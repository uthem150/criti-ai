import styled from "@emotion/styled";
import { colors, typography } from "../../styles/design-system";

// 전체 컨테이너
export const Container = styled.div`
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${colors.light.grayscale[5]};
`;

export const ContentWrapper = styled.div<{ isStarted: boolean }>`
  display: flex;
  padding: ${(props) => (props.isStarted ? "5rem 2.5rem" : "0rem 1.25rem")};
  /* width: 37.5rem; */
  width: 80%;

  flex-direction: column;
  align-items: center;
  flex: 1 0 0;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

// 진행바
export const ProgressBarContainer = styled.div`
  width: 100%;
  margin-bottom: 2.5rem;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${colors.light.grayscale[20]};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${colors.light.brand.primary100},
    ${colors.light.etc.blue}
  );
  transition: width 0.3s ease;
`;

// 콘텐츠 카드
export const ContentCard = styled.div`
  width: 100%;
`;

// 환영 화면
export const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 600px;
  min-height: 100vh;
`;

export const WelcomeTitle = styled.h2`
  ${typography.styles.headline2};
  color: ${colors.light.grayscale[100]};
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    ${typography.styles.headline2};
  }
`;

export const WelcomeSubtitle = styled.p`
  ${typography.styles.body1};
  color: ${colors.light.grayscale[70]};
  line-height: 1.6;
  margin: 0 0 40px 0;
`;

export const StartButton = styled.button`
  display: flex;
  height: 3.5rem;
  padding: 0.9375rem 1.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  border-radius: 0.75rem;

  background: ${colors.light.brand.primary100};
  color: ${colors.light.static.white};

  ${typography.styles.title4};
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 문제 화면
export const QuestionNumber = styled.div`
  ${typography.styles.title2};
  text-align: center;
  color: ${colors.light.grayscale[50]};
  margin-bottom: 0.75rem;
`;

export const QuestionTitle = styled.h3`
  ${typography.styles.title1};
  color: ${colors.light.grayscale[90]};
  margin-bottom: 3.75rem;
  text-align: center;

  @media (max-width: 768px) {
  }
`;

// 선택지
export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3.75rem;
`;

export const OptionButton = styled.button<{ selected: boolean }>`
  display: flex;
  padding: 1.25rem 1.75rem;
  align-items: center;
  gap: 0.75rem;
  align-self: stretch;
  border-radius: 1.25rem;

  background: ${(props) =>
    props.selected ? colors.light.brand.primary10 : colors.light.grayscale[0]};

  border: 1px solid
    ${(props) =>
      props.selected
        ? colors.light.brand.primary100
        : colors.light.grayscale[20]};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    border-color: ${colors.light.brand.primary100};
    transform: translateX(4px);
  }
`;

export const OptionIcon = styled.div<{ selected: boolean }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 2rem;
  background: ${(props) =>
    props.selected
      ? colors.light.brand.primary100
      : colors.light.grayscale[20]};
  color: ${(props) =>
    props.selected ? colors.light.grayscale[0] : colors.light.grayscale[70]};
  display: flex;
  align-items: center;
  justify-content: center;
  ${typography.styles.title4};
  flex-shrink: 0;
  transition: all 0.2s;
`;

export const OptionText = styled.div`
  ${typography.styles.caption2};
  color: ${colors.light.grayscale[100]};
`;

// 힌트 버튼 및 제출 버튼 컨테이너
export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const HintButton = styled.button`
  flex: 1;
  padding: 16px;
  background: ${colors.light.grayscale[0]};
  color: ${colors.light.brand.primary100};
  border: 2px solid ${colors.light.brand.primary100};
  border-radius: 12px;
  ${typography.styles.title4};
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.light.brand.primary10};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background: ${colors.light.grayscale[20]};
    border-color: ${colors.light.grayscale[30]};
    color: ${colors.light.grayscale[50]};
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

// 힌트 섹션
export const HintSection = styled.div`
  background: ${colors.light.grayscale[5]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-left: 4px solid ${colors.light.etc.purple};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const HintContent = styled.div`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[80]};
  line-height: 1.6;

  strong {
    color: ${colors.light.etc.purple};
    font-weight: ${typography.fontWeight.semibold};
  }
`;

// 제출 버튼
export const SubmitButton = styled.button`
  flex: 2;
  padding: 16px;
  background: ${colors.light.grayscale[90]};
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 12px;
  ${typography.styles.title3};
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.light.grayscale[100]};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background: ${colors.light.grayscale[40]};
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

// 결과 섹션
export const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ResultBadge = styled.div<{ correct: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${(props) =>
    props.correct ? colors.light.state.success : colors.light.state.error};
  color: ${colors.light.grayscale[0]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 24px;
  animation: scaleIn 0.3s ease-out;

  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
`;

export const ResultTitle = styled.h4<{ correct: boolean }>`
  ${typography.styles.title3};
  color: ${(props) =>
    props.correct ? colors.light.state.success : colors.light.state.error};
  margin: 0 0 24px 0;
`;

// 답 설명
export const AnswerExplanation = styled.div`
  text-align: left;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
`;

export const AnswerLabel = styled.div`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[100]};
  margin-bottom: 0.3rem;
`;

export const AnswerBox = styled.div<{ correct: boolean }>`
  padding: 1.25rem 1.75rem;
  margin-bottom: 1.5rem;
  background: ${(props) =>
    props.correct
      ? colors.light.state.successLight
      : colors.light.state.errorLight};

  border: 1px solid
    ${(props) =>
      props.correct ? colors.light.state.success : colors.light.state.error};

  border-radius: 1.25rem;
  ${typography.styles.caption2};
  color: ${colors.light.grayscale[100]};
`;

export const ExplanationSection = styled.div`
  text-align: left;
  margin-bottom: 1.5rem;
`;

export const ExplanationTitle = styled.div`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[100]};
  margin-bottom: 12px;
`;

export const ExplanationText = styled.div`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[80]};
  line-height: 1.6;
  white-space: pre-wrap;
`;

// 다음 버튼
export const NextButton = styled.button`
  display: flex;
  height: 3.5rem;
  padding: 0.9375rem 1.5rem 0.9375rem 1.75rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;

  background: ${colors.light.grayscale[100]};
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 0.7rem;
  ${typography.styles.title4};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${colors.light.grayscale[100]};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// 완료 화면
export const CompletionContainer = styled.div`
  width: 100%;
  max-width: 800px;
  text-align: center;
`;

export const ScoreSection = styled.div`
  background: ${colors.light.grayscale[0]};
  border-radius: 16px;
  padding: 48px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const ScoreTitle = styled.h2`
  ${typography.styles.headline1};
  color: ${colors.light.state.error};
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    ${typography.styles.headline2};
  }
`;

export const ScoreSubtitle = styled.p`
  ${typography.styles.body1};
  color: ${colors.light.grayscale[70]};
  margin: 0 0 32px 0;
  line-height: 1.6;
`;

export const BadgeDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 24px 0;
  padding: 20px;
  background: ${colors.light.grayscale[5]};
  border-radius: 12px;
`;

export const BadgeIcon = styled.div`
  font-size: 48px;
`;

export const BadgeInfo = styled.div`
  text-align: left;
`;

export const BadgeName = styled.div`
  ${typography.styles.title3};
  color: ${colors.light.grayscale[90]};
  font-weight: ${typography.fontWeight.semibold};
`;

export const BadgeDescription = styled.div`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  margin-top: 4px;
`;

export const RestartButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${colors.light.grayscale[90]};
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 12px;
  ${typography.styles.title3};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${colors.light.grayscale[100]};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const ResultsListTitle = styled.h3`
  ${typography.styles.title1};
  color: ${colors.light.grayscale[90]};
  margin: 32px 0 24px 0;
  text-align: left;
`;

export const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ResultItem = styled.div`
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: 12px;
  padding: 24px;
  text-align: left;
`;

export const ResultItemHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 16px;
`;

export const ResultItemNumber = styled.div`
  ${typography.styles.title4};
  color: ${colors.light.grayscale[60]};
`;

export const ResultItemStatus = styled.div<{ correct: boolean }>`
  ${typography.styles.body2};
  color: ${(props) =>
    props.correct ? colors.light.state.success : colors.light.state.error};
  font-weight: ${typography.fontWeight.semibold};
`;

export const ResultItemTitle = styled.div`
  ${typography.styles.title2};
  color: ${colors.light.grayscale[100]};
  margin-bottom: 1rem;
`;
