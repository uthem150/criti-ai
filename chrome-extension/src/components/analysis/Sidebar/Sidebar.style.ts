import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { colors, typography } from "@/styles/design";

// Keyframes
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
`;

// 전체 컨테이너
export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: ${typography.fontFamily.primary};
`;

// 닫기 버튼
export const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  background: ${colors.light.grayscale[10]};
  width: 1.5rem;
  height: 1.5rem;

  border: none;
  border-radius: 100%;

  font-size: 0.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${colors.light.grayscale[60]};

  transition: all "250ms ease-in-out";
  backdrop-filter: blur(10px);
  box-shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";

  &:hover {
    background: ${colors.light.grayscale[5]};
    color: ${colors.light.state.error};
    transform: scale(1.1);
  }
`;

// 헤더
export const HeaderSection = styled.div`
  padding: 1.5rem 1rem;

  display: flex;
  padding: 1.5rem 2rem;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;

  height: 10vh;
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.26rem;

  h2 {
    margin: 0rem;
    color: ${colors.light.grayscale[90]};
    font-family: Poppins;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
  }
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  ${typography.styles.caption3};
  color: ${colors.light.grayscale[0]};
  opacity: 0.9;
  font-family: inherit !important;
  position: relative;
  z-index: 1;
`;

// 에러 섹션
export const ErrorSection = styled.div`
  padding: 60px 24px;
  text-align: center;
  background: ${colors.light.grayscale[0]};
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ErrorIcon = styled.div`
  font-size: 80px;
  margin-bottom: 24px;
  line-height: 1;
`;

export const ErrorTitle = styled.h3`
  font-size: 28px;
  font-weight: ${typography.fontWeight.bold};
  margin: 0 0 12px 0;
  color: ${colors.light.state.error};
  letter-spacing: -0.5px;
`;

export const ErrorText = styled.p`
  ${typography.styles.body2};
  margin: 0 0 32px 0;
  color: ${colors.light.grayscale[70]};
  line-height: 1.6;
  max-width: 400px;
`;

export const ErrorSolutions = styled.div`
  background: ${colors.light.grayscale[5]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 16px;
  padding: 24px;
  margin: 0 0 32px 0;
  text-align: left;
  max-width: 420px;
  width: 100%;
`;

export const ErrorSolutionsTitle = styled.h4`
  ${typography.styles.title5};
  font-weight: ${typography.fontWeight.semibold};
  margin: 0 0 16px 0;
  color: ${colors.light.grayscale[90]};
`;

export const ErrorSolutionsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: ${colors.light.grayscale[70]};
  list-style-type: disc;
`;

export const ErrorSolutionsItem = styled.li`
  ${typography.styles.body4};
  margin-bottom: 8px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ErrorActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  width: 100%;
  max-width: 420px;
`;

export const ErrorButton = styled.button<{ primary?: boolean }>`
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 250ms ease-in-out;
  color: ${colors.light.grayscale[0]};
  flex: 1;

  ${(props) =>
    props.primary
      ? css`
          background: ${colors.light.brand.primary100};
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);

          &:hover {
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
            opacity: 0.95;
          }
        `
      : css`
          background: ${colors.light.grayscale[30]};

          &:hover {
            background: ${colors.light.grayscale[40]};
          }
        `}

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 환영 섹션
export const WelcomeSection = styled.div`
  min-height: 90vh;
  padding: 60px 24px 40px;
  text-align: center;
  background: ${colors.light.grayscale[0]};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const WelcomeTitle = styled.h3`
  font-size: 28px;
  font-weight: ${typography.fontWeight.bold};
  margin: 0 0 16px 0;
  color: ${colors.light.grayscale[100]};
  line-height: 1.3;
  letter-spacing: -0.5px;
`;

export const WelcomeText = styled.p`
  ${typography.styles.body2};
  margin: 0 0 32px 0;
  color: ${colors.light.grayscale[60]};
  max-width: 380px;
  line-height: 1.6;
`;

export const AnalyzeButton = styled.button`
  background: ${colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};
  border: none;
  padding: 18px 48px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  margin-bottom: 32px;
  transition: all 250ms ease-in-out;
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
    opacity: 0.95;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonIcon = styled.span`
  font-size: 22px;
  display: flex;
  align-items: center;
  line-height: 1;
`;

export const AnalysisFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0;
  width: 100%;
`;

export const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 16px;
  background: ${colors.light.grayscale[5]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 16px;
  transition: all 250ms ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${colors.light.grayscale[10]};
    border-color: ${colors.light.brand.primary100};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const FeatureIcon = styled.span`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

// 로딩 섹션
export const LoadingSection = styled.div`
  padding: 60px 24px;
  text-align: center;
  background: ${colors.light.grayscale[0]};
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LoadingAnimation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
`;

export const Spinner = styled.div`
  width: 64px;
  height: 64px;
  border: 4px solid ${colors.light.grayscale[10]};
  border-top: 4px solid ${colors.light.brand.primary100};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

export const LoadingDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

export const LoadingDot = styled.span`
  width: 10px;
  height: 10px;
  background: ${colors.light.brand.primary100};
  border-radius: 50%;
  animation: ${pulse} 1.4s ease-in-out infinite both;

  &:nth-of-type(1) {
    animation-delay: -0.32s;
  }
  &:nth-of-type(2) {
    animation-delay: -0.16s;
  }
  &:nth-of-type(3) {
    animation-delay: 0s;
  }
`;

export const LoadingTitle = styled.h3`
  font-size: 28px;
  font-weight: ${typography.fontWeight.bold};
  margin: 0 0 12px 0;
  color: ${colors.light.grayscale[100]};
  letter-spacing: -0.5px;
`;

export const LoadingText = styled.p`
  ${typography.styles.body2};
  margin: 0 0 32px 0;
  color: ${colors.light.grayscale[60]};
  line-height: 1.6;
  max-width: 400px;
`;

export const AnalysisSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 360px;
`;

export const Step = styled.div<{ active?: boolean }>`
  padding: 16px 24px;
  background: ${colors.light.grayscale[5]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 12px;
  ${typography.styles.body3};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.light.grayscale[60]};
  transition: all 250ms ease-in-out;
  width: 100%;
  text-align: left;

  ${(props) =>
    props.active &&
    css`
      background: ${colors.light.brand.primary100};
      color: ${colors.light.grayscale[0]};
      font-weight: ${typography.fontWeight.semibold};
      border-color: ${colors.light.brand.primary100};
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    `}
`;

// 결과 섹션
export const ResultsSection = styled.div`
  padding: 20px;
  background: ${colors.light.grayscale[5]};
  min-height: 90vh;
`;

// 접을 수 있는 섹션 (ExpandableSection 컴포넌트 내부에서 사용)
export const ExpandableSectionContainer = styled.div`
  margin-bottom: 16px;
  border-radius: 12px;
  border: 1px solid ${colors.light.grayscale[20]};
  background: ${colors.light.grayscale[0]};
  overflow: hidden;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: all 250ms ease-in-out;

  &:hover {
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
`;

export const SectionHeader = styled.button`
  width: 100%;
  padding: 12px 16px;
  height: 3.5rem;
  background: ${colors.light.grayscale[5]};
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${typography.styles.title5.fontSize};
  transition: all 250ms ease-in-out;
  font-family: inherit;

  &:hover {
    background: ${colors.light.grayscale[10]};
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SectionIcon = styled.span`
  font-size: ${typography.styles.title3.fontSize};
`;

export const SectionTitle = styled.span`
  ${typography.styles.title3};
  color: ${colors.light.grayscale[100]};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* 점수/개수 텍스트 스타일 */
  span {
    ${typography.styles.title3};
    font-weight: ${typography.fontWeight.bold};
  }
`;

export const ExpandArrow = styled.span<{ expanded?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  color: ${colors.light.grayscale[70]};
  transition: transform 0.2s ease;
  transform: ${(props) => (props.expanded ? "rotate(180deg)" : "rotate(0deg)")};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const SectionContent = styled.div`
  padding: 20px;
  border-top: 1px solid ${colors.light.grayscale[20]};
  animation: ${slideDown} 250ms ease-in-out;
`;

// 공용 타이틀 (h4, h5)
export const SectionContentTitleH4 = styled.h4`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 12px 0;
`;

export const SectionContentTitleH5 = styled.h5`
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 8px 0;
`;

// 종합 분석 결과
export const OverviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const OverallScoreDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${colors.light.grayscale[0]};
  border-radius: 12px;
  border: 1px solid ${colors.light.brand.primary20};
`;

export const ScoreCircle = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
`;

export const ScoreNumber = styled.div`
  ${typography.styles.headline1};
  color: ${colors.light.etc.mint};
  line-height: 1;
  font-weight: ${typography.fontWeight.bold};
`;

export const ScoreLabel = styled.div`
  ${typography.styles.caption4};
  color: ${colors.light.grayscale[70]};
  margin-top: 4px;
`;

export const ScoreDescription = styled.div``;

export const ScoreDescriptionText = styled.p`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  margin: 0;
  line-height: 1.6;
`;

export const DetailedScores = styled.div``;

export const DetailedScoresTitle = styled.h4`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 16px 0;
`;

// 세로 막대 그래프 컨테이너
export const ChartContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 12px;
  height: 180px;
  padding: 0 8px;
  align-self: stretch;
`;

export const ChartColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 1;
`;

export const ChartBarVertical = styled.div<{ height: number; color: string }>`
  width: 100%;

  /* 점수(100)가 전체 높이의 100%가 아닌 70%를 차지하도록 하여 
     상단 숫자와 하단 라벨이 들어갈 공간을 확보  */
  height: ${(props) => props.height * 0.7}%;

  background: ${(props) => props.color};
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: height 0.5s ease;
  min-height: 20px; /* 점수가 낮아도 최소한의 막대는 보이도록 유지 */
`;

export const ChartValue = styled.div<{ score: number }>`
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  ${typography.styles.title5};

  color: ${(props) => {
    if (props.score >= 70) return colors.light.state.success;
    if (props.score >= 50) return colors.light.etc.orange;
    return colors.light.state.error;
  }};
  white-space: nowrap;
`;

export const ChartLabel = styled.div`
  ${typography.styles.caption3};
  color: ${colors.light.grayscale[70]};
  text-align: center;
`;

// 출처 신뢰도
export const SourceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TrustLevel = styled.div`
  display: flex;
  justify-content: center;
`;

export const TrustBadge = styled.span<{
  level: "trusted" | "neutral" | "caution" | "unreliable";
}>`
  padding: 8px 16px;
  border-radius: 9999px;
  ${typography.styles.title5};

  ${(props) =>
    props.level === "trusted" &&
    css`
      background: ${colors.light.grayscale[5]};
      color: ${colors.light.etc.mint};
      border: 1px solid ${colors.light.etc.mint};
    `}
  ${(props) =>
    props.level === "neutral" &&
    css`
      background: ${colors.light.grayscale[5]};
      color: ${colors.light.grayscale[60]};
      border: 1px solid ${colors.light.grayscale[60]};
    `}
  ${(props) =>
    props.level === "caution" &&
    css`
      background: ${colors.light.grayscale[5]};
      color: ${colors.light.etc.yellow};
      border: 1px solid ${colors.light.etc.yellow};
    `}
  ${(props) =>
    props.level === "unreliable" &&
    css`
      background: ${colors.light.grayscale[5]};
      color: ${colors.light.state.error};
      border: 1px solid ${colors.light.state.error};
    `}
`;

export const SourceDetails = styled.div``;

export const SourceDetailsTitle = styled.h4`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 8px 0;
`;

export const SourceDescriptionText = styled.p`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 16px 0;
`;

export const ReputationFactors = styled.div``;

export const ReputationFactorsTitle = styled.h5`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 8px 0;
`;

export const FactorTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export const FactorTag = styled.span`
  background: ${colors.light.grayscale[10]};
  color: ${colors.light.grayscale[60]};
  padding: 4px 8px;
  border-radius: 6px;
  ${typography.styles.caption4};
`;

export const HistoricalData = styled.div`
  background: ${colors.light.grayscale[5]};
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${colors.light.grayscale[20]};
  margin-top: 16px;
`;

export const HistoricalItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const HistoricalLabel = styled.span`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
`;

export const HistoricalValue = styled.span`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[90]};
  font-weight: ${typography.fontWeight.semibold};
`;

// 편향성 분석
export const BiasContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const BiasSection = styled.div`
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 8px;
  padding: 16px;
  background: ${colors.light.grayscale[5]};
`;

export const BiasSectionTitle = styled.h4`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 12px 0;
`;

export const IntensityDisplay = styled.div`
  margin-bottom: 16px;
`;

export const IntensityBadge = styled.span<{
  intensity: "none" | "low" | "medium" | "high";
}>`
  padding: 4px 12px;
  border-radius: 9999px;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.light.grayscale[0]};
  border: 1px solid;

  ${(props) =>
    (props.intensity === "none" || props.intensity === "low") &&
    css`
      color: ${colors.light.etc.mint};
      border-color: ${colors.light.etc.mint};
    `}
  ${(props) =>
    props.intensity === "medium" &&
    css`
      color: ${colors.light.etc.yellow};
      border-color: ${colors.light.etc.yellow};
    `}
  ${(props) =>
    props.intensity === "high" &&
    css`
      color: ${colors.light.state.error};
      border-color: ${colors.light.state.error};
    `}
`;

export const ManipulativeWords = styled.div``;

export const ManipulativeWordsTitle = styled.h5`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 12px 0;
`;

export const WordsGrid = styled.div`
  display: grid;
  gap: 12px;
`;

export const WordItem = styled.div`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 8px;
  padding: 12px;
`;

export const WordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const WordBadge = styled.span<{
  impact: "low" | "medium" | "high";
}>`
  padding: 4px 8px;
  border-radius: 6px;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.bold};
  background: ${colors.light.grayscale[10]};

  ${(props) =>
    props.impact === "low" &&
    css`
      color: ${colors.light.etc.yellow};
    `}
  ${(props) =>
    props.impact === "medium" &&
    css`
      color: ${colors.light.etc.orange};
    `}
  ${(props) =>
    props.impact === "high" &&
    css`
      color: ${colors.light.etc.red};
    `}
`;

export const WordCategory = styled.span`
  ${typography.styles.caption4};
  color: ${colors.light.grayscale[60]};
  padding: 2px 6px;
  background: ${colors.light.grayscale[10]};
  border-radius: 4px;
`;

export const WordExplanation = styled.p`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
  line-height: 1.4;
  margin: 0;
`;

// 클릭베이트
export const ClickbaitGrid = styled.div`
  display: grid;
  gap: 12px;
`;

export const ClickbaitItem = styled.div<{
  severity: "low" | "medium" | "high";
}>`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 8px;
  padding: 12px;

  ${(props) =>
    props.severity === "high" &&
    css`
      border-color: ${colors.light.etc.red};
      background: ${colors.light.grayscale[5]};
    `}
  ${(props) =>
    props.severity === "medium" &&
    css`
      border-color: ${colors.light.etc.yellow};
      background: ${colors.light.grayscale[5]};
    `}
`;

export const ClickbaitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const ClickbaitType = styled.span`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[90]};
`;

export const SeverityIndicator = styled.span<{
  severity: "low" | "medium" | "high";
}>`
  padding: 2px 6px;
  border-radius: 4px;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};

  ${(props) =>
    props.severity === "high" &&
    css`
      background: ${colors.light.grayscale[10]};
      color: ${colors.light.etc.red};
    `}
  ${(props) =>
    props.severity === "medium" &&
    css`
      background: ${colors.light.grayscale[10]};
      color: ${colors.light.etc.yellow};
    `}
  ${(props) =>
    props.severity === "low" &&
    css`
      background: ${colors.light.grayscale[10]};
      color: ${colors.light.etc.mint};
    `}
`;

export const ClickbaitText = styled.div`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
  margin: 4px 0 8px 0;
  font-style: italic;
  padding: 4px 8px;
  background: ${colors.light.grayscale[10]};
  border-radius: 4px;
`;

export const ClickbaitExplanation = styled.p`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
  margin: 0;
  line-height: 1.4;
`;

// 정치적 편향
export const PoliticalBias = styled.div`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 8px;
  padding: 12px;
`;

export const PoliticalDirection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const PoliticalBadge = styled.span<{
  direction: "left" | "right" | "center" | "neutral";
}>`
  padding: 4px 12px;
  border-radius: 9999px;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.light.grayscale[10]};

  ${(props) =>
    props.direction === "left" &&
    css`
      color: ${colors.light.brand.primary100};
    `}
  ${(props) =>
    props.direction === "right" &&
    css`
      color: ${colors.light.state.error};
    `}
  ${(props) =>
    (props.direction === "center" || props.direction === "neutral") &&
    css`
      color: ${colors.light.grayscale[60]};
    `}
`;

export const Confidence = styled.span`
  ${typography.styles.caption4};
  color: ${colors.light.grayscale[60]};
`;

export const PoliticalIndicators = styled.div``;

export const PoliticalIndicatorsTitle = styled.h5`
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 8px 0;
`;

export const PoliticalIndicatorsList = styled.ul`
  margin: 0;
  padding-left: 16px;
  list-style-type: none;
`;

export const PoliticalIndicatorsItem = styled.li`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
  margin-bottom: 4px;
  position: relative;

  &::before {
    content: "•";
    color: ${colors.light.grayscale[40]};
    position: absolute;
    left: -12px;
  }
`;

// 논리적 오류
export const LogicContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FallaciesGrid = styled.div`
  display: grid;
  gap: 16px;
`;

export const FallacyItem = styled.div<{
  severity: "low" | "medium" | "high";
}>`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 12px;
  padding: 16px;
  transition: all 250ms ease-in-out;

  &:hover {
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  ${(props) =>
    props.severity === "high" &&
    css`
      border-color: ${colors.light.etc.red};
      background: ${colors.light.grayscale[5]};
    `}
  ${(props) =>
    props.severity === "medium" &&
    css`
      border-color: ${colors.light.etc.orange};
      background: ${colors.light.grayscale[5]};
    `}
  ${(props) =>
    props.severity === "low" &&
    css`
      border-color: ${colors.light.etc.yellow};
      background: ${colors.light.grayscale[5]};
    `}
`;

export const FallacyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const FallacyType = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FallacyIcon = styled.span`
  font-size: ${typography.styles.title4.fontSize};
`;

export const FallacyName = styled.span`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[90]};
`;

export const SeverityBadge = styled.span<{
  severity: "low" | "medium" | "high";
}>`
  padding: 4px 8px;
  border-radius: 12px;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.light.grayscale[10]};

  ${(props) =>
    props.severity === "high" &&
    css`
      color: ${colors.light.etc.red};
    `}
  ${(props) =>
    props.severity === "medium" &&
    css`
      color: ${colors.light.etc.orange};
    `}
  ${(props) =>
    props.severity === "low" &&
    css`
      color: ${colors.light.etc.yellow};
    `}
`;

export const FallacyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FallacyDescription = styled.p`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  margin: 0;
`;

export const AffectedText = styled.div``;
export const FallacyExplanation = styled.div``;
export const FallacyExamples = styled.div``;

export const AffectedTextTitle = styled(SectionContentTitleH5)``;
export const FallacyExplanationTitle = styled(SectionContentTitleH5)``;
export const FallacyExamplesTitle = styled(SectionContentTitleH5)``;

export const AffectedTextQuote = styled.blockquote`
  margin: 0;
  padding: 8px 12px;
  background: ${colors.light.grayscale[10]};
  border-left: 3px solid ${colors.light.grayscale[40]};
  border-radius: 4px;
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
  font-style: italic;
`;

export const FallacyExplanationText = styled.p`
  margin: 0;
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
`;

export const FallacyExamplesList = styled.ul`
  margin: 0;
  padding-left: 16px;
  list-style-type: none;
`;

export const FallacyExamplesItem = styled.li`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[60]};
  margin-bottom: 4px;
  position: relative;

  &::before {
    content: "•";
    color: ${colors.light.grayscale[40]};
    position: absolute;
    left: -12px;
  }
`;

// 광고성 분석
export const AdvertisementContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const AdOverview = styled.div`
  background: ${colors.light.grayscale[5]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 12px;
  padding: 16px;
`;

export const AdStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const AdBadge = styled.span<{ isAdvertorial?: boolean }>`
  padding: 8px 12px;
  border-radius: 9999px;
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  border: 1px solid;

  ${(props) =>
    props.isAdvertorial
      ? css`
          background: ${colors.light.grayscale[5]};
          color: ${colors.light.etc.mint};
          border-color: ${colors.light.etc.mint};
        `
      : css`
          background: ${colors.light.grayscale[5]};
          color: ${colors.light.etc.mint};
          border-color: ${colors.light.etc.mint};
        `}
`;

export const AdConfidence = styled.span`
  ${typography.styles.caption4};
  color: ${colors.light.grayscale[60]};
`;

export const AdScores = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AdScoreItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AdScoreLabel = styled.span`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
`;

export const AdScoreValue = styled.span`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[90]};
  font-weight: ${typography.fontWeight.semibold};
`;

export const AdIndicators = styled.div``;

export const AdIndicatorsTitle = styled.h4`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 16px 0;
`;

// 교차 검증
export const CrossRefContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const KeyClaims = styled.div``;
export const SearchKeywords = styled.div``;
export const FactCheckSources = styled.div``;
export const ConsensusDisplay = styled.div``;

export const KeyClaimsTitle = styled(SectionContentTitleH4)``;
export const SearchKeywordsTitle = styled(SectionContentTitleH4)``;
export const FactCheckSourcesTitle = styled(SectionContentTitleH4)``;
export const ConsensusDisplayTitle = styled(SectionContentTitleH4)``;

export const ClaimsList = styled.ul`
  margin: 0;
  padding-left: 16px;
  list-style-type: none;
`;

export const ClaimItem = styled.li`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  margin-bottom: 8px;
  position: relative;
  padding-left: 4px;

  &::before {
    content: "🎯";
    position: absolute;
    left: -16px;
  }
`;

export const KeywordsBox = styled.div`
  background: ${colors.light.grayscale[10]};
  border: 1px solid ${colors.light.grayscale[30]};
  border-radius: 8px;
  padding: 12px;
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  font-weight: ${typography.fontWeight.semibold};
`;

export const SourcesGrid = styled.div`
  display: grid;
  gap: 12px;
`;

export const FactCheckItem = styled.div<{
  verdict: "true" | "false" | "mixed" | "unverified";
}>`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 8px;
  padding: 12px;
  transition: all 250ms ease-in-out;

  &:hover {
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  ${(props) =>
    props.verdict === "true" &&
    css`
      border-color: ${colors.light.etc.mint};
      background: ${colors.light.grayscale[5]};
    `}
  ${(props) =>
    props.verdict === "false" &&
    css`
      border-color: ${colors.light.state.error};
      background: ${colors.light.grayscale[5]};
    `}
  ${(props) =>
    props.verdict === "mixed" &&
    css`
      border-color: ${colors.light.etc.yellow};
      background: ${colors.light.grayscale[5]};
    `}
`;

export const SourceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const SourceOrg = styled.span`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[90]};
`;

export const VerdictBadge = styled.span<{
  verdict: "true" | "false" | "mixed" | "unverified";
}>`
  padding: 4px 8px;
  border-radius: 12px;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.light.grayscale[10]};

  ${(props) =>
    props.verdict === "true" &&
    css`
      color: ${colors.light.etc.mint};
    `}
  ${(props) =>
    props.verdict === "false" &&
    css`
      color: ${colors.light.state.error};
    `}
  ${(props) =>
    props.verdict === "mixed" &&
    css`
      color: ${colors.light.etc.yellow};
    `}
  ${(props) =>
    props.verdict === "unverified" &&
    css`
      color: ${colors.light.grayscale[60]};
    `}
`;

export const SourceSummary = styled.p`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 8px 0;
`;

export const SourceLink = styled.a`
  ${typography.styles.caption4};
  color: ${colors.light.brand.primary100};
  text-decoration: none;
  font-weight: ${typography.fontWeight.semibold};

  &:hover {
    text-decoration: underline;
  }
`;

export const ConsensusBadge = styled.div<{
  consensus: "agree" | "disagree" | "mixed" | "insufficient";
}>`
  padding: 12px 16px;
  border-radius: 12px;
  ${typography.styles.title5};
  text-align: center;
  border: 2px solid;
  background: ${colors.light.grayscale[5]};

  ${(props) =>
    props.consensus === "agree" &&
    css`
      color: ${colors.light.etc.mint};
      border-color: ${colors.light.etc.mint};
    `}
  ${(props) =>
    props.consensus === "disagree" &&
    css`
      color: ${colors.light.state.error};
      border-color: ${colors.light.state.error};
    `}
  ${(props) =>
    props.consensus === "mixed" &&
    css`
      color: ${colors.light.etc.yellow};
      border-color: ${colors.light.etc.yellow};
    `}
  ${(props) =>
    props.consensus === "insufficient" &&
    css`
      color: ${colors.light.grayscale[60]};
      border-color: ${colors.light.grayscale[60]};
    `}
`;

// 분석 팁
export const AnalysisTips = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: ${colors.light.grayscale[5]};
  border: 1px solid ${colors.light.etc.yellow};
  border-radius: 12px;
`;

export const AnalysisTipsTitle = styled.h4`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 16px 0;
  text-align: center;
`;

export const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const TipItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  background: ${colors.light.grayscale[0]};
  border-radius: 8px;
`;

export const TipIcon = styled.span`
  font-size: ${typography.styles.title4.fontSize};
  flex-shrink: 0;
  margin-top: 2px;
`;

export const TipText = styled.p`
  margin: 0;
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
`;

// 비판적 사고 훈련 버튼
export const CriticalThinkingButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  background: ${colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 12px;
  ${typography.styles.title5};
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 250ms ease-in-out;
  margin-top: 16px;

  &:hover {
    background: ${colors.light.brand.primary100};
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ClickableText 스타일
export const ClickableTextStyled = styled.span<{
  type: "bias" | "fallacy" | "manipulation" | "advertisement" | "claim";
}>`
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 2px;
  transition: 150ms ease-in-out;

  &:hover {
    background-color: ${colors.light.grayscale[10]};
  }

  ${(props) =>
    props.type === "bias" &&
    css`
      color: ${colors.light.etc.yellow};
      font-weight: ${typography.fontWeight.semibold};
    `}
  ${(props) =>
    props.type === "fallacy" &&
    css`
      color: ${colors.light.etc.orange};
      font-weight: ${typography.fontWeight.semibold};
    `}
  ${(props) =>
    props.type === "manipulation" &&
    css`
      color: ${colors.light.etc.purple};
      font-weight: ${typography.fontWeight.semibold};
    `}
  ${(props) =>
    props.type === "advertisement" &&
    css`
      color: ${colors.light.etc.mint};
      font-weight: ${typography.fontWeight.semibold};
    `}
  ${(props) =>
    props.type === "claim" &&
    css`
      color: ${colors.light.etc.blue};
      font-weight: ${typography.fontWeight.semibold};
    `}
  
  /* .word-badge 스타일을 .className으로 받을 수 있도록 지원 */
  &.word-badge {
    padding: 4px 8px;
    border-radius: 6px;
    ${typography.styles.caption4};
    font-weight: ${typography.fontWeight.bold};
    border-bottom: none;
    background: ${colors.light.grayscale[10]};

    &.low {
      color: ${colors.light.etc.yellow};
    }
    &.medium {
      color: ${colors.light.etc.orange};
    }
    &.high {
      color: ${colors.light.etc.red};
    }
  }
`;
