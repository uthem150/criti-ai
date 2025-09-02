import React from 'react';
import { 
  MeterContainer, 
  ScoreCircle, 
  ScoreText, 
  LevelContainer,
  TrustLabel,
  TrustDescription 
} from './TrustMeter.style';

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

  return (
    <MeterContainer>
      <ScoreCircle score={score}>
        <ScoreText score={score}>
          {score}
        </ScoreText>
      </ScoreCircle>
      <LevelContainer>
        <TrustLabel score={score}>
          {getTrustLevel(score)}
        </TrustLabel>
        <TrustDescription>
          신뢰도 점수
        </TrustDescription>
      </LevelContainer>
    </MeterContainer>
  );
};
