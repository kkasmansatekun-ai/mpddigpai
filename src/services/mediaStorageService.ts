import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MaterialItem } from '../types';

const DB_NAME = 'mpd_digpai_media_db';
const STORE_NAME = 'media_files';
const DB_VERSION = 1;

const MATERIALS_COLLECTION = 'learning_materials';
const CHUNKS_COLLECTION = 'material_chunks';
const LOCAL_STORAGE_KEY = 'mpd_custom_materials';

// Firestore limit is 1MB per doc; 450KB chunks safely stay well below limit
const CHUNK_SIZE = 450_000;

// --- INDEXED DB HELPERS ---
function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB tidak tersedia'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbSetMedia(id: string, dataUrl: string): Promise<void> {
  try {
    const database = await openMediaDB();
    await new Promise<void>((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(dataUrl, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB write warning:', err);
  }
}

export async function idbGetMedia(id: string): Promise<string | null> {
  try {
    const database = await openMediaDB();
    return await new Promise<string | null>((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(typeof req.result === 'string' ? req.result : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB read warning:', err);
    return null;
  }
}

export async function idbDeleteMedia(id: string): Promise<void> {
  try {
    const database = await openMediaDB();
    await new Promise<void>((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete warning:', err);
  }
}

// --- SAFE LOCAL STORAGE CACHE ---
export function saveMaterialsToLocalCache(materials: MaterialItem[]): void {
  try {
    // Strip large dataUrls (> 120KB) from localStorage to prevent QuotaExceededError;
    // the full binary dataUrl lives safely in IndexedDB + Firestore chunks
    const lightweight = materials.map((m) => {
      const att = (m.contentData as any)?.fileAttachment;
      if (att && typeof att.dataUrl === 'string' && att.dataUrl.length > 120_000) {
        return {
          ...m,
          contentData: {
            ...m.contentData,
            fileAttachment: {
              ...att,
              dataUrl: '',
              hasLocalCache: true,
            },
          },
        };
      }
      return m;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lightweight));
  } catch (err) {
    console.warn('localStorage cache warning:', err);
  }
}

export function getMaterialsFromLocalCache(): MaterialItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// --- HYDRATE BINARY DATAURL FROM IDB OR FIRESTORE CHUNKS ---
export async function hydrateMaterialMedia(mat: MaterialItem): Promise<MaterialItem> {
  const att = (mat.contentData as any)?.fileAttachment;
  if (!att) return mat;

  // Already has inline dataUrl
  if (typeof att.dataUrl === 'string' && att.dataUrl.length > 20) {
    return mat;
  }

  // 1. Try IndexedDB first (fastest)
  const localData = await idbGetMedia(mat.id);
  if (localData && localData.length > 20) {
    return {
      ...mat,
      contentData: {
        ...mat.contentData,
        fileAttachment: {
          ...att,
          dataUrl: localData,
        },
      },
    };
  }

  // 2. If chunked in Firestore, fetch & reassemble chunks
  const chunkCount = Number(att.chunkCount || 0);
  if (chunkCount > 0) {
    try {
      const chunkPromises = Array.from({ length: chunkCount }, (_, i) =>
        getDoc(doc(db, CHUNKS_COLLECTION, `${mat.id}_chunk_${i}`))
      );
      const chunkDocs = await Promise.all(chunkPromises);
      const parts: string[] = [];
      let allPresent = true;
      for (const snap of chunkDocs) {
        if (snap.exists() && typeof snap.data()?.data === 'string') {
          parts.push(snap.data().data);
        } else {
          allPresent = false;
          break;
        }
      }

      if (allPresent && parts.length === chunkCount) {
        const fullDataUrl = parts.join('');
        // Cache locally in IndexedDB for instant subsequent loads
        await idbSetMedia(mat.id, fullDataUrl);
        return {
          ...mat,
          contentData: {
            ...mat.contentData,
            fileAttachment: {
              ...att,
              dataUrl: fullDataUrl,
            },
          },
        };
      }
    } catch (err) {
      console.warn(`Gagal memuat chunk media untuk ${mat.id}:`, err);
    }
  }

  return mat;
}

// --- SAVE MATERIAL (WITH AUTOMATIC CHUNKING FOR VIDEOS / LARGE PDF / WORD) ---
export async function saveMaterialWithMedia(
  mat: MaterialItem,
  onProgress?: (pct: number, label: string) => void
): Promise<MaterialItem> {
  const att = (mat.contentData as any)?.fileAttachment;
  const fullDataUrl: string = att?.dataUrl || '';

  if (fullDataUrl) {
    onProgress?.(20, 'Menyimpan berkas ke memori lokal...');
    await idbSetMedia(mat.id, fullDataUrl);
  }

  // Prepare Firestore payload
  let firestorePayload: any = mat;

  if (att && fullDataUrl.length > CHUNK_SIZE) {
    const totalChunks = Math.ceil(fullDataUrl.length / CHUNK_SIZE);
    onProgress?.(30, `Mengunggah berkas dalam ${totalChunks} bagian ke Cloud...`);

    // Upload chunks in batches of 4 for speed & reliability
    const batchSize = 4;
    for (let i = 0; i < totalChunks; i += batchSize) {
      const batchPromises: Promise<void>[] = [];
      for (let j = i; j < Math.min(i + batchSize, totalChunks); j++) {
        const slice = fullDataUrl.slice(j * CHUNK_SIZE, (j + 1) * CHUNK_SIZE);
        batchPromises.push(
          setDoc(doc(db, CHUNKS_COLLECTION, `${mat.id}_chunk_${j}`), {
            materialId: mat.id,
            index: j,
            data: slice,
          })
        );
      }
      await Promise.all(batchPromises);
      const pct = Math.min(90, 30 + Math.round(((i + batchSize) / totalChunks) * 60));
      onProgress?.(pct, `Mengunggah berkas ke Firebase (${Math.min(i + batchSize, totalChunks)}/${totalChunks})...`);
    }

    // Store metadata in learning_materials doc without oversized dataUrl
    firestorePayload = {
      ...mat,
      contentData: {
        ...mat.contentData,
        fileAttachment: {
          name: att.name,
          size: att.size,
          type: att.type,
          extension: att.extension,
          dataUrl: '',
          isChunked: true,
          chunkCount: totalChunks,
        },
      },
    };
  } else if (att) {
    onProgress?.(60, 'Menyimpan materi ke database Firebase...');
    firestorePayload = {
      ...mat,
      contentData: {
        ...mat.contentData,
        fileAttachment: {
          ...att,
          isChunked: false,
          chunkCount: 0,
        },
      },
    };
  } else {
    onProgress?.(60, 'Menyimpan materi ke database Firebase...');
  }

  // Strip undefined properties recursively for Firestore
  const cleanPayload = JSON.parse(JSON.stringify(firestorePayload));
  await setDoc(doc(db, MATERIALS_COLLECTION, mat.id), cleanPayload);

  onProgress?.(100, 'Materi berhasil disimpan & disinkronkan!');

  // Return full material with inline dataUrl in memory for immediate UI display
  if (att && fullDataUrl) {
    return {
      ...mat,
      contentData: {
        ...mat.contentData,
        fileAttachment: {
          ...att,
          dataUrl: fullDataUrl,
          isChunked: fullDataUrl.length > CHUNK_SIZE,
          chunkCount: fullDataUrl.length > CHUNK_SIZE ? Math.ceil(fullDataUrl.length / CHUNK_SIZE) : 0,
        },
      },
    };
  }
  return mat;
}

// --- LOAD ALL CUSTOM MATERIALS WITH HYDRATED MEDIA ---
export async function loadAllMaterialsWithMedia(): Promise<MaterialItem[]> {
  const localList = getMaterialsFromLocalCache();
  const map = new Map<string, MaterialItem>();
  localList.forEach((m) => map.set(m.id, m));

  try {
    const snap = await getDocs(collection(db, MATERIALS_COLLECTION));
    if (!snap.empty) {
      snap.forEach((d) => {
        const cloudItem = d.data() as MaterialItem;
        if (cloudItem && cloudItem.id) {
          map.set(cloudItem.id, cloudItem);
        }
      });
    }
  } catch (err) {
    console.warn('Gagal memuat materi dari Firestore:', err);
  }

  const merged = Array.from(map.values());
  saveMaterialsToLocalCache(merged);

  // Hydrate attachments (from IDB or Firestore chunks) in parallel
  const hydrated = await Promise.all(merged.map((m) => hydrateMaterialMedia(m)));
  return hydrated;
}

// --- DELETE MATERIAL & CHUNKS ---
export async function deleteMaterialWithMedia(mat: MaterialItem): Promise<void> {
  await idbDeleteMedia(mat.id);

  try {
    await deleteDoc(doc(db, MATERIALS_COLLECTION, mat.id));
  } catch (err) {
    console.warn('Gagal menghapus dokumen materi di Firestore:', err);
  }

  const chunkCount = Number((mat.contentData as any)?.fileAttachment?.chunkCount || 0);
  if (chunkCount > 0) {
    try {
      await Promise.all(
        Array.from({ length: chunkCount }, (_, i) =>
          deleteDoc(doc(db, CHUNKS_COLLECTION, `${mat.id}_chunk_${i}`))
        )
      );
    } catch (err) {
      console.warn('Gagal menghapus chunk berkas di Firestore:', err);
    }
  }
}
