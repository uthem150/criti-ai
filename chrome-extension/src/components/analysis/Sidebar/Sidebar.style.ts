import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
} from "@/styles/style";

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

const highlightPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(107, 138, 255, 0.8);
    background-color: rgba(107, 138, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(107, 138, 255, 0.3);
    background-color: rgba(107, 138, 255, 0.7);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(107, 138, 255, 0);
  }
`;

const tooltipFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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
export const CloseButtonContainer = styled.div`
  position: absolute;
  top: ${spacing[3]};
  right: ${spacing[3]};
  z-index: 10;
`;

export const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: ${borderRadius.full};
  width: ${spacing[8]};
  height: ${spacing[8]};
  font-size: ${typography.styles.body2.fontSize};
  cursor: pointer;
  color: ${colors.grayscale[60]};
  transition: all ${animations.transition.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit !important;
  backdrop-filter: blur(10px);
  box-shadow: ${shadows.md};

  &:hover {
    background: ${colors.background.secondary};
    color: ${colors.status.error};
    transform: scale(1.1);
  }
`;

// 헤더
export const HeaderSection = styled.div`
  padding: ${spacing[3]} ${spacing[2]};
  background: linear-gradient(
    135deg,
    ${colors.primary.main} 0%,
    ${colors.primary.dark} 100%
  );
  color: ${colors.text.inverse};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
  height: 10vh;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.1) 75%,
      transparent 75%
    );
    background-size: 20px 20px;
    opacity: 0.3;
  }
`;

export const HeaderTitle = styled.h3`
  margin: 0;
  ${typography.styles.title1};
  color: ${colors.text.inverse};
  display: flex;
  align-items: center;
  gap: ${spacing[1]};
  font-family: inherit !important;
  position: relative;
  z-index: 1;
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  ${typography.styles.caption3};
  color: ${colors.text.inverse};
  opacity: 0.9;
  font-family: inherit !important;
  position: relative;
  z-index: 1;
`;

// 에러 섹션
export const ErrorSection = styled.div`
  padding: ${spacing[8]} ${spacing[6]};
  text-align: center;
  background: ${colors.background.secondary};
  min-height: 90vh;
`;

export const ErrorIcon = styled.div`
  font-size: ${typography.styles.headline1.fontSize};
  margin-bottom: ${spacing[4]};
`;

export const ErrorTitle = styled.h3`
  ${typography.styles.title2};
  margin: 0 0 ${spacing[3]} 0;
  color: ${colors.status.error};
`;

export const ErrorText = styled.p`
  ${typography.styles.body3};
  margin: 0 0 ${spacing[5]} 0;
  color: ${colors.text.secondary};
`;

export const ErrorSolutions = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.secondary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[4]};
  margin: ${spacing[4]} 0;
  text-align: left;
`;

export const ErrorSolutionsTitle = styled.h4`
  ${typography.styles.title5};
  margin: 0 0 ${spacing[2]} 0;
  color: ${colors.text.primary};
`;

export const ErrorSolutionsList = styled.ul`
  margin: 0;
  padding-left: ${spacing[4]};
  color: ${colors.text.secondary};
  list-style-type: disc;
`;

export const ErrorSolutionsItem = styled.li`
  ${typography.styles.body4};
  margin-bottom: ${spacing[1]};
`;

export const ErrorActions = styled.div`
  display: flex;
  gap: ${spacing[2]};
  justify-content: center;
`;

export const ErrorButton = styled.button<{ primary?: boolean }>`
  padding: ${spacing[2]} ${spacing[5]};
  border: none;
  border-radius: ${borderRadius.md};
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${animations.transition.normal};
  color: ${colors.text.inverse};

  ${(props) =>
    props.primary
      ? css`
          background: ${colors.status.error};
        `
      : css`
          background: ${colors.status.warning};
        `}

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${shadows.md};
  }
`;

// 환영 섹션
export const WelcomeSection = styled.div`
  min-height: 90vh;
  padding: ${spacing[8]} ${spacing[6]};
  text-align: center;
  background: ${colors.background.gradient};
`;

export const WelcomeIcon = styled.div`
  font-size: 56px; // 디자인 시스템에 없음
  margin-bottom: ${spacing[4]};
  display: block;
`;

export const WelcomeTitle = styled.h3`
  ${typography.styles.title1};
  margin: 0 0 ${spacing[3]} 0;
  color: ${colors.text.primary};
`;

export const WelcomeText = styled.p`
  ${typography.styles.body3};
  margin: 0 0 ${spacing[6]} 0;
  color: ${colors.text.secondary};
`;

export const AnalyzeButton = styled.button`
  background: linear-gradient(
    135deg,
    ${colors.primary.main},
    ${colors.primary.dark}
  );
  color: ${colors.text.inverse};
  border: none;
  padding: ${spacing[4]} ${spacing[8]};
  border-radius: ${borderRadius.xl};
  ${typography.styles.title4};
  cursor: pointer;
  margin-bottom: ${spacing[6]};
  transition: all ${animations.transition.slow};
  box-shadow: 0 4px 16px ${colors.shadow.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
  width: fit-content;
  margin: 0 auto ${spacing[6]};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${colors.shadow.primary};
  }
`;

export const ButtonIcon = styled.span`
  font-size: ${typography.styles.title3.fontSize};
`;

export const AnalysisFeatures = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing[3]};
  margin-top: ${spacing[6]};
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  ${typography.styles.caption4};
  color: ${colors.text.secondary};
`;

export const FeatureIcon = styled.span`
  font-size: ${typography.styles.title4.fontSize};
`;

// 로딩 섹션
export const LoadingSection = styled.div`
  padding: ${spacing[8]} ${spacing[6]};
  text-align: center;
  background: ${colors.background.secondary};
  min-height: 90vh;
`;

export const LoadingAnimation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};
`;

export const Spinner = styled.div`
  width: ${spacing[12]};
  height: ${spacing[12]};
  border: ${spacing[1]} solid ${colors.background.tertiary};
  border-top: ${spacing[1]} solid ${colors.primary.main};
  border-radius: ${borderRadius.full};
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

export const LoadingDots = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing[1]};
`;

export const LoadingDot = styled.span`
  width: ${spacing[2]};
  height: ${spacing[2]};
  background: ${colors.primary.main};
  border-radius: ${borderRadius.full};
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
  ${typography.styles.title2};
  margin: 0 0 ${spacing[2]} 0;
  color: ${colors.text.primary};
`;

export const LoadingText = styled.p`
  ${typography.styles.body3};
  margin: 0 0 ${spacing[5]} 0;
  color: ${colors.text.secondary};
`;

export const AnalysisSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
  align-items: center;
`;

export const Step = styled.div<{ active?: boolean }>`
  padding: ${spacing[2]} ${spacing[4]};
  background: ${colors.background.tertiary};
  border-radius: ${borderRadius.full};
  ${typography.styles.caption4};
  color: ${colors.text.secondary};
  transition: all ${animations.transition.normal};

  ${(props) =>
    props.active &&
    css`
      background: ${colors.primary.main};
      color: ${colors.text.inverse};
      font-weight: ${typography.fontWeight.semibold};
    `}
`;

// 결과 섹션
export const ResultsSection = styled.div`
  padding: ${spacing[5]};
  background: ${colors.background.secondary};
  min-height: 90vh;
`;

// 접을 수 있는 섹션 (ExpandableSection 컴포넌트 내부에서 사용)
export const ExpandableSectionContainer = styled.div`
  margin-bottom: ${spacing[4]};
  border-radius: ${borderRadius.xl};
  border: 1px solid ${colors.border.primary};
  background: ${colors.background.primary};
  overflow: hidden;
  box-shadow: ${shadows.base};
  transition: all ${animations.transition.normal};

  &:hover {
    box-shadow: ${shadows.lg};
  }
`;

export const SectionHeader = styled.button`
  width: 100%;
  padding: ${spacing[4]} ${spacing[5]};
  background: ${colors.background.secondary};
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${typography.styles.title5.fontSize};
  transition: all ${animations.transition.normal};
  font-family: inherit;

  &:hover {
    background: ${colors.background.hover};
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
`;

export const SectionIcon = styled.span`
  font-size: ${typography.styles.title3.fontSize};
`;

export const SectionTitle = styled.span`
  ${typography.styles.title5};
  color: ${colors.text.primary};
`;

export const SectionBadge = styled.span`
  background: ${colors.primary.main};
  color: ${colors.text.inverse};
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.xl};
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
`;

export const ExpandArrow = styled.span<{ expanded?: boolean }>`
  font-size: ${typography.styles.body4.fontSize};
  color: ${colors.grayscale[60]};
  transition: transform ${animations.transition.normal};
  transform: rotate(-90deg);

  ${(props) =>
    props.expanded &&
    css`
      transform: rotate(0deg);
    `}
`;

export const SectionContent = styled.div`
  padding: ${spacing[5]};
  border-top: 1px solid ${colors.border.primary};
  animation: ${slideDown} ${animations.transition.normal};
`;

// 공용 타이틀 (h4, h5)
export const SectionContentTitleH4 = styled.h4`
  ${typography.styles.title5};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing[3]} 0;
`;

export const SectionContentTitleH5 = styled.h5`
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.secondary};
  margin: 0 0 ${spacing[2]} 0;
`;

// 종합 분석 결과
export const OverviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
`;

export const OverallScoreDisplay = styled.div`
  display: flex;
  gap: ${spacing[5]};
  align-items: center;
  padding: ${spacing[5]};
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  border: 1px solid ${colors.primary.main};
`;

export const ScoreCircle = styled.div`
  flex-shrink: 0;
  text-align: center;
`;

export const ScoreNumber = styled.div`
  ${typography.styles.headline1};
  background: linear-gradient(
    135deg,
    ${colors.primary.main},
    ${colors.primary.dark}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
`;

export const ScoreLabel = styled.div`
  ${typography.styles.caption4};
  color: ${colors.primary.dark};
  font-weight: ${typography.fontWeight.semibold};
  margin-top: ${spacing[1]};
`;

export const ScoreDescription = styled.div`
  flex: 1;
`;

export const ScoreDescriptionTitle = styled.h4`
  ${typography.styles.title4};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing[2]} 0;
`;

export const ScoreDescriptionText = styled.p`
  ${typography.styles.body3};
  color: ${colors.text.secondary};
  margin: 0;
`;

export const DetailedScores = styled.div``;

export const DetailedScoresTitle = styled.h4`
  ${typography.styles.title4};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing[4]} 0;
`;

export const ScoreBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`;

export const ScoreBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

export const BarInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BarLabel = styled.span`
  ${typography.styles.body3};
  color: ${colors.text.secondary};
`;

export const BarValue = styled.span`
  ${typography.styles.body3};
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.semibold};
`;

export const BarTrack = styled.div`
  height: ${spacing[2]};
  background: ${colors.background.tertiary};
  border-radius: ${borderRadius.base};
  overflow: hidden;
`;

export const BarFill = styled.div<{
  type: "source" | "objectivity" | "logic" | "advertisement" | "evidence";
}>`
  height: 100%;
  border-radius: ${borderRadius.base};
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  ${(props) =>
    props.type === "source" &&
    css`
      background: ${colors.analysis.source};
    `}
  ${(props) =>
    props.type === "objectivity" &&
    css`
      background: ${colors.primary.main};
    `}
  ${(props) =>
    props.type === "logic" &&
    css`
      background: ${colors.analysis.logic};
    `}
  ${(props) =>
    props.type === "advertisement" &&
    css`
      background: ${colors.analysis.advertisement};
    `}
  ${(props) =>
    props.type === "evidence" &&
    css`
      background: ${colors.analysis.evidence};
    `}
`;

// 출처 신뢰도
export const SourceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`;

export const TrustLevel = styled.div`
  display: flex;
  justify-content: center;
`;

export const TrustBadge = styled.span<{
  level: "trusted" | "neutral" | "caution" | "unreliable";
}>`
  padding: ${spacing[2]} ${spacing[4]};
  border-radius: ${borderRadius.full};
  ${typography.styles.title5};

  ${(props) =>
    props.level === "trusted" &&
    css`
      background: ${colors.background.secondary};
      color: ${colors.trust.high};
      border: 1px solid ${colors.trust.high};
    `}
  ${(props) =>
    props.level === "neutral" &&
    css`
      background: ${colors.background.secondary};
      color: ${colors.grayscale[60]};
      border: 1px solid ${colors.grayscale[60]};
    `}
  ${(props) =>
    props.level === "caution" &&
    css`
      background: ${colors.background.secondary};
      color: ${colors.trust.medium};
      border: 1px solid ${colors.trust.medium};
    `}
  ${(props) =>
    props.level === "unreliable" &&
    css`
      background: ${colors.background.secondary};
      color: ${colors.trust.veryLow};
      border: 1px solid ${colors.trust.veryLow};
    `}
`;

export const SourceDetails = styled.div``;

export const SourceDetailsTitle = styled.h4`
  ${typography.styles.title4};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing[2]} 0;
`;

export const SourceDescriptionText = styled.p`
  ${typography.styles.body3};
  color: ${colors.text.secondary};
  margin: 0 0 ${spacing[4]} 0;
`;

export const ReputationFactors = styled.div``;

export const ReputationFactorsTitle = styled.h5`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.secondary};
  margin: 0 0 ${spacing[2]} 0;
`;

export const FactorTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing[1]};
`;

export const FactorTag = styled.span`
  background: ${colors.background.tertiary};
  color: ${colors.text.tertiary};
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.md};
  ${typography.styles.caption4};
`;

export const HistoricalData = styled.div`
  background: ${colors.background.secondary};
  padding: ${spacing[3]};
  border-radius: ${borderRadius.lg};
  border: 1px solid ${colors.border.primary};
  margin-top: ${spacing[4]};
`;

export const HistoricalItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing[1]};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const HistoricalLabel = styled.span`
  ${typography.styles.body4};
  color: ${colors.text.secondary};
`;

export const HistoricalValue = styled.span`
  ${typography.styles.body4};
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.semibold};
`;

// 편향성 분석
export const BiasContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[5]};
`;

export const BiasSection = styled.div`
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[4]};
  background: ${colors.background.secondary};
`;

export const BiasSectionTitle = styled.h4`
  ${typography.styles.title5};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing[3]} 0;
`;

export const IntensityDisplay = styled.div`
  margin-bottom: ${spacing[4]};
`;

export const IntensityBadge = styled.span<{
  intensity: "none" | "low" | "medium" | "high";
}>`
  padding: ${spacing[1]} ${spacing[3]};
  border-radius: ${borderRadius.full};
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.background.primary}; // 흰색 배경
  border: 1px solid;

  ${(props) =>
    (props.intensity === "none" || props.intensity === "low") &&
    css`
      color: ${colors.trust.high};
      border-color: ${colors.trust.high};
    `}
  ${(props) =>
    props.intensity === "medium" &&
    css`
      color: ${colors.trust.medium};
      border-color: ${colors.trust.medium};
    `}
  ${(props) =>
    props.intensity === "high" &&
    css`
      color: ${colors.trust.veryLow};
      border-color: ${colors.trust.veryLow};
    `}
`;

export const ManipulativeWords = styled.div``;

export const ManipulativeWordsTitle = styled.h5`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.secondary};
  margin: 0 0 ${spacing[3]} 0;
`;

export const WordsGrid = styled.div`
  display: grid;
  gap: ${spacing[3]};
`;

export const WordItem = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[3]};
`;

export const WordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[2]};
`;

export const WordBadge = styled.span<{
  impact: "low" | "medium" | "high";
}>`
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.md};
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.bold};
  background: ${colors.background.tertiary};

  ${(props) =>
    props.impact === "low" &&
    css`
      color: ${colors.analysis.bias};
    `}
  ${(props) =>
    props.impact === "medium" &&
    css`
      color: ${colors.analysis.logic};
    `}
  ${(props) =>
    props.impact === "high" &&
    css`
      color: ${colors.analysis.evidence};
    `}
`;

export const WordCategory = styled.span`
  ${typography.styles.caption4};
  color: ${colors.text.tertiary};
  padding: 2px 6px; // 10px 폰트가 없으므로 12px 폰트에 맞게 패딩 조정
  background: ${colors.background.tertiary};
  border-radius: ${borderRadius.base};
`;

export const WordExplanation = styled.p`
  ${typography.styles.body4};
  color: ${colors.text.secondary};
  line-height: 1.4;
  margin: 0;
`;

// 클릭베이트
export const ClickbaitGrid = styled.div`
  display: grid;
  gap: ${spacing[3]};
`;

export const ClickbaitItem = styled.div<{
  severity: "low" | "medium" | "high";
}>`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[3]};

  ${(props) =>
    props.severity === "high" &&
    css`
      border-color: ${colors.analysis.evidence};
      background: ${colors.background.secondary};
    `}
  ${(props) =>
    props.severity === "medium" &&
    css`
      border-color: ${colors.analysis.bias};
      background: ${colors.background.secondary};
    `}
`;

export const ClickbaitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[2]};
`;

export const ClickbaitType = styled.span`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

export const SeverityIndicator = styled.span<{
  severity: "low" | "medium" | "high";
}>`
  padding: 2px 6px;
  border-radius: ${borderRadius.base};
  ${typography.styles.caption4}; // 10px -> 12px
  font-weight: ${typography.fontWeight.semibold};

  ${(props) =>
    props.severity === "high" &&
    css`
      background: ${colors.background.tertiary};
      color: ${colors.analysis.evidence};
    `}
  ${(props) =>
    props.severity === "medium" &&
    css`
      background: ${colors.background.tertiary};
      color: ${colors.analysis.bias};
    `}
  ${(props) =>
    props.severity === "low" &&
    css`
      background: ${colors.background.tertiary};
      color: ${colors.analysis.advertisement};
    `}
`;

export const ClickbaitText = styled.div`
  ${typography.styles.body4};
  color: ${colors.text.secondary};
  margin: ${spacing[1]} 0 ${spacing[2]} 0;
  font-style: italic;
  padding: ${spacing[1]} ${spacing[2]};
  background: ${colors.background.tertiary};
  border-radius: ${borderRadius.base};
`;

export const ClickbaitExplanation = styled.p`
  ${typography.styles.body4};
  color: ${colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

// 정치적 편향
export const PoliticalBias = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[3]};
`;

export const PoliticalDirection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[3]};
`;

export const PoliticalBadge = styled.span<{
  direction: "left" | "right" | "center" | "neutral";
}>`
  padding: ${spacing[1]} ${spacing[3]};
  border-radius: ${borderRadius.full};
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.background.tertiary};

  ${(props) =>
    props.direction === "left" &&
    css`
      color: ${colors.primary.main};
    `}
  ${(props) =>
    props.direction === "right" &&
    css`
      color: ${colors.status.error};
    `}
  ${(props) =>
    (props.direction === "center" || props.direction === "neutral") &&
    css`
      color: ${colors.grayscale[60]};
    `}
`;

export const Confidence = styled.span`
  ${typography.styles.caption4};
  color: ${colors.text.tertiary};
`;

export const PoliticalIndicators = styled.div``;

export const PoliticalIndicatorsTitle = styled.h5`
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.secondary};
  margin: 0 0 ${spacing[2]} 0;
`;

export const PoliticalIndicatorsList = styled.ul`
  margin: 0;
  padding-left: ${spacing[4]};
  list-style-type: none;
`;

export const PoliticalIndicatorsItem = styled.li`
  ${typography.styles.body4};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing[1]};
  position: relative;

  &::before {
    content: "•";
    color: ${colors.grayscale[40]};
    position: absolute;
    left: -${spacing[3]};
  }
`;

// 논리적 오류
export const LogicContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`;

export const FallaciesGrid = styled.div`
  display: grid;
  gap: ${spacing[4]};
`;

export const FallacyItem = styled.div<{
  severity: "low" | "medium" | "high";
}>`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.xl};
  padding: ${spacing[4]};
  transition: all ${animations.transition.normal};

  &:hover {
    box-shadow: ${shadows.md};
  }

  ${(props) =>
    props.severity === "high" &&
    css`
      border-color: ${colors.analysis.evidence};
      background: ${colors.background.secondary};
    `}
  ${(props) =>
    props.severity === "medium" &&
    css`
      border-color: ${colors.analysis.logic};
      background: ${colors.background.secondary};
    `}
  ${(props) =>
    props.severity === "low" &&
    css`
      border-color: ${colors.analysis.bias};
      background: ${colors.background.secondary};
    `}
`;

export const FallacyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[3]};
`;

export const FallacyType = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

export const FallacyIcon = styled.span`
  font-size: ${typography.styles.title4.fontSize};
`;

export const FallacyName = styled.span`
  ${typography.styles.title5};
  color: ${colors.text.primary};
`;

export const SeverityBadge = styled.span<{
  severity: "low" | "medium" | "high";
}>`
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.xl};
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.background.tertiary};

  ${(props) =>
    props.severity === "high" &&
    css`
      color: ${colors.analysis.evidence};
    `}
  ${(props) =>
    props.severity === "medium" &&
    css`
      color: ${colors.analysis.logic};
    `}
  ${(props) =>
    props.severity === "low" &&
    css`
      color: ${colors.analysis.bias};
    `}
`;

export const FallacyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`;

export const FallacyDescription = styled.p`
  ${typography.styles.body3};
  color: ${colors.text.secondary};
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
  padding: ${spacing[2]} ${spacing[3]};
  background: ${colors.background.tertiary};
  border-left: 3px solid ${colors.border.tertiary};
  border-radius: ${borderRadius.base};
  ${typography.styles.body4};
  color: ${colors.text.secondary};
  font-style: italic;
`;

export const FallacyExplanationText = styled.p`
  margin: 0;
  ${typography.styles.body4};
  color: ${colors.text.secondary};
`;

export const FallacyExamplesList = styled.ul`
  margin: 0;
  padding-left: ${spacing[4]};
  list-style-type: none;
`;

export const FallacyExamplesItem = styled.li`
  ${typography.styles.body4};
  color: ${colors.grayscale[60]};
  margin-bottom: ${spacing[1]};
  position: relative;

  &::before {
    content: "•";
    color: ${colors.grayscale[40]};
    position: absolute;
    left: -${spacing[3]};
  }
`;

// 광고성 분석
export const AdvertisementContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[5]};
`;

export const AdOverview = styled.div`
  background: ${colors.background.secondary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.xl};
  padding: ${spacing[4]};
`;

export const AdStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[4]};
`;

export const AdBadge = styled.span<{ isAdvertorial?: boolean }>`
  padding: ${spacing[2]} ${spacing[3]};
  border-radius: ${borderRadius.full};
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  border: 1px solid;

  ${(props) =>
    props.isAdvertorial
      ? css`
          background: ${colors.background.secondary};
          color: ${colors.analysis.advertisement};
          border-color: ${colors.analysis.advertisement};
        `
      : css`
          background: ${colors.background.secondary};
          color: ${colors.trust.high};
          border-color: ${colors.trust.high};
        `}
`;

export const AdConfidence = styled.span`
  ${typography.styles.caption4};
  color: ${colors.text.tertiary};
`;

export const AdScores = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

export const AdScoreItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AdScoreLabel = styled.span`
  ${typography.styles.body4};
  color: ${colors.text.secondary};
`;

export const AdScoreValue = styled.span`
  ${typography.styles.body4};
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.semibold};
`;

export const AdIndicators = styled.div``;

export const AdIndicatorsTitle = styled.h4`
  ${typography.styles.title5};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing[4]} 0;
`;

// 교차 검증
export const CrossRefContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[5]};
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
  padding-left: ${spacing[4]};
  list-style-type: none;
`;

export const ClaimItem = styled.li`
  ${typography.styles.body3};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing[2]};
  position: relative;
  padding-left: ${spacing[1]};

  &::before {
    content: "🎯";
    position: absolute;
    left: -${spacing[4]};
  }
`;

export const KeywordsBox = styled.div`
  background: ${colors.background.tertiary};
  border: 1px solid ${colors.border.secondary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[3]};
  ${typography.styles.body3};
  color: ${colors.text.secondary};
  font-weight: ${typography.fontWeight.semibold};
`;

export const SourcesGrid = styled.div`
  display: grid;
  gap: ${spacing[3]};
`;

export const FactCheckItem = styled.div<{
  verdict: "true" | "false" | "mixed" | "unverified";
}>`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[3]};
  transition: all ${animations.transition.normal};

  &:hover {
    box-shadow: ${shadows.md};
  }

  ${(props) =>
    props.verdict === "true" &&
    css`
      border-color: ${colors.trust.high};
      background: ${colors.background.secondary};
    `}
  ${(props) =>
    props.verdict === "false" &&
    css`
      border-color: ${colors.trust.veryLow};
      background: ${colors.background.secondary};
    `}
  ${(props) =>
    props.verdict === "mixed" &&
    css`
      border-color: ${colors.trust.medium};
      background: ${colors.background.secondary};
    `}
`;

export const SourceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[2]};
`;

export const SourceOrg = styled.span`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

export const VerdictBadge = styled.span<{
  verdict: "true" | "false" | "mixed" | "unverified";
}>`
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.xl};
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.background.tertiary};

  ${(props) =>
    props.verdict === "true" &&
    css`
      color: ${colors.trust.high};
    `}
  ${(props) =>
    props.verdict === "false" &&
    css`
      color: ${colors.trust.veryLow};
    `}
  ${(props) =>
    props.verdict === "mixed" &&
    css`
      color: ${colors.trust.medium};
    `}
  ${(props) =>
    props.verdict === "unverified" &&
    css`
      color: ${colors.grayscale[60]};
    `}
`;

export const SourceSummary = styled.p`
  ${typography.styles.body4};
  color: ${colors.text.secondary};
  margin: 0 0 ${spacing[2]} 0;
`;

export const SourceLink = styled.a`
  ${typography.styles.caption4};
  color: ${colors.primary.main};
  text-decoration: none;
  font-weight: ${typography.fontWeight.semibold};

  &:hover {
    text-decoration: underline;
  }
`;

export const ConsensusBadge = styled.div<{
  consensus: "agree" | "disagree" | "mixed" | "insufficient";
}>`
  padding: ${spacing[3]} ${spacing[4]};
  border-radius: ${borderRadius.xl};
  ${typography.styles.title5};
  text-align: center;
  border: 2px solid;
  background: ${colors.background.secondary};

  ${(props) =>
    props.consensus === "agree" &&
    css`
      color: ${colors.trust.high};
      border-color: ${colors.trust.high};
    `}
  ${(props) =>
    props.consensus === "disagree" &&
    css`
      color: ${colors.trust.veryLow};
      border-color: ${colors.trust.veryLow};
    `}
  ${(props) =>
    props.consensus === "mixed" &&
    css`
      color: ${colors.trust.medium};
      border-color: ${colors.trust.medium};
    `}
  ${(props) =>
    props.consensus === "insufficient" &&
    css`
      color: ${colors.grayscale[60]};
      border-color: ${colors.grayscale[60]};
    `}
`;

// 분석 팁
export const AnalysisTips = styled.div`
  margin-top: ${spacing[6]};
  padding: ${spacing[5]};
  background: ${colors.background.secondary};
  border: 1px solid ${colors.trust.medium};
  border-radius: ${borderRadius.xl};
`;

export const AnalysisTipsTitle = styled.h4`
  ${typography.styles.title4};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing[4]} 0;
  text-align: center;
`;

export const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing[3]};
`;

export const TipItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing[2]};
  padding: ${spacing[2]};
  background: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
`;

export const TipIcon = styled.span`
  font-size: ${typography.styles.title4.fontSize};
  flex-shrink: 0;
  margin-top: 2px;
`;

export const TipText = styled.p`
  margin: 0;
  ${typography.styles.body4};
  color: ${colors.text.secondary};
`;

// ClickableText 스타일
export const ClickableTextStyled = styled.span<{
  type: "bias" | "fallacy" | "manipulation" | "advertisement" | "claim";
}>`
  cursor: pointer;
  padding: 2px ${spacing[1]};
  border-radius: ${borderRadius.sm};
  transition: ${animations.transition.fast};

  &:hover {
    background-color: ${colors.background.hover};
  }

  ${(props) =>
    props.type === "bias" &&
    css`
      color: ${colors.analysis.bias};
      border-bottom: 2px solid ${colors.analysis.bias};
      font-weight: ${typography.fontWeight.semibold};
    `}
  ${(props) =>
    props.type === "fallacy" &&
    css`
      color: ${colors.analysis.logic};
      border-bottom: 2px solid ${colors.analysis.logic};
      font-weight: ${typography.fontWeight.semibold};
    `}
  ${(props) =>
    props.type === "manipulation" &&
    css`
      color: ${colors.palette.purple};
      border-bottom: 2px solid ${colors.palette.purple};
      font-weight: ${typography.fontWeight.semibold};
    `}
  ${(props) =>
    props.type === "advertisement" &&
    css`
      color: ${colors.analysis.advertisement};
      border-bottom: 2px solid ${colors.analysis.advertisement};
      font-weight: ${typography.fontWeight.semibold};
    `}
  ${(props) =>
    props.type === "claim" &&
    css`
      color: ${colors.analysis.source};
      border-bottom: 2px solid ${colors.analysis.source};
      font-weight: ${typography.fontWeight.semibold};
    `}
  
  /* .word-badge 스타일을 .className으로 받을 수 있도록 지원 */
  &.word-badge {
    padding: ${spacing[1]} ${spacing[2]};
    border-radius: ${borderRadius.md};
    ${typography.styles.caption4};
    font-weight: ${typography.fontWeight.bold};
    border-bottom: none;
    background: ${colors.background.tertiary};

    &.low {
      color: ${colors.analysis.bias};
    }
    &.medium {
      color: ${colors.analysis.logic};
    }
    &.high {
      color: ${colors.analysis.evidence};
    }
  }
`;

// Global styles (외부 페이지 하이라이트 및 툴팁용)
// 새 디자인 시스템 색상에 맞춰 RGBA 값 및 토큰으로 변경
export const globalStyles = css`
  /* 하이라이트 스타일 - 외부 페이지용 */
  .criti-ai-highlight {
    position: relative !important;
    cursor: pointer !important;
    padding: 1px 3px !important;
    border-radius: ${borderRadius.sm} !important;
    transition: all ${animations.transition.normal} !important;
    z-index: 999990 !important;
  }

  .criti-ai-highlight:hover {
    transform: scale(1.02) !important;
    box-shadow: ${shadows.md} !important;
  }

  /* Bias: Yellow */
  .criti-ai-highlight-bias {
    background-color: rgba(250, 176, 7, 0.3) !important;
    border-bottom: 2px solid ${colors.analysis.bias} !important;
    color: ${typography.fontWeight.bold} !important;
  }

  /* Fallacy (Logic): Orange */
  .criti-ai-highlight-fallacy {
    background-color: rgba(255, 119, 0, 0.3) !important;
    border-bottom: 2px solid ${colors.analysis.logic} !important;
    font-weight: ${typography.fontWeight.bold} !important;
  }

  /* Manipulation: Purple */
  .criti-ai-highlight-manipulation {
    background-color: rgba(80, 92, 255, 0.3) !important;
    border-bottom: 2px solid ${colors.palette.purple} !important;
    font-weight: ${typography.fontWeight.bold} !important;
  }

  /* Advertisement: Mint */
  .criti-ai-highlight-advertisement {
    background-color: rgba(0, 178, 154, 0.3) !important;
    border-bottom: 2px solid ${colors.analysis.advertisement} !important;
    font-weight: ${typography.fontWeight.bold} !important;
  }

  /* 포커스 효과 - 클릭시 임시 강조 (Primary color 기준) */
  .criti-ai-highlight-focused {
    animation: ${highlightPulse} 2s ease-in-out !important;
    transform: scale(1.05) !important;
    z-index: 999999 !important;
    position: relative !important;
  }

  /* 툴팁 스타일 (Grayscale 기준) */
  .criti-ai-tooltip {
    position: fixed !important;
    background: linear-gradient(
      135deg,
      ${colors.grayscale[90]},
      ${colors.grayscale[80]}
    ) !important;
    color: ${colors.text.inverse} !important;
    padding: ${spacing[3]} ${spacing[4]} !important;
    border-radius: ${borderRadius.xl} !important;
    ${typography.styles.body3};
    font-weight: ${typography.fontWeight.semibold} !important;
    max-width: 320px !important;
    z-index: 1000000 !important;
    box-shadow: ${shadows.xl} !important;
    border: 1px solid ${colors.grayscale[70]} !important;
    backdrop-filter: blur(20px) !important;
    animation: ${tooltipFadeIn} ${animations.transition.normal} !important;
  }
`;
