import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TagInputProps {
  id?: string;
  placeholder?: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  maxTags?: number;
  className?: string;
  disabled?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  id,
  placeholder = 'Add tag...',
  tags = [],
  setTags,
  maxTags = 10,
  className,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      // Ensure we don't add duplicates
      const normalizedValue = inputValue.trim().toLowerCase();
      
      if (!tags.some(tag => tag.toLowerCase() === normalizedValue)) {
        // Check if we've reached the maximum number of tags
        if (tags.length < maxTags) {
          setTags([...tags, inputValue.trim()]);
          setInputValue('');
        }
      } else {
        // Tag already exists, just clear the input
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove the last tag if Backspace is pressed and input is empty
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className={cn('flex flex-wrap gap-2 p-1 border rounded-md', className)}>
      {tags.map((tag, index) => (
        <Badge 
          key={index} 
          variant="secondary"
          className="text-xs gap-1 py-1"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              className="ml-1"
              onClick={() => removeTag(index)}
            >
              <X size={14} className="hover:text-destructive" />
            </button>
          )}
        </Badge>
      ))}
      
      {tags.length < maxTags && (
        <Input
          id={id}
          type="text"
          placeholder={tags.length === 0 ? placeholder : ''}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[120px] border-none px-1 py-0 h-6 focus-visible:ring-transparent"
          disabled={disabled}
        />
      )}
    </div>
  );
}; 