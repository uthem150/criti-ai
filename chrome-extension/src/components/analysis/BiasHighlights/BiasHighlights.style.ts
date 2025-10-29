import styled from "@emotion/styled";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  animations,
} from "@/styles/style";

export const HighlightsContainer = styled.div`
  margin-bottom: ${spacing[4]};
`;

export const SectionTitle = styled.h4`
  margin: 0 0 ${spacing[3]} 0;
  color: ${colors.text.primary};

  ${typography.styles.title4};

  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

export const EmptyState = styled.p`
  color: ${colors.text.secondary};

  ${typography.styles.caption3};

  margin: 0;
  padding: ${spacing[4]};
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  text-align: center;
`;

export const HighlightsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

interface HighlightItemProps {
  type?: string;
}

export const HighlightItem = styled.li<HighlightItemProps>`
  margin-bottom: ${spacing[3]};
  padding: ${spacing[3]};
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  border-left: 3px solid
    ${(props) =>
      props.type === "bias"
        ? colors.status.warning
        : props.type === "fallacy"
          ? colors.status.error
          : props.type === "manipulation"
            ? colors.status.error
            : colors.status.warning};
  transition: all ${animations.transition.fast};

  &:hover {
    background: ${colors.background.tertiary};
    transform: translateX(2px);
    box-shadow: 0 2px 8px ${colors.shadow.medium};
  }

  &:last-child {
    margin-bottom: 0;
  }

  .highlight-header {
    margin-bottom: ${spacing[2]};

    .highlight-type {
      display: inline-block;
      background: ${
        (props) =>
          props.type === "bias"
            ? colors.palette.orange // warning 대신 orange 사용
            : props.type === "fallacy"
              ? colors.status.error
              : props.type === "manipulation"
                ? colors.status.error
                : colors.palette.gray // 중립 색상 사용
      };

      color: ${(props) =>
        props.type === "bias"
          ? colors.palette.yellow
          : props.type === "fallacy"
            ? colors.palette.red
            : props.type === "manipulation"
              ? colors.palette.red
              : colors.palette.gray};
      padding: 2px 8px;
      border-radius: ${borderRadius.sm};

      ${typography.styles.caption4};
    }
  }

  .position-info {
    margin-top: ${spacing[2]};
    color: ${colors.text.tertiary};
    opacity: 0.7;
    ${typography.styles.caption4};
  }
`;

export const HighlightText = styled.strong`
  color: ${colors.text.primary};
  ${typography.styles.caption2};
  font-weight: ${typography.fontWeight.semibold};
  display: block;
  margin-bottom: ${spacing[1]};
`;

export const HighlightExplanation = styled.small`
  color: ${colors.text.secondary};
  ${typography.styles.body4};
`;
