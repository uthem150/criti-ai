import React, { useState, useEffect } from "react";
import type { TrustAnalysis } from "@shared/types";
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
      {/* 단순한 닫기 버튼 */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 10
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(107, 114, 128, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#6b7280',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            const btn = e.target as HTMLButtonElement;
            btn.style.background = 'rgba(239, 68, 68, 0.1)';
            btn.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            const btn = e.target as HTMLButtonElement;
            btn.style.background = 'rgba(107, 114, 128, 0.1)';
            btn.style.color = '#6b7280';
          }}
          title="닫기"
        >
          ✕
        </button>
      </div>

      {/* 제목 영역 */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '20px', 
          fontWeight: '700',
          color: '#0ea5e9',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🔍 크리티 AI
        </h3>
        <p style={{ 
          margin: '4px 0 0 0', 
          fontSize: '14px', 
          color: '#6b7280' 
        }}>
          뉴스 신뢰도 분석
        </p>
      </div>

      {!analysis && !isAnalyzing && (
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <button 
            onClick={onAnalyze}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)'
            }}
            onMouseEnter={(e) => {
              const btn = e.target as HTMLButtonElement;
              btn.style.transform = 'translateY(-1px)';
              btn.style.boxShadow = '0 4px 8px rgba(14, 165, 233, 0.3)';
            }}
            onMouseLeave={(e) => {
              const btn = e.target as HTMLButtonElement;
              btn.style.transform = 'translateY(0)';
              btn.style.boxShadow = '0 2px 4px rgba(14, 165, 233, 0.2)';
            }}
          >
            이 기사 분석하기
          </button>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#6b7280', 
            lineHeight: '1.5' 
          }}>
            AI가 이 기사의 신뢰도와<br />
            편향성을 분석해드립니다
          </p>
        </div>
      )}

      {isAnalyzing && (
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #0ea5e9',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ margin: 0, color: '#6b7280' }}>
            AI가 기사를 분석 중입니다...
          </p>
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `
          }} />
        </div>
      )}

      {analysis && (
        <div style={{ padding: '0 0 24px 0' }}>
          <ScoreDisplay>
            <TrustMeter score={analysis.overallScore} />
          </ScoreDisplay>

          <AnalysisSection>
            <h4>📋 상세 분석</h4>

            <div className="metric">
              <span className="label">출처 신뢰도</span>
              <span className="value">
                {analysis.sourceCredibility.score}/100
              </span>
            </div>

            <div className="metric">
              <span className="label">감정적 편향</span>
              <span className="value">
                {analysis.biasAnalysis.emotionalBias.intensity === 'high' ? '높음' : 
                 analysis.biasAnalysis.emotionalBias.intensity === 'medium' ? '보통' : '낮음'}
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
        </div>
      )}
    </SidebarContainer>
  );
};
