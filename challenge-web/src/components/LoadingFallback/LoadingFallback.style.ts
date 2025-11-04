import styled from "@emotion/styled";
import { colors, typography } from "@/styles/design-system";

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: 16px;
  background: ${colors.light.grayscale[5]};
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${colors.light.grayscale[20]};
  border-top-color: ${colors.light.brand.primary100};
  border-radius: 9999px;
  animation: spin 0.8s linear infinite;
`;

export const LoadingText = styled.p`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[70]};
  margin: 0;
`;
