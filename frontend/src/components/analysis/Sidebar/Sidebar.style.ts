import styled from '@emotion/styled';

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
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  box-shadow: -8px 0 25px rgba(0, 0, 0, 0.15);
  z-index: 999999;
  padding: 24px;
  overflow-y: auto;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 폰트 강제 설정 - 네이버 뉴스 등에서 중요 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  color: #111827 !important;
  
  /* 모든 자식 요소에 폰트 상속 강제 */
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
    box-sizing: border-box !important;
  }
  
  /* 헤딩 요소들 크기 조정 */
  h1, h2, h3, h4, h5, h6 {
    font-family: inherit !important;
    line-height: 1.4 !important;
    color: #111827 !important;
  }
  
  h3 {
    font-size: 18px !important;
  }
  
  h4 {
    font-size: 16px !important;
  }
  
  h5 {
    font-size: 14px !important;
  }
  
  /* 버튼 및 인터랙티브 요소들 */
  button, input, select, textarea {
    font-family: inherit !important;
    font-size: inherit !important;
    line-height: inherit !important;
  }
  
  /* 기본 텍스트 요소들 */
  p, span, div {
    font-family: inherit !important;
    color: inherit !important;
  }
`;

export const ScoreDisplay = styled.div`
  margin-bottom: 24px;
  
  /* 폰트 상속 보장 */
  font-family: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
  
  * {
    font-family: inherit !important;
  }
`;

export const AnalysisSection = styled.div`
  margin-bottom: 24px;
  
  /* 폰트 상속 보장 */
  font-family: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
  
  h4 {
    margin: 0 0 16px 0;
    color: #111827;
    font-size: 16px !important;
    font-weight: 600;
    font-family: inherit !important;
    line-height: 1.4 !important;
  }
  
  /* 분석 요약 스타일 */
  .analysis-summary {
    margin-bottom: 20px;
    padding: 16px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 8px;
    border-left: 4px solid #0ea5e9;
    
    h4 {
      margin: 0 0 8px 0;
      color: #0c4a6e;
    }
    
    .summary-text {
      margin: 0;
      color: #0f172a;
      font-size: 14px;
      line-height: 1.5;
      font-weight: 500;
    }
  }
  
  /* 새로운 상세 메트릭 스타일 */
  .detailed-metric {
    margin-bottom: 20px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    
    &.warning {
      border-color: #f59e0b;
      background: rgba(251, 191, 36, 0.05);
    }
    
    &.advertisement {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.05);
    }
    
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .label {
        font-weight: 600;
        color: #111827;
        font-size: 14px;
      }
      
      .score, .confidence, .count {
        font-weight: 700;
        color: #0ea5e9;
        font-size: 14px;
      }
    }
    
    .metric-details {
      .level-badge, .intensity-badge, .political-badge, .ad-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 8px;
        
        &[data-level="trusted"], &.safe {
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
        
        &[data-level="unreliable"], &.warning {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }
        
        &[data-intensity="none"] {
          background: rgba(34, 197, 94, 0.1);
          color: #059669;
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
        color: #6b7280;
        font-size: 13px;
        margin: 8px 0;
        line-height: 1.4;
      }
      
      .reputation-factors {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 8px;
        
        .factor-tag {
          font-size: 11px;
          color: #6b7280;
          background: rgba(107, 114, 128, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
      
      .historical-reliability {
        margin-top: 8px;
        
        small {
          color: #9ca3af;
          font-size: 11px;
        }
      }
      
      /* 조작적 단어 상세 스타일 */
      .manipulative-words {
        margin-top: 12px;
        
        .words-label {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 8px 0;
          font-weight: 500;
        }
        
        .words-list {
          .word-item {
            margin-bottom: 10px;
            
            .word-tag {
              display: inline-block;
              padding: 3px 6px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 500;
              margin-bottom: 4px;
              
              &.low {
                background: rgba(251, 191, 36, 0.1);
                color: #d97706;
              }
              
              &.medium {
                background: rgba(239, 68, 68, 0.15);
                color: #dc2626;
              }
              
              &.high {
                background: rgba(239, 68, 68, 0.2);
                color: #991b1b;
                font-weight: 600;
              }
            }
            
            .word-details {
              margin-top: 4px;
              padding-left: 8px;
              
              .word-category {
                font-size: 10px;
                color: #9ca3af;
                margin-bottom: 2px;
                display: block;
              }
              
              .word-explanation {
                font-size: 11px;
                color: #6b7280;
                line-height: 1.3;
                margin: 0;
              }
            }
          }
        }
      }
      
      /* 클릭베이트 요소 스타일 */
      .clickbait-elements {
        margin-top: 12px;
        
        .elements-label {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 8px 0;
          font-weight: 500;
        }
        
        .clickbait-item {
          margin-bottom: 10px;
          padding: 8px;
          background: rgba(168, 85, 247, 0.05);
          border-radius: 6px;
          border: 1px solid rgba(168, 85, 247, 0.2);
          
          .clickbait-type {
            display: inline-block;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 4px;
            margin-bottom: 4px;
            
            &.low {
              background: rgba(168, 85, 247, 0.1);
              color: #7c3aed;
            }
            
            &.medium {
              background: rgba(168, 85, 247, 0.15);
              color: #6d28d9;
            }
            
            &.high {
              background: rgba(168, 85, 247, 0.2);
              color: #5b21b6;
            }
          }
          
          .clickbait-text {
            font-size: 12px;
            color: #374151;
            margin: 4px 0;
            font-style: italic;
          }
          
          .clickbait-explanation {
            font-size: 11px;
            color: #6b7280;
            margin: 0;
            line-height: 1.3;
          }
        }
      }
      
      /* 정치적 편향 지표 스타일 */
      .political-indicators {
        margin-top: 12px;
        
        .indicators-label {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 8px 0;
          font-weight: 500;
        }
        
        .indicators-list {
          .indicator-tag {
            display: block;
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 4px;
          }
        }
      }
      
      /* 논리적 오류 미리보기 스타일 */
      .fallacy-summary {
        .fallacy-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(107, 114, 128, 0.1);
          
          &:last-child {
            border-bottom: none;
          }
          
          .fallacy-type {
            font-size: 12px;
            color: #374151;
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
      
      /* 교차 검증 스타일 */
      .key-claims {
        margin-top: 12px;
        
        .claims-label {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 8px 0;
          font-weight: 500;
        }
        
        .claims-list {
          margin: 0;
          padding-left: 16px;
          
          li {
            font-size: 12px;
            color: #374151;
            line-height: 1.4;
            margin-bottom: 4px;
          }
        }
      }
      
      .search-keywords {
        margin-top: 12px;
        
        .keywords-label {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 4px 0;
          font-weight: 500;
        }
        
        .keywords {
          font-size: 12px;
          color: #0ea5e9;
          font-weight: 500;
          padding: 4px 8px;
          background: rgba(14, 165, 233, 0.1);
          border-radius: 4px;
          display: inline-block;
        }
      }
      
      /* 팩트체크 소스 스타일 (새로 추가) */
      .fact-check-sources {
        margin-top: 12px;
        
        .sources-label {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 8px 0;
          font-weight: 500;
        }
        
        .fact-check-item {
          margin-bottom: 8px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 6px;
          border: 1px solid rgba(34, 197, 94, 0.2);
          
          .source-org {
            font-size: 11px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 4px;
          }
          
          .verdict {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            margin-bottom: 4px;
            
            &.true {
              background: rgba(34, 197, 94, 0.1);
              color: #059669;
            }
            
            &.false {
              background: rgba(239, 68, 68, 0.1);
              color: #dc2626;
            }
            
            &.mixed {
              background: rgba(251, 191, 36, 0.1);
              color: #d97706;
            }
            
            &.unverified {
              background: rgba(107, 114, 128, 0.1);
              color: #6b7280;
            }
          }
          
          .source-summary {
            font-size: 11px;
            color: #6b7280;
            line-height: 1.3;
          }
        }
      }
    }
  }
`;

// 기존 styled components
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
  font-family: inherit !important;
  
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
    font-size: 20px !important;
    font-weight: 700;
    color: #0ea5e9;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: inherit !important;
  }
  
  p {
    margin: 4px 0 0 0;
    font-size: 14px !important;
    color: #6b7280;
    font-family: inherit !important;
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
    font-size: 16px !important;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 16px;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
    font-family: inherit !important;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(14, 165, 233, 0.3);
    }
  }
  
  p {
    margin: 0;
    font-size: 14px !important;
    color: #6b7280;
    line-height: 1.5;
    font-family: inherit !important;
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
    font-family: inherit !important;
    font-size: 14px !important;
  }
  
  small {
    font-family: inherit !important;
  }
`;

export const ResultsSection = styled.div`
  padding: 0 0 24px 0;
`;
