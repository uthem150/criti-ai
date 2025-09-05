import { css } from '@emotion/react';

export const sidebarStyles = css`
  /* 전역 리셋 및 기본 설정 */
  .criti-ai-sidebar-container {
    all: initial;
    position: fixed;
    top: 0;
    right: -400px;
    width: 400px;
    height: 100vh;
    background: #ffffff;
    border-left: 1px solid #e5e7eb;
    box-shadow: -8px 0 25px rgba(0, 0, 0, 0.15);
    z-index: 999999;
    overflow-y: auto;
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* 폰트 강제 설정 */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    color: #111827 !important;
    
    /* 모든 자식 요소에 폰트 상속 강제 */
    * {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
      box-sizing: border-box !important;
    }
    
    &.open {
      right: 0;
    }
  }
  
  /* 닫기 버튼 */
  .close-button-container {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
  }
  
  .close-button {
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
      transform: scale(1.1);
    }
  }
  
  /* 헤더 섹션 */
  .header-section {
    padding: 24px 24px 16px;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    
    h3 {
      margin: 0 !important;
      font-size: 20px !important;
      font-weight: 700 !important;
      color: #0ea5e9 !important;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: inherit !important;
    }
    
    p {
      margin: 4px 0 0 0 !important;
      font-size: 14px !important;
      color: #6b7280 !important;
      font-family: inherit !important;
    }
  }
  
  /* 에러 섹션 */
  .error-section {
    padding: 24px;
    text-align: center;
    
    .error-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    h3 {
      color: #ef4444 !important;
      margin: 0 0 12px 0 !important;
    }
    
    .error-solutions {
      margin: 20px 0;
      text-align: left;
      background: #fef2f2;
      padding: 16px;
      border-radius: 8px;
      
      h4 {
        color: #dc2626 !important;
        margin: 0 0 8px 0 !important;
        font-size: 14px !important;
      }
      
      ul {
        margin: 0;
        padding-left: 20px;
        
        li {
          font-size: 13px;
          color: #7f1d1d;
          margin-bottom: 4px;
        }
      }
    }
    
    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      
      .error-button {
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        font-size: 13px !important;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit !important;
        
        &.primary {
          background: #0ea5e9;
          color: white;
          
          &:hover {
            background: #0284c7;
          }
        }
        
        &.secondary {
          background: #f3f4f6;
          color: #374151;
          
          &:hover {
            background: #e5e7eb;
          }
        }
      }
    }
  }
  
  /* 웰컴 섹션 */
  .welcome-section {
    padding: 32px 24px;
    text-align: center;
    
    .welcome-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    h3 {
      color: #111827 !important;
      margin: 0 0 12px 0 !important;
      font-size: 18px !important;
    }
    
    p {
      color: #6b7280 !important;
      margin: 0 0 24px 0 !important;
      line-height: 1.6;
    }
    
    .analyze-button {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px !important;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 24px;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
      font-family: inherit !important;
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      width: 100%;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(14, 165, 233, 0.3);
      }
    }
    
    .analysis-features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      
      .feature-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: rgba(14, 165, 233, 0.05);
        border-radius: 6px;
        font-size: 13px;
        color: #374151;
      }
    }
  }
  
  /* 로딩 섹션 */
  .loading-section {
    padding: 32px 24px;
    text-align: center;
    
    .loading-animation {
      margin-bottom: 20px;
      
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top: 3px solid #0ea5e9;
        border-radius: 50%;
        margin: 0 auto 16px;
        animation: spin 1s linear infinite;
      }
      
      .loading-dots {
        display: flex;
        justify-content: center;
        gap: 4px;
        
        span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0ea5e9;
          animation: loadingDots 1.4s ease-in-out infinite both;
          
          &:nth-child(1) { animation-delay: -0.32s; }
          &:nth-child(2) { animation-delay: -0.16s; }
          &:nth-child(3) { animation-delay: 0s; }
        }
      }
    }
    
    h3 {
      color: #111827 !important;
      margin: 0 0 8px 0 !important;
    }
    
    p {
      color: #6b7280 !important;
      margin: 0 0 20px 0 !important;
    }
    
    .analysis-steps {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .step {
        padding: 8px 12px;
        background: #f3f4f6;
        border-radius: 6px;
        font-size: 13px;
        color: #6b7280;
        transition: all 0.3s ease;
        
        &.active {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
          transform: translateX(4px);
        }
      }
    }
  }
  
  /* 결과 섹션 */
  .results-section {
    padding: 0 0 24px 0;
  }
  
  /* 확장 가능한 섹션 */
  .expandable-section {
    margin-bottom: 4px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    
    .section-header {
      width: 100%;
      padding: 16px 20px;
      background: #f9fafb;
      border: none;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: inherit !important;
      transition: all 0.2s ease;
      
      &:hover {
        background: #f3f4f6;
      }
      
      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        
        .section-icon {
          font-size: 18px;
        }
        
        .section-title {
          font-size: 16px !important;
          font-weight: 600;
          color: #111827 !important;
        }
        
        .section-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px !important;
          font-weight: 600;
          color: white;
          background: #0ea5e9;
        }
      }
      
      .expand-arrow {
        color: #6b7280;
        font-size: 12px;
        transition: transform 0.2s ease;
        
        &.expanded {
          transform: rotate(180deg);
        }
      }
    }
    
    .section-content {
      padding: 20px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }
  }
  
  /* 종합 분석 결과 */
  .overview-content {
    .overall-score-display {
      display: flex;
      gap: 20px;
      margin-bottom: 24px;
      align-items: center;
      
      .score-circle {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0ea5e9, #0284c7);
        color: white;
        
        .score-number {
          font-size: 24px !important;
          font-weight: 700;
          margin: 0;
        }
        
        .score-label {
          font-size: 10px !important;
          opacity: 0.9;
          margin: 0;
        }
      }
      
      .score-description {
        flex: 1;
        
        h4 {
          margin: 0 0 8px 0 !important;
          color: #111827 !important;
          font-size: 16px !important;
          font-weight: 600;
        }
        
        p {
          margin: 0 !important;
          color: #6b7280 !important;
          line-height: 1.5;
        }
      }
    }
    
    .detailed-scores {
      h4 {
        margin: 0 0 16px 0 !important;
        color: #111827 !important;
        font-size: 16px !important;
        font-weight: 600;
      }
      
      .score-bars {
        display: flex;
        flex-direction: column;
        gap: 12px;
        
        .score-bar {
          .bar-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            
            .bar-label {
              font-size: 13px;
              color: #374151;
              font-weight: 500;
            }
            
            .bar-value {
              font-size: 13px;
              font-weight: 600;
              color: #0ea5e9;
            }
          }
          
          .bar-track {
            height: 8px;
            background: #f3f4f6;
            border-radius: 4px;
            overflow: hidden;
            
            .bar-fill {
              height: 100%;
              border-radius: 4px;
              transition: width 0.6s ease;
              
              &.source { background: linear-gradient(90deg, #10b981, #059669); }
              &.objectivity { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
              &.logic { background: linear-gradient(90deg, #f59e0b, #d97706); }
              &.advertisement { background: linear-gradient(90deg, #06b6d4, #0891b2); }
              &.evidence { background: linear-gradient(90deg, #84cc16, #65a30d); }
            }
          }
        }
      }
    }
  }
  
  /* 출처 신뢰도 */
  .source-content {
    .trust-level {
      margin-bottom: 16px;
      
      .trust-badge {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px !important;
        font-weight: 600;
        
        &.trusted {
          background: rgba(34, 197, 94, 0.1);
          color: #059669;
        }
        
        &.neutral {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }
        
        &.caution {
          background: rgba(251, 191, 36, 0.1);
          color: #d97706;
        }
        
        &.unreliable {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }
      }
    }
    
    .source-details {
      h4 {
        margin: 0 0 8px 0 !important;
        color: #111827 !important;
        font-size: 15px !important;
        font-weight: 600;
      }
      
      .source-description {
        color: #6b7280 !important;
        margin: 0 0 16px 0 !important;
        line-height: 1.5;
      }
      
      .reputation-factors {
        h5 {
          margin: 0 0 8px 0 !important;
          color: #374151 !important;
          font-size: 13px !important;
          font-weight: 600;
        }
        
        .factor-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          
          .factor-tag {
            font-size: 11px !important;
            color: #6b7280;
            background: rgba(107, 114, 128, 0.1);
            padding: 3px 6px;
            border-radius: 3px;
          }
        }
      }
      
      .historical-data {
        margin-top: 16px;
        
        .historical-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 12px;
          
          .historical-label {
            color: #6b7280;
          }
          
          .historical-value {
            color: #374151;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  /* 편향성 분석 */
  .bias-content {
    .bias-section {
      margin-bottom: 24px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      h4 {
        margin: 0 0 12px 0 !important;
        color: #111827 !important;
        font-size: 15px !important;
        font-weight: 600;
      }
      
      .intensity-display {
        margin-bottom: 16px;
        
        .intensity-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px !important;
          font-weight: 600;
          
          &.none, &.low {
            background: rgba(34, 197, 94, 0.1);
            color: #059669;
          }
          
          &.medium {
            background: rgba(251, 191, 36, 0.1);
            color: #d97706;
          }
          
          &.high {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
          }
        }
      }
      
      .manipulative-words {
        h5 {
          margin: 0 0 12px 0 !important;
          color: #374151 !important;
          font-size: 13px !important;
          font-weight: 600;
        }
        
        .words-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          
          .word-item {
            padding: 12px;
            background: rgba(168, 85, 247, 0.05);
            border-radius: 6px;
            border: 1px solid rgba(168, 85, 247, 0.1);
            
            .word-header {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 8px;
              flex-wrap: wrap;
              
              .word-badge {
                padding: 3px 6px;
                border-radius: 3px;
                font-size: 11px !important;
                font-weight: 600;
                
                &.low {
                  background: rgba(251, 191, 36, 0.2);
                  color: #d97706;
                }
                
                &.medium {
                  background: rgba(239, 68, 68, 0.2);
                  color: #dc2626;
                }
                
                &.high {
                  background: rgba(239, 68, 68, 0.3);
                  color: #991b1b;
                }
              }
              
              .word-category {
                font-size: 10px !important;
                color: #7c3aed;
                background: rgba(124, 58, 237, 0.1);
                padding: 2px 4px;
                border-radius: 3px;
              }
            }
            
            .word-explanation {
              margin: 0 !important;
              color: #6b7280 !important;
              font-size: 12px !important;
              line-height: 1.4;
            }
          }
        }
      }
      
      .clickbait-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
        
        .clickbait-item {
          padding: 12px;
          border-radius: 6px;
          border: 1px solid rgba(168, 85, 247, 0.2);
          
          &.low {
            background: rgba(168, 85, 247, 0.05);
          }
          
          &.medium {
            background: rgba(168, 85, 247, 0.08);
          }
          
          &.high {
            background: rgba(168, 85, 247, 0.12);
          }
          
          .clickbait-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            .clickbait-type {
              font-size: 11px !important;
              color: #7c3aed;
              background: rgba(124, 58, 237, 0.1);
              padding: 2px 6px;
              border-radius: 3px;
              font-weight: 600;
            }
            
            .severity-indicator {
              font-size: 10px !important;
              padding: 2px 4px;
              border-radius: 3px;
              font-weight: 600;
              
              &.low { background: #10b981; color: white; }
              &.medium { background: #f59e0b; color: white; }
              &.high { background: #ef4444; color: white; }
            }
          }
          
          .clickbait-text {
            margin: 4px 0 !important;
            font-size: 12px !important;
            color: #374151 !important;
            font-style: italic;
          }
          
          .clickbait-explanation {
            margin: 0 !important;
            color: #6b7280 !important;
            font-size: 11px !important;
            line-height: 1.4;
          }
        }
      }
      
      .political-bias {
        .political-direction {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          
          .political-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px !important;
            font-weight: 600;
            
            &.left {
              background: rgba(59, 130, 246, 0.1);
              color: #2563eb;
            }
            
            &.right {
              background: rgba(239, 68, 68, 0.1);
              color: #dc2626;
            }
            
            &.center, &.neutral {
              background: rgba(107, 114, 128, 0.1);
              color: #6b7280;
            }
          }
          
          .confidence {
            font-size: 11px !important;
            color: #6b7280;
          }
        }
        
        .political-indicators {
          h5 {
            margin: 0 0 8px 0 !important;
            color: #374151 !important;
            font-size: 13px !important;
            font-weight: 600;
          }
          
          ul {
            margin: 0;
            padding-left: 16px;
            
            li {
              font-size: 12px !important;
              color: #6b7280 !important;
              margin-bottom: 4px;
              line-height: 1.4;
            }
          }
        }
      }
    }
  }
  
  /* 논리적 오류 */
  .logic-content {
    .fallacies-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      .fallacy-item {
        padding: 16px;
        border-radius: 8px;
        border: 1px solid;
        
        &.low {
          border-color: rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.05);
        }
        
        &.medium {
          border-color: rgba(251, 191, 36, 0.3);
          background: rgba(251, 191, 36, 0.05);
        }
        
        &.high {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }
        
        .fallacy-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          .fallacy-type {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .fallacy-icon {
              font-size: 16px;
            }
            
            .fallacy-name {
              font-size: 14px !important;
              font-weight: 600;
              color: #111827 !important;
            }
          }
          
          .severity-badge {
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 10px !important;
            font-weight: 600;
            
            &.low { background: #10b981; color: white; }
            &.medium { background: #f59e0b; color: white; }
            &.high { background: #ef4444; color: white; }
          }
        }
        
        .fallacy-content {
          .fallacy-description {
            margin: 0 0 12px 0 !important;
            color: #374151 !important;
            font-size: 13px !important;
            line-height: 1.5;
          }
          
          .affected-text {
            margin-bottom: 12px;
            
            h5 {
              margin: 0 0 6px 0 !important;
              color: #374151 !important;
              font-size: 12px !important;
              font-weight: 600;
            }
            
            blockquote {
              margin: 0;
              padding: 8px 12px;
              background: rgba(107, 114, 128, 0.1);
              border-left: 3px solid #6b7280;
              border-radius: 4px;
              font-size: 12px !important;
              color: #374151 !important;
              font-style: italic;
            }
          }
          
          .fallacy-explanation {
            margin-bottom: 12px;
            
            h5 {
              margin: 0 0 6px 0 !important;
              color: #374151 !important;
              font-size: 12px !important;
              font-weight: 600;
            }
            
            p {
              margin: 0 !important;
              color: #6b7280 !important;
              font-size: 12px !important;
              line-height: 1.5;
            }
          }
          
          .fallacy-examples {
            h5 {
              margin: 0 0 6px 0 !important;
              color: #374151 !important;
              font-size: 12px !important;
              font-weight: 600;
            }
            
            ul {
              margin: 0;
              padding-left: 16px;
              
              li {
                font-size: 11px !important;
                color: #6b7280 !important;
                margin-bottom: 3px;
                line-height: 1.4;
              }
            }
          }
        }
      }
    }
  }
  
  /* 광고성 분석 */
  .advertisement-content {
    .ad-overview {
      margin-bottom: 20px;
      
      .ad-status {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        
        .ad-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px !important;
          font-weight: 600;
          
          &.advertorial {
            background: rgba(251, 191, 36, 0.1);
            color: #d97706;
          }
          
          &.non-advertorial {
            background: rgba(34, 197, 94, 0.1);
            color: #059669;
          }
        }
        
        .ad-confidence {
          font-size: 11px !important;
          color: #6b7280;
        }
      }
      
      .ad-scores {
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        .ad-score-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .score-label {
            font-size: 12px !important;
            color: #6b7280;
          }
          
          .score-value {
            font-size: 12px !important;
            font-weight: 600;
            color: #0ea5e9;
          }
        }
      }
    }
    
    .ad-indicators {
      h4 {
        margin: 0 0 12px 0 !important;
        color: #111827 !important;
        font-size: 15px !important;
        font-weight: 600;
      }
      
      .indicators-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
        
        .indicator-item {
          padding: 12px;
          border-radius: 6px;
          border: 1px solid rgba(6, 182, 212, 0.2);
          background: rgba(6, 182, 212, 0.05);
          
          .indicator-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            .indicator-type {
              font-size: 11px !important;
              color: #0891b2;
              background: rgba(6, 182, 212, 0.1);
              padding: 2px 6px;
              border-radius: 3px;
              font-weight: 600;
            }
            
            .indicator-weight {
              font-size: 10px !important;
              color: #6b7280;
            }
          }
          
          .indicator-evidence {
            margin-bottom: 8px;
            
            h5 {
              margin: 0 0 4px 0 !important;
              color: #374151 !important;
              font-size: 11px !important;
              font-weight: 600;
            }
          }
          
          .indicator-explanation {
            h5 {
              margin: 0 0 4px 0 !important;
              color: #374151 !important;
              font-size: 11px !important;
              font-weight: 600;
            }
            
            p {
              margin: 0 !important;
              color: #6b7280 !important;
              font-size: 11px !important;
              line-height: 1.4;
            }
          }
        }
      }
    }
  }
  
  /* 교차 검증 */
  .crossref-content {
    .key-claims {
      margin-bottom: 20px;
      
      h4 {
        margin: 0 0 12px 0 !important;
        color: #111827 !important;
        font-size: 15px !important;
        font-weight: 600;
      }
      
      .claims-list {
        margin: 0;
        padding: 0;
        list-style: none;
        
        .claim-item {
          padding: 8px 0;
          border-bottom: 1px solid rgba(16, 185, 129, 0.1);
          font-size: 12px !important;
          
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    
    .search-keywords {
      margin-bottom: 20px;
      
      h4 {
        margin: 0 0 8px 0 !important;
        color: #111827 !important;
        font-size: 15px !important;
        font-weight: 600;
      }
      
      .keywords-box {
        padding: 8px 12px;
        background: rgba(14, 165, 233, 0.1);
        border-radius: 6px;
        font-size: 12px !important;
        color: #0ea5e9;
        font-weight: 500;
      }
    }
    
    .fact-check-sources {
      margin-bottom: 20px;
      
      h4 {
        margin: 0 0 12px 0 !important;
        color: #111827 !important;
        font-size: 15px !important;
        font-weight: 600;
      }
      
      .sources-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
        
        .fact-check-item {
          padding: 12px;
          border-radius: 6px;
          border: 1px solid rgba(34, 197, 94, 0.2);
          background: rgba(34, 197, 94, 0.05);
          
          .source-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            .source-org {
              font-size: 12px !important;
              font-weight: 600;
              color: #374151 !important;
            }
            
            .verdict-badge {
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 10px !important;
              font-weight: 600;
              
              &.true { background: #10b981; color: white; }
              &.false { background: #ef4444; color: white; }
              &.mixed { background: #f59e0b; color: white; }
              &.unverified { background: #6b7280; color: white; }
            }
          }
          
          .source-summary {
            margin: 0 0 8px 0 !important;
            color: #6b7280 !important;
            font-size: 11px !important;
            line-height: 1.4;
          }
          
          .source-link {
            font-size: 11px !important;
            color: #0ea5e9;
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
    
    .consensus-display {
      text-align: center;
      
      h4 {
        margin: 0 0 12px 0 !important;
        color: #111827 !important;
        font-size: 15px !important;
        font-weight: 600;
      }
      
      .consensus-badge {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px !important;
        font-weight: 600;
        
        &.agree {
          background: rgba(34, 197, 94, 0.1);
          color: #059669;
        }
        
        &.disagree {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }
        
        &.mixed, &.insufficient {
          background: rgba(251, 191, 36, 0.1);
          color: #d97706;
        }
      }
    }
  }
  
  /* 분석 팁 */
  .analysis-tips {
    margin-top: 24px;
    padding: 20px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 8px;
    border: 1px solid rgba(14, 165, 233, 0.2);
    
    h4 {
      margin: 0 0 16px 0 !important;
      color: #0c4a6e !important;
      font-size: 15px !important;
      font-weight: 600;
      text-align: center;
    }
    
    .tips-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .tip-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        
        .tip-icon {
          font-size: 16px;
          margin-top: 2px;
        }
        
        p {
          margin: 0 !important;
          color: #0f172a !important;
          font-size: 12px !important;
          line-height: 1.5;
          flex: 1;
        }
      }
    }
  }
  
  /* 애니메이션 */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes loadingDots {
    0%, 80%, 100% { 
      transform: scale(0);
      opacity: 0.5;
    }
    40% { 
      transform: scale(1);
      opacity: 1;
    }
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .criti-ai-sidebar-container {
      width: 100vw;
      right: -100vw;
      
      &.open {
        right: 0;
      }
    }
  }
`;
