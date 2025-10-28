import styled from '@emotion/styled';
import { colors, typography, spacing, borderRadius } from '../../styles/style';

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: ${spacing[4]};
  background: ${colors.background.secondary};
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${colors.border.primary};
  border-top-color: ${colors.primary};
  border-radius: ${borderRadius.full};
  animation: spin 0.8s linear infinite;
`;

export const LoadingText = styled.p`
  ${typography.styles.body2};
  color: ${colors.text.secondary};
  margin: 0;
`;
