import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
} from "../../../styles/design-system";

interface ButtonStyleProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
}

const getVariantStyles = (variant: ButtonStyleProps["variant"]) => {
  switch (variant) {
    case "primary":
      return css`
        background-color: ${colors.primary[500]};
        color: ${colors.text.inverse};
        border: 1px solid ${colors.primary[500]};

        &:hover:not(:disabled) {
          background-color: ${colors.primary[600]};
          border-color: ${colors.primary[600]};
        }

        &:active:not(:disabled) {
          background-color: ${colors.primary[700]};
        }
      `;

    case "secondary":
      return css`
        background-color: ${colors.secondary[100]};
        color: ${colors.text.primary};
        border: 1px solid ${colors.border.primary};

        &:hover:not(:disabled) {
          background-color: ${colors.secondary[200]};
        }
      `;

    case "outline":
      return css`
        background-color: transparent;
        color: ${colors.primary[600]};
        border: 1px solid ${colors.primary[300]};

        &:hover:not(:disabled) {
          background-color: ${colors.primary[50]};
          border-color: ${colors.primary[400]};
        }
      `;

    case "ghost":
      return css`
        background-color: transparent;
        color: ${colors.text.secondary};
        border: 1px solid transparent;

        &:hover:not(:disabled) {
          background-color: ${colors.secondary[100]};
          color: ${colors.text.primary};
        }
      `;

    case "danger":
      return css`
        background-color: ${colors.status.error};
        color: ${colors.text.inverse};
        border: 1px solid ${colors.status.error};

        &:hover:not(:disabled) {
          background-color: #dc2626;
        }
      `;

    default:
      return getVariantStyles("primary");
  }
};

const getSizeStyles = (size: ButtonStyleProps["size"]) => {
  switch (size) {
    case "sm":
      return css`
        padding: ${spacing[2]} ${spacing[3]};
        font-size: ${typography.fontSize.sm};
        min-height: 2rem;
      `;

    case "lg":
      return css`
        padding: ${spacing[3]} ${spacing[6]};
        font-size: ${typography.fontSize.lg};
        min-height: 2.75rem;
      `;

    case "md":
    default:
      return css`
        padding: ${spacing[2]} ${spacing[4]};
        font-size: ${typography.fontSize.base};
        min-height: 2.5rem;
      `;
  }
};

export const StyledButton = styled.button<ButtonStyleProps>`
  // 기본 스타일
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};

  font-family: ${typography.fontFamily.primary};
  font-weight: ${typography.fontWeight.medium};
  line-height: ${typography.lineHeight.tight};
  text-decoration: none;

  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.sm};

  cursor: pointer;
  transition: all ${animations.transition.normal};

  // 포커스 스타일
  &:focus {
    outline: 2px solid ${colors.border.focus};
    outline-offset: 2px;
  }

  // 비활성화 스타일
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // 변형별 스타일
  ${(props) => getVariantStyles(props.variant)}

  // 크기별 스타일
  ${(props) => getSizeStyles(props.size)}
  
  // 전체 너비
  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}
`;
