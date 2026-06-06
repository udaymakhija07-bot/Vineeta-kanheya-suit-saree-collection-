import { useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import { isCloudinaryReady, uploadImagesToCloudinary } from '@/services/cloudinaryService'

interface CloudinaryImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export default function CloudinaryImageUpload({ images, onChange }: CloudinaryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const urls = await uploadImagesToCloudinary(files)
      onChange([...images, ...urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  if (!isCloudinaryReady()) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p className="font-semibold">Cloudinary not configured</p>
        <p className="mt-1">
          Add <code>VITE_CLOUDINARY_CLOUD_NAME</code> and{' '}
          <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> to your <code>.env</code> file.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        type="button"
        variant="secondary"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? 'Uploading...' : 'Select Images from Computer'}
      </Button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-gray-500">Images upload automatically to Cloudinary.</p>
    </div>
  )
}
