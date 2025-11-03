import styled from "@emotion/styled";
import { colors, typography } from "../../styles/design-system";

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: 100vh;
  background: ${colors.light.grayscale[5]};

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 0;
  background: linear-gradient(
    135deg,
    ${colors.light.brand.primary100},
    ${colors.light.etc.purple}
  );
  border-radius: 0.75rem;
  color: ${colors.light.grayscale[0]};
  box-shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
`;

export const HeaderTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  ${typography.styles.headline1};
  color: ${colors.light.grayscale[0]};

  @media (max-width: 768px) {
    ${typography.styles.headline2};
  }
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  ${typography.styles.title3};
  opacity: 0.95;
  color: ${colors.light.grayscale[0]};

  @media (max-width: 768px) {
    ${typography.styles.body1};
  }
`;

export const NavButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const NavButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(
    135deg,
    ${colors.light.brand.primary100},
    ${colors.light.etc.blue}
  );
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 0.5rem;
  ${typography.styles.title5};
  cursor: pointer;
  transition: "250ms ease-in-out";
  box-shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";
    opacity: 0.95;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    ${typography.styles.body3};
  }
`;

export const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

export const StatItem = styled.div`
  background: ${colors.light.grayscale[0]};
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
  border: 1px solid ${colors.light.grayscale[20]};
  transition: "250ms ease-in-out";

  &:hover {
    box-shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
    transform: translateY(-2px);
  }
`;

export const StatLabel = styled.div`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  margin-bottom: 0.25rem;
`;

export const StatValue = styled.div`
  ${typography.styles.title2};
  color: ${colors.light.brand.primary100};
`;

export const BadgeContainer = styled.div`
  background: ${colors.light.grayscale[0]};
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)";

  h3 {
    margin: 0 0 1rem 0;
    color: ${colors.light.grayscale[90]};
    ${typography.styles.title2};
  }

  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${colors.light.grayscale[5]};
  border-radius: 0.375rem;
  border: 1px solid ${colors.light.grayscale[20]};
  transition: "250ms ease-in-out";

  &:hover {
    box-shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
  }

  .icon {
    ${typography.styles.headline2};
  }

  .name {
    font-weight: ${typography.fontWeight.semibold};
    color: ${colors.light.grayscale[90]};
    ${typography.styles.body2};
  }

  .description {
    ${typography.styles.body3};
    color: ${colors.light.grayscale[70]};
  }
`;

export const ChallengeContainer = styled.div`
  margin-bottom: 2rem;
`;

export const ChallengeCard = styled.div`
  background: ${colors.light.grayscale[0]};
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
  border: 1px solid ${colors.light.grayscale[20]};
`;

export const ChallengeTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  color: ${colors.light.grayscale[90]};
  ${typography.styles.headline2};

  @media (max-width: 768px) {
    ${typography.styles.title1};
  }
`;

export const ChallengeContent = styled.div`
  background: ${colors.light.grayscale[5]};
  padding: 1.5rem;
  border-radius: 0.375rem;
  border-left: 4px solid ${colors.light.brand.primary100};
  margin-bottom: 2rem;
  line-height: 1.7;
  ${typography.styles.body2};
  color: ${colors.light.grayscale[90]};
  white-space: pre-line;
`;

export const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

interface OptionButtonProps {
  selected: boolean;
}

export const OptionButton = styled.button<OptionButtonProps>`
  padding: 1rem;
  border: 2px solid
    ${(props) =>
      props.selected
        ? colors.light.brand.primary100
        : colors.light.grayscale[20]};
  background: ${(props) =>
    props.selected ? colors.light.brand.primary10 : colors.light.grayscale[0]};
  color: ${(props) =>
    props.selected
      ? colors.light.brand.primary100
      : colors.light.grayscale[90]};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all "250ms ease-in-out";
  text-align: left;
  min-height: 80px;
  display: flex;
  align-items: center;
  ${typography.styles.body2};

  &:hover {
    border-color: ${colors.light.brand.primary100};
    background: ${(props) =>
      props.selected
        ? colors.light.brand.primary20
        : colors.light.brand.primary10};
    transform: translateY(-2px);
    box-shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
  }

  &:active {
    transform: translateY(0);
  }

  div {
    width: 100%;
  }
`;

export const ActionButton = styled.button`
  background: ${colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  ${typography.styles.title5};
  cursor: pointer;
  transition: all "250ms ease-in-out";
  min-width: 120px;
  box-shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)";

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: ${colors.light.grayscale[40]};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ResultContainer = styled.div`
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
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
    props.isCorrect ? colors.light.state.success : colors.light.state.error};
  margin-bottom: 1rem;
  text-align: center;
`;

export const ExplanationText = styled.div`
  ${typography.styles.body2};
  line-height: 1.7;
  color: ${colors.light.grayscale[90]};
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: ${colors.light.brand.primary100};
    font-weight: ${typography.fontWeight.semibold};
  }
`;

export const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;

    > div {
      width: 100%;
      display: flex;
      justify-content: center;
      gap: 0.75rem;
    }
  }
`;
