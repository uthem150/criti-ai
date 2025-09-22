import { createRoot } from "react-dom/client";
import { ContentScriptApp } from "../../components/ContentScriptApp";
import { debugCommands } from "../../utils/debugUtils";

// Shadow DOM용 완전히 격리된 CSS - 전면 재설계
const getShadowCSS = () => `
  /* 완전 초기화 및 기본 폰트 설정 */
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #111827;
    letter-spacing: -0.01em;
    box-sizing: border-box;
  }
  
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
    box-sizing: border-box !important;
  }

  /* 사이드바 기본 컨테이너 */
  .criti-ai-sidebar-container {
    position: fixed;
    top: 0;
    right: -420px;
    width: 420px;
    height: 100vh;
    z-index: 999999;
    background: #ffffff;
    border-left: 1px solid #e5e7eb;
    box-shadow: -12px 0 40px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    transition: right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    font-size: 14px;
    line-height: 1.6;
    color: #111827;
    padding: 0;
  }

  .criti-ai-sidebar-container.open {
    right: 0px;
  }

  /* 사이드바 스크롤바 커스터마이징 */
  .criti-ai-sidebar-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .criti-ai-sidebar-container::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  .criti-ai-sidebar-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  .criti-ai-sidebar-container::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* 닫기 버튼 */
  .close-button-container {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
  }

  .close-button {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 16px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: inherit !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .close-button:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    transform: scale(1.1);
  }

  /* 헤더 섹션 */
  .header-section {
    padding: 14px 10px;
    background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
    color: white;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 15px;
    height: 10vh;
  }
  
  .header-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%);
    background-size: 20px 20px;
    opacity: 0.3;
  }
  
  .header-section h3 {
    margin: 0 0 4px 0;
    font-size: 24px !important;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: inherit !important;
    position: relative;
    z-index: 1;
  }
  
  .header-section p {
    margin: 0;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.9);
    font-family: inherit !important;
    position: relative;
    z-index: 1;
  }

  /* 에러 섹션 */
  .error-section {
    padding: 32px 24px;
    text-align: center;
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
  }
  
  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .error-section h3 {
    margin: 0 0 12px 0;
    color: #dc2626;
    font-size: 20px;
    font-weight: 600;
  }
  
  .error-section p {
    margin: 0 0 20px 0;
    font-size: 14px;
    line-height: 1.6;
    color: #991b1b;
  }
  
  .error-solutions {
    background: rgba(239, 68, 68, 0.05);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    text-align: left;
  }
  
  .error-solutions h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #991b1b;
    font-weight: 600;
  }
  
  .error-solutions ul {
    margin: 0;
    padding-left: 16px;
    color: #7f1d1d;
  }
  
  .error-solutions li {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 4px;
  }
  
  .error-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  
  .error-button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .error-button.primary {
    background: linear-gradient(135deg, #dc2626, #991b1b);
    color: white;
  }
  
  .error-button.secondary {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
  }
  
  .error-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  /* 환영 섹션 */
  .welcome-section {
    min-height: 90vh;
    padding: 32px 24px;
    text-align: center;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  }
  
  .welcome-icon {
    font-size: 56px;
    margin-bottom: 16px;
    display: block;
  }
  
  .welcome-section h3 {
    margin: 0 0 12px 0;
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
  }
  
  .welcome-section p {
    margin: 0 0 24px 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.6;
  }
  
  .analyze-button {
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 24px;
    transition: all 0.3s;
    box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: fit-content;
    margin: 0 auto 24px;
  }
  
  .analyze-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4);
  }
  
  .button-icon {
    font-size: 18px;
  }
  
  .analysis-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 24px;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #475569;
  }
  
  .feature-icon {
    font-size: 16px;
  }

  /* 로딩 섹션 */
  .loading-section {
    padding: 32px 24px;
    text-align: center;
    background: linear-gradient(135deg, #f0f9ff, #dbeafe);
  }
  
  .loading-animation {
    position: relative;
    margin-bottom: 24px;
  }
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e0f2fe;
    border-top: 4px solid #0ea5e9;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-dots {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: 16px;
  }
  
  .loading-dots span {
    width: 8px;
    height: 8px;
    background: #0ea5e9;
    border-radius: 50%;
    animation: pulse 1.4s ease-in-out infinite both;
  }
  
  .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
  .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
  .loading-dots span:nth-child(3) { animation-delay: 0s; }
  
  @keyframes pulse {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  
  .loading-section h3 {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #0c4a6e;
  }
  
  .loading-section p {
    margin: 0 0 20px 0;
    color: #0369a1;
    font-size: 14px;
  }
  
  .analysis-steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  
  .step {
    padding: 8px 16px;
    background: rgba(14, 165, 233, 0.1);
    border-radius: 20px;
    font-size: 12px;
    color: #0369a1;
    transition: all 0.3s;
  }
  
  .step.active {
    background: rgba(14, 165, 233, 0.2);
    color: #0c4a6e;
    font-weight: 500;
  }

  /* 결과 섹션 */
  .results-section {
    padding: 20px;
  }

  /* 접을 수 있는 섹션 */
  .expandable-section {
    margin-bottom: 16px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: white;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }
  
  .expandable-section:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .section-header {
    width: 100%;
    padding: 16px 20px;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    transition: all 0.2s;
    font-family: inherit;
  }
  
  .section-header:hover {
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .section-icon {
    font-size: 18px;
  }
  
  .section-title {
    font-weight: 600;
    color: #1e293b;
  }
  
  .section-badge {
    background: #0ea5e9;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }
  
  .expand-arrow {
    font-size: 12px;
    color: #64748b;
    transition: transform 0.2s;
    transform: rotate(-90deg);
  }
  
  .expand-arrow.expanded {
    transform: rotate(0deg);
  }
  
  .section-content {
    padding: 20px;
    border-top: 1px solid #e2e8f0;
    animation: slideDown 0.3s ease;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 1000px;
    }
  }

  /* 종합 분석 결과 섹션 */
  .overview-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .overall-score-display {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
    border-radius: 12px;
    border: 1px solid #0ea5e9;
  }
  
  .score-circle {
    flex-shrink: 0;
    text-align: center;
  }
  
  .score-number {
    font-size: 48px;
    font-weight: 700;
    background: linear-gradient(135deg, #0ea5e9, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }
  
  .score-label {
    font-size: 12px;
    color: #0369a1;
    font-weight: 500;
    margin-top: 4px;
  }
  
  .score-description {
    flex: 1;
  }
  
  .score-description h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #0c4a6e;
    font-weight: 600;
  }
  
  .score-description p {
    margin: 0;
    font-size: 14px;
    color: #0369a1;
    line-height: 1.5;
  }
  
  .detailed-scores h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #1e293b;
    font-weight: 600;
  }
  
  .score-bars {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .score-bar {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .bar-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .bar-label {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
  }
  
  .bar-value {
    font-size: 13px;
    color: #1e293b;
    font-weight: 600;
  }
  
  .bar-track {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .bar-fill.source { background: linear-gradient(90deg, #10b981, #059669); }
  .bar-fill.objectivity { background: linear-gradient(90deg, #3b82f6, #2563eb); }
  .bar-fill.logic { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
  .bar-fill.advertisement { background: linear-gradient(90deg, #f59e0b, #d97706); }
  .bar-fill.evidence { background: linear-gradient(90deg, #ef4444, #dc2626); }

  /* 출처 신뢰도 섹션 */
  .source-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .trust-level {
    display: flex;
    justify-content: center;
  }
  
  .trust-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
  }
  
  .trust-badge.trusted {
    background: rgba(34, 197, 94, 0.1);
    color: #059669;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }
  
  .trust-badge.neutral {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
    border: 1px solid rgba(107, 114, 128, 0.3);
  }
  
  .trust-badge.caution {
    background: rgba(251, 191, 36, 0.1);
    color: #d97706;
    border: 1px solid rgba(251, 191, 36, 0.3);
  }
  
  .trust-badge.unreliable {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  .source-details h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #1e293b;
    font-weight: 600;
  }
  
  .source-description {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
  }
  
  .reputation-factors h5 {
    margin: 0 0 8px 0;
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }
  
  .factor-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .factor-tag {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
  }
  
  .historical-data {
    background: #f8fafc;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
  
  .historical-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  
  .historical-item:last-child {
    margin-bottom: 0;
  }
  
  .historical-label {
    font-size: 12px;
    color: #64748b;
  }
  
  .historical-value {
    font-size: 12px;
    color: #1e293b;
    font-weight: 500;
  }

  /* 편향성 분석 섹션 */
  .bias-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .bias-section {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    background: #fafafa;
  }
  
  .bias-section h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
  }
  
  .intensity-display {
    margin-bottom: 16px;
  }
  
  .intensity-badge {
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .intensity-badge.none, .intensity-badge.low {
    background: rgba(34, 197, 94, 0.1);
    color: #059669;
  }
  
  .intensity-badge.medium {
    background: rgba(251, 191, 36, 0.1);
    color: #d97706;
  }
  
  .intensity-badge.high {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
  
  .manipulative-words h5 {
    margin: 0 0 12px 0;
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }
  
  .words-grid {
    display: grid;
    gap: 12px;
  }
  
  .word-item {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
  }
  
  .word-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .word-badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .word-badge.low {
    background: rgba(251, 191, 36, 0.1);
    color: #d97706;
  }
  
  .word-badge.medium {
    background: rgba(239, 68, 68, 0.15);
    color: #dc2626;
  }
  
  .word-badge.high {
    background: rgba(239, 68, 68, 0.2);
    color: #991b1b;
  }
  
  .word-category {
    font-size: 10px;
    color: #6b7280;
    padding: 2px 6px;
    background: rgba(107, 114, 128, 0.1);
    border-radius: 4px;
  }
  
  .word-explanation {
    font-size: 11px;
    color: #475569;
    line-height: 1.4;
    margin: 0;
  }

  /* 클릭베이트 요소 */
  .clickbait-grid {
    display: grid;
    gap: 12px;
  }
  
  .clickbait-item {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
  }
  
  .clickbait-item.high {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.02);
  }
  
  .clickbait-item.medium {
    border-color: #f59e0b;
    background: rgba(251, 191, 36, 0.02);
  }
  
  .clickbait-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .clickbait-type {
    font-size: 12px;
    font-weight: 500;
    color: #1e293b;
  }
  
  .severity-indicator {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
  }
  
  .severity-indicator.high {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
  
  .severity-indicator.medium {
    background: rgba(251, 191, 36, 0.1);
    color: #d97706;
  }
  
  .severity-indicator.low {
    background: rgba(34, 197, 94, 0.1);
    color: #059669;
  }
  
  .clickbait-text {
    font-size: 12px;
    color: #374151;
    margin: 4px 0;
    font-style: italic;
    padding: 4px 8px;
    background: rgba(107, 114, 128, 0.05);
    border-radius: 4px;
  }
  
  .clickbait-explanation {
    font-size: 11px;
    color: #6b7280;
    margin: 0;
    line-height: 1.4;
  }

  /* 정치적 편향 */
  .political-bias {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
  }
  
  .political-direction {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .political-badge {
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .political-badge.left {
    background: rgba(59, 130, 246, 0.1);
    color: #2563eb;
  }
  
  .political-badge.right {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
  
  .political-badge.center, .political-badge.neutral {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
  }
  
  .confidence {
    font-size: 11px;
    color: #6b7280;
  }
  
  .political-indicators h5 {
    margin: 0 0 8px 0;
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
  }
  
  .political-indicators ul {
    margin: 0;
    padding-left: 16px;
    list-style-type: none;
  }
  
  .political-indicators li {
    font-size: 11px;
    color: #475569;
    margin-bottom: 4px;
    position: relative;
  }
  
  .political-indicators li::before {
    content: '•';
    color: #94a3b8;
    position: absolute;
    left: -12px;
  }

  /* 논리적 오류 섹션 */
  .logic-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .fallacies-grid {
    display: grid;
    gap: 16px;
  }
  
  .fallacy-item {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    transition: all 0.2s;
  }
  
  .fallacy-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .fallacy-item.high {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.02);
  }
  
  .fallacy-item.medium {
    border-color: #f59e0b;
    background: rgba(251, 191, 36, 0.02);
  }
  
  .fallacy-item.low {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.02);
  }
  
  .fallacy-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .fallacy-type {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .fallacy-icon {
    font-size: 16px;
  }
  
  .fallacy-name {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
  }
  
  .severity-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 500;
  }
  
  .severity-badge.high {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
  
  .severity-badge.medium {
    background: rgba(251, 191, 36, 0.1);
    color: #d97706;
  }
  
  .severity-badge.low {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
  }
  
  .fallacy-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .fallacy-description {
    font-size: 13px;
    color: #475569;
    line-height: 1.5;
    margin: 0;
  }
  
  .affected-text h5, .fallacy-explanation h5, .fallacy-examples h5 {
    margin: 0 0 6px 0;
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
  }
  
  .affected-text blockquote {
    margin: 0;
    padding: 8px 12px;
    background: rgba(107, 114, 128, 0.05);
    border-left: 3px solid #94a3b8;
    border-radius: 4px;
    font-size: 12px;
    color: #374151;
    font-style: italic;
  }
  
  .fallacy-explanation p {
    margin: 0;
    font-size: 12px;
    color: #475569;
    line-height: 1.5;
  }
  
  .fallacy-examples ul {
    margin: 0;
    padding-left: 16px;
    list-style-type: none;
  }
  
  .fallacy-examples li {
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 4px;
    position: relative;
  }
  
  .fallacy-examples li::before {
    content: '•';
    color: #94a3b8;
    position: absolute;
    left: -12px;
  }

  /* 광고성 분석 섹션 */
  .advertisement-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .ad-overview {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
  }
  
  .ad-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .ad-badge {
    padding: 8px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .ad-badge.advertorial {
    background: rgba(251, 191, 36, 0.1);
    color: #d97706;
    border: 1px solid rgba(251, 191, 36, 0.3);
  }
  
  .ad-badge.non-advertorial {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  
  .ad-confidence {
    font-size: 11px;
    color: #6b7280;
  }
  
  .ad-scores {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .ad-score-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .score-label {
    font-size: 12px;
    color: #64748b;
  }
  
  .score-value {
    font-size: 12px;
    color: #1e293b;
    font-weight: 600;
  }
  
  .ad-indicators h4 {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #1e293b;
    font-weight: 600;
  }
  
  .indicators-grid {
    display: grid;
    gap: 12px;
  }
  
  .indicator-item {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    transition: all 0.2s;
  }
  
  .indicator-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .indicator-item[class*="weight-"]:nth-child(odd) {
    border-left: 3px solid #f59e0b;
  }
  
  .indicator-item[class*="weight-"]:nth-child(even) {
    border-left: 3px solid #ef4444;
  }
  
  .indicator-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .indicator-type {
    font-size: 12px;
    font-weight: 500;
    color: #1e293b;
  }
  
  .indicator-weight {
    font-size: 10px;
    color: #6b7280;
    background: rgba(107, 114, 128, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
  }
  
  .indicator-evidence h5, .indicator-explanation h5 {
    margin: 0 0 6px 0;
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
  }
  
  .indicator-evidence p, .indicator-explanation p {
    margin: 0;
    font-size: 11px;
    color: #475569;
    line-height: 1.4;
  }
  
  .indicator-evidence p {
    background: rgba(107, 114, 128, 0.05);
    padding: 6px 8px;
    border-radius: 4px;
    font-style: italic;
  }

  /* 교차 검증 섹션 */
  .crossref-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .key-claims h4, .search-keywords h4, .fact-check-sources h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #1e293b;
    font-weight: 600;
  }
  
  .claims-list {
    margin: 0;
    padding-left: 16px;
    list-style-type: none;
  }
  
  .claim-item {
    font-size: 13px;
    color: #475569;
    margin-bottom: 8px;
    position: relative;
    line-height: 1.5;
    padding-left: 5px;
  }
  
  .claim-item::before {
    content: '🎯';
    position: absolute;
    left: -16px;
  }
  
  .keywords-box {
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    padding: 12px;
    font-size: 13px;
    color: #0369a1;
    font-weight: 500;
  }
  
  .sources-grid {
    display: grid;
    gap: 12px;
  }
  
  .fact-check-item {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    transition: all 0.2s;
  }
  
  .fact-check-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .fact-check-item.true {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.02);
  }
  
  .fact-check-item.false {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.02);
  }
  
  .fact-check-item.mixed {
    border-color: #f59e0b;
    background: rgba(251, 191, 36, 0.02);
  }
  
  .source-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .source-org {
    font-size: 12px;
    font-weight: 600;
    color: #1e293b;
  }
  
  .verdict-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 500;
  }
  
  .verdict-badge.true {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
  }
  
  .verdict-badge.false {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
  
  .verdict-badge.mixed {
    background: rgba(251, 191, 36, 0.1);
    color: #d97706;
  }
  
  .verdict-badge.unverified {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
  }
  
  .source-summary {
    font-size: 11px;
    color: #475569;
    line-height: 1.4;
    margin: 0;
  }
  
  .consensus-display h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #1e293b;
    font-weight: 600;
  }
  
  .consensus-badge {
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    border: 2px solid;
  }
  
  .consensus-badge.agree {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
    border-color: rgba(16, 185, 129, 0.3);
  }
  
  .consensus-badge.disagree {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border-color: rgba(239, 68, 68, 0.3);
  }
  
  .consensus-badge.mixed {
    background: rgba(251, 191, 36, 0.1);
    color: #d97706;
    border-color: rgba(251, 191, 36, 0.3);
  }
  
  .consensus-badge.insufficient {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
    border-color: rgba(107, 114, 128, 0.3);
  }

  /* 분석 팁 섹션 */
  .analysis-tips {
    margin-top: 24px;
    padding: 20px;
    background: linear-gradient(135deg, #fefce8, #fef3c7);
    border: 1px solid #fbbf24;
    border-radius: 12px;
  }
  
  .analysis-tips h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #92400e;
    font-weight: 600;
    text-align: center;
  }
  
  .tips-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  .tip-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
  }
  
  .tip-icon {
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .tip-item p {
    margin: 0;
    font-size: 11px;
    color: #92400e;
    line-height: 1.4;
  }

  /* 하이라이트 스타일 - 외부 페이지용 */
  .criti-ai-highlight {
    position: relative !important;
    cursor: pointer !important;
    padding: 1px 3px !important;
    border-radius: 3px !important;
    transition: all 0.2s ease !important;
    z-index: 999990 !important;
  }
  
  .criti-ai-highlight:hover {
    transform: scale(1.02) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  }

  .criti-ai-highlight-bias {
    background-color: rgba(245, 158, 11, 0.3) !important;
    border-bottom: 2px solid #f59e0b !important;
    color: #92400e !important;
    font-weight: 600 !important;
  }

  .criti-ai-highlight-fallacy {
    background-color: rgba(239, 68, 68, 0.3) !important;
    border-bottom: 2px solid #ef4444 !important;
    color: #991b1b !important;
    font-weight: 600 !important;
  }

  .criti-ai-highlight-manipulation {
    background-color: rgba(168, 85, 247, 0.3) !important;
    border-bottom: 2px solid #a855f7 !important;
    color: #7c2d12 !important;
    font-weight: 600 !important;
  }

  .criti-ai-highlight-advertisement {
    background-color: rgba(16, 185, 129, 0.3) !important;
    border-bottom: 2px solid #10b981 !important;
    color: #065f46 !important;
    font-weight: 600 !important;
  }

  /* 포커스 효과 - 클릭시 임시 강조 */
  .criti-ai-highlight-focused {
    animation: highlightPulse 2s ease-in-out !important;
    transform: scale(1.05) !important;
    z-index: 999999 !important;
    position: relative !important;
  }
  
  @keyframes highlightPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.8);
      background-color: rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.3);
      background-color: rgba(59, 130, 246, 0.7);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
  }

  /* 툴팁 스타일 */
  .criti-ai-tooltip {
    position: fixed !important;
    background: linear-gradient(135deg, #1f2937, #374151) !important;
    color: white !important;
    padding: 12px 16px !important;
    border-radius: 12px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    line-height: 1.5 !important;
    max-width: 320px !important;
    z-index: 1000000 !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(20px) !important;
    animation: tooltipFadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

// Content Script 진입점
console.log("🔍 Criti AI Content Script 로드됨 (Shadow DOM 버전)");

// 노이즈 요소 선택자 정의
const NOISE_SELECTORS = [
  // 스크립트 및 스타일
  "script",
  "style",
  "noscript",
  "template",
  'link[rel="stylesheet"]',

  // 네비게이션 및 UI
  "nav",
  "header",
  "footer",
  ".navigation",
  ".nav",
  ".menu",
  ".header",
  ".footer",
  ".sidebar",
  ".breadcrumb",
  ".pagination",
  ".toolbar",

  // 광고 관련
  ".ad",
  ".ads",
  ".advertisement",
  ".adsense",
  ".adsbygoogle",
  ".banner",
  ".promotion",
  ".sponsored",
  ".affiliate",
  ".marketing",
  ".commercial",
  '[class*="ad-"]',
  '[class*="ads-"]',
  '[class*="banner-"]',
  '[class*="promo-"]',
  '[id*="ad"]',
  '[id*="google_ads"]',
  'iframe[src*="googlesyndication"]',

  // 소셜 및 공유
  ".social",
  ".share",
  ".sharing",
  ".sns",
  ".facebook",
  ".twitter",
  ".instagram",
  ".youtube",
  ".social-share",
  ".share-button",

  // 댓글 및 상호작용
  ".comment",
  ".comments",
  ".reply",
  ".replies",
  ".discussion",
  ".feedback",
  ".review",
  ".rating",
  ".vote",

  // 추천 및 관련
  ".related",
  ".recommendation",
  ".suggestion",
  ".more",
  ".similar",
  ".recommended",
  ".trending",
  ".popular",

  // 메타데이터
  ".tag",
  ".tags",
  ".category",
  ".metadata",
  ".byline",
  ".author-info",
  ".date",
  ".time",
  ".share-count",
  ".view-count",
  ".read-time",

  // 기타 노이즈
  ".popup",
  ".modal",
  ".overlay",
  ".tooltip",
  ".notification",
  ".cookie",
  ".privacy",
  ".legal",
  ".copyright",
  ".subscription",
];

// 간단한 노이즈 제거 함수
const removeNoiseElements = (container: Element | Document): void => {
  NOISE_SELECTORS.forEach((selector) => {
    try {
      const elements = container.querySelectorAll(selector);
      elements.forEach((element) => {
        if (element && element.parentNode) {
          element.remove();
        }
      });
    } catch (error) {
      console.warn(`노이즈 선택자 처리 실패: ${selector}`);
    }
  });

  // 숨겨진 요소도 제거
  const hiddenElements = container.querySelectorAll(
    '[style*="display:none"], [style*="display: none"], [hidden]'
  );
  hiddenElements.forEach((element) => {
    if (element && element.parentNode) {
      element.remove();
    }
  });
};

// 네이버 블로그 콘텐츠 추출 (노이즈 제거 적용)
const extractNaverBlogContent = async (): Promise<{
  title: string;
  content: string;
} | null> => {
  console.log("🔍 네이버 블로그 콘텐츠 추출 시도");

  // 네이버 블로그 iframe 확인
  const mainFrame = document.querySelector("#mainFrame") as HTMLIFrameElement;
  if (!mainFrame) {
    console.log("❌ 네이버 블로그 메인 프레임을 찾을 수 없음");
    return null;
  }

  try {
    // iframe 내부 접근 시도
    const frameDocument =
      mainFrame.contentDocument || mainFrame.contentWindow?.document;
    if (!frameDocument) {
      console.log("❌ iframe 내부 문서에 접근할 수 없음");
      return null;
    }

    // 프레임 문서 복사본 생성
    const clonedBody = frameDocument.body.cloneNode(true) as Element;

    // 노이즈 제거
    removeNoiseElements(clonedBody);
    console.log("네이버 블로그 노이즈 제거 완료");

    // 네이버 블로그 선택자들
    const blogSelectors = [
      ".se-main-container",
      ".se-component-content",
      ".se-text-paragraph",
      "#postViewArea",
      ".post-view",
      ".post_ct",
      "#post-view-content",
      ".se-viewer",
      ".content-area",
    ];

    // 제목 찾기
    const titleSelectors = [
      ".se-title-text",
      ".post_title",
      ".title_post",
      "#title_1",
      "h2.title",
      ".post-title",
    ];

    // 제목 추출
    let title = "";
    for (const selector of titleSelectors) {
      const titleElement =
        clonedBody.querySelector(selector) ||
        frameDocument.querySelector(selector);
      if (titleElement?.textContent?.trim()) {
        title = titleElement.textContent.trim();
        console.log("✅ 네이버 블로그 제목 발견:", title);
        break;
      }
    }

    // 본문 추출
    let content = "";
    let maxTextLength = 0;

    for (const selector of blogSelectors) {
      const elements = clonedBody.querySelectorAll(selector);
      if (elements.length > 0) {
        const textArray = Array.from(elements)
          .map((el) => el.textContent?.trim() || "")
          .filter((text) => text.length > 20); // 20자 이상인 것만

        if (textArray.length > 0) {
          const combinedText = textArray.join("\n\n");
          if (combinedText.length > maxTextLength) {
            maxTextLength = combinedText.length;
            content = combinedText;
            console.log(
              `✅ 네이버 블로그 콘텐츠 발견 (${selector}):`,
              content.length,
              "글자"
            );
          }
        }
      }
    }

    // 제목 기본값
    if (!title) {
      title = document.title || frameDocument.title || "네이버 블로그 포스트";
    }

    // 콘텐츠가 부족하면 재시도
    if (content.length < 50) {
      console.log("❌ 네이버 블로그 콘텐츠가 너무 짧음:", content.length);

      // 동적 로딩을 위해 잠시 대기 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 재시도
      for (const selector of blogSelectors) {
        const elements = clonedBody.querySelectorAll(selector);
        if (elements.length > 0) {
          const textArray = Array.from(elements)
            .map((el) => el.textContent?.trim() || "")
            .filter((text) => text.length > 20);

          if (textArray.length > 0) {
            content = textArray.join("\n\n");
            console.log(
              `✅ 재시도로 네이버 블로그 콘텐츠 발견:`,
              content.length,
              "글자"
            );
            break;
          }
        }
      }
    }

    if (content.length >= 50) {
      return { title, content: content.substring(0, 4000) };
    } else {
      console.log("❌ 네이버 블로그 콘텐츠 추출 실패 - 내용이 부족함");
      return null;
    }
  } catch (error) {
    console.error("❌ 네이버 블로그 추출 중 오류:", error);
    return null;
  }
};

// 컨텐츠 감지 - 네이버 블로그 특별 처리 포함
const isAnalyzableContent = async (): Promise<boolean> => {
  const excludedDomains = [
    "chrome://",
    "chrome-extension://",
    "about:",
    "file://",
    "chrome-devtools://",
    "moz-extension://",
    "edge://",
    "safari-extension://",
  ];

  const currentUrl = window.location.href;
  if (excludedDomains.some((domain) => currentUrl.startsWith(domain))) {
    console.log("❌ 제외된 도메인:", currentUrl);
    return false;
  }

  // 네이버 블로그 특별 처리
  if (currentUrl.includes("blog.naver.com")) {
    console.log("🔍 네이버 블로그 감지 - 특별 처리 시작");
    const naverContent = await extractNaverBlogContent();
    if (naverContent && naverContent.content.length > 50) {
      console.log(
        "✅ 네이버 블로그 분석 가능:",
        naverContent.content.length,
        "글자"
      );
      return true;
    } else {
      console.log("❌ 네이버 블로그 콘텐츠 부족");
      return false;
    }
  }

  // 일반 페이지 처리
  const textContent = document.body.textContent?.trim() || "";
  const isValid = textContent.length > 30;

  console.log("📝 컨텐츠 체크:", {
    url: currentUrl,
    textLength: textContent.length,
    isValid: isValid,
  });

  return isValid;
};

// 일반 페이지 콘텐츠 추출 (노이즈 제거 적용)
const extractPageContent = async (): Promise<{
  title: string;
  content: string;
}> => {
  console.log("📄 컨텐츠 추출 시작");

  // 네이버 블로그 우선 처리
  if (window.location.href.includes("blog.naver.com")) {
    console.log("🔍 네이버 블로그 콘텐츠 추출 시도");
    const naverContent = await extractNaverBlogContent();
    if (naverContent) {
      console.log("네이버 블로그 콘텐츠 추출 성공");
      return naverContent;
    }
    console.log("네이버 블로그 추출 실패, 일반 방식으로 시도");
  }

  // DOM 복사본 생성 (원본 보존)
  const clonedBody = document.body.cloneNode(true) as Element;

  // 노이즈 제거
  removeNoiseElements(clonedBody);
  console.log("일반 페이지 노이즈 제거 완료");

  // 제목 추출
  const titleSelectors = [
    "h1",
    ".article-title",
    ".news-title",
    ".post-title",
    ".entry-title",
    "[data-testid='headline']",
    ".title",
    ".headline",
    ".subject",
    ".article-header h1",
    ".content-title",
    ".main-title",
    ".page-title",
    ".story-title",
    ".article_title",
    ".news_title",
    ".tit_view",
    "#articleTitle",
    ".title_text",
  ];

  let title = document.title;
  for (const selector of titleSelectors) {
    const element = clonedBody.querySelector(selector);
    if (element?.textContent?.trim() && element.textContent.trim().length > 5) {
      title = element.textContent.trim();
      console.log("제목 발견:", title.substring(0, 50));
      break;
    }
  }

  // 본문 콘텐츠 추출
  const contentSelectors = [
    "article",
    ".article-content",
    ".news-content",
    ".post-content",
    ".entry-content",
    ".content",
    ".main-content",
    "[role='main']",
    "main",
    ".article-body",
    ".story-body",
    ".post-body",
    ".content-body",
    ".article-text",
    ".news-body",
    ".detail-content",
    ".view-content",
    ".read-content",
    ".article_content",
    ".news_content",
  ];

  let content = "";
  let maxTextLength = 0;

  // 각 선택자별로 텍스트 길이 체크하여 가장 긴 것 선택
  for (const selector of contentSelectors) {
    const element = clonedBody.querySelector(selector);
    if (element?.textContent?.trim()) {
      const textLength = element.textContent.trim().length;
      if (textLength > maxTextLength && textLength > 100) {
        maxTextLength = textLength;
        content = element.textContent.trim();
        console.log("콘텐츠 후보:", selector, textLength, "글자");
      }
    }
  }

  // 여전히 부족하면 intelligent 추출
  if (content.length < 200) {
    console.log("Intelligent 콘텐츠 추출 시도");

    const potentialElements = clonedBody.querySelectorAll(
      "p, div, section, article, span"
    );
    const bestElements: Element[] = [];

    Array.from(potentialElements).forEach((element) => {
      const text = element.textContent?.trim() || "";
      const textLength = text.length;
      const childElementsCount = element.children.length;

      const density =
        childElementsCount > 0
          ? textLength / (childElementsCount + 1)
          : textLength;
      const hasParent = element.parentElement;
      const isNotScript = !element.tagName
        .toLowerCase()
        .match(/script|style|noscript/);

      if (textLength > 50 && density > 30 && hasParent && isNotScript) {
        bestElements.push(element);
      }
    });

    if (bestElements.length > 0) {
      bestElements.sort(
        (a, b) => (b.textContent?.length || 0) - (a.textContent?.length || 0)
      );

      content = bestElements
        .slice(0, 8)
        .map((el) => el.textContent?.trim())
        .filter((text) => text && text.length > 30)
        .join("\n\n");

      console.log("Intelligent 추출 성공:", content.length, "글자");
    }
  }

  const finalContent = content.substring(0, 4000);

  console.log("최종 콘텐츠 추출 완료:", {
    title: title.substring(0, 50),
    contentLength: finalContent.length,
    domain: window.location.hostname,
    success: finalContent.length >= 50,
  });

  return { title, content: finalContent };
};

// Shadow DOM을 사용한 사이드바 마운트
const mountApp = () => {
  console.log("🏠 Shadow DOM 기반 앱 마운트 시작");

  let sidebarVisible = false;
  let shadowHost: HTMLElement | null = null;
  let shadowRoot: ShadowRoot | null = null;
  let reactRoot: import("react-dom/client").Root | null = null;

  const toggleSidebar = () => {
    console.log("🔄 사이드바 토글, 현재 상태:", sidebarVisible);

    if (!shadowHost) {
      console.log("🌟 Shadow DOM 생성");

      shadowHost = document.createElement("div");
      shadowHost.id = "criti-ai-shadow-host";
      shadowHost.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        right: 0 !important;
        width: 0 !important;
        height: 0 !important;
        z-index: 999999 !important;
        pointer-events: none !important;
      `;

      document.body.appendChild(shadowHost);

      shadowRoot = shadowHost.attachShadow({ mode: "closed" });

      // Shadow DOM 내부 CSS 주입
      const style = document.createElement("style");
      style.textContent = getShadowCSS();
      shadowRoot.appendChild(style);

      // 사이드바 컨테이너 생성
      const sidebarContainer = document.createElement("div");
      sidebarContainer.className = "criti-ai-sidebar-container";
      sidebarContainer.style.pointerEvents = "auto";
      shadowRoot.appendChild(sidebarContainer);

      // React 앱 마운트
      reactRoot = createRoot(sidebarContainer);

      // 페이지 데이터 추출 (네이버 블로그 지원)
      extractPageContent().then((pageData) => {
        if (reactRoot) {
          reactRoot.render(
            <ContentScriptApp
              url={window.location.href}
              title={pageData.title}
              content={pageData.content}
              sidebarVisible={sidebarVisible}
              onClose={() => {
                console.log("✖️ 사이드바 닫기 요청");
                closeSidebar();
              }}
            />
          );
        }
      });
    }

    if (!sidebarVisible) {
      openSidebar();
    } else {
      closeSidebar();
    }
  };

  const openSidebar = () => {
    console.log("🔓 사이드바 열기");
    sidebarVisible = true;
    if (shadowRoot) {
      const container = shadowRoot.querySelector(".criti-ai-sidebar-container");
      if (container) {
        container.classList.add("open");
      }
    }

    // React 상태 업데이트
    updateReactAppState();
  };

  const closeSidebar = () => {
    console.log("🔒 사이드바 닫기 및 하이라이트 제거");
    sidebarVisible = false;

    // 사이드바 닫기 애니메이션
    if (shadowRoot) {
      const container = shadowRoot.querySelector(".criti-ai-sidebar-container");
      if (container) {
        container.classList.remove("open");
      }
    }

    // 모든 하이라이트 제거
    clearAllHighlights();

    // React 상태 업데이트
    updateReactAppState();
  };

  // React 앱 상태 업데이트 함수
  const updateReactAppState = () => {
    if (reactRoot && shadowRoot) {
      extractPageContent().then((pageData) => {
        if (reactRoot) {
          reactRoot.render(
            <ContentScriptApp
              url={window.location.href}
              title={pageData.title}
              content={pageData.content}
              sidebarVisible={sidebarVisible}
              onClose={() => {
                console.log("✖️ 사이드바 닫기 요청");
                closeSidebar();
              }}
            />
          );
        }
      });
    }
  };

  // 전역 하이라이트 관리 시스템 (강화된 버전)
  const highlightElements = new Map<string, HTMLElement>();
  const activeTooltips = new Set<HTMLElement>();
  const eventListeners = new Set<() => void>();

  // 메모리 누수 방지를 위한 정리 함수
  const cleanupResources = () => {
    console.log("🧹 리소스 정리 시작");

    // 모든 이벤트 리스너 제거
    eventListeners.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.warn("⚠️ 이벤트 리스너 정리 실패:", error);
      }
    });
    eventListeners.clear();

    // 모든 툴팁 제거
    activeTooltips.forEach((tooltip) => {
      if (tooltip.parentNode) {
        tooltip.remove();
      }
    });
    activeTooltips.clear();

    // 하이라이트 요소 맵 정리
    highlightElements.clear();

    console.log("✅ 리소스 정리 완료");
  };

  const scrollToHighlight = (highlightId: string): void => {
    console.log("🎯 스크롤 요청:", highlightId);
    const element = highlightElements.get(highlightId);
    if (element) {
      // 부드러운 스크롤
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      // 임시 강조 효과
      element.classList.add("criti-ai-highlight-focused");
      setTimeout(() => {
        element.classList.remove("criti-ai-highlight-focused");
      }, 2000);

      console.log("✅ 스크롤 완료:", highlightId);
    } else {
      console.log("❌ 하이라이트 요소를 찾을 수 없음:", highlightId);
    }
  };

  const clearAllHighlights = (): void => {
    console.log("🗑️ 모든 하이라이트 제거 시작");

    // 메인 문서 툴팅 제거
    const tooltips = document.querySelectorAll(".criti-ai-tooltip");
    tooltips.forEach((tooltip) => {
      activeTooltips.delete(tooltip as HTMLElement);
      tooltip.remove();
    });

    // 메인 문서 하이라이트 제거
    const highlights = document.querySelectorAll(".criti-ai-highlight");
    highlights.forEach((element) => {
      const parent = element.parentNode;
      if (parent) {
        parent.replaceChild(
          document.createTextNode(element.textContent || ""),
          element
        );
        parent.normalize();
      }
    });

    // 네이버 블로그 iframe 내부 하이라이트 제거
    if (window.location.href.includes("blog.naver.com")) {
      const mainFrame = document.querySelector(
        "#mainFrame"
      ) as HTMLIFrameElement;
      if (mainFrame && mainFrame.contentDocument) {
        try {
          // iframe 툴팅 제거
          const frameTooltips =
            mainFrame.contentDocument.querySelectorAll(".criti-ai-tooltip");
          frameTooltips.forEach((tooltip) => {
            activeTooltips.delete(tooltip as HTMLElement);
            tooltip.remove();
          });

          // iframe 하이라이트 제거
          const frameHighlights = mainFrame.contentDocument.querySelectorAll(
            ".criti-ai-highlight"
          );
          frameHighlights.forEach((element) => {
            const parent = element.parentNode;
            if (parent) {
              parent.replaceChild(
                mainFrame.contentDocument!.createTextNode(
                  element.textContent || ""
                ),
                element
              );
              parent.normalize();
            }
          });

          console.log("✅ iframe 하이라이트 제거 완료");
        } catch (error) {
          console.log("⚠️ iframe 하이라이트 제거 실패 (보안 제한):", error);
        }
      }
    }

    // 맵 정리
    highlightElements.clear();
    activeTooltips.clear();

    console.log("✅ 모든 하이라이트 제거 완료");
  };

  const scrollToHighlightByText = (text: string, type?: string): boolean => {
    console.log("🔍 텍스트로 하이라이트 찾기:", text, type);

    // Map에서 텍스트 매칭하여 찾기
    for (const [id, element] of highlightElements) {
      const elementText = element.textContent?.trim() || "";
      const isTextMatch =
        elementText.includes(text) || text.includes(elementText);
      const isTypeMatch = !type || id.includes(type);

      if (isTextMatch && isTypeMatch) {
        scrollToHighlight(id);
        return true;
      }
    }

    // 직접 DOM에서 찾기 (fallback)
    const allHighlights = document.querySelectorAll(".criti-ai-highlight");
    for (const highlight of allHighlights) {
      const highlightText = highlight.textContent?.trim() || "";
      const isTextMatch =
        highlightText.includes(text) || text.includes(highlightText);
      const isTypeMatch =
        !type || highlight.className.includes(`criti-ai-highlight-${type}`);

      if (isTextMatch && isTypeMatch) {
        highlight.scrollIntoView({ behavior: "smooth", block: "center" });
        highlight.classList.add("criti-ai-highlight-focused");
        setTimeout(() => {
          highlight.classList.remove("criti-ai-highlight-focused");
        }, 2000);
        console.log("✅ Fallback 스크롤 성공");
        return true;
      }
    }

    console.log("❌ 해당 텍스트의 하이라이트를 찾을 수 없음");
    return false;
  };

  // 전역 접근용 인터페이스
  interface CritiAIGlobal {
    critiAI: {
      toggleSidebar: () => void;
      isReady: boolean;
      highlightElements: Map<string, HTMLElement>;
      scrollToHighlight: (highlightId: string) => void;
      clearAllHighlights: () => void;
      scrollToHighlightByText: (text: string, type?: string) => boolean;
      cleanupResources: () => void;
      version: string;
    };
  }

  (window as unknown as CritiAIGlobal).critiAI = {
    toggleSidebar,
    isReady: true,
    highlightElements,
    scrollToHighlight,
    clearAllHighlights,
    scrollToHighlightByText,
    cleanupResources,
    version: "2.0.0",
  };

  // 개선된 메시지 리스너
  chrome.runtime.onMessage.addListener(
    (
      request: { action: string },
      _sender,
      sendResponse: (response: { success: boolean; ready?: boolean }) => void
    ) => {
      console.log("📨 메시지 수신:", request);

      if (request.action === "ping") {
        console.log("📡 Ping 요청 - Content Script 준비 상태 확인");
        sendResponse({ success: true, ready: true });
        return true;
      }

      if (request.action === "toggleSidebar") {
        console.log("📨 Popup에서 사이드바 토글 요청");
        try {
          toggleSidebar();
          sendResponse({ success: true });
        } catch (error) {
          console.error("❌ 사이드바 토글 실패:", error);
          sendResponse({ success: false });
        }
        return true;
      }

      sendResponse({ success: false });
      return true;
    }
  );

  console.log("✅ Shadow DOM 기반 Criti AI 시스템 초기화 완료");
};

// 하이라이트 CSS 주입 시스템
const getOptimizedHighlightCSS = () => `
  /* 하이라이트 기본 스타일 */
  .criti-ai-highlight {
    position: relative !important;
    cursor: pointer !important;
    padding: 2px 4px !important;
    border-radius: 4px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    z-index: 999990 !important;
    display: inline !important;
    line-height: inherit !important;
    font-family: inherit !important;
    font-size: inherit !important;
    text-decoration: none !important;
    border: none !important;
    outline: none !important;
    box-sizing: border-box !important;
  }
  
  .criti-ai-highlight:hover {
    transform: scale(1.02) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
    filter: brightness(1.1) !important;
  }

  /* 편향성 하이라이트 */
  .criti-ai-highlight-bias {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(251, 191, 36, 0.35)) !important;
    border-bottom: 2px solid #f59e0b !important;
    color: #92400e !important;
    font-weight: 600 !important;
  }
  
  .criti-ai-highlight-bias:hover {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(251, 191, 36, 0.5)) !important;
  }

  /* 논리적 오류 하이라이트 */
  .criti-ai-highlight-fallacy {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(248, 113, 113, 0.35)) !important;
    border-bottom: 2px solid #ef4444 !important;
    color: #991b1b !important;
    font-weight: 600 !important;
  }
  
  .criti-ai-highlight-fallacy:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(248, 113, 113, 0.5)) !important;
  }

  /* 감정 조작 하이라이트 */
  .criti-ai-highlight-manipulation {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(196, 181, 253, 0.35)) !important;
    border-bottom: 2px solid #a855f7 !important;
    color: #6b21a8 !important;
    font-weight: 600 !important;
  }
  
  .criti-ai-highlight-manipulation:hover {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(196, 181, 253, 0.5)) !important;
  }

  /* 광고성 하이라이트 */
  .criti-ai-highlight-advertisement {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(52, 211, 153, 0.35)) !important;
    border-bottom: 2px solid #10b981 !important;
    color: #065f46 !important;
    font-weight: 600 !important;
  }
  
  .criti-ai-highlight-advertisement:hover {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(52, 211, 153, 0.5)) !important;
  }

  /* 핵심 주장 하이라이트 */
  .criti-ai-highlight-claim {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(147, 197, 253, 0.35)) !important;
    border-bottom: 2px solid #3b82f6 !important;
    color: #1e40af !important;
    font-weight: 500 !important;
  }
  
  .criti-ai-highlight-claim:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(147, 197, 253, 0.5)) !important;
  }

  /* 포커스 효과 */
  .criti-ai-highlight-focused {
    animation: critiHighlightPulse 2s ease-in-out !important;
    transform: scale(1.05) !important;
    z-index: 999999 !important;
    position: relative !important;
  }
  
  @keyframes critiHighlightPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.8);
      background-color: rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 0 0 15px rgba(59, 130, 246, 0.3);
      background-color: rgba(59, 130, 246, 0.7);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
  }

  /* 툴팁 스타일 */
  .criti-ai-tooltip {
    position: fixed !important;
    background: linear-gradient(135deg, #1f2937, #374151) !important;
    color: white !important;
    padding: 16px 20px !important;
    border-radius: 12px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    line-height: 1.5 !important;
    max-width: 350px !important;
    z-index: 1000000 !important;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.35) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(20px) !important;
    animation: critiTooltipFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    pointer-events: none !important;
    user-select: none !important;
    word-wrap: break-word !important;
    white-space: normal !important;
  }
  
  @keyframes critiTooltipFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  /* 다크 모드 지원 */
  @media (prefers-color-scheme: dark) {
    .criti-ai-highlight {
      filter: brightness(1.2) !important;
    }
    
    .criti-ai-tooltip {
      background: linear-gradient(135deg, #0f172a, #1e293b) !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
  }
  
  /* 모바일 최적화 */
  @media (max-width: 768px) {
    .criti-ai-highlight {
      padding: 1px 2px !important;
    }
    
    .criti-ai-tooltip {
      max-width: 280px !important;
      font-size: 13px !important;
      padding: 12px 16px !important;
    }
  }
`;

// 하이라이트용 CSS를 문서 전체에 주입
const injectHighlightCSS = () => {
  const cssText = getOptimizedHighlightCSS();

  // 1. 메인 문서에 스타일 주입
  if (!document.getElementById("criti-ai-highlight-styles")) {
    const style = document.createElement("style");
    style.id = "criti-ai-highlight-styles";
    style.textContent = cssText;
    document.head.appendChild(style);
    console.log("✅ 메인 문서에 하이라이트 CSS 주입 완료");
  }

  // 2. 네이버 블로그 iframe에 스타일 주입
  if (window.location.href.includes("blog.naver.com")) {
    const iframe = document.querySelector("#mainFrame") as HTMLIFrameElement;
    if (iframe) {
      // 즉시 CSS 주입 시도
      const injectFrameCSS = () => {
        try {
          const frameDocument = iframe.contentDocument;
          if (
            frameDocument &&
            !frameDocument.getElementById("criti-ai-highlight-styles")
          ) {
            const frameStyle = frameDocument.createElement("style");
            frameStyle.id = "criti-ai-highlight-styles";
            frameStyle.textContent = cssText;
            frameDocument.head.appendChild(frameStyle);
            console.log("✅ 네이버 블로그 iframe에 CSS 주입 성공");
            return true;
          }
        } catch (e) {
          console.log("⚠️ iframe CSS 주입 실패 (보안 제한):", e);
          return false;
        }
        return false;
      };

      // 즉시 시도
      injectFrameCSS();

      // iframe 로드 이벤트
      iframe.addEventListener("load", injectFrameCSS);

      // 동적 로딩 반복 시도
      let retryCount = 0;
      const maxRetries = 10;
      const retryInjection = () => {
        if (retryCount >= maxRetries) return;

        if (!injectFrameCSS()) {
          retryCount++;
          setTimeout(retryInjection, 500);
        }
      };

      setTimeout(retryInjection, 1000);
    }
  }
};

// 페이지 로드 완료 후 실행
const initialize = async () => {
  const canAnalyze = await isAnalyzableContent();

  if (canAnalyze) {
    injectHighlightCSS();
    mountApp();
    console.log("🎉 Criti AI 초기화 완료 - 분석 가능한 페이지");
  } else {
    // 분석 불가능한 페이지에서도 ping에는 응답
    chrome.runtime.onMessage.addListener(
      (
        request: { action: string },
        _sender,
        sendResponse: (response: {
          success: boolean;
          ready?: boolean;
          reason?: string;
        }) => void
      ) => {
        if (request.action === "ping") {
          console.log("📡 분석 불가능한 페이지에서 Ping 응답");
          sendResponse({
            success: false,
            ready: false,
            reason: "not_analyzable",
          });
          return true;
        }
        sendResponse({ success: false });
        return true;
      }
    );
    console.log("⚠️ 분석 불가능한 페이지 - Criti AI 대기 모드");
  }
};

// DOM 준비 상태에 따른 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

// 동적 페이지 변화 감지 + 네이버 블로그 동적 로딩 감지 + 메모리 관리
let lastUrl = window.location.href;
let pageObserver: MutationObserver | null = null;
let frameObserver: MutationObserver | null = null;
let cleanupTimeout: NodeJS.Timeout | null = null;

const cleanupObservers = () => {
  console.log("📊 관찰자 정리 시작");

  if (pageObserver) {
    pageObserver.disconnect();
    pageObserver = null;
  }

  if (frameObserver) {
    frameObserver.disconnect();
    frameObserver = null;
  }

  if (cleanupTimeout) {
    clearTimeout(cleanupTimeout);
    cleanupTimeout = null;
  }

  console.log("✅ 관찰자 정리 완료");
};

const setupObservers = () => {
  // 기존 관찰자 정리
  cleanupObservers();

  pageObserver = new MutationObserver(async (mutations) => {
    // URL 변화 감지
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      console.log("🔄 페이지 URL 변화 감지, 재초기화");

      // 리소스 정리 후 재초기화
      if (window.critiAI?.cleanupResources) {
        window.critiAI.cleanupResources();
      }

      // 지연 후 재초기화 (페이지 안정화 대기)
      cleanupTimeout = setTimeout(initialize, 1000);
      return;
    }

    // 네이버 블로그 동적 컨테이너 변화 감지
    if (window.location.href.includes("blog.naver.com")) {
      const hasContentChanges = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node as Element).querySelector &&
            ((node as Element).querySelector(".se-main-container") ||
              (node as Element).querySelector(".se-component-content") ||
              (node as Element).matches(
                ".se-main-container, .se-component-content"
              ))
        )
      );

      if (hasContentChanges) {
        console.log("🔄 네이버 블로그 컨테이너 변화 감지");
        // 하이라이트 재적용 로직은 TextHighlighter에서 처리
      }
    }
  });

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false, // 성능 최적화
    characterData: false,
  });

  // 네이버 블로그 iframe 관찰자 설정
  if (window.location.href.includes("blog.naver.com")) {
    const mainFrame = document.querySelector("#mainFrame") as HTMLIFrameElement;
    if (mainFrame) {
      const setupFrameObserver = () => {
        try {
          if (mainFrame.contentDocument && !frameObserver) {
            frameObserver = new MutationObserver(() => {
              console.log("🔄 네이버 블로그 iframe 컨테이너 변화 감지");
            });

            frameObserver.observe(mainFrame.contentDocument.body, {
              childList: true,
              subtree: true,
              attributes: false,
              characterData: false,
            });

            console.log("✅ iframe 관찰자 설정 완료");
          }
        } catch (error) {
          console.log("⚠️ iframe 관찰 설정 실패 (보안 제한):", error);
        }
      };

      // 즉시 시도 및 load 이벤트
      setupFrameObserver();
      mainFrame.addEventListener("load", setupFrameObserver);
    }
  }
};

setupObservers();

// 페이지 언로드 시 정리
window.addEventListener("beforeunload", () => {
  console.log("📊 페이지 언로드 - 리소스 정리");
  cleanupObservers();
  if (window.critiAI?.cleanupResources) {
    window.critiAI.cleanupResources();
  }
});

// 개발 디버깅 도구 활성화
if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
  (window as Window & { critiAIDebug?: typeof debugCommands }).critiAIDebug =
    debugCommands;
  console.log("🔧 개발자 도구 활성화: window.critiAIDebug");
} else {
  // 프로덕션에서도 기본 디버깅 기능 제공
  (
    window as Window & { critiAIDebug?: Partial<typeof debugCommands> }
  ).critiAIDebug = {
    version: debugCommands.version,
    diagnose: debugCommands.diagnose,
    checkHighlights: debugCommands.checkHighlights,
  };
}
