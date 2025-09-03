import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  PopupContainer,
  Header,
  GuideSection,
  GuideCard,
  StatusText,
  ActionButton,
  FeaturesList,
  FeatureItem
} from './popup.style';
import './popup.css';

export const PopupApp: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState<chrome.tabs.Tab | null>(null);
  const [isAnalyzable, setIsAnalyzable] = React.useState(false);

  React.useEffect(() => {
    // 현재 탭 정보 가져오기
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentTab(tabs[0]);
        // URL을 바탕으로 분석 가능 여부 판단
        const url = tabs[0].url || '';
        const isValidPage = !url.startsWith('chrome://') && 
                           !url.startsWith('chrome-extension://') && 
                           !url.startsWith('about:');
        setIsAnalyzable(isValidPage);
      }
    });
  }, []);

  const handleOpenChallenge = () => {
    chrome.tabs.create({ url: 'http://localhost:5173/challenge.html' });
  };

  const handleGoToNewsPage = () => {
    chrome.tabs.create({ url: 'https://news.naver.com' });
  };

  const handleOpenSidebar = async () => {
    if (!currentTab?.id) return;

    try {
      // 현재 탭에서 content script의 toggleSidebar 호출
      await chrome.tabs.sendMessage(currentTab.id, { action: 'toggleSidebar' });
      
      // 팝업 닫기 (선택적)
      window.close();
    } catch (error) {
      console.error('사이드바 열기 실패:', error);
      
      // content script가 로드되지 않았을 경우 대안
      try {
        await chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: () => {
            interface CritiAIWindow extends Window {
              critiAI?: {
                toggleSidebar: () => void;
              };
            }
            
            const globalWindow = window as CritiAIWindow;
            if (globalWindow.critiAI?.toggleSidebar) {
              globalWindow.critiAI.toggleSidebar();
            } else {
              alert('페이지를 새로고침 후 다시 시도해주세요.');
            }
          }
        });
        window.close();
      } catch (scriptError) {
        console.error('스크립트 실행 실패:', scriptError);
      }
    }
  };

  return (
    <PopupContainer>
      <Header>
        <h2>
          🔍 크리티 AI
        </h2>
        <p>뉴스 신뢰도 분석기</p>
      </Header>
      
      <GuideSection>
        <GuideCard>
          <h3>📊 사용법</h3>
          <ol>
            <li>뉴스 기사 페이지로 이동</li>
            <li>우측에 나타나는 사이드바 확인</li>
            <li>"이 기사 분석하기" 클릭</li>
            <li>AI 분석 결과 확인</li>
          </ol>
        </GuideCard>

        <FeaturesList>
          <FeatureItem>
            <div className="icon">🎯</div>
            <div className="content">
              <div className="title">편향 탐지</div>
              <p className="description">감정적 유도나 선동적 표현을 찾아냅니다</p>
            </div>
          </FeatureItem>

          <FeatureItem>
            <div className="icon">🧠</div>
            <div className="content">
              <div className="title">논리적 오류</div>
              <p className="description">성급한 일반화, 허수아비 공격 등을 분석합니다</p>
            </div>
          </FeatureItem>

          <FeatureItem>
            <div className="icon">🔗</div>
            <div className="content">
              <div className="title">출처 검증</div>
              <p className="description">언론사 신뢰도와 도메인을 확인합니다</p>
            </div>
          </FeatureItem>
        </FeaturesList>
      </GuideSection>

      <StatusText>
        {isAnalyzable ? (
          <>
            🎩 현재 페이지에서 분석이 가능합니다!<br />
            아래 버튼으로 사이드바를 열어보세요
          </>
        ) : (
          <>
            현재 페이지에서 분석을 시작하려면<br />
            뉴스 기사로 이동해주세요
          </>
        )}
      </StatusText>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isAnalyzable && (
          <ActionButton 
            onClick={handleOpenSidebar}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              fontWeight: '700',
              fontSize: '16px'
            }}
          >
            🔍 지금 분석 시작하기
          </ActionButton>
        )}
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <ActionButton onClick={handleGoToNewsPage}>
            📰 뉴스 보러가기
          </ActionButton>
          <ActionButton onClick={handleOpenChallenge}>
            🎮 챌린지 게임
          </ActionButton>
        </div>
      </div>
    </PopupContainer>
  );
};

const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}
