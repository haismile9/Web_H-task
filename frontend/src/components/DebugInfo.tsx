import React from 'react';

interface DebugInfoProps {
  data: Record<string, any>;
  show?: boolean;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ data, show = false }) => {
  if (!show || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h4 className="font-bold mb-2">🐛 Debug Info</h4>
      <pre className="text-xs overflow-auto max-h-40">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DebugInfo;
