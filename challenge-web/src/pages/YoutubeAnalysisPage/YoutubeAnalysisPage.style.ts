import styled from "@emotion/styled";
import { colors, typography } from "../../styles/design-system";

// 전체 컨테이너
export const Container = styled.div`
  min-height: 100vh;
  background: ${colors.light.grayscale[0]};
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
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
  padding: 1.5rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${colors.light.grayscale[20]};
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LogoIcon = styled.div`
  ${typography.styles.title1};
`;

export const LogoText = styled.h1`
  ${typography.styles.title2};
  color: ${colors.light.grayscale[90]};
  margin: 0;
`;

export const NavButton = styled.button`
  padding: 0.5rem 1.25rem;
  background: ${colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 0.5rem;
  ${typography.styles.title5};
  cursor: pointer;
  transition: "250ms ease-in-out";
  box-shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)";

  &:hover {
    opacity: 0.9;
    box-shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
  }

  &:active {
    transform: scale(0.98);
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
  box-shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
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
  max-width: 600px;
  margin: 0 auto;
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  ${typography.styles.body2};
  font-family: ${typography.fontFamily.primary};
  border: 1px solid ${colors.light.grayscale[30]};
  border-radius: 0.375rem;
  outline: none;
  transition: "250ms ease-in-out";

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
  padding: 0.75rem 1.5rem;
  background: ${colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 0.375rem;
  ${typography.styles.title5};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  transition: "250ms ease-in-out";
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  box-shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)";

  &:hover:not(:disabled) {
    opacity: 0.9;
    box-shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const ErrorMessage = styled.div`
  padding: 1rem;
  background: ${colors.light.state.errorLight};
  border: 1px solid ${colors.light.state.error};
  border-radius: 0.375rem;
  color: ${colors.light.state.error};
  ${typography.styles.body3};
  margin-top: 1rem;
  max-width: 600px;
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
  box-shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
`;

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${colors.light.grayscale[20]};
  border-top-color: ${colors.light.brand.primary100};
  border-radius: 9999px;
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

// 결과 카드
export const ResultCard = styled.div`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
`;

export const ResultLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 왼쪽 섹션
export const LeftSection = styled.div``;

export const ResultTitle = styled.h2`
  ${typography.styles.title2};
  color: ${colors.light.grayscale[90]};
  margin-bottom: 1.5rem;
`;

// export const VideoPreview = styled.div`
//   display: flex;
//   gap: 1.5rem;
//   margin-bottom: 1.5rem;
//   padding-bottom: 1.5rem;
//   border-bottom: 1px solid ${colors.light.grayscale[20]};
// `;

// 16:9 비율을 가진 플레이어 컨테이너
export const PlayerWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  border-radius: 0.5rem;
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
  margin-top: 1rem; /* 플레이어와 간격 */
`;

export const VideoTitle = styled.h3`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[90]};
  margin: 0 0 0.5rem 0;
  line-height: ${typography.styles.title4.lineHeight};
`;

// 오른쪽 섹션
export const RightSection = styled.div``;

export const ScoreDisplay = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const ScoreValue = styled.div<{ score: number }>`
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

export const ScoreLabel = styled.div`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
`;

export const ScoreSummary = styled.p`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[70]};
  line-height: 1.6;
  margin: 1rem 0 2rem 0;
  text-align: center;
`;

// 막대 그래프
export const ChartContainer = styled.div`
  margin-top: 2rem;
`;

export const ChartBar = styled.div`
  margin-bottom: 1rem;
`;

export const ChartLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  ${typography.styles.body3};
`;

export const ChartLabelText = styled.span`
  color: ${colors.light.grayscale[70]};
  font-weight: ${typography.fontWeight.semibold};
`;

export const ChartLabelValue = styled.span<{ score: number }>`
  color: ${(props) => {
    if (props.score >= 70) return colors.light.state.success;
    if (props.score >= 50) return colors.light.etc.orange;
    return colors.light.state.error;
  }};
  font-weight: ${typography.fontWeight.bold};
`;

export const ChartBarBackground = styled.div`
  width: 100%;
  height: 24px;
  background: ${colors.light.grayscale[10]};
  border-radius: 0.25rem;
  overflow: hidden;
`;

export const ChartBarFill = styled.div<{ width: number; color: string }>`
  width: ${(props) => props.width}%;
  height: 100%;
  background: ${(props) => props.color};
  border-radius: 0.25rem;
  transition: width 0.5s ease;
`;

// 접기/펼치기 섹션
export const CollapsibleSection = styled.div`
  margin-top: 2rem;
  border-top: 1px solid ${colors.light.grayscale[20]};
  padding-top: 1.5rem;
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
  color: ${colors.light.grayscale[90]};
  margin: 0;
`;

export const CollapsibleIcon = styled.span<{ isOpen: boolean }>`
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: "250ms ease-in-out";
`;

export const CollapsibleContent = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-top: ${(props) => (props.isOpen ? "1rem" : 0)};
`;

export const SourceInfo = styled.div`
  background: ${colors.light.grayscale[5]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.5rem;
  padding: 1.25rem;
`;

export const SourceInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ChannelImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 9999px;
  object-fit: cover;
  border: 1px solid ${colors.light.grayscale[20]};
  flex-shrink: 0;
`;

export const SourceTextInfo = styled.div`
  flex: 1;
`;

export const SourceLink = styled.div`
  color: ${colors.light.brand.primary100};
  ${typography.styles.body3};
  font-weight: ${typography.fontWeight.semibold};
`;

export const SourceDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SourceDetailLabel = styled.span`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
`;

export const SourceDetailValue = styled.span`
  ${typography.styles.title3};
  color: ${colors.light.grayscale[90]};
`;

export const SourceDescription = styled.p`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  margin: 0.75rem 0 0 0;
  line-height: 1.5;
`;

// 분석 섹션들
export const FullWidthSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${colors.light.grayscale[20]};
`;

export const SectionTitle = styled.h3`
  ${typography.styles.title3};
  color: ${colors.light.grayscale[90]};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const AnalysisContent = styled.div`
  background: ${colors.light.grayscale[5]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 0.5rem;
  padding: 1.25rem;
`;

export const AnalysisItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid ${colors.light.grayscale[20]};

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
  margin-bottom: 0.5rem;
`;

export const ItemTitle = styled.div`
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.light.grayscale[90]};
  ${typography.styles.body2};
`;

export const ItemTimestamp = styled.span`
  ${typography.styles.body4};
  color: ${colors.light.brand.primary100};
  background: ${colors.light.etc.blueLight};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: ${typography.fontWeight.semibold};
  cursor: pointer;
  user-select: none;
  transition: "250ms ease-in-out";

  &:hover {
    opacity: 0.8;
  }
`;

export const ItemDescription = styled.p`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  line-height: 1.5;
  margin: 0.5rem 0 0 0;
`;

export const Badge = styled.span<{
  severity?: "low" | "medium" | "high" | "critical";
}>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  ${typography.styles.body4};
  font-weight: ${typography.fontWeight.bold};
  text-transform: uppercase;
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
