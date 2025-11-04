import styled from "@emotion/styled";
import { colors, typography } from "@/styles/design";

export const FallaciesContainer = styled.div`
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

export const FallaciesList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const FallacyItem = styled.li<{ severity: "low" | "medium" | "high" }>`
  margin-bottom: 12px;
  padding: 12px;
  background: ${colors.light.grayscale[5]};
  border-radius: 6px;
  border-left: 3px solid
    ${({ severity }) =>
      severity === "high"
        ? colors.light.state.error
        : severity === "medium"
          ? colors.light.etc.orange
          : colors.light.brand.primary100};
  transition: all "150ms ease-in-out";

  &:hover {
    background: ${colors.light.grayscale[10]};
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 그림자 */
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FallacyType = styled.strong`
  color: ${colors.light.grayscale[90]};
  ${typography.styles.caption2};

  font-weight: ${typography.fontWeight.semibold};

  display: block;
  margin-bottom: 4px;
`;

export const FallacyDescription = styled.small`
  color: ${colors.light.grayscale[70]};
  ${typography.styles.body4};
`;

export const SeverityBadge = styled.span<{
  severity: "low" | "medium" | "high";
}>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 2px;
  margin-left: 8px;
  background: ${({ severity }) =>
    severity === "high"
      ? colors.light.state.error
      : severity === "medium"
        ? colors.light.etc.orange
        : colors.light.brand.primary100};
  color: ${colors.light.grayscale[0]};

  ${typography.styles.caption4};
`;

export const AffectedText = styled(FallacyDescription)`
  margin-top: 4px;
  font-style: italic;
  padding: 4px 8px;
  background: ${colors.light.grayscale[10]};
  border-radius: 2px;
  display: block;
`;
