import styled from "@emotion/styled";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  animations,
} from "@/styles/style";

export const FallaciesContainer = styled.div`
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

export const FallaciesList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const FallacyItem = styled.li<{ severity: "low" | "medium" | "high" }>`
  margin-bottom: ${spacing[3]};
  padding: ${spacing[3]};
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  border-left: 3px solid
    ${({ severity }) =>
      severity === "high"
        ? colors.status.error
        : severity === "medium"
          ? colors.status.warning
          : colors.status.info};
  transition: all ${animations.transition.fast};

  &:hover {
    background: ${colors.background.tertiary};
    transform: translateX(2px);
    box-shadow: 0 2px 8px ${colors.shadow.medium}; /* 그림자 */
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FallacyType = styled.strong`
  color: ${colors.text.primary};
  ${typography.styles.caption2};

  font-weight: ${typography.fontWeight.semibold};

  display: block;
  margin-bottom: ${spacing[1]};
`;

export const FallacyDescription = styled.small`
  color: ${colors.text.secondary};
  ${typography.styles.body4};
`;

export const SeverityBadge = styled.span<{
  severity: "low" | "medium" | "high";
}>`
  display: inline-block;
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${borderRadius.sm};
  margin-left: ${spacing[2]};
  background: ${({ severity }) =>
    severity === "high"
      ? colors.status.error
      : severity === "medium"
        ? colors.status.warning
        : colors.status.info};
  color: ${colors.text.inverse};

  ${typography.styles.caption4};
`;

export const AffectedText = styled(FallacyDescription)`
  margin-top: ${spacing[1]};
  font-style: italic;
  padding: ${spacing[1]} ${spacing[2]};
  background: ${colors.background.tertiary};
  border-radius: ${borderRadius.sm};
  display: block;
`;
