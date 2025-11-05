import styled from "@emotion/styled";
import { colors, typography } from "../../styles/design-system";

// 전체 컨테이너
export const Container = styled.div`
  min-height: 100vh;
  background: ${colors.light.grayscale[5]};
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// 뒤로가기 버튼
export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: none;
  border: none;
  color: ${colors.light.grayscale[70]};
  ${typography.styles.body2};
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.light.grayscale[100]};
  }

  @media (min-width: 1025px) {
    display: none;
  }
`;

// 입력 카드
export const InputCard = styled.div`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.75rem;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const InputTitle = styled.h2`
  ${typography.styles.headline2};
  color: ${colors.light.grayscale[90]};
  margin-bottom: 0.5rem;
`;

export const InputDescription = styled.p`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[70]};
  margin-bottom: 2rem;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  max-width: 700px;
  margin: 0 auto;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.875rem 1.25rem;
  ${typography.styles.body2};
  font-family: ${typography.fontFamily.primary};
  border: 1px solid ${colors.light.grayscale[30]};
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${colors.light.brand.primary100};
    box-shadow: 0 0 0 3px ${colors.light.brand.primary10};
  }

  &::placeholder {
    color: ${colors.light.grayscale[40]};
  }

  &:disabled {
    background: ${colors.light.grayscale[10]};
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled.button<{ disabled?: boolean }>`
  padding: 0.875rem 1.5rem;
  background: ${colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 0.5rem;
  ${typography.styles.title5};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  min-width: 120px;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(22, 138, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const ErrorMessage = styled.div`
  padding: 1rem 1.25rem;
  background: ${colors.light.state.errorLight};
  border: 1px solid ${colors.light.state.error};
  border-radius: 0.5rem;
  color: ${colors.light.state.error};
  ${typography.styles.body3};
  margin-top: 1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// 로딩
export const LoadingCard = styled.div`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.75rem;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${colors.light.grayscale[20]};
  border-top-color: ${colors.light.brand.primary100};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[70]};
  margin: 0;
`;

// 결과 레이아웃
export const ResultLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 왼쪽 섹션 (Sticky)
export const LeftSection = styled.div`
  position: sticky;
  top: 2rem;
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    position: relative;
    top: 0;
  }
`;

// 비디오 플레이어
export const PlayerWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 0.5rem;
  background: #000;
  margin-bottom: 1.25rem;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export const VideoInfo = styled.div`
  margin-bottom: 1.25rem;
`;

export const VideoTitle = styled.h3`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

export const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${typography.styles.body4};
  color: ${colors.light.grayscale[60]};
`;

// 채널 정보
export const ChannelInfo = styled.div`
  padding-top: 1.25rem;
  border-top: 1px solid ${colors.light.grayscale[20]};
`;

export const ChannelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ChannelImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${colors.light.grayscale[20]};
`;

export const ChannelTextInfo = styled.div`
  flex: 1;
`;

export const ChannelName = styled.div`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[90]};
  font-weight: ${typography.fontWeight.semibold};
  margin-bottom: 0.25rem;
`;

export const ChannelSubscribers = styled.div`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[60]};
`;

// 오른쪽 섹션 (Scrollable)
export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// 총점 카드
export const ScoreCard = styled.div`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const TotalScore = styled.div<{ score: number }>`
  font-size: 4rem;
  font-weight: ${typography.fontWeight.bold};
  font-family: ${typography.fontFamily.primary};
  color: ${(props) => {
    if (props.score >= 70) return colors.light.state.success;
    if (props.score >= 50) return colors.light.etc.orange;
    return colors.light.state.error;
  }};
  line-height: 1;
  margin-bottom: 0.5rem;
`;

export const ScoreDescription = styled.p`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[70]};
  margin: 1rem 0 0 0;
  line-height: 1.6;
`;

// 세로 막대 그래프 카드
export const ChartCard = styled.div`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const ChartTitle = styled.h3`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 1.5rem 0;
`;

export const ChartContainer = styled.div`
  display: flex;
  justify-content: space-around;
  /* align-items: flex-end; */
  gap: 1rem;
  height: 200px;
  padding: 0 1rem;
`;

export const ChartColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex: 1;
  max-width: 80px;
`;

export const ChartBarVertical = styled.div<{ height: number; color: string }>`
  width: 100%;
  height: ${(props) => props.height}%;
  background: ${(props) => props.color};
  border-radius: 0.375rem 0.375rem 0 0;
  position: relative;
  transition: height 0.5s ease;
  min-height: 20px;
`;

export const ChartValue = styled.div<{ score: number }>`
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  ${typography.styles.body4};
  font-weight: ${typography.fontWeight.bold};
  color: ${(props) => {
    if (props.score >= 70) return colors.light.state.success;
    if (props.score >= 50) return colors.light.etc.orange;
    return colors.light.state.error;
  }};
  white-space: nowrap;
`;

export const ChartLabel = styled.div`
  ${typography.styles.body4};
  color: ${colors.light.grayscale[70]};
  text-align: center;
  font-weight: ${typography.fontWeight.semibold};
`;

// Collapsible 섹션
export const CollapsibleCard = styled.div`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const CollapsibleHeader = styled.button<{ isOpen: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: ${(props) =>
    props.isOpen ? colors.light.grayscale[5] : colors.light.grayscale[0]};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.light.grayscale[5]};
  }
`;

export const CollapsibleTitle = styled.h3`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[90]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CollapsibleIcon = styled.span<{ isOpen: boolean }>`
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease;
  font-size: 0.875rem;
  color: ${colors.light.grayscale[60]};
`;

export const CollapsibleContent = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? "5000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

export const CollapsibleBody = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
`;

// 채널 점수 섹션 (Collapsible 내부)
export const ChannelScoreContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ScoreRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${colors.light.grayscale[5]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.5rem;
`;

export const ScoreLabel = styled.span`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
`;

export const ScoreValue = styled.span<{ score?: number }>`
  ${typography.styles.title5};
  color: ${(props) => {
    if (!props.score) return colors.light.grayscale[90];
    if (props.score >= 70) return colors.light.state.success;
    if (props.score >= 50) return colors.light.etc.orange;
    return colors.light.state.error;
  }};
  font-weight: ${typography.fontWeight.bold};
`;

// 분석 내용
export const AnalysisContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AnalysisItem = styled.div`
  padding: 1rem;
  background: ${colors.light.grayscale[5]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.5rem;
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

export const ItemTitle = styled.div`
  ${typography.styles.body2};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[90]};
  flex: 1;
`;

export const ItemTimestamp = styled.button`
  ${typography.styles.body4};
  color: ${colors.light.brand.primary100};
  background: ${colors.light.etc.blueLight};
  padding: 0.25rem 0.625rem;
  border-radius: 0.25rem;
  border: none;
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ItemDescription = styled.p`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  line-height: 1.6;
  margin: 0.5rem 0 0 0;
`;

export const Badge = styled.span<{
  severity?: "low" | "medium" | "high" | "critical";
}>`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 0.25rem;
  ${typography.styles.body4};
  font-weight: ${typography.fontWeight.bold};
  text-transform: uppercase;
  white-space: nowrap;
  background: ${(props) => {
    switch (props.severity) {
      case "critical":
        return colors.light.state.error;
      case "high":
        return colors.light.etc.redLight;
      case "medium":
        return colors.light.etc.orangeLight;
      case "low":
        return colors.light.etc.blueLight;
      default:
        return colors.light.grayscale[10];
    }
  }};
  color: ${(props) => {
    switch (props.severity) {
      case "critical":
        return colors.light.grayscale[0];
      case "high":
        return colors.light.state.error;
      case "medium":
        return colors.light.etc.orange;
      case "low":
        return colors.light.brand.primary100;
      default:
        return colors.light.grayscale[70];
    }
  }};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${colors.light.grayscale[40]};
  ${typography.styles.body3};
`;
