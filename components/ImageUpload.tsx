import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageChange: (base64Image: string | null) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

export default function ImageUpload({ 
  onImageChange, 
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      toast.error(`Please upload ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} files only`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreview(base64);
        onImageChange(base64);
        toast.success('Image uploaded successfully');
        setUploading(false);
      };

      reader.onerror = () => {
        toast.error('Failed to read file');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setUploading(false);
    }
  }, [acceptedFormats, maxSizeMB, onImageChange]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    onImageChange(null);
    toast.success('Image removed');
  }, [onImageChange]);

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            id="image-upload"
            accept={acceptedFormats.join(',')}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <label 
            htmlFor="image-upload" 
            className="cursor-pointer block"
          >
            <div className="text-6xl mb-3">📸</div>
            <div className="text-lg font-semibold text-gray-700 mb-2">
              {uploading ? 'Uploading...' : 'Upload Proof of Completion'}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Click to upload image (max {maxSizeMB}MB)
            </div>
            <div className="text-xs text-gray-400">
              Supported: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}
            </div>
          </label>
        </div>
      ) : (
        <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
          <img 
            src={preview} 
            alt="Proof of completion preview" 
            className="w-full h-auto max-h-96 object-contain bg-gray-50"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg transition-colors"
              title="Remove image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="bg-green-50 border-t border-green-200 p-3">
            <div className="flex items-center text-green-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Image uploaded successfully</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for good proof:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Screenshot of completed lessons/assignments</li>
          <li>• Certificate from the course platform</li>
          <li>• Project results or code screenshots</li>
          <li>• Clear and readable images</li>
        </ul>
      </div>
    </div>
  );
}

