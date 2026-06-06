import { getCloudinaryConfig, isCloudinaryConfigured } from '@/config/env'

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
}

export function isCloudinaryReady(): boolean {
  return isCloudinaryConfigured()
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
  const uploads = files.map((file) => uploadImageToCloudinary(file))
  return Promise.all(uploads)
}
