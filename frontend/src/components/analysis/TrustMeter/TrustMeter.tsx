import React from 'react';
import { MeterContainer, ScoreCircle, ScoreText } from './TrustMeter.style';

interface TrustMeterProps {
  score: number; // 0-100
}

export const TrustMeter: React.FC<TrustMeterProps> = ({ score }) => {
  const getTrustLevel = (score: number): string => {
    if (score >= 80) return '신뢰';
    if (score >= 60) return '보통';
    if (score >= 40) return '주의';
    return '위험';
  };

  const getTrustColor = (score: number): string => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  return (
    <MeterContainer>
      <ScoreCircle score={score}>
        <ScoreText style={{ color: getTrustColor(score) }}>
          {score}
        </ScoreText>
      </ScoreCircle>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 4px 0', color: getTrustColor(score) }}>
          {getTrustLevel(score)}
        </h4>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
          신뢰도 점수
        </p>
      </div>
    </MeterContainer>
  );
};
