import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const PopupApp: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'ready' | 'not_ready' | 'error'>('checking');

  // Tab 정보 및 Content Script 상태 확인
  useEffect(() => {
    let isMounted = true;

    const checkContentScript = async () => {
      try {
        console.log('🔍 현재 탭 정보 확인 중...');
        
        // 현재 활성 탭 가져오기
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!isMounted) return;
        
        if (!tab?.id || !tab.url) {
          console.log('❌ 유효하지 않은 탭');
          setConnectionStatus('error');
          return;
        }

        setCurrentTab(tab);
        console.log('📍 현재 탭:', { url: tab.url, title: tab.title });

        // Content Script 준비 상태 확인 (ping)
        console.log('📡 Content Script ping 전송 중...');
        
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
        
        if (!isMounted) return;
        
        console.log('📨 Content Script 응답:', response);
        
        if (response?.success && response?.ready) {
          setConnectionStatus('ready');
          console.log('✅ Content Script 준비 완료');
        } else {
          setConnectionStatus('not_ready');
          console.log('⚠️ Content Script 준비되지 않음:', response?.reason || 'unknown');
        }
        
      } catch (pingError) {
        if (!isMounted) return;
        
        console.log('❌ Content Script ping 실패:', pingError);
        setConnectionStatus('not_ready');
        
        // 재시도 로직 (최대 3번)
        let retryCount = 0;
        const maxRetries = 3;
        
        const retryPing = async () => {
          while (retryCount < maxRetries && isMounted) {
            retryCount++;
            console.log(`🔄 재시도 ${retryCount}/${maxRetries}`);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            try {
              const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
              if (!currentTab?.id) continue;
              
              const retryResponse = await chrome.tabs.sendMessage(currentTab.id, { action: 'ping' });
              
              if (retryResponse?.success && retryResponse?.ready) {
                console.log('✅ 재시도 성공');
                if (isMounted) {
                  setConnectionStatus('ready');
                }
                return;
              }
              
            } catch {
              console.log(`❌ 재시도 ${retryCount} 실패`);
            }
          }
          
          // 모든 재시도 실패
          if (isMounted) {
            console.log('❌ 모든 재시도 실패');
            setConnectionStatus('error');
          }
        };
        
        retryPing();
      }
    };

    checkContentScript();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAnalyzeClick = async () => {
    if (!currentTab?.id) {
      console.log('❌ 현재 탭 정보가 없습니다.');
      return;
    }

    setIsAnalyzing(true);
    console.log('📊 분석 시작 요청');

    try {
      // Content Script에 사이드바 토글 메시지 전송
      const response = await chrome.tabs.sendMessage(currentTab.id, { 
        action: 'toggleSidebar'
      });

      console.log('📨 사이드바 토글 응답:', response);

      if (response?.success) {
        console.log('✅ 사이드바 토글 성공');
        // 팝업 창 닫기 (선택사항)
        window.close();
      } else {
        console.log('❌ 사이드바 토글 실패');
      }
      
    } catch (toggleError) {
      console.error('❌ 사이드바 토글 에러:', toggleError);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case 'checking':
        return (
          <div className="status-checking">
            <div className="spinner"></div>
            <p>페이지 연결 상태 확인 중...</p>
            <small>Content Script 로딩을 기다리고 있습니다.</small>
          </div>
        );

      case 'ready':
        return (
          <div className="status-ready">
            <div className="icon">🎯</div>
            <h3>신뢰도 분석 준비 완료</h3>
            <p>
              현재 페이지의 내용을 분석하여 신뢰도, 편향성, 논리적 오류를 검토할 수 있습니다.
            </p>
            <button 
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing}
              className="analyze-button"
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner small"></div>
                  분석 중...
                </>
              ) : (
                '🔍 페이지 분석 시작'
              )}
            </button>
            {currentTab?.title && (
              <div className="current-page">
                <small>
                  📄 {currentTab.title.substring(0, 50)}
                  {currentTab.title.length > 50 ? '...' : ''}
                </small>
              </div>
            )}
          </div>
        );

      case 'not_ready':
        return (
          <div className="status-not-ready">
            <div className="icon">⚠️</div>
            <h3>분석 준비 중</h3>
            <p>
              페이지가 아직 완전히 로드되지 않았거나, 분석할 수 있는 콘텐츠가 부족합니다.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              🔄 다시 시도
            </button>
            <small>
              💡 뉴스, 블로그, 게시글 등 텍스트 콘텐츠가 있는 페이지에서 사용하세요.
            </small>
          </div>
        );

      case 'error':
        return (
          <div className="status-error">
            <div className="icon">❌</div>
            <h3>연결 실패</h3>
            <p>
              현재 페이지는 분석할 수 없습니다.
            </p>
            <div className="error-details">
              <small>
                다음과 같은 페이지는 분석이 제한됩니다:<br />
                • Chrome 확장 프로그램 페이지<br />
                • Chrome 설정 페이지<br />
                • 파일 시스템 페이지<br />
                • 텍스트 내용이 부족한 페이지
              </small>
            </div>
            <button 
              onClick={() => chrome.tabs.create({ url: 'https://news.naver.com' })}
              className="demo-button"
            >
              📰 네이버 뉴스로 테스트
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h2>🎯 Criti AI</h2>
        <p>디지털 콘텐츠 신뢰도 분석</p>
      </header>
      
      <main className="popup-main">
        {renderConnectionStatus()}
      </main>
      
      <footer className="popup-footer">
        <div className="version-info">
          <small>v1.0.0 • 개발 모드</small>
        </div>
        <div className="links">
          <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            chrome.tabs.create({ url: 'https://github.com/your-repo/criti-ai' }); 
          }}>
            📚 도움말
          </a>
        </div>
      </footer>
    </div>
  );
};

// 스타일링
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', sans-serif;
    width: 380px;
    min-height: 500px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    color: #1e293b;
    line-height: 1.5;
  }

  .popup-container {
    display: flex;
    flex-direction: column;
    min-height: 500px;
  }

  .popup-header {
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    color: white;
    padding: 20px;
    text-align: center;
    
    h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    p {
      font-size: 14px;
      opacity: 0.9;
    }
  }

  .popup-main {
    flex: 1;
    padding: 24px;
  }

  .status-checking,
  .status-ready,
  .status-not-ready,
  .status-error {
    text-align: center;
    
    .icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    h3 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #1e293b;
    }
    
    p {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 20px;
    }
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #0ea5e9;
    border-radius: 50%;
    margin: 0 auto 16px;
    animation: spin 1s linear infinite;
    
    &.small {
      width: 16px;
      height: 16px;
      border-width: 2px;
      margin: 0 8px 0 0;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .analyze-button,
  .retry-button,
  .demo-button {
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 16px;
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(14, 165, 233, 0.3);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
  }

  .retry-button {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
    
    &:hover:not(:disabled) {
      box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
    }
  }

  .demo-button {
    background: linear-gradient(135deg, #10b981, #059669);
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
    
    &:hover:not(:disabled) {
      box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
    }
  }

  .current-page {
    margin-top: 12px;
    padding: 8px 12px;
    background: rgba(14, 165, 233, 0.1);
    border-radius: 6px;
    
    small {
      color: #0c4a6e;
      font-weight: 500;
    }
  }

  .error-details {
    margin: 16px 0;
    padding: 12px;
    background: rgba(239, 68, 68, 0.05);
    border-radius: 6px;
    border: 1px solid rgba(239, 68, 68, 0.1);
    
    small {
      font-size: 12px;
      color: #7f1d1d;
      line-height: 1.4;
    }
  }

  .popup-footer {
    padding: 16px 24px;
    background: rgba(148, 163, 184, 0.1);
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .version-info small {
      color: #64748b;
      font-size: 12px;
    }
    
    .links a {
      color: #0ea5e9;
      text-decoration: none;
      font-size: 12px;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }

  /* 상태별 아이콘 색상 */
  .status-ready .icon {
    filter: hue-rotate(120deg);
  }
  
  .status-not-ready .icon {
    filter: hue-rotate(30deg);
  }
  
  .status-error .icon {
    filter: hue-rotate(0deg);
  }
`;

// 스타일 주입
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// React 앱 렌더링
const container = document.getElementById('popup-root');
if (container) {
  // 초기 로딩 상태 제거
  container.innerHTML = '';
  
  const root = createRoot(container);
  root.render(<PopupApp />);
  
  console.log('✅ Popup React 앱 마운트 성공');
} else {
  console.error('❌ Popup root container not found');
  // 비상 상황 대비
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; color: #dc2626;">
      <h3>오류 발생</h3>
      <p>Popup 컴탈이너를 찾을 수 없습니다.</p>
      <small>popup-root 요소가 필요합니다.</small>
    </div>
  `;
}
