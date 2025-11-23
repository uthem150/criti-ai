import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import * as S from "./popup.style";
import Magnifier from "@/assets/icons/magnifier.svg?react";
import Logo from "@/assets/icons/CritiAI_Logo.svg?react";
import CartBar from "@/assets/icons/chart-bar.svg?react";
import Seeding from "@/assets/icons/seeding.svg?react";

import styled from "@emotion/styled";

const StyledMagnifier = styled(Magnifier)`
  display: flex;
  width: 4.5rem;
  height: 4.5rem;
  padding: 0.32975rem;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;

  animation: bounce 2s infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

export const PopupApp: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "ready" | "not_ready" | "error"
  >("checking");

  // Tab 정보 및 Content Script 상태 확인
  useEffect(() => {
    let isMounted = true;

    const checkContentScript = async () => {
      try {
        console.log("🔍 현재 탭 정보 확인 중...");

        // 현재 활성 탭 가져오기
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!isMounted) return;

        if (!tab?.id || !tab.url) {
          console.log("❌ 유효하지 않은 탭");
          setConnectionStatus("error");
          return;
        }

        setCurrentTab(tab);
        console.log("📍 현재 탭:", { url: tab.url, title: tab.title });

        // Content Script 준비 상태 확인 (ping)
        console.log("📡 Content Script ping 전송 중...");

        const response = await chrome.tabs.sendMessage(tab.id, {
          action: "ping",
        });

        if (!isMounted) return;

        console.log("📨 Content Script 응답:", response);

        if (response?.success && response?.ready) {
          setConnectionStatus("ready");
          console.log("✅ Content Script 준비 완료");
        } else {
          setConnectionStatus("not_ready");
          console.log(
            "⚠️ Content Script 준비되지 않음:",
            response?.reason || "unknown"
          );
        }
      } catch (pingError) {
        if (!isMounted) return;

        console.log("❌ Content Script ping 실패:", pingError);
        setConnectionStatus("not_ready");

        // 재시도 로직 (최대 3번)
        let retryCount = 0;
        const maxRetries = 3;

        const retryPing = async () => {
          while (retryCount < maxRetries && isMounted) {
            retryCount++;
            console.log(`🔄 재시도 ${retryCount}/${maxRetries}`);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            try {
              const [currentTab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
              });
              if (!currentTab?.id) continue;

              const retryResponse = await chrome.tabs.sendMessage(
                currentTab.id,
                { action: "ping" }
              );

              if (retryResponse?.success && retryResponse?.ready) {
                console.log("✅ 재시도 성공");
                if (isMounted) {
                  setConnectionStatus("ready");
                }
                return;
              }
            } catch {
              console.log(`❌ 재시도 ${retryCount} 실패`);
            }
          }

          // 모든 재시도 실패
          if (isMounted) {
            console.log("❌ 모든 재시도 실패");
            setConnectionStatus("error");
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
      console.log("❌ 현재 탭 정보가 없습니다.");
      return;
    }

    setIsAnalyzing(true);
    console.log("📊 분석 시작 요청");

    try {
      // Content Script에 사이드바 토글 메시지 전송
      const response = await chrome.tabs.sendMessage(currentTab.id, {
        action: "toggleSidebar",
      });

      console.log("📨 사이드바 토글 응답:", response);

      if (response?.success) {
        console.log("✅ 사이드바 토글 성공");
        // 팝업 창 닫기 (선택사항)
        window.close();
      } else {
        console.log("❌ 사이드바 토글 실패");
      }
    } catch (toggleError) {
      console.error("❌ 사이드바 토글 에러:", toggleError);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChallengeClick = () => {
    // Challenge 웹 페이지로 이동 (개발 환경)
    const challengeUrl =
      process.env.NODE_ENV === "production"
        ? "https://criti-ai-challenge.vercel.app"
        : "http://localhost:3000/challenge";

    chrome.tabs.create({ url: challengeUrl });
    console.log("🎮 Challenge 페이지로 이동:", challengeUrl);
  };

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case "checking":
        return (
          <S.StatusContainer status="checking">
            <S.Spinner />
            <S.StatusDescription>
              페이지 연결 상태 확인 중...
              <br />
              <small>Content Script 로딩을 기다리고 있습니다.</small>
            </S.StatusDescription>
          </S.StatusContainer>
        );

      case "ready":
        return (
          <S.StatusContainer status="ready">
            <S.GreetingContainer>
              <StyledMagnifier />
              <S.StatusTitle>신뢰도 분석 준비 완료</S.StatusTitle>
              {currentTab?.title && (
                <S.CurrentPage>
                  <small>
                    📄 {currentTab.title.substring(0, 50)}
                    {currentTab.title.length > 50 ? "..." : ""}
                  </small>
                </S.CurrentPage>
              )}
            </S.GreetingContainer>
          </S.StatusContainer>
        );

      case "not_ready":
        return (
          <S.StatusContainer status="not_ready">
            <S.Icon status="not_ready">⚠️</S.Icon>
            <S.StatusTitle>분석 준비 중</S.StatusTitle>
            <S.StatusDescription>
              페이지가 아직 완전히 로드되지 않았거나,
              <br /> 분석할 수 있는 콘텐츠가 부족합니다.
            </S.StatusDescription>
            <S.RetryButton onClick={() => window.location.reload()}>
              <S.ButtonTitle type="analyze">다시 시도</S.ButtonTitle>
            </S.RetryButton>
            <small>
              💡 뉴스, 블로그, 게시글 등 텍스트 콘텐츠가 있는 페이지에서
              사용하세요.
            </small>
          </S.StatusContainer>
        );

      case "error":
        return (
          <S.StatusContainer status="error">
            <S.Icon status="error">❌</S.Icon>
            <S.StatusTitle>연결 실패</S.StatusTitle>
            <S.StatusDescription>
              현재 페이지는 분석할 수 없습니다.
            </S.StatusDescription>
            <S.ErrorDetails>
              <small>
                다음과 같은 페이지는 분석이 제한됩니다:
                <br />
                • Chrome 확장 프로그램 페이지
                <br />
                • Chrome 설정 페이지
                <br />
                • 파일 시스템 페이지
                <br />• 텍스트 내용이 부족한 페이지
              </small>
            </S.ErrorDetails>
            <S.DemoButton
              onClick={() =>
                chrome.tabs.create({ url: "https://news.naver.com" })
              }
            >
              <S.ButtonTitle type="analyze">
                📰 네이버 뉴스로 테스트
              </S.ButtonTitle>
            </S.DemoButton>
          </S.StatusContainer>
        );

      default:
        return null;
    }
  };

  return (
    <S.PopupContainer>
      <S.Header>
        <S.LogoWrapper>
          <Logo />
          <h2>Criti AI</h2>
        </S.LogoWrapper>
      </S.Header>

      <S.Main>
        {renderConnectionStatus()}

        <S.OptionWrapper>
          {connectionStatus === "ready" ? (
            <S.AnalyzeButton onClick={handleAnalyzeClick} type="analyze">
              {isAnalyzing ? (
                <>
                  <S.Spinner small />
                  분석 중...
                </>
              ) : (
                <S.ButtonContent>
                  <S.ButtonTitleWrapper>
                    <CartBar />
                    <S.ButtonTitle type="analyze">분석 시작하기</S.ButtonTitle>
                  </S.ButtonTitleWrapper>
                  <S.ButtonDescription type="analyze">
                    AI가 해당 콘텐츠의 신뢰도, 편향성, 광고 등을
                    <br /> 종합적으로 분석합니다.
                  </S.ButtonDescription>
                </S.ButtonContent>
              )}
            </S.AnalyzeButton>
          ) : (
            ""
          )}
          <S.ChallengeButton onClick={handleChallengeClick}>
            <S.ButtonContent>
              <S.ButtonTitleWrapper>
                <Seeding />
                <S.ButtonTitle type="challenge">
                  비판적 사고 훈련하기
                </S.ButtonTitle>
              </S.ButtonTitleWrapper>

              <S.ButtonDescription type="challenge">
                AI가 생성한 챌린지를 통해 <br />
                가짜뉴스를 판별하는 능력을 기르세요!
              </S.ButtonDescription>
            </S.ButtonContent>
          </S.ChallengeButton>
        </S.OptionWrapper>
      </S.Main>
    </S.PopupContainer>
  );
};

// 기존 인라인 스타일 제거

// 스타일링
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  
  body {
    font-family: 'Pretendard', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', sans-serif;
    width: 380px;
    min-height: 550px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    color: #1e293b;
    line-height: 1.5;
  }
`;
// 스타일 주입
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// React 앱 렌더링
const container = document.getElementById("popup-root");
if (container) {
  // 초기 로딩 상태 제거
  container.innerHTML = "";

  const root = createRoot(container);
  root.render(<PopupApp />);

  console.log("✅ Popup React 앱 마운트 성공");
} else {
  console.error("❌ Popup root container not found");
  // 비상 상황 대비
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; color: #dc2626;">
      <h3>오류 발생</h3>
      <p>Popup 컨테이너를 찾을 수 없습니다.</p>
      <small>popup-root 요소가 필요합니다.</small>
    </div>
  `;
}
