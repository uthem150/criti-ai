import styled from '@emotion/styled';
import { colors, borderRadius, shadows, animations } from '@/styles/design-system';

interface ScoreCircleProps {
  score: number;
}

export const MeterContainer = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%);
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.md};
  text-align: center;
  transition: all ${animations.transition.normal};
  
  &:hover {
    box-shadow: ${shadows.xl};
    transform: translateY(-2px);
  }
`;

export const ScoreCircle = styled.div<ScoreCircleProps>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: ${({ score }) => 
    `conic-gradient(
      ${score >= 80 ? colors.trust.trusted : 
        score >= 60 ? colors.trust.neutral :
        score >= 40 ? colors.trust.caution : colors.trust.dangerous} ${score * 3.6}deg,
      ${colors.background.tertiary} ${score * 3.6}deg
    )`
  };
  
  &::before {
    content: '';
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: ${colors.background.primary};
    position: absolute;
    z-index: 1;
  }
`;

export const ScoreText = styled.div<{ score: number }>`
  position: relative;
  z-index: 2;
  font-size: 2rem;
  font-weight: 700;
  color: ${({ score }) => 
    score >= 80 ? colors.trust.trusted : 
    score >= 60 ? colors.trust.neutral :
    score >= 40 ? colors.trust.caution : colors.trust.dangerous
  };
`;

export const LevelContainer = styled.div`
  text-align: center;
`;

export const TrustLabel = styled.h4<{ score: number }>`
  margin: 0 0 4px 0;
  color: ${({ score }) => 
    score >= 80 ? colors.trust.trusted : 
    score >= 60 ? colors.trust.neutral :
    score >= 40 ? colors.trust.caution : colors.trust.dangerous
  };
  font-size: 1.125rem;
  font-weight: 600;
`;

export const TrustDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`;
