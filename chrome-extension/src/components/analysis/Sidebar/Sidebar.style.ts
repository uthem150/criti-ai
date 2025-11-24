import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { colors, typography } from "@/styles/design";
import {
  getAdBackgroundColor,
  getAdColor,
  getAdScoreColor,
  getConsensusBackgroundColor,
  getConsensusColor,
  getIntensityColor,
  getPoliticalColor,
  getScoreColor,
  getTextTypeColor,
  getTrustColor,
  getVerdictColor,
  type ConsensusType,
  type TextType,
  type VerdictType,
} from "@/utils/colorUtils";

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
    max-height: 62.5rem;
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

  transition: all 250ms ease-in-out;
  backdrop-filter: blur(0.625rem);
  box-shadow:
    0 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 0.1),
    0 0.125rem 0.25rem -0.125rem rgb(0 0 0 / 0.1);

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
  padding: 3.75rem 1.5rem;
  text-align: center;
  background: ${colors.light.grayscale[0]};
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ErrorIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  line-height: 1;
`;

export const ErrorTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: ${typography.fontWeight.bold};
  margin: 0 0 0.75rem 0;
  color: ${colors.light.state.error};
  letter-spacing: -0.03125rem;
`;

export const ErrorText = styled.p`
  ${typography.styles.body2};
  margin: 0 0 2rem 0;
  color: ${colors.light.grayscale[70]};
  line-height: 1.6;
  max-width: 25rem;
`;

export const ErrorSolutions = styled.div`
  background: ${colors.light.grayscale[5]};
  border: 0.0625rem solid ${colors.light.grayscale[20]};
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 0 0 2rem 0;
  text-align: left;
  max-width: 26.25rem;
  width: 100%;
`;

export const ErrorSolutionsTitle = styled.h4`
  ${typography.styles.title5};
  font-weight: ${typography.fontWeight.semibold};
  margin: 0 0 1rem 0;
  color: ${colors.light.grayscale[90]};
`;

export const ErrorSolutionsList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  color: ${colors.light.grayscale[70]};
  list-style-type: disc;
`;

export const ErrorSolutionsItem = styled.li`
  ${typography.styles.body4};
  margin-bottom: 0.5rem;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ErrorActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  width: 100%;
  max-width: 26.25rem;
`;

export const ErrorButton = styled.button<{ primary?: boolean }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 250ms ease-in-out;
  color: ${colors.light.grayscale[0]};
  flex: 1;

  ${(props) =>
    props.primary
      ? css`
          background: ${colors.light.brand.primary100};
          box-shadow: 0 0.125rem 0.5rem rgba(59, 130, 246, 0.2);

          &:hover {
            box-shadow: 0 0.25rem 1rem rgba(59, 130, 246, 0.3);
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
    transform: translateY(-0.0625rem);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 환영 섹션
export const WelcomeSection = styled.div`
  min-height: 90vh;
  padding: 3.75rem 1.5rem 2.5rem;
  text-align: center;
  background: ${colors.light.grayscale[0]};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const WelcomeTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: ${typography.fontWeight.bold};
  margin: 0 0 1rem 0;
  color: ${colors.light.grayscale[100]};
  line-height: 1.3;
  letter-spacing: -0.03125rem;
`;

export const WelcomeText = styled.p`
  ${typography.styles.body2};
  margin: 0 0 2rem 0;
  color: ${colors.light.grayscale[60]};
  max-width: 23.75rem;
  line-height: 1.6;
`;

export const AnalyzeButton = styled.button`
  background: ${colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};
  border: none;
  padding: 1.125rem 3rem;
  border-radius: 1rem;
  font-size: 1.125rem;
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 250ms ease-in-out;
  box-shadow: 0 0.125rem 0.75rem rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: fit-content;

  &:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.25rem 1.25rem rgba(59, 130, 246, 0.3);
    opacity: 0.95;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonIcon = styled.span`
  font-size: 1.375rem;
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
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background: ${colors.light.grayscale[5]};
  border: 0.0625rem solid ${colors.light.grayscale[20]};
  border-radius: 1rem;
  transition: all 250ms ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${colors.light.grayscale[10]};
    border-color: ${colors.light.brand.primary100};
    transform: translateY(-0.125rem);
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.08);
  }
`;

export const FeatureIcon = styled.span`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

// 로딩 섹션
export const LoadingSection = styled.div`
  padding: 3.75rem 1.5rem;
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
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const Spinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 0.25rem solid ${colors.light.grayscale[10]};
  border-top: 0.25rem solid ${colors.light.brand.primary100};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

export const LoadingDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

export const LoadingDot = styled.span`
  width: 0.625rem;
  height: 0.625rem;
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
  font-size: 1.75rem;
  font-weight: ${typography.fontWeight.bold};
  margin: 0 0 0.75rem 0;
  color: ${colors.light.grayscale[100]};
  letter-spacing: -0.03125rem;
`;

export const LoadingText = styled.p`
  ${typography.styles.body2};
  margin: 0 0 2rem 0;
  color: ${colors.light.grayscale[60]};
  line-height: 1.6;
  max-width: 25rem;
`;

export const AnalysisSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  width: 100%;
  max-width: 22.5rem;
`;

export const Step = styled.div<{ active?: boolean }>`
  padding: 1rem 1.5rem;
  background: ${colors.light.grayscale[5]};
  border: 0.0625rem solid ${colors.light.grayscale[20]};
  border-radius: 0.75rem;
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
      box-shadow: 0 0.125rem 0.5rem rgba(59, 130, 246, 0.2);
    `}
`;

// 결과 섹션
export const ResultsSection = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 90vh;
`;

// 접을 수 있는 섹션 (ExpandableSection 컴포넌트 내부에서 사용)
export const ExpandableSectionContainer = styled.div`
  background: ${colors.light.grayscale[5]};
  overflow: hidden;
  transition: all 250ms ease-in-out;
`;

export const SectionHeader = styled.button`
  width: 100%;
  background: ${colors.light.grayscale[5]};
  border: none;
  cursor: pointer;
  transition: all 250ms ease-in-out;

  display: flex;
  justify-content: space-between;

  height: 3.5rem;
  padding: 0.75rem 2rem;
  align-items: center;
  gap: 1rem;
  align-self: stretch;

  &:hover {
    background: ${colors.light.grayscale[10]};
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  display: flex;
  padding: 2rem;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  align-self: stretch;
  background-color: ${colors.light.grayscale[0]};
  animation: ${slideDown} 250ms ease-in-out;
`;

// 공용 타이틀 (h4, h5)
export const SectionContentTitleH4 = styled.h4`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 0.75rem 0;
`;

export const SectionContentTitleH5 = styled.h5`
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 0.5rem 0;
`;

// 종합 분석 결과
export const OverviewContent = styled.div`
  display: flex;
  padding: 2rem 2rem 1.25rem 2rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
`;

export const OverallScoreDisplay = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ScoreNumber = styled.div<{ score: number }>`
  ${typography.styles.headline2};
  color: ${({ score }) => getScoreColor(score)};
`;

export const ScoreDescriptionText = styled.p`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[80]};
  margin: 0;
`;

export const DetailedScores = styled.div`
  display: flex;
  padding: 1.5rem 2rem 1.25rem 2rem;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  align-self: stretch;
`;

// 그래프 영역 (높이 12rem 고정, 막대들이 들어가는 곳)
export const ChartGraphBox = styled.div`
  display: flex;
  height: 13rem;
  padding: 0 0.75rem;
  align-items: flex-end;
  gap: 1.25rem;
  align-self: stretch;

  border-bottom: 0.0625rem solid ${colors.light.grayscale[20]};
`;

// 그래프 내부의 개별 막대 컬럼 (Value + Bar)
export const ChartGraphColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex: 1; /* 너비 균등하게 분배 */
  height: 100%;
  position: relative;
`;

export const DetailedScoresTitle = styled.h4`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 1rem 0;
`;

// 세로 막대 그래프 컨테이너
export const ChartContainer = styled.div`
  display: flex;
  height: 15rem;
  padding: 0 0.75rem;
  align-items: flex-end;
  gap: 1.25rem;
  align-self: stretch;
`;

export const ChartColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex: 1;
`;

export const ChartBarVertical = styled.div<{ height: number; color: string }>`
  width: 100%;
  /* 13rem 높이 기준 100% 비율로 계산 */
  height: ${(props) => props.height}%;
  background: ${(props) => props.color || getScoreColor(props.height)};
  /* 상단만 둥글게 */
  border-radius: 0.25rem 0.25rem 0 0;
  position: relative;
  transition: height 0.5s ease;
  min-height: 0.125rem; /* 0점이어도 라인은 보이게 */
`;

export const ChartValue = styled.div<{ score: number }>`
  /* 절대 위치로 변경하여 막대 영역을 침범하지 않게 함 */
  position: absolute;

  /* 막대 높이(score%)만큼 바닥에서 띄움 */
  bottom: ${({ score }) => score}%;

  /* 가로 중앙 정렬을 위해 너비와 정렬 설정 */
  width: 100%;
  text-align: center;

  /* 막대와 텍스트 사이의 간격 */
  margin-bottom: 0.5rem;

  ${typography.styles.title5}
  font-weight: ${typography.fontWeight.bold};
  color: ${({ score }) => getScoreColor(score)};

  /* (선택 사항) 애니메이션이 있다면 텍스트도 같이 움직이도록 트랜지션 추가 */
  transition: bottom 0.5s ease;
`;

// 하단 라벨 영역 컨테이너
export const ChartLabelsBox = styled.div`
  display: flex;
  padding: 0.62rem 0.75rem; /* 그래프와 간격(padding-top) */
  align-items: center;
  gap: 1.25rem;
  align-self: stretch;
`;

// 라벨 텍스트
export const ChartLabel = styled.div`
  flex: 1; /* 그래프 컬럼과 동일한 너비 비율 유지 */
  text-align: center;
  ${typography.styles.caption3};
  color: ${colors.light.grayscale[70]};
`;

// 출처 신뢰도
export const SourceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TrustLevel = styled.div`
  display: flex;
  justify-content: center;
`;

export const TrustBadge = styled.span<{
  level: "trusted" | "neutral" | "caution" | "unreliable";
}>`
  padding: 0.5rem 1rem;
  border-radius: 624.9375rem;
  ${typography.styles.title5};

  /* 모든 케이스 공통 스타일 */
  background: ${colors.light.grayscale[5]};
  border: 0.0625rem solid;

  color: ${({ level }) => getTrustColor(level)};
  border-color: ${({ level }) => getTrustColor(level)};
`;

export const SourceDetails = styled.div``;

export const SourceDetailsTitle = styled.h4`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 0.5rem 0;
`;

export const SourceDescriptionText = styled.p`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 1rem 0;
`;

export const ReputationFactors = styled.div``;

export const ReputationFactorsTitle = styled.h5`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 0.5rem 0;
`;

export const FactorTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

export const FactorTag = styled.span`
  background: ${colors.light.grayscale[10]};
  color: ${colors.light.grayscale[60]};
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  ${typography.styles.caption4};
`;

export const HistoricalData = styled.div`
  background: ${colors.light.grayscale[5]};
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 0.0625rem solid ${colors.light.grayscale[20]};
  margin-top: 1rem;
`;

export const HistoricalItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;

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
  gap: 1.25rem;
`;

export const BiasSection = styled.div`
  border: 0.0625rem solid ${colors.light.grayscale[20]};
  border-radius: 0.5rem;
  padding: 1rem;
  background: ${colors.light.grayscale[5]};
`;

export const BiasSectionTitle = styled.h4`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 0.75rem 0;
`;

export const BiasSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const IntensityBadge = styled.span<{
  intensity: "none" | "low" | "medium" | "high";
}>`
  padding: 0.3rem 0.5rem;
  border-radius: 0.5rem;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.light.grayscale[0]};
  border: 0.0625rem solid;

  color: ${({ intensity }) => getIntensityColor(intensity)};
  border-color: ${({ intensity }) => getIntensityColor(intensity)};
`;

export const ManipulativeWords = styled.div``;

export const ManipulativeWordsTitle = styled.h5`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 0.75rem 0;
`;

export const WordsGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`;

export const WordItem = styled.div`
  background: ${colors.light.grayscale[0]};
  border: 0.0625rem solid ${colors.light.grayscale[20]};
  border-radius: 0.5rem;
  padding: 0.75rem;
`;

export const WordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
`;

export const WordBadge = styled.span<{
  impact: "low" | "medium" | "high";
}>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.bold};
  background: ${colors.light.grayscale[10]};

  color: ${({ impact }) => getIntensityColor(impact)};
`;

export const WordCategory = styled.span`
  ${typography.styles.caption4};
  color: ${colors.light.grayscale[60]};
  padding: 0.125rem 0.375rem;
  background: ${colors.light.grayscale[10]};
  border-radius: 0.25rem;

  flex-shrink: 0; /* 절대 줄어들지 않음 */
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
  gap: 0.75rem;
`;

export const ClickbaitItem = styled.div<{
  severity: "low" | "medium" | "high";
}>`
  border: 0.0625rem solid ${colors.light.grayscale[20]};
  border-radius: 0.5rem;
  padding: 0.75rem;
  background: ${colors.light.grayscale[5]};

  border-color: ${({ severity }) => getIntensityColor(severity)};
`;

export const ClickbaitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const ClickbaitType = styled.span`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[90]};
`;

export const SeverityIndicator = styled.span<{
  severity: "low" | "medium" | "high";
}>`
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.light.grayscale[10]};

  color: ${({ severity }) => getIntensityColor(severity)};
`;

export const ClickbaitText = styled.div`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
  margin: 0.25rem 0 0.5rem 0;
  font-style: italic;
  padding: 0.25rem 0.5rem;
  background: ${colors.light.grayscale[10]};
  border-radius: 0.25rem;
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
  border: 0.0625rem solid ${colors.light.grayscale[20]};
  border-radius: 0.5rem;
  padding: 0.75rem;
`;

export const PoliticalDirection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const PoliticalBadge = styled.span<{
  direction: "left" | "right" | "center" | "neutral";
}>`
  padding: 0.25rem 0.75rem;
  border-radius: 624.9375rem;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.light.grayscale[10]};

  color: ${({ direction }) => getPoliticalColor(direction)};
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
  margin: 0 0 0.5rem 0;
`;

export const PoliticalIndicatorsList = styled.ul`
  margin: 0;
  padding-left: 1rem;
  list-style-type: none;
`;

export const PoliticalIndicatorsItem = styled.li`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
  margin-bottom: 0.25rem;
  position: relative;

  &::before {
    content: "•";
    color: ${colors.light.grayscale[40]};
    position: absolute;
    left: -0.75rem;
  }
`;

// 논리적 오류
export const LogicContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FallaciesGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

export const FallacyItem = styled.div<{
  severity: "low" | "medium" | "high";
}>`
  background: ${colors.light.grayscale[0]};
  border: 0.0625rem solid;
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 250ms ease-in-out;

  &:hover {
    box-shadow:
      0 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 0.1),
      0 0.125rem 0.25rem -0.125rem rgb(0 0 0 / 0.1);
  }

  border-color: ${({ severity }) => getIntensityColor(severity)};
  background: ${colors.light.grayscale[5]};
`;

export const FallacyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const FallacyType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FallacyName = styled.span`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[90]};
`;

export const SeverityBadge = styled.span<{
  severity: "low" | "medium" | "high";
}>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.light.grayscale[10]};

  color: ${({ severity }) => getIntensityColor(severity)};
`;

export const FallacyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  padding: 0.5rem 0.75rem;
  background: ${colors.light.grayscale[10]};
  border-left: 0.1875rem solid ${colors.light.grayscale[40]};
  border-radius: 0.25rem;
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
  padding-left: 1rem;
  list-style-type: none;
`;

export const FallacyExamplesItem = styled.li`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[60]};
  margin-bottom: 0.25rem;
  position: relative;

  &::before {
    content: "•";
    color: ${colors.light.grayscale[40]};
    position: absolute;
    left: -0.75rem;
  }
`;

// 광고성 분석
export const AdvertisementContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const AdOverview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2.5rem;
  align-self: stretch;
  gap: 1.5rem;
  padding-bottom: 2rem;
`;

export const AdStatus = styled.div<{ isAdvertorial?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem;
  background: ${colors.light.grayscale[0]};
  border-radius: 0.75rem;

  background-color: ${({ isAdvertorial }) =>
    getAdBackgroundColor(isAdvertorial)};
`;

export const AdBadge = styled.div<{ isAdvertorial?: boolean }>`
  ${typography.styles.title4};
  text-align: center;

  color: ${({ isAdvertorial }) => getAdColor(!!isAdvertorial)};
`;

export const AdConfidence = styled.span`
  ${typography.styles.caption3};
  color: ${colors.light.grayscale[60]};
`;

export const AdScores = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const AdScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const AdScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AdScoreLabel = styled.span`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  font-weight: ${typography.fontWeight.regular};
`;

export const AdScoreValue = styled.span<{ score?: number }>`
  ${typography.styles.title5};
  color: ${({ score }) =>
    score !== undefined
      ? getAdScoreColor(score)
      : colors.light.brand.primary100};
  font-weight: ${typography.fontWeight.bold};
`;

export const AdScoreBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${colors.light.grayscale[20]};
  border-radius: 0.25rem;
  overflow: hidden;
  position: relative;
`;

export const AdScoreBarFill = styled.div<{ score: number }>`
  height: 100%;
  width: ${(props) => props.score}%;
  background: ${({ score }) => getAdScoreColor(score)};
  border-radius: 0.25rem;
  transition: width 0.5s ease;
`;

export const AdIndicators = styled.div``;

export const AdIndicatorsTitle = styled.h4`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 1rem 0;
`;

// 교차 검증
export const CrossRefContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const CrossRefStatus = styled.div<{ consensus: string }>`
  display: flex;
  height: 3.375rem;
  padding: 1rem 0;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  align-self: stretch;
  border-radius: 0.75rem;

  background-color: ${({ consensus }) =>
    getConsensusBackgroundColor(consensus)};
`;

export const CrossRefStatusText = styled.div<{ consensus: string }>`
  ${typography.styles.title4}
  color: ${({ consensus }) => getConsensusColor(consensus)};
  font-weight: ${typography.fontWeight.semibold};
`;

export const KeyClaims = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  align-self: stretch;
  background-color: ${colors.light.grayscale[5]};
  border-radius: 0.75rem;
  overflow: hidden;
`;
export const SearchKeywords = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  align-self: stretch;
  background-color: ${colors.light.grayscale[5]};
  border-radius: 0.75rem;
  overflow: hidden;
`;
export const FactCheckSources = styled.div``;
export const ConsensusDisplay = styled.div``;

export const KeyClaimsTitle = styled.h4`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[100]};
  background: ${colors.light.grayscale[10]};

  display: flex;
  padding: 0.75rem 1.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
`;

export const SearchKeywordsTitle = styled(KeyClaimsTitle)`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[100]};
  background: ${colors.light.grayscale[10]};
  padding: 0.75rem 1.25rem;
  text-align: center;
  margin: 0;
  font-weight: ${typography.fontWeight.bold};
`;
export const FactCheckSourcesTitle = styled(KeyClaimsTitle)`
  border-radius: 0.7rem;
  margin-bottom: 1rem;
`;
export const ConsensusDisplayTitle = styled(SectionContentTitleH4)``;

export const ClaimItem = styled.li`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};

  display: flex;
  align-items: flex-start; /* 텍스트가 여러 줄일 때 위쪽 정렬 */
  gap: 0.5rem; /* 마커와 텍스트 사이 간격 */

  /* 기본 마커 제거 */
  list-style: none;

  /* 커스텀 마커 생성 */
  &::before {
    content: "•";
    color: ${colors.light.grayscale[70]};
    flex-shrink: 0; /* 마커가 찌그러지지 않도록 고정 */
  }
`;

export const ClaimsList = styled.ul`
  display: flex;
  padding: 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  align-self: stretch;
  background: ${colors.light.grayscale[5]};
  list-style: none; /* 기본 스타일 제거 */
`;

export const KeywordsContainer = styled.div`
  background: ${colors.light.grayscale[5]};
  padding: 1rem 1.25rem;
`;

export const KeywordTagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const KeywordTag = styled.span`
  ${typography.styles.caption4};
  color: ${colors.light.transparency.black[80]};

  display: flex;
  height: 1.5rem;
  padding: 0.5625rem 0.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.375rem;
  background: ${colors.light.transparency.black[5]};
`;

export const KeywordsBox = styled.div`
  background: ${colors.light.grayscale[10]};
  border: 0.0625rem solid ${colors.light.grayscale[30]};
  border-radius: 0.5rem;
  padding: 0.75rem;
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  font-weight: ${typography.fontWeight.semibold};
`;

export const SourcesGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`;

export const FactCheckItem = styled.div<{
  verdict: "true" | "false" | "mixed" | "unverified";
}>`
  background: ${colors.light.grayscale[5]};
  border: 0.0625rem solid ${colors.light.grayscale[20]};
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 250ms ease-in-out;

  &:hover {
    box-shadow:
      0 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 0.1),
      0 0.125rem 0.25rem -0.125rem rgb(0 0 0 / 0.1);
  }

  border-color: ${({ verdict }) => getVerdictColor(verdict)};
`;

export const SourceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const SourceOrg = styled.span`
  ${typography.styles.caption3};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[90]};
`;

export const VerdictBadge = styled.span<{
  verdict: VerdictType;
}>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  ${typography.styles.caption4};
  font-weight: ${typography.fontWeight.semibold};
  background: ${colors.light.grayscale[10]};

  color: ${({ verdict }) => getVerdictColor(verdict)};
`;

export const SourceSummary = styled.p`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 0.5rem 0;
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
  consensus: ConsensusType;
}>`
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  ${typography.styles.title5};
  text-align: center;
  border: 0.125rem solid;
  background: ${colors.light.grayscale[5]};

  color: ${({ consensus }) => getConsensusColor(consensus)};
  border-color: ${({ consensus }) => getConsensusColor(consensus)};
`;

// 분석 팁
export const AnalysisTips = styled.div`
  display: flex;
  padding: 2rem;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
`;

export const AnalysisTipsTitle = styled.h4`
  color: ${colors.light.grayscale[100]};
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.02rem;
  padding-bottom: 1rem;
`;

export const TipsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
  padding-bottom: 1.25rem;
`;

export const TipItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TipCheckIcon = styled.span`
  color: ${colors.light.brand.primary100};
  font-size: 1.5rem;
  flex-shrink: 0;
  line-height: 1;
  margin-top: 0.125rem;
`;

export const TipText = styled.p`
  ${typography.styles.caption3};
  color: ${colors.light.grayscale[70]};
`;

// 비판적 사고 훈련 버튼
export const CriticalThinkingButton = styled.button`
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: ${colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 0.75rem;
  ${typography.styles.title5};
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 250ms ease-in-out;
  margin-top: 1rem;

  &:hover {
    background: ${colors.light.brand.primary100};
    opacity: 0.9;
    transform: translateY(-0.0625rem);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ClickableTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%; /* 부모 너비 가득 채우기 */
  gap: 0.5rem; /* 텍스트와 카테고리 사이 간격 */
`;

// ClickableText 스타일
export const ClickableTextStyled = styled.span<{
  type: TextType;
}>`
  cursor: pointer;
  padding: 0.125rem 0.25rem;
  border-radius: 0.125rem;
  transition: 150ms ease-in-out;

  /* 공통 스타일: 모든 타입이 semibold를 사용하므로 여기서 한 번만 선언 */
  font-weight: ${typography.fontWeight.semibold};

  /* 유틸 함수를 사용하여 글자색 동적 적용 */
  color: ${({ type }) => getTextTypeColor(type)};

  text-align: left;

  &:hover {
    background-color: ${colors.light.grayscale[10]};
  }

  &.word-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    ${typography.styles.caption4};
    font-weight: ${typography.fontWeight.bold};
    border-bottom: none;
    background: ${colors.light.grayscale[10]};

    /* badge 안에서도 말줄임표가 적용되도록 상속/유지 */
    overflow: hidden;
    text-overflow: ellipsis;

    &.low {
      color: ${getIntensityColor("low")}; /* 민트 */
    }
    &.medium {
      color: ${getIntensityColor("medium")}; /* 노랑 */
    }
    &.high {
      color: ${getIntensityColor("high")}; /* 빨강 */
    }
  }
`;
