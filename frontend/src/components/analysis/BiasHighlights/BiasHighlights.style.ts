import styled from '@emotion/styled';
import { colors, spacing, borderRadius, typography, animations } from '@/styles/design-system';

export const HighlightsContainer = styled.div`
  margin-bottom: ${spacing[4]};
`;

export const SectionTitle = styled.h4`
  margin: 0 0 ${spacing[3]} 0;
  color: ${colors.text.primary};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

export const EmptyState = styled.p`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.sm};
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

export const HighlightItem = styled.li`
  margin-bottom: ${spacing[3]};
  padding: ${spacing[3]};
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  border-left: 3px solid ${colors.status.warning};
  transition: all ${animations.transition.fast};
  
  &:hover {
    background: ${colors.background.tertiary};
    transform: translateX(2px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const HighlightText = styled.strong`
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.medium};
  display: block;
  margin-bottom: ${spacing[1]};
`;

export const HighlightExplanation = styled.small`
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.xs};
  line-height: ${typography.lineHeight.normal};
`;
