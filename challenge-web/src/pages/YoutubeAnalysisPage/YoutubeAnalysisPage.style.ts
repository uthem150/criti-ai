import styled from "@emotion/styled";
import { colors, typography } from "../../styles/design-system";

// 전체 컨테이너
export const Container = styled.div`
  min-height: 100vh;
  background: ${colors.light.grayscale[5]};
  display: flex;
`;

export const ContentWrapper = styled.div<{ isAnalysis: boolean }>`
  display: flex;
  padding: 12.5rem 1.25rem;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  flex: 1 0 0;
  align-self: stretch;
  justify-content: center;

  padding: ${(props) =>
    props.isAnalysis ? "2.5rem 1.25rem" : "12.5rem 1.25rem"};

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

// 뒤로가기 버튼
export const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  color: ${colors.light.grayscale[70]};
  ${typography.styles.body2};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.light.grayscale[100]};
  }

  @media (max-width: 1025px) {
    display: none;
  }
`;

// 입력 카드
export const InputCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding-top: 3rem;
  }
`;

export const MiddleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

export const TitleAndDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
`;

export const InputTitle = styled.h2`
  ${typography.styles.headline2};
  color: ${colors.light.grayscale[100]};
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const InputDescription = styled.p`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[70]};
  text-align: center;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
  height: 3rem;
  padding: 1rem 1.25rem;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;

  border-radius: 0.75rem;
  border: 1px solid rgba(26, 167, 255, 0.6);
  background: ${colors.light.grayscale[0]};
  box-shadow: 0 0 20px 0 ${colors.light.brand.primary20};

  /* 2. 모바일 스타일 (세로 배치 덮어쓰기) */
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.625rem;

    /* 모바일에서는 그룹의 테두리/그림자 제거 */
    border: none;
    background: transparent;
    box-shadow: none;
    padding: 0;
    min-height: auto;
  }
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  text-align: left;
  height: auto;
  padding: 0.875rem 1.25rem 0.875rem 0rem;
  border: none;
  box-shadow: none;
  background: transparent;

  color: ${colors.light.grayscale[100]};
  font-family: ${typography.fontFamily.primary};
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.02rem;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${colors.light.grayscale[40]};
  }

  &:disabled {
    cursor: not-allowed;
  }

  /* 모바일 스타일 (테두리/그림자 추가) */
  @media (max-width: 640px) {
    width: 100%;
    box-sizing: border-box;
    height: 3rem;
    text-align: center;
    flex: none;

    /* 모바일에서는 인풋에 직접 스타일 적용 */
    border-radius: 0.75rem;
    border: 1px solid rgba(26, 167, 255, 0.6);
    background: ${colors.light.grayscale[0]};
    box-shadow: 0 0 20px 0 ${colors.light.brand.primary20};
  }
`;

export const SubmitButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;

  border-radius: 0.5rem;
  opacity: 0.4;
  background: ${colors.light.brand.primary100};
  transition: all 0.2s ease;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(22, 138, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  /* 모바일 스타일 */
  @media (max-width: 640px) {
    width: 100%;
    min-height: 2rem;
    border-radius: 0.75rem; /* 인풋과 동일하게 */
    opacity: 1; /* 불투명하게 */
    flex-shrink: 1; /* 초기화 */

    /* 모바일용 hover */
    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: none;
      box-shadow: none;
    }
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
  width: 100%;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// 로딩
export const LoadingCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
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
  width: 100%; /* 너비 100% */

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 왼쪽 섹션 (Sticky)
export const LeftSection = styled.div`
  position: sticky;
  top: 2.5rem;
  width: 100%; /* 너비 100% */
  box-sizing: border-box; /* 패딩 포함 */
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 1024px) {
    position: relative;
    top: 0;
  }
`;

// --- 영상 정보 상단 뱃지 스타일 ---
export const VideoBadgesWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem; /* 뱃지 사이 간격 */
`;

export const VideoBadge = styled.span<{ type: "time" | "video" }>`
  display: flex;
  height: 1.75rem;
  padding: 0.5625rem 0.625rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border-radius: 0.375rem;
  ${typography.styles.caption3}
  line-height: 1; /* 높이를 깔끔하게 */
  text-transform: uppercase;

  background: ${(props) =>
    props.type === "time"
      ? colors.light.transparency.black[5]
      : colors.light.etc.redLight};

  color: ${(props) =>
    props.type === "time"
      ? colors.light.transparency.black[80]
      : colors.light.etc.red};
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const VideoTitle = styled.h3`
  ${typography.styles.title2};
  color: ${colors.light.grayscale[100]};
`;

export const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const VideoStatsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  ${typography.styles.caption3}
  color: ${colors.light.grayscale[60]};

  svg {
    width: 1rem; /* 16px */
    height: 1rem; /* 16px */
    color: ${colors.light.grayscale[60]};
  }
`;

// 메타 데이터 항목 전체를 감싸는 래퍼 (구분선 역할을 대체)
export const VideoMetaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem; /* 항목 간의 간격 (조회수-좋아요-게시일) */
`;

export const LeftBottom = styled.div`
  display: flex;
  flex-direction: column;
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
