import styled from '@emotion/styled';
import { colors, spacing, borderRadius, shadows, animations } from '../../../styles/design-system';

interface SidebarContainerProps {
  isVisible: boolean;
}

export const SidebarContainer = styled.div<SidebarContainerProps>`
  position: fixed;
  top: 0;
  right: ${props => props.isVisible ? '0' : '-400px'};
  width: 400px;
  height: 100vh;
  background: ${colors.background.primary};
  border-left: 1px solid ${colors.border.primary};
  box-shadow: ${shadows.lg};
  z-index: 999999;
  padding: ${spacing[6]};
  overflow-y: auto;
  transition: right ${animations.transition.normal};
  
  .header {
    margin-bottom: ${spacing[6]};
    border-bottom: 1px solid ${colors.border.primary};
    padding-bottom: ${spacing[4]};
    
    h3 {
      margin: 0 0 ${spacing[2]} 0;
      color: ${colors.primary[600]};
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    p {
      margin: 0;
      color: ${colors.text.secondary};
      font-size: 0.875rem;
    }
  }
  
  .analyze-prompt {
    text-align: center;
    padding: ${spacing[8]} ${spacing[4]};
    
    .analyze-button {
      background: ${colors.primary[500]};
      color: white;
      border: none;
      padding: ${spacing[3]} ${spacing[6]};
      border-radius: ${borderRadius.md};
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: ${spacing[4]};
      transition: all ${animations.transition.normal};
      
      &:hover {
        background: ${colors.primary[600]};
        transform: translateY(-1px);
      }
    }
    
    .description {
      color: ${colors.text.secondary};
      font-size: 0.875rem;
      line-height: 1.4;
      margin: 0;
    }
  }
  
  .loading {
    text-align: center;
    padding: ${spacing[8]} ${spacing[4]};
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid ${colors.border.primary};
      border-top: 3px solid ${colors.primary[500]};
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto ${spacing[4]} auto;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    p {
      color: ${colors.text.secondary};
      margin: 0;
    }
  }
`;

export const ScoreDisplay = styled.div`
  margin-bottom: ${spacing[6]};
  padding: ${spacing[4]};
  background: ${colors.background.secondary};
  border-radius: ${borderRadius.lg};
`;

export const AnalysisSection = styled.div`
  margin-bottom: ${spacing[6]};
  
  h4 {
    margin: 0 0 ${spacing[4]} 0;
    color: ${colors.text.primary};
    font-size: 1rem;
    font-weight: 600;
  }
  
  .metric {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${spacing[3]} 0;
    border-bottom: 1px solid ${colors.border.primary};
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: ${colors.text.secondary};
      font-size: 0.875rem;
    }
    
    .value {
      font-weight: 500;
      color: ${colors.text.primary};
    }
    
    &.warning .value {
      color: ${colors.status.warning};
    }
  }
`;
