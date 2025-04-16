'use client';

import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className = '',
  speed = 50,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsComplete(true);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      {!isComplete && <span className="animate-blink">|</span>}
    </span>
  );
};

export default TypewriterText; 