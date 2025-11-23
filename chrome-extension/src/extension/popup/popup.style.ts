// style.ts에 추가
import styled from "@emotion/styled";
import { colors, typography } from "@/styles/design";
import { css, keyframes } from "@emotion/react";

const spacing = [
  "0rem",
  "0.25rem",
  "0.5rem",
  "0.75rem",
  "1rem",
  "1.5rem",
  "2rem",
  "3rem",
];

const animations = {
  transition: {
    normal: "0.2s ease-out",
  },
};

// 스피너 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 550px;
  width: 380px;
  background-color: ${colors.light.grayscale[0]};
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 0rem 1rem;
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

export const Main = styled.main`
  flex: 1;
  padding: ${spacing[5]};
`;

// 상태별 컨테이너
export const StatusContainer = styled.div<{
  status?: "checking" | "ready" | "not_ready" | "error";
}>`
  text-align: center;
  margin-bottom: ${spacing[5]};
`;

export const GreetingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
`;

export const Icon = styled.div<{ status?: "ready" | "not_ready" | "error" }>`
  font-size: 2rem;
  margin-bottom: ${spacing[4]};

  ${(props) =>
    props.status === "ready" &&
    css`
      filter: hue-rotate(120deg);
    `}

  ${(props) =>
    props.status === "not_ready" &&
    css`
      filter: hue-rotate(30deg);
    `}
  
  ${(props) =>
    props.status === "error" &&
    css`
      filter: hue-rotate(0deg);
    `}
`;

export const StatusTitle = styled.h3`
  ${typography.styles.title3}
  font-weight: 700;
  color: ${colors.light.grayscale[80]};
  margin-bottom: 0.5rem;
`;

export const StatusDescription = styled.p`
  font-size: 0.7rem;
  background: ${colors.light.etc.blueLight};
  color: ${colors.light.grayscale[80]};

  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

// 스피너
export const Spinner = styled.div<{ small?: boolean }>`
  width: ${(props) => (props.small ? "16px" : "40px")};
  height: ${(props) => (props.small ? "16px" : "40px")};
  border: ${(props) => (props.small ? "2px" : "3px")} solid #e2e8f0;
  border-top: ${(props) => (props.small ? "2px" : "3px")} solid #0ea5e9;
  border-radius: 50%;
  margin: ${(props) => (props.small ? "0 8px 0 0" : `0 auto ${spacing[4]}`)};
  animation: ${spin} 1s linear infinite;
`;

// 버튼 기본 스타일
const buttonBase = css`
  display: flex;
  padding: 1.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
  border-radius: 1.25rem;
  border: none;

  cursor: pointer;
  transition: all ${animations.transition.normal};
  display: flex;
  justify-content: center;
  width: 100%;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const AnalyzeButton = styled.div<{
  type?: "analyze" | "challenge";
}>`
  ${buttonBase}
  background: ${colors.light.brand.primary100};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(172, 172, 172, 0.3);
  }

  & svg {
    /* svg 태그 자체와 그 내부의 path까지 모두 선택 */
    &,
    & path {
      stroke: ${(props) =>
        props.type === "analyze"
          ? colors.light.static.white
          : colors.light.brand.primary100};
    }
  }
`;

export const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 0.5rem;
`;

export const ButtonTitleWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ButtonTitle = styled.div<{
  type?: "analyze" | "challenge";
}>`
  ${typography.styles.title5}

  color: ${(props) =>
    props.type === "analyze"
      ? colors.light.static.white
      : colors.light.brand.primary100};
`;

export const ButtonDescription = styled.p<{
  type?: "analyze" | "challenge";
}>`
  ${typography.styles.body4}
  color: ${(props) =>
    props.type === "analyze"
      ? colors.light.static.white
      : colors.light.brand.primary100};

  text-align: left;
  opacity: 0.7;
`;

export const RetryButton = styled.button`
  ${buttonBase}
  background: #f59e0b;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(172, 172, 172, 0.3);
  }
`;

export const DemoButton = styled.button`
  ${buttonBase}
  background: #10b981;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(172, 172, 172, 0.3);
  }
`;

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ChallengeButton = styled.div<{
  type?: "analyze" | "challenge";
}>`
  ${buttonBase}
  background: ${colors.light.brand.primary20};

  & svg {
    /* svg 태그 자체와 그 내부의 path까지 모두 선택 */
    &,
    & path {
      stroke: ${(props) =>
        props.type === "analyze"
          ? colors.light.static.white
          : colors.light.brand.primary100};
    }
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(172, 172, 172, 0.3);
  }
`;

export const ChallengeDescription = styled.p`
  font-size: 13px;
  color: #64748b;
  text-align: center;
  line-height: 1.4;
  margin-bottom: ${spacing[2]};
`;

export const CurrentPage = styled.div`
  padding: 0.7rem;
  background: rgba(14, 165, 233, 0.1);
  border-radius: 6px;

  small {
    color: #0c4a6e;
    font-weight: 500;
  }
`;

export const ErrorDetails = styled.div`
  margin: ${spacing[4]} 0;
  padding: ${spacing[3]};
  background: rgba(239, 68, 68, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(239, 68, 68, 0.1);

  small {
    font-size: 12px;
    color: #7f1d1d;
    line-height: 1.4;
  }
`;

export const Footer = styled.footer`
  padding: ${spacing[4]} ${spacing[5]};
  background: rgba(148, 163, 184, 0.1);
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .version-info small {
    color: #64748b;
    font-size: 12px;
  }

  .links a {
    color: #0ea5e9;
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;
