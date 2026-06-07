import { getCloudinaryConfig, isCloudinaryConfigured } from '@/config/env'
import { storage } from '@/config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
}

export function isCloudinaryReady(): boolean {
  // We return true now because we have a fallback (Firebase Storage), 
  // so the upload component can always render the upload controls.
  return true
}

export async function uploadImageToFirebase(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop()
  const randomId = Math.random().toString(36).substring(2, 8)
  const fileName = `products/${Date.now()}_${randomId}.${fileExtension}`
  
  const storageRef = ref(storage, fileName)
  const snapshot = await uploadBytes(storageRef, file)
  const downloadUrl = await getDownloadURL(snapshot.ref)
  return downloadUrl
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const { cloudName, uploadPreset } = getCloudinaryConfig()

  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.',
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'vineeta-products')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData },
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(
      (error as { error?: { message?: string } }).error?.message ??
        'Failed to upload image to Cloudinary',
    )
  }

  const data = (await response.json()) as CloudinaryUploadResponse
  return data.secure_url
}

export async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
  const useCloudinary = isCloudinaryConfigured()
  
  const uploads = files.map(async (file) => {
    if (useCloudinary) {
      return uploadImageToCloudinary(file)
    } else {
      return uploadImageToFirebase(file)
    }
  })
  
  return Promise.all(uploads)
}
