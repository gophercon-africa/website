import React from 'react';
import { toast } from 'react-hot-toast';

interface ToastWrapperProps {
  children: React.ReactNode;
  message?: string;
  className?: string;
}

const ToastWrapper: React.FC<ToastWrapperProps> = ({ 
  children, 
  message = 'Coming soon!', 
  className = '' 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#fff',
        color: '#006B3F',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
        border: '1px solid #E5E7EB',
        fontSize: '15px',
        fontWeight: '900',
        letterSpacing: '0.3px',
        maxWidth: '400px',
        lineHeight: '1.5',
      },
      icon: '🎉',
      iconTheme: {
        primary: '#006B3F',
        secondary: '#fff',
      }
    });
  };

  return (
    <div 
      onClick={handleClick} 
      className={`cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

export default ToastWrapper; 