import styled from '@emotion/styled';

export const MeterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

export const ScoreBarContainer = styled.div`
  width: 100%;
  height: 40px;
  background-color: #f1f5f9;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
`;

interface ScoreBarProps {
  score: number;
  color: string;
}

export const ScoreBar = styled.div<ScoreBarProps>`
  width: ${props => Math.max(props.score, 5)}%; /* 최소 5%는 보이도록 */
  height: 100%;
  background: linear-gradient(90deg, ${props => props.color}CC, ${props => props.color});
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.score > 25 ? 'center' : 'flex-end'};
  position: relative;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px ${props => props.color}40;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
    border-radius: inherit;
  }
`;

export const ScoreText = styled.span<{ score: number }>`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.score > 25 ? 'white' : '#374151'};
  text-shadow: ${props => props.score > 25 ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'};
  position: ${props => props.score <= 25 ? 'absolute' : 'static'};
  right: ${props => props.score <= 25 ? '8px' : 'auto'};
  z-index: 10;
`;

export const LevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

interface TrustLabelProps {
  score: number;
}

export const TrustLabel = styled.div<TrustLabelProps>`
  font-size: 24px;
  font-weight: 800;
  color: ${props => {
    if (props.score >= 80) return '#059669';
    if (props.score >= 60) return '#d97706';
    if (props.score >= 40) return '#ea580c';
    return '#dc2626';
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TrustDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
`;

export const DetailedScoresContainer = styled.div`
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 12px 0;
    text-align: center;
  }
`;

export const DetailedScoreItem = styled.div`
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ScoreLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
`;

interface ScoreValueProps {
  score: number;
}

export const ScoreValue = styled.span<ScoreValueProps>`
  font-weight: 600;
  font-size: 12px;
  color: ${props => {
    if (props.score >= 80) return '#059669';
    if (props.score >= 60) return '#d97706';
    if (props.score >= 40) return '#ea580c';
    return '#dc2626';
  }};
`;

export const ScoreMiniBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  
  .fill {
    height: 100%;
    border-radius: 3px;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 2px; /* 최소 너비 보장 */
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 2px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 0 3px 3px 0;
    }
  }
`;
