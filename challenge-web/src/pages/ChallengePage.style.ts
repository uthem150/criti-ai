import styled from '@emotion/styled';
import { colors, spacing, borderRadius, shadows, typography, animations } from '../styles/design-system';

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[6]};
  min-height: 100vh;
  background: ${colors.background.secondary};

  @media (max-width: 768px) {
    padding: ${spacing[4]};
  }
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: ${spacing[8]};
  padding: ${spacing[8]} 0;
  background: linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]});
  border-radius: ${borderRadius.xl};
  color: white;
`;

export const HeaderTitle = styled.h1`
  margin: 0 0 ${spacing[2]} 0;
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  font-family: ${typography.fontFamily.primary};
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: ${typography.fontSize.lg};
  opacity: 0.9;
  font-weight: ${typography.fontWeight.normal};
`;

export const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing[4]};
  margin-bottom: ${spacing[8]};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${spacing[3]};
  }
`;

export const StatItem = styled.div`
  background: ${colors.background.primary};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.lg};
  text-align: center;
  box-shadow: ${shadows.sm};
  border: 1px solid ${colors.border.primary};
`;

export const StatLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing[1]};
`;

export const StatValue = styled.div`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
`;

export const BadgeContainer = styled.div`
  background: ${colors.background.primary};
  padding: ${spacing[6]};
  border-radius: ${borderRadius.lg};
  margin-bottom: ${spacing[8]};
  box-shadow: ${shadows.sm};

  h3 {
    margin: 0 0 ${spacing[4]} 0;
    color: ${colors.text.primary};
    font-size: ${typography.fontSize.lg};
    font-weight: ${typography.fontWeight.semibold};
  }

  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`;

export const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  padding: ${spacing[3]};
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.border.primary};

  .icon {
    font-size: ${typography.fontSize['2xl']};
  }

  .name {
    font-weight: ${typography.fontWeight.semibold};
    color: ${colors.text.primary};
  }

  .description {
    font-size: ${typography.fontSize.sm};
    color: ${colors.text.secondary};
  }
`;

export const ChallengeContainer = styled.div`
  margin-bottom: ${spacing[8]};
`;

export const ChallengeCard = styled.div`
  background: ${colors.background.primary};
  padding: ${spacing[8]};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.md};
  border: 1px solid ${colors.border.primary};
`;

export const ChallengeTitle = styled.h2`
  margin: 0 0 ${spacing[6]} 0;
  color: ${colors.text.primary};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
`;

export const ChallengeContent = styled.div`
  background: ${colors.background.secondary};
  padding: ${spacing[6]};
  border-radius: ${borderRadius.md};
  border-left: 4px solid ${colors.primary[500]};
  margin-bottom: ${spacing[6]};
  line-height: ${typography.lineHeight.relaxed};
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
`;

export const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing[3]};
  margin-bottom: ${spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

interface OptionButtonProps {
  selected: boolean;
}

export const OptionButton = styled.button<OptionButtonProps>`
  padding: ${spacing[3]} ${spacing[4]};
  border: 2px solid ${props => props.selected ? colors.primary[500] : colors.border.primary};
  background: ${props => props.selected ? colors.primary[50] : colors.background.primary};
  color: ${props => props.selected ? colors.primary[700] : colors.text.primary};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  font-weight: ${props => props.selected ? typography.fontWeight.semibold : typography.fontWeight.normal};
  cursor: pointer;
  transition: all ${animations.transition.normal};

  &:hover {
    border-color: ${colors.primary[400]};
    background: ${colors.primary[50]};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ActionButton = styled.button`
  background: ${colors.primary[500]};
  color: white;
  border: none;
  padding: ${spacing[3]} ${spacing[6]};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${animations.transition.normal};
  min-width: 120px;

  &:hover:not(:disabled) {
    background: ${colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: ${colors.text.disabled};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ResultContainer = styled.div`
  padding: ${spacing[6]};
  border-radius: ${borderRadius.lg};
  margin-top: ${spacing[4]};
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

interface ResultTextProps {
  isCorrect: boolean;
}

export const ResultText = styled.div<ResultTextProps>`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${props => props.isCorrect ? colors.status.success : colors.status.error};
  margin-bottom: ${spacing[4]};
  text-align: center;
`;

export const ExplanationText = styled.div`
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.relaxed};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[4]};

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: ${colors.primary[600]};
    font-weight: ${typography.fontWeight.semibold};
  }
`;

export const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing[4]};

  @media (max-width: 768px) {
    flex-direction: column;
    
    > div {
      width: 100%;
      display: flex;
      justify-content: center;
      gap: ${spacing[3]};
    }
  }
`;
