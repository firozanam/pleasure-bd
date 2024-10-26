import { put, del, list } from '@vercel/blob';

export async function uploadToBlob(file) {
  const { url } = await put(file.name, file, { access: 'public' });
  return url;
}

export async function deleteFromBlob(url) {
  await del(url);
}

export async function listBlobFiles() {
  const { blobs } = await list();
  return blobs;
}

export function getBlobImageUrl(url) {
  return url;
}
