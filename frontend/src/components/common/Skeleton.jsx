import React from 'react';

const Skeleton = ({ className, width, height, circle = false }) => {
  const style = {
    width: width || '100%',
    height: height || '1rem',
    borderRadius: circle ? '50%' : '0.5rem',
  };

  return (
    <div 
      className={`bg-gray-200 animate-pulse ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;
