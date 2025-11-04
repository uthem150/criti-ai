import styled from "@emotion/styled";
import { colors, typography } from "@/styles/design";

export const HighlightsContainer = styled.div`
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  color: ${colors.light.grayscale[90]};

  ${typography.styles.title4};

  display: flex;
  align-items: center;
  gap: 8px;
`;

export const EmptyState = styled.p`
  color: ${colors.light.grayscale[70]};

  ${typography.styles.caption3};

  margin: 0;
  padding: 16px;
  background: ${colors.light.grayscale[5]};
  border-radius: 6px;
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
  margin-bottom: 12px;
  padding: 12px;
  background: ${colors.light.grayscale[5]};
  border-radius: 6px;
  border-left: 3px solid
    ${(props) =>
      props.type === "bias"
        ? colors.light.etc.orange
        : props.type === "fallacy"
          ? colors.light.state.error
          : props.type === "manipulation"
            ? colors.light.state.error
            : colors.light.etc.orange};
  transition: all "150ms ease-in-out";

  &:hover {
    background: ${colors.light.grayscale[10]};
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }

  .highlight-header {
    margin-bottom: 8px;

    .highlight-type {
      display: inline-block;
      background: ${(props) =>
        props.type === "bias"
          ? colors.light.etc.orange
          : props.type === "fallacy"
            ? colors.light.state.error
            : props.type === "manipulation"
              ? colors.light.state.error
              : colors.light.etc.gray};

      color: ${(props) =>
        props.type === "bias"
          ? colors.light.etc.yellow
          : props.type === "fallacy"
            ? colors.light.etc.red
            : props.type === "manipulation"
              ? colors.light.etc.red
              : colors.light.etc.gray};
      padding: 2px 8px;
      border-radius: 2px;

      ${typography.styles.caption4};
    }
  }

  .position-info {
    margin-top: 8px;
    color: ${colors.light.grayscale[60]};
    opacity: 0.7;
    ${typography.styles.caption4};
  }
`;

export const HighlightText = styled.strong`
  color: ${colors.light.grayscale[90]};
  ${typography.styles.caption2};
  font-weight: ${typography.fontWeight.semibold};
  display: block;
  margin-bottom: 4px;
`;

export const HighlightExplanation = styled.small`
  color: ${colors.light.grayscale[70]};
  ${typography.styles.body4};
`;
