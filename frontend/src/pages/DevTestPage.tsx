import React from "react";
import { ContentScriptApp } from "../components/ContentScriptApp";

// 개발 테스트용 페이지 - main.tsx에서 사용
const mockProps = {
  url: "https://example.com/news/shocking-discovery",
  title: "충격적인 사실이 밝혀졌다! 전문가들도 놀란 새로운 발견",
  content: `
이번 연구에서 충격적인 사실이 밝혀졌습니다. 
전문가들은 이 결과에 대해 "반드시 주의해야 할 문제"라고 말했습니다.
일부 시민들은 이에 대해 강력히 반발하고 있으며, 
정부는 즉각적인 대응이 필요하다고 발표했습니다.

하지만 다른 전문가들은 이 연구 결과에 대해 의문을 제기하고 있습니다.
단지 몇 개의 사례만으로 전체를 판단하는 것은 성급한 일반화의 오류일 수 있다는 것입니다.

더 많은 연구와 검증이 필요한 상황입니다.
시민들의 현명한 판단이 요구되는 시점입니다.
  `.trim(),
};

export const DevTestPage: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* 가짜 뉴스 기사 영역 */}
      <div
        style={{
          flex: 1,
          padding: "20px 40px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e5e5",
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: "800px" }}>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "10px 15px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              color: "#6c757d",
            }}
          >
            🧪 <strong>개발 테스트 모드</strong> - 실제 뉴스 사이트를
            시뮬레이션합니다
          </div>

          <h1
            style={{
              fontSize: "28px",
              lineHeight: "1.3",
              marginBottom: "20px",
              color: "#333",
            }}
          >
            {mockProps.title}
          </h1>

          <div
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "20px",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>📅 2025년 9월 1일</span> |<span> 📍 example.com</span> |
            <span> 👀 조회수 1,234</span>
          </div>

          <div
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#333",
              whiteSpace: "pre-line",
            }}
          >
            {mockProps.content}
          </div>

          <div
            style={{
              marginTop: "40px",
              padding: "20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#6c757d",
            }}
          >
            💡 <strong>테스트 가이드:</strong>
            <br />
            1. 우측 사이드바에서 "이 기사 분석하기" 클릭
            <br />
            2. AI 분석 결과 확인
            <br />
            3. 편향된 표현이 하이라이트 되는지 확인
            <br />
            4. 신뢰도 점수 확인
          </div>
        </div>
      </div>

      {/* Criti AI 사이드바 영역 */}
      <ContentScriptApp {...mockProps} />
    </div>
  );
};
