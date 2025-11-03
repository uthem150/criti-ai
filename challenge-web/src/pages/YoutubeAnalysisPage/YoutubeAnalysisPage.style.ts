import styled from "@emotion/styled";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
} from "../../styles/design-system";

// 전체 컨테이너
export const Container = styled.div`
  min-height: 100vh;
  background: ${colors.background.primary};
  padding: ${spacing[8]};

  @media (max-width: 768px) {
    padding: ${spacing[4]};
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

// 헤더
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[6]} 0;
  margin-bottom: ${spacing[8]};
  border-bottom: 1px solid ${colors.border.primary};
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

export const LogoIcon = styled.div`
  ${typography.styles.title1};
`;

export const LogoText = styled.h1`
  ${typography.styles.title2};
  color: ${colors.text.primary};
  margin: 0;
`;

export const NavButton = styled.button`
  padding: ${spacing[2]} ${spacing[5]};
  background: ${colors.primary};
  color: ${colors.text.inverse};
  border: none;
  border-radius: ${borderRadius.lg};
  ${typography.styles.title5};
  cursor: pointer;
  transition: ${animations.transition.normal};
  box-shadow: ${shadows.sm};

  &:hover {
    opacity: 0.9;
    box-shadow: ${shadows.md};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// 입력 카드
export const InputCard = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.xl};
  padding: ${spacing[12]} ${spacing[8]};
  margin-bottom: ${spacing[8]};
  text-align: center;
  box-shadow: ${shadows.sm};
`;

export const InputTitle = styled.h2`
  ${typography.styles.headline2};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[2]};
`;

export const InputDescription = styled.p`
  ${typography.styles.body2};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing[8]};
`;

export const InputGroup = styled.div`
  display: flex;
  gap: ${spacing[3]};
  max-width: 600px;
  margin: 0 auto;
`;

export const Input = styled.input`
  flex: 1;
  padding: ${spacing[3]} ${spacing[4]};
  ${typography.styles.body2};
  font-family: ${typography.fontFamily.primary};
  border: 1px solid ${colors.border.secondary};
  border-radius: ${borderRadius.md};
  outline: none;
  transition: ${animations.transition.normal};

  &:focus {
    border-color: ${colors.border.focus};
    box-shadow: 0 0 0 3px rgba(107, 138, 255, 0.1);
  }

  &::placeholder {
    color: ${colors.grayscale[40]};
  }

  &:disabled {
    background: ${colors.background.tertiary};
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled.button<{ disabled?: boolean }>`
  padding: ${spacing[3]} ${spacing[6]};
  background: ${colors.primary};
  color: ${colors.text.inverse};
  border: none;
  border-radius: ${borderRadius.md};
  ${typography.styles.title5};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  transition: ${animations.transition.normal};
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  white-space: nowrap;
  box-shadow: ${shadows.sm};

  &:hover:not(:disabled) {
    opacity: 0.9;
    box-shadow: ${shadows.md};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const ErrorMessage = styled.div`
  padding: ${spacing[4]};
  background: ${colors.status.error}15;
  border: 1px solid ${colors.status.error};
  border-radius: ${borderRadius.md};
  color: ${colors.status.error};
  ${typography.styles.body3};
  margin-top: ${spacing[4]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

// 로딩
export const LoadingCard = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.xl};
  padding: ${spacing[16]} ${spacing[8]};
  text-align: center;
  box-shadow: ${shadows.sm};
`;

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${colors.border.primary};
  border-top-color: ${colors.primary};
  border-radius: ${borderRadius.full};
  animation: spin 0.8s linear infinite;
  margin: 0 auto ${spacing[6]};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  ${typography.styles.body2};
  color: ${colors.text.secondary};
  margin: 0;
`;

// 결과 카드
export const ResultCard = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.xl};
  padding: ${spacing[8]};
  box-shadow: ${shadows.sm};
`;

export const ResultLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing[8]};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 왼쪽 섹션
export const LeftSection = styled.div``;

export const ResultTitle = styled.h2`
  ${typography.styles.title2};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[6]};
`;

// export const VideoPreview = styled.div`
//   display: flex;
//   gap: ${spacing[6]};
//   margin-bottom: ${spacing[6]};
//   padding-bottom: ${spacing[6]};
//   border-bottom: 1px solid ${colors.border.primary};
// `;

// 16:9 비율을 가진 플레이어 컨테이너
export const PlayerWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  border-radius: ${borderRadius.lg};
  background: #000;
  width: 100%;
  flex-shrink: 0;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export const VideoInfo = styled.div`
  margin-top: ${spacing[4]}; /* 플레이어와 간격 */
`;

export const VideoTitle = styled.h3`
  ${typography.styles.title4};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing[2]} 0;
  line-height: ${typography.styles.title4.lineHeight};
`;

// 오른쪽 섹션
export const RightSection = styled.div``;

export const ScoreDisplay = styled.div`
  text-align: center;
  margin-bottom: ${spacing[8]};
`;

export const ScoreValue = styled.div<{ score: number }>`
  font-size: 4rem;
  font-weight: ${typography.fontWeight.bold};
  font-family: ${typography.fontFamily.primary};
  color: ${(props) => {
    if (props.score >= 70) return colors.status.success;
    if (props.score >= 50) return colors.status.warning;
    return colors.status.error;
  }};
  line-height: 1;
  margin-bottom: ${spacing[2]};
`;

export const ScoreLabel = styled.div`
  ${typography.styles.body3};
  color: ${colors.text.secondary};
`;

export const ScoreSummary = styled.p`
  ${typography.styles.body2};
  color: ${colors.text.secondary};
  line-height: 1.6;
  margin: ${spacing[4]} 0 ${spacing[8]} 0;
  text-align: center;
`;

// 막대 그래프
export const ChartContainer = styled.div`
  margin-top: ${spacing[8]};
`;

export const ChartBar = styled.div`
  margin-bottom: ${spacing[4]};
`;

export const ChartLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing[2]};
  ${typography.styles.body3};
`;

export const ChartLabelText = styled.span`
  color: ${colors.text.secondary};
  font-weight: ${typography.fontWeight.semibold};
`;

export const ChartLabelValue = styled.span<{ score: number }>`
  color: ${(props) => {
    if (props.score >= 70) return colors.status.success;
    if (props.score >= 50) return colors.status.warning;
    return colors.status.error;
  }};
  font-weight: ${typography.fontWeight.bold};
`;

export const ChartBarBackground = styled.div`
  width: 100%;
  height: 24px;
  background: ${colors.background.tertiary};
  border-radius: ${borderRadius.base};
  overflow: hidden;
`;

export const ChartBarFill = styled.div<{ width: number; color: string }>`
  width: ${(props) => props.width}%;
  height: 100%;
  background: ${(props) => props.color};
  border-radius: ${borderRadius.base};
  transition: width 0.5s ease;
`;

// 접기/펼치기 섹션
export const CollapsibleSection = styled.div`
  margin-top: ${spacing[8]};
  border-top: 1px solid ${colors.border.primary};
  padding-top: ${spacing[6]};
`;

export const CollapsibleHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
`;

export const CollapsibleTitle = styled.h3`
  ${typography.styles.title4};
  color: ${colors.text.primary};
  margin: 0;
`;

export const CollapsibleIcon = styled.span<{ isOpen: boolean }>`
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: ${animations.transition.normal};
`;

export const CollapsibleContent = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-top: ${(props) => (props.isOpen ? spacing[4] : "0")};
`;

export const SourceInfo = styled.div`
  background: ${colors.background.secondary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[5]};
`;

export const SourceInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
`;

export const ChannelImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: ${borderRadius.full};
  object-fit: cover;
  border: 1px solid ${colors.border.primary};
  flex-shrink: 0;
`;

export const SourceTextInfo = styled.div`
  flex: 1;
`;

export const SourceLink = styled.div`
  color: ${colors.primary};
  ${typography.styles.body3};
  font-weight: ${typography.fontWeight.semibold};
`;

export const SourceDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[2]};
  margin-top: ${spacing[2]};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SourceDetailLabel = styled.span`
  ${typography.styles.body3};
  color: ${colors.text.secondary};
`;

export const SourceDetailValue = styled.span`
  ${typography.styles.title3};
  color: ${colors.text.primary};
`;

export const SourceDescription = styled.p`
  ${typography.styles.body3};
  color: ${colors.text.secondary};
  margin: ${spacing[3]} 0 0 0;
  line-height: 1.5;
`;

// 분석 섹션들
export const FullWidthSection = styled.div`
  margin-top: ${spacing[8]};
  padding-top: ${spacing[8]};
  border-top: 1px solid ${colors.border.primary};
`;

export const SectionTitle = styled.h3`
  ${typography.styles.title3};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[4]};
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

export const AnalysisContent = styled.div`
  background: ${colors.background.secondary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[5]};
`;

export const AnalysisItem = styled.div`
  padding: ${spacing[4]} 0;
  border-bottom: 1px solid ${colors.border.primary};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${spacing[2]};
`;

export const ItemTitle = styled.div`
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  ${typography.styles.body2};
`;

export const ItemTimestamp = styled.span`
  ${typography.styles.body4};
  color: ${colors.primary};
  background: ${colors.primary}15;
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.base};
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  user-select: none;
  transition: ${animations.transition.normal};

  &:hover {
    opacity: 0.8;
  }
`;

export const ItemDescription = styled.p`
  ${typography.styles.body3};
  color: ${colors.text.secondary};
  line-height: 1.5;
  margin: ${spacing[2]} 0 0 0;
`;

export const Badge = styled.span<{
  severity?: "low" | "medium" | "high" | "critical";
}>`
  display: inline-block;
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.base};
  ${typography.styles.body4};
  font-weight: ${typography.fontWeight.bold};
  text-transform: uppercase;
  background: ${(props) => {
    switch (props.severity) {
      case "critical":
        return colors.status.error;
      case "high":
        return `${colors.status.error}20`;
      case "medium":
        return `${colors.status.warning}20`;
      case "low":
        return `${colors.status.info}20`;
      default:
        return colors.background.tertiary;
    }
  }};
  color: ${(props) => {
    switch (props.severity) {
      case "critical":
        return colors.text.inverse;
      case "high":
        return colors.status.error;
      case "medium":
        return colors.status.warning;
      case "low":
        return colors.status.info;
      default:
        return colors.text.secondary;
    }
  }};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing[8]};
  color: ${colors.text.disabled};
  ${typography.styles.body3};
`;
