import React from 'react';

interface ComponentScore {
  label: string;
  score: number;
  description: string;
}

interface ComponentScoresProps {
  financialStrengthScore: number;
  paymentBehaviorScore: number;
  businessStabilityScore: number;
  complianceScore: number;
}

const ComponentScores: React.FC<ComponentScoresProps> = ({
  financialStrengthScore,
  paymentBehaviorScore,
  businessStabilityScore,
  complianceScore
}) => {
  const scores: ComponentScore[] = [
    {
      label: 'Financial Strength',
      score: financialStrengthScore,
      description: 'Financial health and stability indicators'
    },
    {
      label: 'Payment Behavior',
      score: paymentBehaviorScore,
      description: 'Historical payment patterns and reliability'
    },
    {
      label: 'Business Stability',
      score: businessStabilityScore,
      description: 'Operational history and market presence'
    },
    {
      label: 'Compliance',
      score: complianceScore,
      description: 'Regulatory compliance and verification status'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 70) return 'text-blue-700';
    if (score >= 60) return 'text-yellow-700';
    if (score >= 40) return 'text-orange-700';
    return 'text-red-700';
  };

  return (
    <div className="space-y-4">
      {scores.map((scoreItem, index) => (
        <div key={index} className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-900">
              {scoreItem.label}
            </h3>
            <span className={`text-sm font-bold ${getScoreTextColor(scoreItem.score)}`}>
              {scoreItem.score.toFixed(1)}
            </span>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>0</span>
              <span>100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ease-out ${getScoreColor(scoreItem.score)}`}
                style={{ width: `${Math.min(scoreItem.score, 100)}%` }}
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-600">
            {scoreItem.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ComponentScores;