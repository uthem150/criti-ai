import styled from "@emotion/styled";
import { colors, typography } from "@/styles/design-system";

export const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: 24px;
  background: ${colors.light.grayscale[0]};
  padding: 32px;
  text-align: center;
`;

export const NotFoundIcon = styled.div`
  font-size: 6rem;
`;

export const NotFoundCode = styled.h1`
  ${typography.styles.headline1};
  color: ${colors.light.grayscale[90]};
  margin: 0;
`;

export const NotFoundMessage = styled.p`
  ${typography.styles.body1};
  color: ${colors.light.grayscale[70]};
  max-width: 500px;
`;

export const HomeLink = styled.a`
  padding: 12px 24px;
  background: ${colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};
  border: none;
  border-radius: 6px;
  ${typography.styles.title5};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
