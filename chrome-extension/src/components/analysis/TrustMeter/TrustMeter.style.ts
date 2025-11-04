import styled from "@emotion/styled";
import { colors, typography } from "@/styles/design";

export const MeterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px;
  background: linear-gradient(
    135deg,
    ${colors.light.grayscale[5]} 0%,
    ${colors.light.grayscale[10]} 100%
  );
  border-radius: 12px;
  border: 1px solid ${colors.light.grayscale[20]};
  box-shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
  font-family: ${typography.fontFamily.primary};
`;

export const ScoreBarContainer = styled.div`
  width: 100%;
  height: 40px;
  background-color: ${colors.light.grayscale[10]};
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
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
  border-radius: 9999px;
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
      ${colors.light.transparency.white[20]} 50%,
      transparent 70%
    );
    border-radius: inherit;
  }
`;

export const ScoreText = styled.span<{ score: number }>`
  font-size: ${typography.styles.title3.fontSize};
  font-weight: ${typography.fontWeight.bold};
  color: ${(props) =>
    props.score > 25 ? colors.light.grayscale[0] : colors.light.grayscale[90]};
  text-shadow: ${(props) =>
    props.score > 25 ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "none"};
  position: ${(props) => (props.score <= 25 ? "absolute" : "static")};
  right: ${(props) => (props.score <= 25 ? "8px" : "auto")};
  z-index: 10;
  font-family: ${typography.fontFamily.primary};
`;

export const LevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-family: ${typography.fontFamily.primary};
`;

interface TrustLabelProps {
  score: number;
}

export const TrustLabel = styled.div<TrustLabelProps>`
  font-size: ${typography.styles.headline2.fontSize};
  font-weight: ${typography.fontWeight.bold};
  color: ${(props) => {
    if (props.score >= 80) return colors.light.etc.mint;
    if (props.score >= 50) return colors.light.etc.yellow;
    if (props.score >= 30) return colors.light.etc.orange;
    return colors.light.state.error;
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: ${typography.fontFamily.primary};
`;

export const TrustDescription = styled.p`
  font-size: ${typography.styles.body3.fontSize};
  color: ${colors.light.grayscale[60]};
  margin: 0;
  font-weight: ${typography.fontWeight.regular};
  font-family: ${typography.fontFamily.primary};
`;

export const DetailedScoresContainer = styled.div`
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid ${colors.light.grayscale[20]};
  font-family: ${typography.fontFamily.primary};

  h4 {
    font-size: ${typography.styles.title4.fontSize};
    font-weight: ${typography.fontWeight.semibold};
    color: ${colors.light.grayscale[90]};
    margin: 0 0 12px 0;
    text-align: center;
    font-family: ${typography.fontFamily.primary};
  }
`;

export const DetailedScoreItem = styled.div`
  margin-bottom: 12px;
  font-family: ${typography.fontFamily.primary};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ScoreLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: ${typography.styles.caption2.fontSize};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.light.grayscale[70]};
  font-family: ${typography.fontFamily.primary};
`;

interface ScoreValueProps {
  score: number;
}

export const ScoreValue = styled.span<ScoreValueProps>`
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.styles.caption3.fontSize};
  color: ${(props) => {
    if (props.score >= 80) return colors.light.etc.mint;
    if (props.score >= 50) return colors.light.etc.yellow;
    if (props.score >= 30) return colors.light.etc.orange;
    return colors.light.state.error;
  }};
  font-family: ${typography.fontFamily.primary};
`;

export const ScoreMiniBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${colors.light.grayscale[10]};
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  .fill {
    height: 100%;
    border-radius: 4px;
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
      background: ${colors.light.transparency.white[80]};
      border-radius: 0 4px 4px 0;
    }
  }
`;
