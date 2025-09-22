import React, { useState, useEffect } from "react";
import type { TrustAnalysis } from "@shared/types";
import { sidebarStyles } from "./Sidebar.style";

interface SidebarProps {
  analysis: TrustAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  onAnalyze: () => void;
  onClose?: () => void;
  onSectionClick?: (sectionType: string, itemText?: string) => void;
}

interface ExpandableSectionProps {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  sectionType?: string;
}

interface ClickableTextProps {
  text: string;
  type: "bias" | "fallacy" | "manipulation" | "advertisement" | "claim";
  className?: string;
  onTextClick?: (text: string, type: string) => void;
  children?: React.ReactNode;
}

// 클릭 가능한 텍스트 컴포넌트
const ClickableText: React.FC<ClickableTextProps> = ({
  text,
  type,
  className = "",
  onTextClick,
  children,
}) => {
  const handleClick = () => {
    console.log("📝 사이드바에서 텍스트 클릭:", text, type);

    if (onTextClick) {
      onTextClick(text, type);
    }

    // 향상된 스크롤 로직
    const critiAI = window.critiAI;
    if (critiAI?.scrollToHighlightByText) {
      const success = critiAI.scrollToHighlightByText(text, type);
      if (success) {
        console.log("✅ 스크롤 성공:", text);
      } else {
        console.log("❌ 스크롤 실패:", text);
        // 백업 전략: 더 느슨한 매칭
        const allHighlights = document.querySelectorAll(".criti-ai-highlight");
        let found = false;

        for (const highlight of allHighlights) {
          const highlightText =
            highlight.textContent?.toLowerCase().trim() || "";
          const searchText = text.toLowerCase().trim();

          // 더 유연한 매칭 (부분 일치, 20% 이상 일치)
          const similarity = calculateTextSimilarity(highlightText, searchText);
          if (similarity > 0.2) {
            highlight.scrollIntoView({ behavior: "smooth", block: "center" });
            highlight.classList.add("criti-ai-highlight-focused");
            setTimeout(() => {
              highlight.classList.remove("criti-ai-highlight-focused");
            }, 2000);
            found = true;
            console.log("✅ 백업 스크롤 성공 (유사도:", similarity, ")");
            break;
          }
        }

        if (!found) {
          console.log("⚠️ 어떤 방법으로도 하이라이트를 찾을 수 없음");
        }
      }
    }
  };

  // 텍스트 유사도 계산 함수
  const calculateTextSimilarity = (text1: string, text2: string): number => {
    if (text1.length === 0 && text2.length === 0) return 1.0;
    if (text1.length === 0 || text2.length === 0) return 0.0;

    // 단순한 부분 일치 및 단어 매칭 체크
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    let matchCount = 0;

    for (const word1 of words1) {
      if (
        word1.length > 2 &&
        words2.some((word2) => word2.includes(word1) || word1.includes(word2))
      ) {
        matchCount++;
      }
    }

    return matchCount / Math.max(words1.length, words2.length);
  };

  return (
    <span
      className={`clickable-text clickable-${type} ${className}`}
      onClick={handleClick}
      title="클릭하여 본문에서 찾기"
      style={{ cursor: "pointer" }}
    >
      {children || text}
    </span>
  );
};

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  badge,
  badgeColor = "#0ea5e9",
  sectionType,
}) => (
  <div className="expandable-section" data-section={sectionType}>
    <button className="section-header" onClick={onToggle}>
      <div className="header-left">
        <span className="section-icon">{icon}</span>
        <span className="section-title">{title}</span>
        {badge && (
          <span
            className="section-badge"
            style={{ backgroundColor: badgeColor }}
          >
            {badge}
          </span>
        )}
      </div>
      <span className={`expand-arrow ${isExpanded ? "expanded" : ""}`}>▼</span>
    </button>
    {isExpanded && <div className="section-content">{children}</div>}
  </div>
);

export const AnalysisSidebar: React.FC<SidebarProps> = ({
  analysis,
  isAnalyzing,
  error,
  onAnalyze,
  onClose,
  onSectionClick,
}) => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    overview: true,
    source: false,
    bias: false,
    logic: false,
    advertisement: false,
    crossref: false,
  });

  useEffect(() => {
    // 스타일 주입
    if (!document.querySelector("#criti-ai-sidebar-styles")) {
      const style = document.createElement("style");
      style.id = "criti-ai-sidebar-styles";
      style.textContent = sidebarStyles.styles;
      document.head.appendChild(style);
    }
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleTextClick = (text: string, type: string) => {
    console.log("📍 사이드바에서 텍스트 클릭:", text, type);
    onSectionClick?.(type, text);
  };

  // 전체 컨테이너 스타일 - 최소 높이 보장
  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={containerStyle}>
      <div className="close-button-container">
        <button
          className="close-button"
          onClick={onClose}
          type="button"
          title="닫기"
        >
          ✕
        </button>
      </div>

      <div className="header-section">
        <h3>🔍 Criti AI</h3>
        <p>콘텐츠 신뢰도 종합 분석</p>
      </div>

      {error && (
        <div className="error-section">
          <div className="error-icon">❌</div>
          <h3>연결 오류</h3>
          <p>{error}</p>

          <div className="error-solutions">
            <h4>🔧 해결 방법:</h4>
            <ul>
              <li>백엔드 서버 실행 확인 (http://localhost:3001)</li>
              <li>API 키 설정 확인</li>
              <li>네트워크 연결 상태 확인</li>
            </ul>
          </div>

          <div className="error-actions">
            <button
              onClick={() => window.location.reload()}
              className="error-button primary"
            >
              🔄 새로고침
            </button>
            <button onClick={onAnalyze} className="error-button secondary">
              ⚡ 재시도
            </button>
          </div>
        </div>
      )}

      {!analysis && !isAnalyzing && !error && (
        <div className="welcome-section">
          <div className="welcome-icon">🎯</div>
          <h3>분석 시작하기</h3>
          <p>
            AI가 이 콘텐츠의 신뢰도, 편향성, 광고성을 종합적으로 분석해드립니다
          </p>
          <button onClick={onAnalyze} className="analyze-button">
            <span className="button-icon">🔍</span>이 글 분석하기
          </button>

          <div className="analysis-features">
            <div className="feature-item">
              <span className="feature-icon">🏛️</span>
              <span>출처 신뢰도</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎭</span>
              <span>편향성 분석</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🧠</span>
              <span>논리적 오류</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>광고성 탐지</span>
            </div>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="loading-section">
          <div className="loading-animation">
            <div className="spinner"></div>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <h3>AI 분석 진행중...</h3>
          <p>신뢰도, 편향성, 광고성, 논리적 오류를 종합 분석하고 있습니다</p>

          <div className="analysis-steps">
            <div className="step active">📊 데이터 수집</div>
            <div className="step active">🔍 패턴 분석</div>
            <div className="step active">🎯 결과 생성</div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="results-section">
          {/* 전체 점수 섹션 */}
          <ExpandableSection
            title="종합 분석 결과"
            icon="📊"
            isExpanded={expandedSections.overview}
            onToggle={() => toggleSection("overview")}
            badge={`${analysis.overallScore}/100`}
            badgeColor={
              analysis.overallScore >= 70
                ? "#10b981"
                : analysis.overallScore >= 50
                  ? "#f59e0b"
                  : "#ef4444"
            }
            sectionType="overview"
          >
            <div className="overview-content">
              <div className="overall-score-display">
                <div className="score-circle">
                  <div className="score-number">{analysis.overallScore}</div>
                  <div className="score-label">신뢰도 점수</div>
                </div>
                <div className="score-description">
                  <h4>🎯 분석 요약</h4>
                  <p>{analysis.analysisSummary}</p>
                </div>
              </div>

              {analysis.detailedScores && (
                <div className="detailed-scores">
                  <h4>📈 상세 점수</h4>
                  <div className="score-bars">
                    <div className="score-bar">
                      <div className="bar-info">
                        <span className="bar-label">🏛️ 출처</span>
                        <span className="bar-value">
                          {analysis.detailedScores.sourceScore}
                        </span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill source"
                          style={{
                            width: `${analysis.detailedScores.sourceScore}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="score-bar">
                      <div className="bar-info">
                        <span className="bar-label">⚖️ 객관성</span>
                        <span className="bar-value">
                          {analysis.detailedScores.objectivityScore}
                        </span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill objectivity"
                          style={{
                            width: `${analysis.detailedScores.objectivityScore}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="score-bar">
                      <div className="bar-info">
                        <span className="bar-label">🧠 논리성</span>
                        <span className="bar-value">
                          {analysis.detailedScores.logicScore}
                        </span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill logic"
                          style={{
                            width: `${analysis.detailedScores.logicScore}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="score-bar">
                      <div className="bar-info">
                        <span className="bar-label">🚫 광고성</span>
                        <span className="bar-value">
                          {analysis.detailedScores.advertisementScore}
                        </span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill advertisement"
                          style={{
                            width: `${analysis.detailedScores.advertisementScore}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="score-bar">
                      <div className="bar-info">
                        <span className="bar-label">📚 근거</span>
                        <span className="bar-value">
                          {analysis.detailedScores.evidenceScore}
                        </span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill evidence"
                          style={{
                            width: `${analysis.detailedScores.evidenceScore}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ExpandableSection>

          {/* 출처 신뢰도 섹션 */}
          <ExpandableSection
            title="출처 신뢰도"
            icon="🏛️"
            isExpanded={expandedSections.source}
            onToggle={() => toggleSection("source")}
            badge={`${analysis.sourceCredibility.score}/100`}
            badgeColor={
              analysis.sourceCredibility.level === "trusted"
                ? "#10b981"
                : analysis.sourceCredibility.level === "neutral"
                  ? "#6b7280"
                  : analysis.sourceCredibility.level === "caution"
                    ? "#f59e0b"
                    : "#ef4444"
            }
            sectionType="source"
          >
            <div className="source-content">
              <div className="trust-level">
                <span
                  className={`trust-badge ${analysis.sourceCredibility.level}`}
                >
                  {analysis.sourceCredibility.level === "trusted"
                    ? "✅ 신뢰할 만함"
                    : analysis.sourceCredibility.level === "neutral"
                      ? "⚖️ 중립적"
                      : analysis.sourceCredibility.level === "caution"
                        ? "⚠️ 주의 필요"
                        : "🚨 신뢰하기 어려움"}
                </span>
              </div>

              <div className="source-details">
                <h4>📰 {analysis.sourceCredibility.domain}</h4>
                <p className="source-description">
                  {analysis.sourceCredibility.reputation.description}
                </p>

                <div className="reputation-factors">
                  <h5>평가 근거:</h5>
                  <div className="factor-tags">
                    {analysis.sourceCredibility.reputation.factors.map(
                      (factor, idx) => (
                        <span key={idx} className="factor-tag">
                          • {factor}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {analysis.sourceCredibility.reputation
                  .historicalReliability && (
                  <div className="historical-data">
                    <div className="historical-item">
                      <span className="historical-label">과거 신뢰도:</span>
                      <span className="historical-value">
                        {
                          analysis.sourceCredibility.reputation
                            .historicalReliability
                        }
                        %
                      </span>
                    </div>
                    {analysis.sourceCredibility.reputation.expertiseArea && (
                      <div className="historical-item">
                        <span className="historical-label">전문 분야:</span>
                        <span className="historical-value">
                          {analysis.sourceCredibility.reputation.expertiseArea.join(
                            ", "
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ExpandableSection>

          {/* 편향성 분석 섹션 */}
          <ExpandableSection
            title="편향성 분석"
            icon="🎭"
            isExpanded={expandedSections.bias}
            onToggle={() => toggleSection("bias")}
            badge={`${analysis.biasAnalysis.emotionalBias.score}/100`}
            badgeColor={
              analysis.biasAnalysis.emotionalBias.score >= 70
                ? "#10b981"
                : "#f59e0b"
            }
            sectionType="bias"
          >
            <div className="bias-content">
              {/* 감정적 편향 */}
              <div className="bias-section">
                <h4>💥 감정적 편향</h4>
                <div className="intensity-display">
                  <span
                    className={`intensity-badge ${analysis.biasAnalysis.emotionalBias.intensity}`}
                  >
                    {analysis.biasAnalysis.emotionalBias.intensity === "high"
                      ? "🔥 매우 높음"
                      : analysis.biasAnalysis.emotionalBias.intensity ===
                          "medium"
                        ? "🟡 보통"
                        : analysis.biasAnalysis.emotionalBias.intensity ===
                            "low"
                          ? "🟢 낮음"
                          : "✅ 거의 없음"}
                  </span>
                </div>

                {analysis.biasAnalysis.emotionalBias.manipulativeWords?.length >
                  0 && (
                  <div className="manipulative-words">
                    <h5>🎯 조작적 표현 탐지 (클릭하여 본문에서 찾기):</h5>
                    <div className="words-grid">
                      {analysis.biasAnalysis.emotionalBias.manipulativeWords.map(
                        (wordObj, idx) => {
                          const word =
                            typeof wordObj === "string"
                              ? wordObj
                              : wordObj.word;
                          const explanation =
                            typeof wordObj === "string"
                              ? `조작적 표현: "${word}"`
                              : wordObj.explanation;

                          return (
                            <div key={idx} className="word-item">
                              <div className="word-header">
                                <ClickableText
                                  text={word}
                                  type="manipulation"
                                  onTextClick={handleTextClick}
                                  className={`word-badge ${typeof wordObj === "string" ? "medium" : wordObj.impact}`}
                                >
                                  "{word}"
                                </ClickableText>
                                {typeof wordObj !== "string" && (
                                  <span className="word-category">
                                    {wordObj.category === "emotional"
                                      ? "😭 감정적"
                                      : wordObj.category === "exaggeration"
                                        ? "📈 과장"
                                        : wordObj.category === "urgency"
                                          ? "⏰ 긴급"
                                          : wordObj.category === "authority"
                                            ? "👑 권위"
                                            : wordObj.category === "fear"
                                              ? "😰 공포"
                                              : "⚠️ 기타"}
                                  </span>
                                )}
                              </div>
                              {typeof wordObj !== "string" && (
                                <p className="word-explanation">
                                  {explanation}
                                </p>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 클릭베이트 요소 */}
              {analysis.biasAnalysis.clickbaitElements &&
                analysis.biasAnalysis.clickbaitElements.length > 0 && (
                  <div className="bias-section">
                    <h4>🎣 클릭베이트 요소 (클릭하여 본문에서 찾기)</h4>
                    <div className="clickbait-grid">
                      {analysis.biasAnalysis.clickbaitElements.map(
                        (element, idx) => (
                          <div
                            key={idx}
                            className={`clickbait-item ${element.severity}`}
                          >
                            <div className="clickbait-header">
                              <span className="clickbait-type">
                                {element.type === "curiosity_gap"
                                  ? "🔍 호기심 갭"
                                  : element.type === "emotional_trigger"
                                    ? "💥 감정 트리거"
                                    : element.type === "urgency"
                                      ? "⚡ 긴급성"
                                      : "⭐ 최상급"}
                              </span>
                              <span
                                className={`severity-indicator ${element.severity}`}
                              >
                                {element.severity}
                              </span>
                            </div>
                            <ClickableText
                              text={element.text}
                              type="bias"
                              onTextClick={handleTextClick}
                              className="clickbait-text"
                            >
                              "{element.text}"
                            </ClickableText>
                            <p className="clickbait-explanation">
                              {element.explanation}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* 정치적 편향 */}
              <div className="bias-section">
                <h4>🗳️ 정치적 편향</h4>
                <div className="political-bias">
                  <div className="political-direction">
                    <span
                      className={`political-badge ${analysis.biasAnalysis.politicalBias.direction}`}
                    >
                      {analysis.biasAnalysis.politicalBias.direction === "left"
                        ? "⬅️ 진보적"
                        : analysis.biasAnalysis.politicalBias.direction ===
                            "right"
                          ? "➡️ 보수적"
                          : analysis.biasAnalysis.politicalBias.direction ===
                              "center"
                            ? "🎯 중도"
                            : "⚖️ 중립적"}
                    </span>
                    <span className="confidence">
                      확신도: {analysis.biasAnalysis.politicalBias.confidence}%
                    </span>
                  </div>

                  {analysis.biasAnalysis.politicalBias.indicators &&
                    analysis.biasAnalysis.politicalBias.indicators.length >
                      0 && (
                      <div className="political-indicators">
                        <h5>편향 지표:</h5>
                        <ul>
                          {analysis.biasAnalysis.politicalBias.indicators.map(
                            (indicator, idx) => (
                              <li key={idx}>{indicator}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </ExpandableSection>

          {/* 논리적 오류 섹션 */}
          {analysis.logicalFallacies &&
            analysis.logicalFallacies.length > 0 && (
              <ExpandableSection
                title="논리적 오류"
                icon="🧠"
                isExpanded={expandedSections.logic}
                onToggle={() => toggleSection("logic")}
                badge={`${analysis.logicalFallacies.length}개 발견`}
                badgeColor={
                  analysis.logicalFallacies.length > 3
                    ? "#ef4444"
                    : analysis.logicalFallacies.length > 1
                      ? "#f59e0b"
                      : "#10b981"
                }
                sectionType="logic"
              >
                <div className="logic-content">
                  <div className="fallacies-grid">
                    {analysis.logicalFallacies.map((fallacy, idx) => (
                      <div
                        key={idx}
                        className={`fallacy-item ${fallacy.severity}`}
                      >
                        <div className="fallacy-header">
                          <div className="fallacy-type">
                            <span className="fallacy-icon">
                              {fallacy.severity === "high"
                                ? "🚨"
                                : fallacy.severity === "medium"
                                  ? "⚠️"
                                  : "💡"}
                            </span>
                            <span className="fallacy-name">{fallacy.type}</span>
                          </div>
                          <span
                            className={`severity-badge ${fallacy.severity}`}
                          >
                            {fallacy.severity}
                          </span>
                        </div>

                        <div className="fallacy-content">
                          <p className="fallacy-description">
                            {fallacy.description}
                          </p>

                          {fallacy.affectedText && (
                            <div className="affected-text">
                              <h5>
                                🎯 문제가 된 부분 (클릭하여 본문에서 찾기):
                              </h5>
                              <blockquote>
                                <ClickableText
                                  text={fallacy.affectedText}
                                  type="fallacy"
                                  onTextClick={handleTextClick}
                                >
                                  "{fallacy.affectedText}"
                                </ClickableText>
                              </blockquote>
                            </div>
                          )}

                          <div className="fallacy-explanation">
                            <h5>💡 쉬운 설명:</h5>
                            <p>{fallacy.explanation}</p>
                          </div>

                          {fallacy.examples && fallacy.examples.length > 0 && (
                            <div className="fallacy-examples">
                              <h5>📚 비슷한 예시:</h5>
                              <ul>
                                {fallacy.examples.map((example, exIdx) => (
                                  <li key={exIdx}>{example}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ExpandableSection>
            )}

          {/* 광고성 분석 섹션 */}
          {analysis.advertisementAnalysis && (
            <ExpandableSection
              title="광고성 분석"
              icon="🎯"
              isExpanded={expandedSections.advertisement}
              onToggle={() => toggleSection("advertisement")}
              badge={
                analysis.advertisementAnalysis.isAdvertorial
                  ? "광고성"
                  : "비광고성"
              }
              badgeColor={
                analysis.advertisementAnalysis.isAdvertorial
                  ? "#f59e0b"
                  : "#10b981"
              }
              sectionType="advertisement"
            >
              <div className="advertisement-content">
                <div className="ad-overview">
                  <div className="ad-status">
                    <span
                      className={`ad-badge ${analysis.advertisementAnalysis.isAdvertorial ? "advertorial" : "non-advertorial"}`}
                    >
                      {analysis.advertisementAnalysis.isAdvertorial
                        ? "🚨 광고성 콘텐츠"
                        : "✅ 일반 콘텐츠"}
                    </span>
                    <span className="ad-confidence">
                      확신도: {analysis.advertisementAnalysis.confidence}%
                    </span>
                  </div>

                  <div className="ad-scores">
                    <div className="ad-score-item">
                      <span className="score-label">네이티브 광고:</span>
                      <span className="score-value">
                        {analysis.advertisementAnalysis.nativeAdScore}/100
                      </span>
                    </div>
                    <div className="ad-score-item">
                      <span className="score-label">상업적 의도:</span>
                      <span className="score-value">
                        {analysis.advertisementAnalysis.commercialIntentScore}
                        /100
                      </span>
                    </div>
                  </div>
                </div>

                {analysis.advertisementAnalysis.indicators &&
                  analysis.advertisementAnalysis.indicators.length > 0 && (
                    <div className="ad-indicators">
                      <h4>🔍 광고성 지표 (클릭하여 본문에서 찾기)</h4>
                      <div className="indicators-grid">
                        {analysis.advertisementAnalysis.indicators.map(
                          (indicator, idx) => (
                            <div
                              key={idx}
                              className={`indicator-item weight-${Math.min(indicator.weight, 10)}`}
                            >
                              <div className="indicator-header">
                                <span className="indicator-type">
                                  {indicator.type === "product_mention"
                                    ? "🛍️ 제품 언급"
                                    : indicator.type === "promotional_language"
                                      ? "📢 홍보 언어"
                                      : indicator.type === "call_to_action"
                                        ? "👆 행동 유도"
                                        : indicator.type === "brand_focus"
                                          ? "🏷️ 브랜드 중심"
                                          : indicator.type === "affiliate_link"
                                            ? "🔗 제휴 링크"
                                            : "📝 후원 콘텐츠"}
                                </span>
                                <span className="indicator-weight">
                                  가중치: {indicator.weight}
                                </span>
                              </div>

                              <div className="indicator-evidence">
                                <h5>
                                  📋 발견된 증거 (클릭하여 본문에서 찾기):
                                </h5>
                                <ClickableText
                                  text={indicator.evidence}
                                  type="advertisement"
                                  onTextClick={handleTextClick}
                                >
                                  "{indicator.evidence}"
                                </ClickableText>
                              </div>

                              <div className="indicator-explanation">
                                <h5>💡 설명:</h5>
                                <p>{indicator.explanation}</p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </ExpandableSection>
          )}

          {/* 교차 검증 섹션 */}
          {analysis.crossReference && (
            <ExpandableSection
              title="교차 검증"
              icon="🔍"
              isExpanded={expandedSections.crossref}
              onToggle={() => toggleSection("crossref")}
              badge={
                analysis.crossReference.consensus === "agree"
                  ? "일치"
                  : analysis.crossReference.consensus === "disagree"
                    ? "불일치"
                    : analysis.crossReference.consensus === "mixed"
                      ? "혼재"
                      : "불충분"
              }
              badgeColor={
                analysis.crossReference.consensus === "agree"
                  ? "#10b981"
                  : analysis.crossReference.consensus === "disagree"
                    ? "#ef4444"
                    : "#f59e0b"
              }
              sectionType="crossref"
            >
              <div className="crossref-content">
                {analysis.crossReference.keyClaims &&
                  analysis.crossReference.keyClaims.length > 0 && (
                    <div className="key-claims">
                      <h4>🎯 핵심 주장</h4>
                      <ul className="claims-list">
                        {analysis.crossReference.keyClaims.map((claim, idx) => (
                          <li key={idx} className="claim-item">
                            <ClickableText
                              text={claim}
                              type="claim"
                              onTextClick={handleTextClick}
                            >
                              {claim}
                            </ClickableText>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {analysis.crossReference.relatedArticleKeywords && (
                  <div className="search-keywords">
                    <h4>🔎 추천 검색 키워드</h4>
                    <div className="keywords-box">
                      {analysis.crossReference.relatedArticleKeywords}
                    </div>
                  </div>
                )}

                {analysis.crossReference.factCheckSources &&
                  analysis.crossReference.factCheckSources.length > 0 && (
                    <div className="fact-check-sources">
                      <h4>✅ 팩트체크 소스</h4>
                      <div className="sources-grid">
                        {analysis.crossReference.factCheckSources.map(
                          (source, idx) => (
                            <div
                              key={idx}
                              className={`fact-check-item ${source.verdict}`}
                            >
                              <div className="source-header">
                                <span className="source-org">
                                  {source.organization}
                                </span>
                                <span
                                  className={`verdict-badge ${source.verdict}`}
                                >
                                  {source.verdict === "true"
                                    ? "✅ 사실"
                                    : source.verdict === "false"
                                      ? "❌ 거짓"
                                      : source.verdict === "mixed"
                                        ? "🔄 부분적"
                                        : "❓ 미확인"}
                                </span>
                              </div>
                              <p className="source-summary">{source.summary}</p>
                              {source.url && (
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="source-link"
                                >
                                  🔗 소스 확인하기
                                </a>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <div className="consensus-display">
                  <h4>📊 전체적 합의</h4>
                  <div
                    className={`consensus-badge ${analysis.crossReference.consensus}`}
                  >
                    {analysis.crossReference.consensus === "agree"
                      ? "✅ 대체로 일치함"
                      : analysis.crossReference.consensus === "disagree"
                        ? "❌ 대체로 불일치함"
                        : analysis.crossReference.consensus === "mixed"
                          ? "🔄 의견이 혼재됨"
                          : "❓ 검증 정보 부족"}
                  </div>
                </div>
              </div>
            </ExpandableSection>
          )}

          {/* 분석 팁 */}
          <div className="analysis-tips">
            <h4>💡 비판적 사고 팁</h4>
            <div className="tips-grid">
              <div className="tip-item">
                <span className="tip-icon">🔍</span>
                <p>여러 출처에서 정보를 교차 확인하세요</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">⚖️</span>
                <p>감정적 언어에 휩쓸리지 말고 객관적으로 판단하세요</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🎯</span>
                <p>광고성 콘텐츠는 상업적 목적을 염두에 두고 읽으세요</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🧠</span>
                <p>논리적 근거가 충분한지 스스로 판단해보세요</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
