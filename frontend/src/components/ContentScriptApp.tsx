import React, { useState } from 'react';
import type { TrustAnalysis } from '@shared/types';
import { AnalysisSidebar } from './analysis/Sidebar';
import { TextHighlighter } from './analysis/TextHighlighter';
import { apiService } from '../services/api';

interface ContentScriptAppProps {
  url: string;
  title: string;
  content: string;
  onClose?: () => void;
}

export const ContentScriptApp: React.FC<ContentScriptAppProps> = ({
  url,
  title,
  content,
  onClose
}) => {
  const [analysis, setAnalysis] = useState<TrustAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log('🔍 분석 시작:', { url, title, contentLength: content.length });
      
      // API 서비스를 통한 Backend API 호출
      const analysis = await apiService.analyzeContent({
        url,
        title,
        content: content.substring(0, 1000) // API 호출 비용 절약을 위해 앞부분만
      });

      console.log('✅ 분석 성공:', analysis);
      setAnalysis(analysis);
      
    } catch (error) {
      console.error('❌ 분석 에러:', error);
      
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      
      // 더 상세한 에러 및 대안 메시지
      if (errorMessage.includes('연결할 수 없습니다')) {
        setError('백엔드 서버 연결 실패 - 더미 데이터로 대체');
      } else if (errorMessage.includes('Failed to fetch')) {
        setError('네트워크 오류 - 더미 데이터로 대체');
      } else {
        setError(errorMessage);
      }
      
      // 에러 발생 시 더미 데이터로 대체 (개발 테스트용)
      console.log('🔄 더미 데이터로 대체');
      
      // 동적 더미 데이터 생성
      const dummyScore = Math.floor(Math.random() * 40) + 60;
      const domain = new URL(url).hostname;
      
      setAnalysis({
        overallScore: dummyScore,
        sourceCredibility: {
          score: Math.floor(Math.random() * 30) + 70,
          level: dummyScore >= 80 ? 'trusted' : dummyScore >= 60 ? 'neutral' : 'caution',
          domain,
          reputation: {
            description: '테스트 모드 - 더미 데이터',
            factors: ['도메인 확인됨', '일반적 평판']
          }
        },
        biasAnalysis: {
          emotionalBias: {
            score: Math.floor(Math.random() * 50) + 25,
            manipulativeWords: ['충격적인', '반드시', '절대적으로'],
            intensity: 'medium'
          },
          politicalBias: {
            direction: 'neutral',
            confidence: 70
          },
          highlightedTexts: [
            {
              text: '충격적인 내용',
              type: 'bias',
              position: { start: 0, end: 6, selector: '' },
              explanation: '감정을 자극하는 과장된 표현입니다 (테스트 모드)'
            },
            {
              text: '반드시 확인해야',
              type: 'bias',
              position: { start: 20, end: 28, selector: '' },
              explanation: '강제성을 나타내는 편향적 표현입니다 (테스트 모드)'
            }
          ]
        },
        logicalFallacies: [
          {
            type: '성급한 일반화',
            description: '제한된 사례로 전체를 판단하고 있습니다 (테스트 모드)',
            affectedText: '일부 사례를 통한 전체 판단',
            position: { start: 50, end: 65, selector: '' },
            severity: 'medium'
          }
        ],
        crossReference: {
          relatedArticles: [],
          consensus: 'insufficient'
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHighlightClick = (highlight: { text: string; explanation: string }) => {
    console.log('💡 하이라이트 클릭:', highlight);
    alert(`편향 분석: ${highlight.explanation}`);
  };

  return (
    <>
      <AnalysisSidebar
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        onAnalyze={handleAnalyze}
        onClose={onClose}
      />
      
      {/* 에러 표시 - 개선된 UI */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '420px',
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          color: '#92400e',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '320px',
          zIndex: 999998,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          ⚠️ {error}<br />
          <small style={{ color: '#78716c', marginTop: '4px', display: 'block' }}>
            테스트 모드: 기능 시연 중
            <br />
            실제 서비스: <a 
              href="http://localhost:3001/health" 
              target="_blank" 
              style={{ color: '#0ea5e9' }}
            >
              서버 상태 확인
            </a>
          </small>
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
