import styled from "@emotion/styled";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../styles/design-system";

export const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: ${spacing[6]};
  background: ${colors.background.primary};
  padding: ${spacing[8]};
  text-align: center;
`;

export const NotFoundIcon = styled.div`
  font-size: 6rem;
`;

export const NotFoundCode = styled.h1`
  ${typography.styles.headline1};
  color: ${colors.text.primary};
  margin: 0;
`;

export const NotFoundMessage = styled.p`
  ${typography.styles.body1};
  color: ${colors.text.secondary};
  max-width: 500px;
`;

export const HomeLink = styled.a`
  padding: ${spacing[3]} ${spacing[6]};
  background: ${colors.primary};
  color: ${colors.text.inverse};
  border: none;
  border-radius: ${borderRadius.md};
  ${typography.styles.title5};
  display: inline-flex;
  align-items: center;
  gap: ${spacing[2]};
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
