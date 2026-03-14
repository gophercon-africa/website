'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  name: string;
  onChange: (value: number) => void;
  label?: string;
  required?: boolean;
  readonly?: boolean;
}

export function StarRating({ 
  value, 
  name, 
  onChange, 
  label = 'Rating', 
  required = false, 
  readonly = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || value;

  if (readonly) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5" role="img" aria-label={`Rating: ${value} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-amber-400">
              <Star
                size={20}
                fill={star <= value ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={1.5}
              />
            </span>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">{value}/5</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex items-center gap-2">
        <div 
          className="flex gap-0.5"
          role="radiogroup"
          aria-label={label}
          aria-required={required}
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              name={name}
              value={star}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onFocus={() => setHoverRating(star)}
              onBlur={() => setHoverRating(0)}
              className="text-amber-400 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-[#006B3F] focus:ring-offset-2 rounded"
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
              aria-pressed={value === star}
            >
              <Star
                size={24}
                fill={star <= displayRating ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700" aria-live="polite">
          {displayRating}/5
        </span>
      </div>
    </div>
  );
}