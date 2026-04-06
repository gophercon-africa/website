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

  const stars = [1, 2, 3, 4, 5];

  const isFilled = (star: number, currentRating: number) => currentRating >= star;
  const isHalf = (star: number, currentRating: number) => currentRating >= star - 0.5 && currentRating < star;

  if (readonly) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5" role="img" aria-label={`Rating: ${value} out of 5 stars`}>
          {stars.map((star) => (
            <span key={star} className="text-amber-400">
              <span className="relative inline-block h-5 w-5">
                <Star
                  size={20}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="absolute inset-0"
                />
                {(isFilled(star, value) || isHalf(star, value)) && (
                  <span
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: isFilled(star, value) ? '100%' : '50%' }}
                  >
                    <Star
                      size={20}
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    />
                  </span>
                )}
              </span>
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
          {stars.map((star) => (
            <div key={star} className="relative h-6 w-6">
              <button
                type="button"
                role="radio"
                name={name}
                value={star - 0.5}
                onClick={() => onChange(star - 0.5)}
                onMouseEnter={() => setHoverRating(star - 0.5)}
                onFocus={() => setHoverRating(star - 0.5)}
                onBlur={() => setHoverRating(0)}
                className="absolute left-0 top-0 h-6 w-3 focus:outline-none focus:ring-2 focus:ring-[#006B3F] focus:ring-offset-2 rounded-l"
                aria-label={`${star - 0.5} stars`}
                aria-checked={value === star - 0.5}
              />
              <button
                type="button"
                role="radio"
                name={name}
                value={star}
                onClick={() => onChange(star)}
                onMouseEnter={() => setHoverRating(star)}
                onFocus={() => setHoverRating(star)}
                onBlur={() => setHoverRating(0)}
                className="absolute right-0 top-0 h-6 w-3 focus:outline-none focus:ring-2 focus:ring-[#006B3F] focus:ring-offset-2 rounded-r"
                aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                aria-checked={value === star}
              />
              <span className="pointer-events-none absolute inset-0 text-amber-400">
                <span className="relative inline-block h-6 w-6">
                  <Star
                    size={24}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="absolute inset-0"
                  />
                  {(isFilled(star, displayRating) || isHalf(star, displayRating)) && (
                    <span
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: isFilled(star, displayRating) ? '100%' : '50%' }}
                    >
                      <Star
                        size={24}
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      />
                    </span>
                  )}
                </span>
              </span>
            </div>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700" aria-live="polite">
          {displayRating}/5
        </span>
      </div>
    </div>
  );
}
