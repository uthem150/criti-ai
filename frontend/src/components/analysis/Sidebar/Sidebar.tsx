import React, { useState, useEffect } from "react";
import type { TrustAnalysis } from "@shared/types";
import {
  SidebarContainer,
  ScoreDisplay,
  AnalysisSection,
  CloseButtonContainer,
  CloseButton,
  HeaderSection,
  WelcomeSection,
  LoadingSection,
  ResultsSection,
} from "./Sidebar.style";
import { TrustMeter } from "../TrustMeter";
import { BiasHighlights } from "../BiasHighlights";
import { LogicalFallacies } from "../LogicalFallacies";

interface SidebarProps {
  analysis: TrustAnalysis | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onClose?: () => void;
}

export const AnalysisSidebar: React.FC<SidebarProps> = ({
  analysis,
  isAnalyzing,
  onAnalyze,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SidebarContainer isVisible={isVisible}>
      <CloseButtonContainer>
        <CloseButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("🔴 사이드바 닫기 버튼 클릭!");
            if (onClose && typeof onClose === "function") {
              onClose();
            } else {
              console.error("❌ onClose 함수가 없거나 잘못되었습니다");
            }
          }}
          type="button"
          title="닫기"
        >
          ✕
        </CloseButton>
      </CloseButtonContainer>

      <HeaderSection>
        <h3>🔍 Criti AI</h3>
        <p>뉴스 신뢰도 분석</p>
      </HeaderSection>

      {!analysis && !isAnalyzing && (
        <WelcomeSection>
          <button onClick={onAnalyze}>이 기사 분석하기</button>
          <p>
            AI가 이 기사의 신뢰도와
            <br />
            편향성을 분석해드립니다
          </p>
        </WelcomeSection>
      )}

      {isAnalyzing && (
        <LoadingSection>
          <div className="spinner" />
          <p>AI가 기사를 분석 중입니다...</p>
        </LoadingSection>
      )}

      {analysis && (
        <ResultsSection>
          <ScoreDisplay>
            <TrustMeter score={analysis.overallScore} />
          </ScoreDisplay>

          <AnalysisSection>
            <h4>📋 상세 분석</h4>

            {/* 출처 신뢰도 상세 정보 */}
            <div className="detailed-metric">
              <div className="metric-header">
                <span className="label">🏛️ 출처 신뢰도</span>
                <span className="score">
                  {analysis.sourceCredibility.score}/100
                </span>
              </div>
              <div className="metric-details">
                <div
                  className="level-badge"
                  data-level={analysis.sourceCredibility.level}
                >
                  {analysis.sourceCredibility.level === "trusted"
                    ? "✅ 신뢰함"
                    : analysis.sourceCredibility.level === "neutral"
                      ? "⚖️ 중립적"
                      : analysis.sourceCredibility.level === "caution"
                        ? "⚠️ 주의"
                        : "🚨 위험"}
                </div>
                <p className="reputation-desc">
                  {analysis.sourceCredibility.reputation.description}
                </p>
                <div className="reputation-factors">
                  {analysis.sourceCredibility.reputation.factors.map(
                    (factor, idx) => (
                      <span key={idx} className="factor-tag">
                        • {factor}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* 편향성 분석 상세 정보 */}
            <div className="detailed-metric">
              <div className="metric-header">
                <span className="label">🎭 감정적 편향</span>
                <span className="score">
                  {analysis.biasAnalysis.emotionalBias.score}/100
                </span>
              </div>
              <div className="metric-details">
                <div
                  className="intensity-badge"
                  data-intensity={analysis.biasAnalysis.emotionalBias.intensity}
                >
                  {analysis.biasAnalysis.emotionalBias.intensity === "high"
                    ? "🔥 높음"
                    : analysis.biasAnalysis.emotionalBias.intensity === "medium"
                      ? "🟡 보통"
                      : "🟢 낮음"}
                </div>
                {analysis.biasAnalysis.emotionalBias.manipulativeWords?.length >
                  0 && (
                  <div className="manipulative-words">
                    <p className="words-label">감정적 표현 감지:</p>
                    <div className="words-list">
                      {analysis.biasAnalysis.emotionalBias.manipulativeWords.map(
                        (word, idx) => (
                          <span key={idx} className="word-tag">
                            "{word}"
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 정치적 편향 */}
            <div className="detailed-metric">
              <div className="metric-header">
                <span className="label">🗳️ 정치적 편향</span>
                <span className="confidence">
                  {analysis.biasAnalysis.politicalBias.confidence}% 확신
                </span>
              </div>
              <div className="metric-details">
                <div
                  className="political-badge"
                  data-direction={analysis.biasAnalysis.politicalBias.direction}
                >
                  {analysis.biasAnalysis.politicalBias.direction === "left"
                    ? "⬅️ 진보적"
                    : analysis.biasAnalysis.politicalBias.direction === "right"
                      ? "➡️ 보수적"
                      : analysis.biasAnalysis.politicalBias.direction ===
                          "center"
                        ? "🎯 중도"
                        : "⚖️ 중립적"}
                </div>
              </div>
            </div>

            {/* 논리적 오류 요약 */}
            {analysis.logicalFallacies &&
              analysis.logicalFallacies.length > 0 && (
                <div className="detailed-metric warning">
                  <div className="metric-header">
                    <span className="label">🧠 논리적 오류</span>
                    <span className="count">
                      {analysis.logicalFallacies.length}개 발견
                    </span>
                  </div>
                  <div className="metric-details">
                    <div className="fallacy-summary">
                      {analysis.logicalFallacies.map((fallacy, idx) => (
                        <div key={idx} className="fallacy-preview">
                          <span className="fallacy-type">{fallacy.type}</span>
                          <span
                            className={`severity-dot ${fallacy.severity}`}
                            title={`심각도: ${fallacy.severity}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </AnalysisSection>

          <BiasHighlights highlights={analysis.biasAnalysis.highlightedTexts} />
          <LogicalFallacies fallacies={analysis.logicalFallacies} />
        </ResultsSection>
      )}
    </SidebarContainer>
  );
};
