import styled from "@emotion/styled";
import { colors, typography } from "@/styles/design-system";

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  background: ${colors.light.grayscale[0]};
  text-align: center;
`;

export const ErrorIcon = styled.div`
  font-size: 4rem;
`;

export const ErrorTitle = styled.h1`
  ${typography.styles.headline2};
  color: ${colors.light.grayscale[90]};
  margin: 0;
`;

export const ErrorDescription = styled.p`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[70]};
  max-width: 500px;
  line-height: 1.6;
`;

export const ErrorDetails = styled.div`
  background: ${colors.light.grayscale[10]};
  padding: 16px;
  border-radius: 6px;
  max-width: 600px;
  width: 100%;
  overflow: auto;
  max-height: 200px;
`;

export const ErrorCode = styled.code`
  ${typography.styles.body3};
  font-family: ${typography.fontFamily.code};
  color: ${colors.light.state.error};
  display: block;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const ResetButton = styled.button`
  padding: 12px 24px;
  background: ${colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 6px;
  ${typography.styles.title5};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
