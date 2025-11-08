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

export const InputDescription = styled.div`
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

export const LoadingText = styled.div`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[70]};
  margin: 0;
`;

// 결과 레이아웃
export const ResultLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  padding: 0 1.25rem;

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
  padding: 0 1.25rem;
`;

export const RightWrapper = styled.div`
  border: 1px solid ${colors.light.grayscale[20]};
  background: ${colors.light.grayscale[0]};

  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
`;

// 총점 카드
export const ScoreCard = styled.div`
  padding: 2rem 2rem 1.25rem 2rem;
  text-align: left;
`;

// 채널 이름 및 점수 카드 스타일
export const ChannelScoreCard = styled.div`
  display: flex;
  height: 3.375rem;
  padding: 1rem 0;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  align-self: stretch;

  background: ${colors.light.etc.blueLight};
  border-radius: 0.75rem;
`;

export const ChannelNameInCard = styled.span`
  ${typography.styles.title4}
  color: ${colors.light.etc.blue};
`;

export const ChannelScoreInCard = styled.span`
  ${typography.styles.caption3}
  color: ${colors.light.transparency.black[60]};
`;

// 긴 텍스트를 위한 항목
export const LongTextScoreRow = styled.div`
  display: flex;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.light.grayscale[20]};
`;

export const LongTextScoreValue = styled.div`
  /* 긴 내용 텍스트 스타일 */
  ${typography.styles.body3}
  color: ${colors.light.grayscale[70]};
  margin: 0;
  padding: 0;
  white-space: pre-wrap; /* 줄 바꿈 처리 */
`;

export const TotalScore = styled.div<{ score: number }>`
  ${typography.styles.headline2};

  color: ${(props) => {
    if (props.score >= 70) return colors.light.state.success;
    if (props.score >= 50) return colors.light.etc.orange;
    return colors.light.state.error;
  }};
  line-height: 1;
  margin-bottom: 1rem; /* Summary와의 간격 */
`;

export const ScoreDescription = styled.div`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[80]};
`;

// 세로 막대 그래프 카드 (차트 자체는 디자인 유지)
export const ChartCard = styled.div`
  padding: 1.25rem 2rem;
`;

export const ChartTitle = styled.h3`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 1.5rem 0;
`;

export const ChartContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 1.25rem;
  height: 15rem;
  padding: 0 0.75rem;
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

// Collapsible 섹션
export const CollapsibleCard = styled.div`
  overflow: hidden;

  &:last-child {
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
  }
`;

export const CollapsibleHeader = styled.button<{ isOpen: boolean }>`
  display: flex;
  height: 3.5rem;
  padding: 0.75rem 2rem;
  align-items: center;
  gap: 1rem;
  align-self: stretch;

  width: 100%;
  justify-content: space-between;
  background: ${colors.light.grayscale[5]};
  cursor: pointer;
  transition: all 0.2s ease;

  /* 열렸을 때만 하단 보더 표시 */
  border-bottom: ${(props) =>
    props.isOpen ? `1px solid ${colors.light.grayscale[20]}` : "none"};

  &:hover {
    background: ${colors.light.grayscale[10]};
  }
`;

export const CollapsibleTitle = styled.h3`
  ${typography.styles.title3};
  color: ${colors.light.grayscale[100]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* 점수/개수 텍스트 스타일 */
  span {
    ${typography.styles.title3};
    font-weight: ${typography.fontWeight.bold};
    padding: 0;
    background: none;
    border-radius: 0;
  }
`;
export const CollapsibleIcon = styled.span<{ isOpen: boolean }>`
  /* 아이콘 중앙 정렬 및 크기 지정 */
  display: flex;
  justify-content: center;
  align-items: center;

  width: 1.5rem;
  height: 1.5rem;

  /* 애니메이션 설정 */
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease;

  color: ${colors.light.grayscale[70]}; /* 100에서 70으로 조정 */

  /* SVG 아이콘 크기 설정 */
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const CollapsibleContent = styled.div<{ isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${(props) => (props.isOpen ? "1fr" : "0fr")};

  transition: grid-template-rows 0.4s ease-in-out;
  background: ${colors.light.grayscale[0]};
`;
export const CollapsibleBody = styled.div`
  overflow: hidden;
`;

// 채널 점수 섹션
export const ChannelScoreContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ScoreRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ScoreLabel = styled.span`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
`;

export const ScoreValue = styled.span`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[100]};
`;

export const BiasAnalysisWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BiasTitle = styled.h3`
  color: ${colors.light.grayscale[100]};

  font-size: 1.125rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.0225rem;
`;

// 분석 내용 (논리적 오류, 편향성 등)
export const AnalysisContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const AnalysisItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const AnalysisItem = styled.div`
  background: ${colors.light.grayscale[5]};
  border-radius: 0.75rem;

  display: flex;
  padding: 1.25rem;
  flex-direction: column;
`;

export const AnalysisBadgeWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ItemHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ItemTitle = styled.div`
  ${typography.styles.body2};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[90]};
  flex: 1;
`;

export const ItemTimestamp = styled.button`
  display: flex;
  height: 1.5rem;
  padding: 0.5625rem 0.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.375rem;
  background-color: ${colors.light.transparency.black[5]};

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

export const ItemDescription = styled.div`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  line-height: 1.6;
  margin: 0.5rem 0 0 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

export const Badge = styled.span<{
  severity?: "low" | "medium" | "high" | "critical";
}>`
  display: flex;
  height: 1.5rem;
  padding: 0.5625rem 0.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  ${typography.styles.caption4};
  text-transform: uppercase;
  white-space: nowrap;
  border-radius: 0.375rem;

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

// 논리적 오류 전용 스타일
export const FallacyTypeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:not(:last-child) {
    border-bottom: 1px solid ${colors.light.grayscale[20]};
  }
`;

export const FallacyTypeHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FallacyTypeName = styled.h3`
  color: ${colors.light.grayscale[100]};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.025rem;
`;

export const FallacyTypeDescription = styled.div`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[60]};
`;

export const FallacyInstancesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

//  각 카드(영역) 사이의 간격
export const FallacyInstance = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FallacyCard = styled.div`
  border-radius: 0.375rem;
  overflow: hidden; // 자식 컴포넌트가 둥근 모서리를 넘지 않도록
`;

// 카드 내부의 제목 역할
export const FallacySectionTitle = styled.div`
  background: ${colors.light.grayscale[10]};
  ${typography.styles.title4};
  color: ${colors.light.grayscale[100]};
  padding: 0.75rem 1.25rem;
`;

// 카드 내부에 패딩을 적용할 컨텐츠 래퍼
export const FallacyCardContent = styled.div`
  background: ${colors.light.grayscale[5]};

  display: flex;
  padding: 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  align-self: stretch;
`;

// 굵은 텍스트로
export const FallacyQuote = styled.div`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[100]};
`;

export const FallacyExplanation = styled.div`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
`;

export const FallacyExamplesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FallacyExampleItem = styled.div`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  padding-left: 1.5rem;
  position: relative;

  &::before {
    content: "•";
    position: absolute;
    left: 0.5rem;
    color: ${colors.light.grayscale[70]};
  }
`;

// CollapsibleHeader의 제목 옆에 표시될 파란색/빨간색 결과 텍스트
export const AnalysisResultText = styled.span<{ isNegative: boolean }>`
  ${typography.styles.title3};
  font-weight: ${typography.fontWeight.bold};
  color: ${(props) =>
    props.isNegative
      ? colors.light.state.error
      : colors.light.brand.primary100};
  margin-left: 0.5rem;
`;

// 광고성 분석 상단 요약 박스
export const AdSummaryBox = styled.div<{ isAdvertorial: boolean }>`
  display: flex;
  height: 3.375rem;
  padding: 1rem 0;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  align-self: stretch;
  border-radius: 0.75rem;

  background: ${(props) =>
    props.isAdvertorial
      ? colors.light.state.errorLight
      : colors.light.state.successLight};

  color: ${(props) =>
    props.isAdvertorial
      ? colors.light.state.error
      : colors.light.state.success};
`;

export const SummaryTitle = styled.span`
  ${typography.styles.title4};
`;

export const SummaryConfidence = styled.span`
  ${typography.styles.caption3};
  color: ${colors.light.transparency.black[60]};
`;

// 막대 그래프 점수 영역 래퍼
export const ScoreBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// 개별 점수 막대 (라벨 + 막대 + 값)
export const ScoreBarItem = styled.div`
  display: flex;
  align-items: center;
`;

// 점수 라벨 ("네이티브 광고")
export const ScoreBarLabel = styled.div`
  width: 5.75rem; // 라벨 너비 고정
  ${typography.styles.caption3}
  color: ${colors.light.grayscale[60]};
`;

// 막대 그래프의 회색 배경 (트랙)
export const ScoreBarContainer = styled.div`
  flex: 1; // 남은 공간 모두 차지
  height: 10px;
  background: ${colors.light.grayscale[10]};
  border-radius: 5px;
  overflow: hidden; // ScoreBarFill이 밖으로 나가지 않도록
`;

// 실제 점수 나타내는 파란색 막대
export const ScoreBarFill = styled.div<{ score: number }>`
  width: ${(props) => props.score}%; // 점수(0-100) %로 변환
  height: 100%;
  background: ${colors.light.brand.primary100};
  border-radius: 5px;
  transition: width 0.3s ease-out;
`;

// 점수 숫자
export const ScoreBarValue = styled.div`
  width: 2rem; // 숫자 너비 고정
  text-align: right;
  ${typography.styles.title5};
  color: ${colors.light.brand.primary100};
`;

export const AdSubSection = styled.div`
  display: flex;
  flex-direction: column;
`;

// "발견된 세부 지표" 같은 하위 섹션 제목
export const AdSubSectionHeader = styled.h4`
  ${typography.styles.title5};
  color: ${colors.light.grayscale[90]};
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${colors.light.grayscale[20]};
`;

// 세부 지표 리스트 래퍼
export const AdIndicatorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem; // 각 지표 사이의 간격
  padding-top: 1.25rem;
`;
