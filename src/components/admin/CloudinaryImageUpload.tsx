import { useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import { isCloudinaryConfigured } from '@/config/env'
import { uploadImagesToCloudinary } from '@/services/cloudinaryService'

interface CloudinaryImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export default function CloudinaryImageUpload({ images, onChange }: CloudinaryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const urls = await uploadImagesToCloudinary(files)
      onChange([...images, ...urls])
    } catch (err) {
      console.error('Upload error:', err)
      const isCloudinary = isCloudinaryConfigured()
      if (isCloudinary) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } else {
        setError(
          'Firebase Storage upload failed. Please ensure Storage is enabled in your Firebase Console, or try adding images using the direct URL input below.'
        )
      }
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return

    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
      setError('Please enter a valid image URL starting with http:// or https://')
      return
    }

    onChange([...images, urlInput.trim()])
    setUrlInput('')
    setError(null)
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const isCloudinary = isCloudinaryConfigured()

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Product Photos</p>
          <div className="flex flex-wrap gap-3">
            {images.map((url, index) => (
              <div key={`${url}-${index}`} className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 shadow-sm group">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1 top-1 rounded bg-black/60 hover:bg-red-600 px-1.5 py-0.5 text-xs text-white transition-colors"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload & URL Input Options */}
      <div className="grid gap-4 md:grid-cols-2 pt-3 border-t border-gray-100">
        {/* Upload Button */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Upload File</p>
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
            className="w-full justify-center text-sm py-2"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-maroon border-t-transparent" />
                Uploading...
              </span>
            ) : (
              'Select Photo from Computer'
            )}
          </Button>
          <p className="mt-1.5 text-xs text-gray-400">
            {isCloudinary 
              ? 'Uploading directly to Cloudinary.' 
              : 'Uploading directly to Firebase Storage.'}
          </p>
        </div>

        {/* URL Input Form */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Or Add by Image URL</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/20"
            />
            <Button 
              type="button" 
              onClick={handleAddUrl}
              className="text-sm py-1.5 px-3"
            >
              Add URL
            </Button>
          </div>
          <p className="mt-1.5 text-xs text-gray-400">Paste any web URL for the product photo.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Configuration Tip */}
      {!isCloudinary && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          <span className="font-semibold text-brand-maroon">💡 Tip:</span> You can configure Cloudinary on Vercel setting the environment variables: <code>VITE_CLOUDINARY_CLOUD_NAME</code> and <code>VITE_CLOUDINARY_UPLOAD_PRESET</code>.
        </div>
      )}
    </div>
  )
}
