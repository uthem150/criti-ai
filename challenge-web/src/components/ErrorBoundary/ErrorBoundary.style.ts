import styled from "@emotion/styled";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../styles/design-system";

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: ${spacing[6]};
  padding: ${spacing[8]};
  background: ${colors.background.primary};
  text-align: center;
`;

export const ErrorIcon = styled.div`
  font-size: 4rem;
`;

export const ErrorTitle = styled.h1`
  ${typography.styles.headline2};
  color: ${colors.text.primary};
  margin: 0;
`;

export const ErrorDescription = styled.p`
  ${typography.styles.body2};
  color: ${colors.text.secondary};
  max-width: 500px;
  line-height: 1.6;
`;

export const ErrorDetails = styled.div`
  background: ${colors.background.tertiary};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.md};
  max-width: 600px;
  width: 100%;
  overflow: auto;
  max-height: 200px;
`;

export const ErrorCode = styled.code`
  ${typography.styles.body3};
  font-family: ${typography.fontFamily.code};
  color: ${colors.status.error};
  display: block;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const ResetButton = styled.button`
  padding: ${spacing[3]} ${spacing[6]};
  background: ${colors.primary};
  color: ${colors.text.inverse};
  border: none;
  border-radius: ${borderRadius.md};
  ${typography.styles.title5};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${spacing[2]};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
