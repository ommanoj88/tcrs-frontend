import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="loading-spinner h-8 w-8"></div>
    </div>
  );
};

export default LoadingSpinner;