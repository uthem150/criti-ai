import styled from "@emotion/styled";
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  animations,
} from "../../styles/design-system";

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
  background: linear-gradient(
    135deg,
    ${colors.primary},
    ${colors.palette.purple}
  );
  border-radius: ${borderRadius.xl};
  color: ${colors.text.inverse};
  box-shadow: ${shadows.md};
`;

export const HeaderTitle = styled.h1`
  margin: 0 0 ${spacing[2]} 0;
  ${typography.styles.headline1};
  color: ${colors.text.inverse};

  @media (max-width: 768px) {
    ${typography.styles.headline2};
  }
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  ${typography.styles.title3};
  opacity: 0.95;
  color: ${colors.text.inverse};

  @media (max-width: 768px) {
    ${typography.styles.body1};
  }
`;

export const NavButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[6]};
  flex-wrap: wrap;
`;

export const NavButton = styled.button`
  padding: ${spacing[3]} ${spacing[6]};
  background: linear-gradient(
    135deg,
    ${colors.primary},
    ${colors.palette.blue}
  );
  color: ${colors.text.inverse};
  border: none;
  border-radius: ${borderRadius.lg};
  ${typography.styles.title5};
  cursor: pointer;
  transition: ${animations.transition.normal};
  box-shadow: ${shadows.md};
  display: flex;
  align-items: center;
  gap: ${spacing[2]};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    opacity: 0.95;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: ${spacing[2]} ${spacing[4]};
    ${typography.styles.body3};
  }
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
  transition: ${animations.transition.normal};

  &:hover {
    box-shadow: ${shadows.md};
    transform: translateY(-2px);
  }
`;

export const StatLabel = styled.div`
  ${typography.styles.body3};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing[1]};
`;

export const StatValue = styled.div`
  ${typography.styles.title2};
  color: ${colors.primary};
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
    ${typography.styles.title2};
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
  transition: ${animations.transition.normal};

  &:hover {
    box-shadow: ${shadows.sm};
  }

  .icon {
    ${typography.styles.headline2};
  }

  .name {
    font-weight: ${typography.fontWeight.semibold};
    color: ${colors.text.primary};
    ${typography.styles.body2};
  }

  .description {
    ${typography.styles.body3};
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
  ${typography.styles.headline2};

  @media (max-width: 768px) {
    ${typography.styles.title1};
  }
`;

export const ChallengeContent = styled.div`
  background: ${colors.background.secondary};
  padding: ${spacing[6]};
  border-radius: ${borderRadius.md};
  border-left: 4px solid ${colors.primary};
  margin-bottom: ${spacing[8]};
  line-height: 1.7;
  ${typography.styles.body2};
  color: ${colors.text.primary};
  white-space: pre-line;
`;

export const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${spacing[3]};
  }
`;

interface OptionButtonProps {
  selected: boolean;
}

export const OptionButton = styled.button<OptionButtonProps>`
  padding: ${spacing[4]};
  border: 2px solid
    ${(props) => (props.selected ? colors.primary : colors.border.primary)};
  background: ${(props) =>
    props.selected ? `${colors.primary}15` : colors.background.primary};
  color: ${(props) => (props.selected ? colors.primary : colors.text.primary)};
  border-radius: ${borderRadius.lg};
  cursor: pointer;
  transition: all ${animations.transition.normal};
  text-align: left;
  min-height: 80px;
  display: flex;
  align-items: center;
  ${typography.styles.body2};

  &:hover {
    border-color: ${colors.primary};
    background: ${(props) =>
      props.selected ? `${colors.primary}25` : `${colors.primary}10`};
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }

  &:active {
    transform: translateY(0);
  }

  div {
    width: 100%;
  }
`;

export const ActionButton = styled.button`
  background: ${colors.primary};
  color: ${colors.text.inverse};
  border: none;
  padding: ${spacing[3]} ${spacing[6]};
  border-radius: ${borderRadius.md};
  ${typography.styles.title5};
  cursor: pointer;
  transition: all ${animations.transition.normal};
  min-width: 120px;
  box-shadow: ${shadows.sm};

  &:hover:not(:disabled) {
    opacity: 0.9;
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
  ${typography.styles.title1};
  color: ${(props) =>
    props.isCorrect ? colors.status.success : colors.status.error};
  margin-bottom: ${spacing[4]};
  text-align: center;
`;

export const ExplanationText = styled.div`
  ${typography.styles.body2};
  line-height: 1.7;
  color: ${colors.text.primary};
  margin-bottom: ${spacing[4]};

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: ${colors.primary};
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
