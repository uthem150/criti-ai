import styled from "@emotion/styled";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "@/styles/style";

export const MeterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
  padding: ${spacing[5]} ${spacing[4]};
  background: ${colors.background.gradient};
  border-radius: ${borderRadius.xl};
  border: 1px solid ${colors.border.primary};
  box-shadow: ${shadows.sm};
  font-family: ${typography.fontFamily.primary};
`;

export const ScoreBarContainer = styled.div`
  width: 100%;
  height: 40px;
  background-color: ${colors.background.tertiary};
  border-radius: ${borderRadius.full};
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px ${colors.shadow.light};
`;

interface ScoreBarProps {
  score: number;
  color: string;
}

export const ScoreBar = styled.div<ScoreBarProps>`
  width: ${(props) => Math.max(props.score, 5)}%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${(props) => props.color}CC,
    ${(props) => props.color}
  );
  border-radius: ${borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.score > 25 ? "center" : "flex-end")};
  position: relative;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px ${(props) => props.color}40;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 70%
    );
    border-radius: inherit;
  }
`;

export const ScoreText = styled.span<{ score: number }>`
  font-size: ${typography.styles.title3.fontSize};
  font-weight: ${typography.fontWeight.bold};
  color: ${(props) =>
    props.score > 25 ? colors.text.inverse : colors.text.primary};
  text-shadow: ${(props) =>
    props.score > 25 ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "none"};
  position: ${(props) => (props.score <= 25 ? "absolute" : "static")};
  right: ${(props) => (props.score <= 25 ? spacing[2] : "auto")};
  z-index: 10;
  font-family: ${typography.fontFamily.primary};
`;

export const LevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing[1]};
  font-family: ${typography.fontFamily.primary};
`;

interface TrustLabelProps {
  score: number;
}

export const TrustLabel = styled.div<TrustLabelProps>`
  font-size: ${typography.styles.headline2.fontSize};
  font-weight: ${typography.fontWeight.bold};
  color: ${(props) => {
    if (props.score >= 80) return colors.trust.high;
    if (props.score >= 50) return colors.trust.medium;
    if (props.score >= 30) return colors.trust.low;
    return colors.trust.veryLow;
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: ${typography.fontFamily.primary};
`;

export const TrustDescription = styled.p`
  font-size: ${typography.styles.body3.fontSize};
  color: ${colors.text.tertiary};
  margin: 0;
  font-weight: ${typography.fontWeight.regular};
  font-family: ${typography.fontFamily.primary};
`;

export const DetailedScoresContainer = styled.div`
  margin-top: ${spacing[2]};
  padding-top: ${spacing[4]};
  border-top: 1px solid ${colors.border.primary};
  font-family: ${typography.fontFamily.primary};

  h4 {
    font-size: ${typography.styles.title4.fontSize};
    font-weight: ${typography.fontWeight.semibold};
    color: ${colors.text.primary};
    margin: 0 0 ${spacing[3]} 0;
    text-align: center;
    font-family: ${typography.fontFamily.primary};
  }
`;

export const DetailedScoreItem = styled.div`
  margin-bottom: ${spacing[3]};
  font-family: ${typography.fontFamily.primary};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ScoreLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[1]};
  font-size: ${typography.styles.caption2.fontSize};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.text.secondary};
  font-family: ${typography.fontFamily.primary};
`;

interface ScoreValueProps {
  score: number;
}

export const ScoreValue = styled.span<ScoreValueProps>`
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.styles.caption3.fontSize};
  color: ${(props) => {
    if (props.score >= 80) return colors.trust.high;
    if (props.score >= 50) return colors.trust.medium;
    if (props.score >= 30) return colors.trust.low;
    return colors.trust.veryLow;
  }};
  font-family: ${typography.fontFamily.primary};
`;

export const ScoreMiniBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${colors.background.tertiary};
  border-radius: ${borderRadius.base};
  overflow: hidden;
  position: relative;

  .fill {
    height: 100%;
    border-radius: ${borderRadius.base};
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 2px;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 2px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 0 ${borderRadius.base} ${borderRadius.base} 0;
    }
  }
`;
