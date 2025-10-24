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

interface HighlightItemProps {
  type?: string;
}

export const HighlightItem = styled.li<HighlightItemProps>`
  margin-bottom: ${spacing[3]};
  padding: ${spacing[3]};
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.md};
  border-left: 3px solid ${
    props => 
      props.type === 'bias' ? colors.status.warning :
      props.type === 'fallacy' ? colors.status.error :
      props.type === 'manipulation' ? colors.status.error :
      colors.status.warning
  };
  transition: all ${animations.transition.fast};
  
  &:hover {
    background: ${colors.background.tertiary};
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .highlight-header {
    margin-bottom: ${spacing[2]};
    
    .highlight-type {
      display: inline-block;
      background: ${
        props => 
          props.type === 'bias' ? 'rgba(251, 191, 36, 0.1)' :
          props.type === 'fallacy' ? 'rgba(239, 68, 68, 0.1)' :
          props.type === 'manipulation' ? 'rgba(239, 68, 68, 0.15)' :
          'rgba(107, 114, 128, 0.1)'
      };
      color: ${
        props => 
          props.type === 'bias' ? '#d97706' :
          props.type === 'fallacy' ? '#dc2626' :
          props.type === 'manipulation' ? '#dc2626' :
          '#6b7280'
      };
      padding: 2px 8px;
      border-radius: ${borderRadius.sm};
      font-size: ${typography.fontSize.xs};
      font-weight: ${typography.fontWeight.medium};
    }
  }
  
  .position-info {
    margin-top: ${spacing[2]};
    font-size: ${typography.fontSize.xs};
    color: ${colors.text.disabled};
    opacity: 0.7;
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
