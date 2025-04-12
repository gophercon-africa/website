'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Image from 'next/image';
interface ImageGridProps {
  images: Array<{
    url: string;
    alt?: string;
  }>;
  onChosen?: (url: string) => void;
  selectedUrl?: string;
  className?: string;
}

const ImageGrid: React.FC<ImageGridProps> = ({ 
  images, 
  onChosen, 
  selectedUrl,
  className = '' 
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleImageClick = (url: string, index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
    
    if (onChosen) {
      onChosen(url);
    }
  };

  if (!images.length) {
    return null;
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative group transition-all duration-300 ease-in-out ${
            expandedIndex === index
              ? 'col-span-2 row-span-2 sm:col-span-3 sm:row-span-2 z-10'
              : ''
          }`}
        >
          <div 
            className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer
              ${selectedUrl === image.url ? 'ring-2 ring-primary-500' : ''}
              ${expandedIndex === index ? 'aspect-auto' : ''}
            `}
            onClick={() => handleImageClick(image.url, index)}
          >
            <Image
              src={image.url}
              alt={image.alt || `Image ${index + 1}`}
              className={`w-full h-full transition-all duration-300 ${
                expandedIndex === index ? 'object-contain' : 'object-cover'
              }`}
              width={1200}
              height={1200}
              quality={95}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />

            {selectedUrl === image.url && (
              <div className="absolute top-2 left-2">
                <div className="p-1 bg-primary-500 rounded-full">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;