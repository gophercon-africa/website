'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface Tag {
  id: string;
  label: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

interface TagsProps {
  tags: Tag[];
  onRemove?: (tag: Tag) => void;
  onAdd?: (label: string) => void;
  editable?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  limit?: number;
  suggestions?: string[];
}

const Tags: React.FC<TagsProps> = ({
  tags = [],
  onRemove,
  onAdd,
  editable = false,
  className = '',
  size = 'md',
  limit,
  suggestions = []
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter suggestions based on input value and ensure tags is an array
    const currentTags = Array.isArray(tags) ? tags : [];
    
    if (inputValue) {
      const filtered = suggestions
        .filter(Boolean) // Remove any undefined/null values
        .filter(suggestion => 
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !currentTags.some(tag => tag?.label?.toLowerCase() === suggestion.toLowerCase())
        );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(
        suggestions
          .filter(Boolean) // Remove any undefined/null values
          .filter(suggestion => 
            !currentTags.some(tag => tag?.label?.toLowerCase() === suggestion.toLowerCase())
          )
      );
    }
  }, [inputValue, suggestions, tags]);

  useEffect(() => {
    // Close suggestions dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTagColors = (color: Tag['color'] = 'primary') => {
    const colors = {
      default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
      success: 'bg-green-100 text-green-800 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      danger: 'bg-red-100 text-red-800 hover:bg-red-200'
    };
    return colors[color];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'text-xs py-0.5 px-2',
      md: 'text-sm py-1 px-3',
      lg: 'text-base py-1.5 px-4'
    };
    return sizes[size];
  };

  const handleAddTag = (label: string) => {
    if (onAdd && label.trim()) {
      onAdd(label.trim());
      setInputValue('');
      setShowSuggestions(false);
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setShowSuggestions(false);
      setInputValue('');
    } else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      const firstSuggestion = suggestionsRef.current?.querySelector('button');
      firstSuggestion?.focus();
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setShowSuggestions(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const showAddButton = editable && (!limit || tags.length < limit);

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className={`inline-flex items-center rounded-full font-medium transition-colors ${getTagColors(
              tag.color
            )} ${getSizeClasses()}`}
          >
            {tag.label}
            {editable && onRemove && (
              <button
                onClick={() => onRemove(tag)}
                className="ml-1.5 hover:text-gray-900 focus:outline-none"
              >
                <X className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
              </button>
            )}
          </span>
        ))}

        {showAddButton && (
          isAdding ? (
            <div className="relative">
              <div className={`inline-flex items-center rounded-full border border-gray-300 bg-white ${getSizeClasses()}`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-32"
                  placeholder="Add tag..."
                />
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="ml-1 p-1 hover:text-gray-700"
                >
                  {showSuggestions ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                >
                  <div className="max-h-48 overflow-auto py-1">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddTag(suggestion)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {suggestion}
                      </button>
                    ))}
                    {inputValue && !filteredSuggestions.includes(inputValue) && (
                      <button
                        onClick={() => handleAddTag(inputValue)}
                        className="w-full text-left px-4 py-2 text-sm text-primary-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        Add {inputValue}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className={`inline-flex items-center rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors ${getSizeClasses()}`}
            >
              <Plus className={size === 'sm' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1'} />
              Add Tag
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Tags;