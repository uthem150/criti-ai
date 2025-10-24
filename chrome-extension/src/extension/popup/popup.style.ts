import styled from '@emotion/styled';
import { colors, spacing, borderRadius, typography, shadows, animations } from '@/styles/design-system';

export const PopupContainer = styled.div`
  padding: ${spacing[5]};
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  background: ${colors.background.primary};
`;

export const Header = styled.div`
  margin-bottom: ${spacing[5]};
  
  h2 {
    margin: 0 0 ${spacing[2]} 0;
    color: ${colors.primary[600]};
    font-size: ${typography.fontSize['2xl']};
    font-weight: ${typography.fontWeight.bold};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[2]};
  }
  
  p {
    margin: 0;
    color: ${colors.text.secondary};
    font-size: ${typography.fontSize.sm};
  }
`;

export const GuideSection = styled.div`
  margin-bottom: ${spacing[5]};
  flex: 1;
`;

export const GuideCard = styled.div`
  background: ${colors.background.secondary};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.lg};
  margin-bottom: ${spacing[4]};
  box-shadow: ${shadows.sm};
  
  h3 {
    margin: 0 0 ${spacing[2]} 0;
    font-size: ${typography.fontSize.base};
    color: ${colors.text.primary};
    display: flex;
    align-items: center;
    gap: ${spacing[2]};
  }
  
  ol {
    text-align: left;
    font-size: ${typography.fontSize.sm};
    color: ${colors.text.primary};
    padding-left: ${spacing[5]};
    margin: 0;
    line-height: ${typography.lineHeight.relaxed};
    
    li {
      margin-bottom: ${spacing[1]};
    }
  }
`;

export const StatusText = styled.div`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.disabled};
  line-height: ${typography.lineHeight.normal};
  margin-bottom: ${spacing[5]};
`;

export const ActionButton = styled.button`
  background: ${colors.primary[500]};
  color: white;
  border: none;
  padding: ${spacing[2]} ${spacing[4]};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  transition: all ${animations.transition.normal};
  
  &:hover {
    background: ${colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: ${shadows.md};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const FeaturesList = styled.div`
  display: grid;
  gap: ${spacing[3]};
  margin-top: ${spacing[4]};
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  padding: ${spacing[3]};
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.md};
  text-align: left;
  
  .icon {
    font-size: 1.5rem;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: ${typography.fontWeight.medium};
      color: ${colors.text.primary};
      margin-bottom: 2px;
    }
    
    .description {
      font-size: ${typography.fontSize.xs};
      color: ${colors.text.secondary};
      margin: 0;
    }
  }
`;
