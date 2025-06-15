import React from 'react';
import { useParams } from 'react-router-dom';

const DebugSetup: React.FC = () => {
  const { businessId } = useParams();
  
  return (
    <div className="p-6">
      <h1>Debug Setup Component</h1>
      <p>Business ID from params: {businessId || 'None'}</p>
      <p>Route is working!</p>
    </div>
  );
};

export default DebugSetup;