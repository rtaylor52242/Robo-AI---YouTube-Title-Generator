import React from 'react';

interface CtrScoreProps {
  score: number;
}

const CtrScore: React.FC<CtrScoreProps> = ({ score }) => {
  const getScoreColor = () => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex-shrink-0">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-md ${getScoreColor()}`}>
        {score}
      </div>
    </div>
  );
};

export default CtrScore;