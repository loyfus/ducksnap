import React from 'react';

const DuckIcon = ({ className = "h-6 w-6", animated = false }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${className} ${animated ? 'animate-bounce' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Duck body */}
      <ellipse cx="12" cy="15" rx="6" ry="5" fill="currentColor" />
      
      {/* Duck head */}
      <circle cx="12" cy="9" r="4" fill="currentColor" />
      
      {/* Duck beak */}
      <path
        d="M 8 9 L 6 8.5 L 6 9.5 Z"
        fill="currentColor"
        opacity="0.8"
      />
      
      {/* Duck eye */}
      <circle cx="11" cy="8.5" r="0.8" fill="white" />
      <circle cx="11.2" cy="8.6" r="0.4" fill="black" />
      
      {/* Duck wing detail */}
      <path
        d="M 14 14 Q 16 15 14 17"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
};

export const DuckIconSimple = ({ className = "h-6 w-6" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Duck silhouette - minimalist design */}
      <path
        d="M 30 60 
           Q 30 45, 40 40
           Q 45 35, 50 35
           Q 60 35, 65 42
           L 70 42
           Q 72 42, 72 44
           Q 72 46, 70 46
           L 65 46
           Q 65 55, 60 60
           Q 55 65, 45 65
           Q 35 65, 30 60
           Z"
        fill="currentColor"
      />
      
      {/* Eye */}
      <circle cx="48" cy="44" r="3" fill="white" />
      <circle cx="49" cy="44.5" r="1.5" fill="#1a1a1a" />
      
      {/* Beak */}
      <path
        d="M 68 43 L 73 43 L 68 45 Z"
        fill="#fbbf24"
      />
    </svg>
  );
};

export default DuckIcon;