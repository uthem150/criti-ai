import React, { useState, useEffect } from "react";
import type { TrustAnalysis } from "@criti-ai/shared";
import {
  SidebarContainer,
  ScoreDisplay,
  AnalysisSection,
} from "./Sidebar.style";
import { TrustMeter } from "../TrustMeter";
import { BiasHighlights } from "../BiasHighlights";
import { LogicalFallacies } from "../LogicalFallacies";

interface SidebarProps {
  analysis: TrustAnalysis | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export const AnalysisSidebar: React.FC<SidebarProps> = ({
  analysis,
  isAnalyzing,
  onAnalyze,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SidebarContainer isVisible={isVisible}>
      <div className="header">
        <h3>��� 크리티 AI</h3>
        <p>뉴스 신뢰도 분석</p>
      </div>

      {!analysis && !isAnalyzing && (
        <div className="analyze-prompt">
          <button onClick={onAnalyze} className="analyze-button">
            이 기사 분석하기
          </button>
          <p className="description">
            AI가 이 기사의 신뢰도와
            <br />
            편향성을 분석해드립니다
          </p>
        </div>
      )}

      {isAnalyzing && (
        <div className="loading">
          <div className="spinner" />
          <p>AI가 기사를 분석 중입니다...</p>
        </div>
      )}

      {analysis && (
        <>
          <ScoreDisplay>
            <TrustMeter score={analysis.overallScore} />
          </ScoreDisplay>

          <AnalysisSection>
            <h4>��� 상세 분석</h4>

            <div className="metric">
              <span className="label">출처 신뢰도</span>
              <span className="value">
                {analysis.sourceCredibility.score}/100
              </span>
            </div>

            <div className="metric">
              <span className="label">감정적 편향</span>
              <span className="value">
                {analysis.biasAnalysis.emotionalBias.intensity}
              </span>
            </div>

            {analysis.logicalFallacies.length > 0 && (
              <div className="metric warning">
                <span className="label">논리적 오류</span>
                <span className="value">
                  {analysis.logicalFallacies.length}개 발견
                </span>
              </div>
            )}
          </AnalysisSection>

          <BiasHighlights highlights={analysis.biasAnalysis.highlightedTexts} />
          <LogicalFallacies fallacies={analysis.logicalFallacies} />
        </>
      )}
    </SidebarContainer>
  );
};
