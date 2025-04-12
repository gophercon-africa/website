import React, { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
interface ImageUploadProps {
  maxImages?: number;
  maxFileSize?: number; // in bytes, e.g., 5 * 1024 * 1024 for 5MB
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  maxImages = 3,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  onImagesChange,
  initialImages = [],
  className = ''
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [error, setError] = useState<string>('');

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    setError('');
    
    // Filter out files that exceed size limit
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxFileSize) {
        setError(`File ${file.name} exceeds the maximum size of ${maxFileSize / (1024 * 1024)}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length + images.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    try {
      const base64Images = await Promise.all(validFiles.map(convertToBase64));
      const newImages = [...images, ...base64Images];
      setImages(newImages);
      onImagesChange(newImages);
    } catch (err) {
      console.error('Error processing images:', err);
      setError('Error processing images. Please try again.');
    }
  }, [images, maxImages, maxFileSize, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxImages - images.length
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
    setError('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <Image
                src={image}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
                width={100}
                height={100}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag & drop images here, or click to select
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Maximum {maxImages} images • Up to {formatFileSize(maxFileSize)} per file
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: JPEG, PNG, WebP
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 