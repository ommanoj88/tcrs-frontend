import React from 'react';

interface CreditScoreChartProps {
  score: number;
  grade: string;
  size?: 'small' | 'medium' | 'large';
}

const CreditScoreChart: React.FC<CreditScoreChartProps> = ({ 
  score, 
  grade, 
  size = 'medium' 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 70) return '#3B82F6'; // Blue
    if (score >= 60) return '#F59E0B'; // Yellow
    if (score >= 40) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getGradientId = () => `scoreGradient-${Math.random().toString(36).substr(2, 9)}`;
  const gradientId = getGradientId();

  const sizeConfig = {
    small: { radius: 40, strokeWidth: 6, fontSize: '14px' },
    medium: { radius: 60, strokeWidth: 8, fontSize: '18px' },
    large: { radius: 80, strokeWidth: 10, fontSize: '24px' }
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg 
          width={config.radius * 2 + config.strokeWidth * 2} 
          height={config.radius * 2 + config.strokeWidth * 2}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={getScoreColor(score)} stopOpacity="0.3" />
              <stop offset="100%" stopColor={getScoreColor(score)} stopOpacity="1" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx={config.radius + config.strokeWidth}
            cy={config.radius + config.strokeWidth}
            r={config.radius}
            stroke="#E5E7EB"
            strokeWidth={config.strokeWidth}
            fill="none"
          />
          
          {/* Progress circle */}
          <circle
            cx={config.radius + config.strokeWidth}
            cy={config.radius + config.strokeWidth}
            r={config.radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="font-bold text-gray-900"
            style={{ fontSize: config.fontSize }}
          >
            {score.toFixed(0)}
          </span>
          <span className="text-xs text-gray-500 font-medium">{grade}</span>
        </div>
      </div>
    </div>
  );
};

export default CreditScoreChart;