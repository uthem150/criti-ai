import styled from '@emotion/styled';
import { colors, spacing, borderRadius, shadows, animations } from '@/styles/design-system';

interface SidebarContainerProps {
  isVisible: boolean;
}

export const SidebarContainer = styled.div<SidebarContainerProps>`
  /* 전역 스타일 리셋 */
  all: initial;
  
  /* 기본 스타일 설정 */
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
  
  /* 폰트 강제 설정 - 네이버 뉴스 등에서 중요 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  color: #111827 !important;
  
  /* 모든 자식 요소에 폰트 상속 강제 */
  * {
    font-family: inherit !important;
    font-size: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
  }
  
  /* 헤딩 요소들 크기 조정 */
  h1, h2, h3, h4, h5, h6 {
    font-family: inherit !important;
    line-height: 1.4 !important;
  }
  
  h3 {
    font-size: 18px !important;
  }
  
  h4 {
    font-size: 16px !important;
  }
  
  /* 버튼 및 인터랙티브 요소들 */
  button, input, select, textarea {
    font-family: inherit !important;
    font-size: inherit !important;
    line-height: inherit !important;
  }
  
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
  
  /* 폰트 상속 보장 */
  font-family: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
  
  * {
    font-family: inherit !important;
    font-size: inherit !important;
    line-height: inherit !important;
  }
`;

export const AnalysisSection = styled.div`
  margin-bottom: ${spacing[6]};
  
  /* 폰트 상속 보장 */
  font-family: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
  
  h4 {
    margin: 0 0 ${spacing[4]} 0;
    color: ${colors.text.primary};
    font-size: 16px !important;
    font-weight: 600;
    font-family: inherit !important;
    line-height: 1.4 !important;
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
  
  /* 새로운 상세 메트릭 스타일 */
  .detailed-metric {
    margin-bottom: ${spacing[5]};
    padding: ${spacing[4]};
    background: ${colors.background.secondary};
    border-radius: ${borderRadius.md};
    border: 1px solid ${colors.border.primary};
    
    &.warning {
      border-color: ${colors.status.warning};
      background: rgba(251, 191, 36, 0.05);
    }
    
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${spacing[3]};
      
      .label {
        font-weight: 600;
        color: ${colors.text.primary};
        font-size: 0.9rem;
      }
      
      .score, .confidence, .count {
        font-weight: 700;
        color: ${colors.primary[600]};
        font-size: 0.9rem;
      }
    }
    
    .metric-details {
      .level-badge, .intensity-badge, .political-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: ${borderRadius.sm};
        font-size: 0.75rem;
        font-weight: 500;
        margin-bottom: ${spacing[2]};
        
        &[data-level="trusted"] {
          background: rgba(34, 197, 94, 0.1);
          color: #059669;
        }
        
        &[data-level="neutral"] {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }
        
        &[data-level="caution"] {
          background: rgba(251, 191, 36, 0.1);
          color: #d97706;
        }
        
        &[data-level="dangerous"] {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }
        
        &[data-intensity="low"] {
          background: rgba(34, 197, 94, 0.1);
          color: #059669;
        }
        
        &[data-intensity="medium"] {
          background: rgba(251, 191, 36, 0.1);
          color: #d97706;
        }
        
        &[data-intensity="high"] {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }
        
        &[data-direction="neutral"], &[data-direction="center"] {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }
        
        &[data-direction="left"] {
          background: rgba(59, 130, 246, 0.1);
          color: #2563eb;
        }
        
        &[data-direction="right"] {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }
      }
      
      .reputation-desc {
        color: ${colors.text.secondary};
        font-size: 0.8rem;
        margin: ${spacing[2]} 0;
        line-height: 1.4;
      }
      
      .reputation-factors {
        display: flex;
        flex-wrap: wrap;
        gap: ${spacing[1]};
        
        .factor-tag {
          font-size: 0.75rem;
          color: ${colors.text.secondary};
          background: rgba(107, 114, 128, 0.1);
          padding: 2px 6px;
          border-radius: ${borderRadius.sm};
        }
      }
      
      .manipulative-words {
        margin-top: ${spacing[2]};
        
        .words-label {
          font-size: 0.75rem;
          color: ${colors.text.secondary};
          margin: 0 0 ${spacing[1]} 0;
        }
        
        .words-list {
          display: flex;
          flex-wrap: wrap;
          gap: ${spacing[1]};
          
          .word-tag {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
            padding: 2px 6px;
            border-radius: ${borderRadius.sm};
            font-size: 0.7rem;
            font-weight: 500;
          }
        }
      }
      
      .fallacy-summary {
        .fallacy-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: ${spacing[2]} 0;
          border-bottom: 1px solid rgba(107, 114, 128, 0.1);
          
          &:last-child {
            border-bottom: none;
          }
          
          .fallacy-type {
            font-size: 0.8rem;
            color: ${colors.text.primary};
            font-weight: 500;
          }
          
          .severity-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            
            &.low {
              background: #22c55e;
            }
            
            &.medium {
              background: #f59e0b;
            }
            
            &.high {
              background: #ef4444;
            }
          }
        }
      }
    }
  }
`;

// 새로운 styled components 추가
export const CloseButtonContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
`;

export const CloseButton = styled.button`
  background: rgba(107, 114, 128, 0.1);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
`;

export const HeaderSection = styled.div`
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
  
  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #0ea5e9;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    margin: 4px 0 0 0;
    font-size: 14px;
    color: #6b7280;
  }
`;

export const WelcomeSection = styled.div`
  padding: 32px 24px;
  text-align: center;
  
  button {
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 16px;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(14, 165, 233, 0.3);
    }
  }
  
  p {
    margin: 0;
    font-size: 14px;
    color: #6b7280;
    line-height: 1.5;
  }
`;

export const LoadingSection = styled.div`
  padding: 32px 24px;
  text-align: center;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #0ea5e9;
    border-radius: 50%;
    margin: 0 auto 16px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  p {
    margin: 0;
    color: #6b7280;
  }
`;

export const ResultsSection = styled.div`
  padding: 0 0 24px 0;
`;
