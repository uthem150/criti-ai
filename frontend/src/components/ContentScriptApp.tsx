import React, { useState } from 'react';
import type { TrustAnalysis } from '@criti-ai/shared';
import { AnalysisSidebar } from './analysis/Sidebar';
import { TextHighlighter } from './analysis/TextHighlighter';

interface ContentScriptAppProps {
  url: string;
  title: string;
  content: string;
}

export const ContentScriptApp: React.FC<ContentScriptAppProps> = ({
  url,
  title,
  content
}) => {
  const [analysis, setAnalysis] = useState<TrustAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log('🔍 분석 시작:', { url, title, contentLength: content.length });
      
      // Backend API 호출
      const response = await fetch('http://localhost:3001/api/analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          title,
          content: content.substring(0, 1000) // API 호출 비용 절약을 위해 앞부분만
        })
      });

      const result = await response.json();
      console.log('📊 API 응답:', result);

      if (result.success) {
        setAnalysis(result.data);
        console.log('✅ 분석 완료:', result.data);
      } else {
        throw new Error(result.error || '분석 실패');
      }
    } catch (error) {
      console.error('❌ 분석 에러:', error);
      
      // 에러 발생 시 더미 데이터로 대체 (개발 테스트용)
      console.log('🔄 더미 데이터로 대체');
      setAnalysis({
        overallScore: 65,
        sourceCredibility: {
          score: 70,
          level: 'neutral',
          domain: new URL(url).hostname,
          reputation: {
            description: '일반적인 뉴스 사이트',
            factors: ['도메인 확인됨', '일반적인 평판']
          }
        },
        biasAnalysis: {
          emotionalBias: {
            score: 75,
            manipulativeWords: ['충격적인', '반드시', '강력히'],
            intensity: 'high'
          },
          politicalBias: {
            direction: 'neutral',
            confidence: 60
          },
          highlightedTexts: [
            {
              text: '충격적인 사실이 밝혀졌습니다',
              type: 'bias',
              position: { start: 0, end: 15, selector: '' },
              explanation: '감정을 자극하는 과장된 표현입니다'
            },
            {
              text: '반드시 주의해야 할 문제',
              type: 'bias', 
              position: { start: 50, end: 65, selector: '' },
              explanation: '강제성을 나타내는 편향적 표현입니다'
            }
          ]
        },
        logicalFallacies: [
          {
            type: '성급한 일반화',
            description: '몇 개의 사례만으로 전체를 판단하고 있습니다',
            affectedText: '몇 개의 사례만으로 전체를 판단',
            position: { start: 200, end: 220, selector: '' },
            severity: 'medium'
          }
        ],
        crossReference: {
          relatedArticles: [],
          consensus: 'insufficient'
        }
      });
      
      setError(error instanceof Error ? error.message : '알 수 없는 오류');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHighlightClick = (highlight: any) => {
    console.log('💡 하이라이트 클릭:', highlight);
    alert(`편향 분석: ${highlight.explanation}`);
  };

  return (
    <>
      <AnalysisSidebar
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        onAnalyze={handleAnalyze}
      />
      
      {/* 에러 표시 */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '420px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '300px',
          zIndex: 999998
        }}>
          ⚠️ API 에러: {error}<br />
          <small>더미 데이터로 대체되었습니다</small>
        </div>
      )}
      
      {analysis && (
        <TextHighlighter
          highlights={analysis.biasAnalysis.highlightedTexts}
          onHighlightClick={handleHighlightClick}
        />
      )}
    </>
  );
};
