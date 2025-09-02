import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

export const PopupApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#0ea5e9' }}>🔍 크리티 AI</h2>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
          뉴스 신뢰도 분석기
        </p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '16px', 
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>📊 사용법</h3>
          <ol style={{ 
            textAlign: 'left', 
            fontSize: '14px', 
            color: '#374151',
            paddingLeft: '20px',
            margin: 0
          }}>
            <li>뉴스 기사 페이지로 이동</li>
            <li>우측에 나타나는 사이드바 확인</li>
            <li>"이 기사 분석하기" 클릭</li>
            <li>AI 분석 결과 확인</li>
          </ol>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
        현재 페이지에서 분석을 시작하려면<br />
        뉴스 기사로 이동해주세요
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => window.close()}
          style={{
            background: '#0ea5e9',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}
