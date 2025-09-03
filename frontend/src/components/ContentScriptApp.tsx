import React, { useState } from 'react';
import type { TrustAnalysis, LogicalFallacy, HighlightedText } from '@shared/types';
import { AnalysisSidebar } from './analysis/Sidebar';
import { TextHighlighter } from './analysis/TextHighlighter';
import { apiService } from '../services/api';

// 더미 데이터 생성을 위한 도움 함수들
const getDomainCharacteristics = (domain: string) => {
  const characteristics = {
    'joongang.co.kr': {
      description: '중앙일보 - 대한민국 주요 종합일간지. 비교적 신뢰할 만한 언론사로 평가받음.',
      factors: ['기전 언론사', '예오드 이상', '전문 기자진', '사실 확인 시스템'],
      politicalLean: 'center' as const
    },
    'chosun.com': {
      description: '조선일보 - 한국 최오 신문. 보수적 성향이 강한 것으로 알려져 있음.',
      factors: ['역사적 신문사', '보수 성향', '정치 전문성'],
      politicalLean: 'right' as const
    },
    'hankyoreh.com': {
      description: '한경닷컴 - 진보적 성향의 언론사. 사회적 이슈에 관심이 높음.',
      factors: ['시민사회 중심', '진보 성향', '환경주의'],
      politicalLean: 'left' as const
    },
    'naver.com': {
      description: '네이버 뉴스 - 다양한 언론사의 기사를 종합하는 포털. 개별 기사의 신뢰도가 상이하다.',
      factors: ['포털 서비스', '다양한 소스', '사용자 생성 콘텐츠 포함'],
      politicalLean: 'neutral' as const
    }
  };
  
  return characteristics[domain as keyof typeof characteristics] || {
    description: `${domain} - 비교적 알려지지 않은 도메인. 추가 조사가 필요함.`,
    factors: ['도메인 조사 필요', '출처 불명확'],
    politicalLean: 'neutral' as const
  };
};

const getEmotionalWords = (title: string, content: string): string[] => {
  const emotionalPatterns = {
    '충격': ['충격적인', '충격', '과연'],
    '강조': ['반드시', '절대', '모두', '완전히'],
    '겐정적': ['대박', '성공', '대단하다', '경이로운'],
    '비관적': ['심각한', '위기', '최악', '참사']
  };
  
  const foundWords: string[] = [];
  const fullText = title + ' ' + content;
  
  Object.values(emotionalPatterns).forEach(patterns => {
    patterns.forEach(pattern => {
      if (fullText.includes(pattern) && !foundWords.includes(pattern)) {
        foundWords.push(pattern);
      }
    });
  });
  
  // 기본 더미 데이터 (3-5개 사이)
  if (foundWords.length < 3) {
    const defaultWords = ['충격적인', '반드시', '대박', '심각한', '전대미문', '경이로운'];
    while (foundWords.length < 3 && defaultWords.length > 0) {
      const randomWord = defaultWords.splice(Math.floor(Math.random() * defaultWords.length), 1)[0];
      foundWords.push(randomWord);
    }
  }
  
  return foundWords.slice(0, 5); // 최대 5개로 제한
};

const generateRealisticHighlights = (title: string, content: string): HighlightedText[] => {
  const highlights: HighlightedText[] = [];
  const fullText = title + ' ' + content.substring(0, 200); // 첫 200자만 분석
  
  // 감정적 표현 감지
  const emotionalWords = ['충격적인', '반드시', '대박', '심각한'];
  emotionalWords.forEach(word => {
    const index = fullText.indexOf(word);
    if (index !== -1) {
      highlights.push({
        text: word,
        type: 'bias',
        position: { start: index, end: index + word.length, selector: '' },
        explanation: `"${word}"는 감정을 자극하는 표현으로, 객관적 판단을 흔들 수 있습니다.`
      });
    }
  });
  
  // 사진 또는 비디오 관련 표현
  if (fullText.includes('CEO') || fullText.includes('대표')) {
    const index = fullText.indexOf('CEO') || fullText.indexOf('대표');
    if (index !== -1) {
      highlights.push({
        text: fullText.includes('CEO') ? 'CEO' : '대표',
        type: 'manipulation',
        position: { start: index, end: index + (fullText.includes('CEO') ? 3 : 2), selector: '' },
        explanation: '인물 지정 시 객관성을 유지하는 것이 중요합니다.'
      });
    }
  }
  
  // 기본 2-3개 보장
  if (highlights.length === 0) {
    highlights.push(
      {
        text: '다수',
        type: 'fallacy',
        position: { start: 10, end: 12, selector: '' },
        explanation: '구체적인 수치 없이 "다수"를 사용한 모호한 표현입니다.'
      },
      {
        text: '역사상',
        type: 'bias',
        position: { start: 30, end: 33, selector: '' },
        explanation: '"역사상" 같은 절대적 표현은 과장된 표현일 수 있습니다.'
      }
    );
  }
  
  return highlights.slice(0, 4); // 최대 4개
};

const generateLogicalFallacies = (title: string, content: string): LogicalFallacy[] => {
  const fallacies: LogicalFallacy[] = [];
  const fullText = title + ' ' + content;
  
  // 성급한 일반화 감지
  if (fullText.includes('모두') || fullText.includes('다수') || fullText.includes('전체')) {
    fallacies.push({
      type: '성급한 일반화',
      description: '제한된 사례나 증거를 바탕으로 전체에 대한 결론을 내리는 논리적 오류입니다.',
      affectedText: '다수 또는 모두',
      position: { start: fullText.indexOf('모두') || fullText.indexOf('다수') || 0, end: 10, selector: '' },
      severity: 'medium'
    });
  }
  
  // 감정 호소 오류
  if (fullText.includes('충격') || fullText.includes('대박') || fullText.includes('심각')) {
    fallacies.push({
      type: '감정 호소',
      description: '논리적 증거 대신 감정에 호소하여 주장을 뒷받침하는 오류입니다.',
      affectedText: '감정적 표현 사용',
      position: { start: 20, end: 30, selector: '' },
      severity: 'high'
    });
  }
  
  // 권위에 대한 호소
  if (fullText.includes('전문가') || fullText.includes('연구') || fullText.includes('보고서')) {
    // 이건 오류가 아니라 긍정적이지만, 때로는 남용될 수 있음
    if (Math.random() > 0.7) {
      fallacies.push({
        type: '부적절한 권위 호소',
        description: '해당 분야의 전문가가 아닌 사람의 의견을 권위있는 의견으로 제시하는 오류입니다.',
        affectedText: '전문가 의견 인용',
        position: { start: 40, end: 50, selector: '' },
        severity: 'low'
      });
    }
  }
  
  return fallacies.slice(0, 3); // 최대 3개
};

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
      
      // 고품질 동적 더미 데이터 생성
      const domain = new URL(url).hostname;
      const dummyScore = Math.floor(Math.random() * 40) + 60;
      const emotionalScore = Math.floor(Math.random() * 50) + 25;
      const credibilityScore = Math.floor(Math.random() * 30) + 70;
      
      // 도메인별 특성화
      const domainData = getDomainCharacteristics(domain);
      
      setAnalysis({
        overallScore: dummyScore,
        sourceCredibility: {
          score: credibilityScore,
          level: credibilityScore >= 85 ? 'trusted' : credibilityScore >= 70 ? 'neutral' : credibilityScore >= 50 ? 'caution' : 'dangerous',
          domain,
          reputation: {
            description: domainData.description,
            factors: domainData.factors
          }
        },
        biasAnalysis: {
          emotionalBias: {
            score: emotionalScore,
            manipulativeWords: getEmotionalWords(title, content),
            intensity: emotionalScore >= 70 ? 'high' : emotionalScore >= 40 ? 'medium' : 'low'
          },
          politicalBias: {
            direction: domainData.politicalLean,
            confidence: Math.floor(Math.random() * 30) + 60
          },
          highlightedTexts: generateRealisticHighlights(title, content)
        },
        logicalFallacies: generateLogicalFallacies(title, content),
        crossReference: {
          relatedArticles: [
            {
              title: `비슷한 주제의 기사 - ${title.substring(0, 20)}...`,
              source: '다른 언론사',
              url: '#dummy-url',
              stance: 'neutral'
            }
          ],
          consensus: Math.random() > 0.7 ? 'agree' : Math.random() > 0.5 ? 'mixed' : 'insufficient'
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHighlightClick = (highlight: { text: string; explanation: string }) => {
    console.log('💡 하이라이트 클릭:', highlight);
    
    // 본문에서 해당 텍스트 찾아서 스크롤 이동
    const targetText = highlight.text;
    
    // 다양한 선택자로 본문 영역 찾기
    const contentSelectors = [
      'article',
      '.article-content',
      '.news-content',
      '.post-content', 
      '.entry-content',
      '.content',
      '[role="main"]',
      'main',
      '.main-content',
      'body' // 마지막 대안
    ];
    
    let found = false;
    
    for (const selector of contentSelectors) {
      const contentElement = document.querySelector(selector);
      if (!contentElement) continue;
      
      // 해당 영역에서 텍스트 찾기
      const walker = document.createTreeWalker(
        contentElement,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return node.textContent?.includes(targetText) 
              ? NodeFilter.FILTER_ACCEPT 
              : NodeFilter.FILTER_REJECT;
          }
        }
      );
      
      const textNode = walker.nextNode();
      if (textNode && textNode.parentElement) {
        // 부모 요소로 스크롤
        const element = textNode.parentElement;
        
        // 부드럽게 스크롤
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
        
        // 잠시 하이라이트 효과
        const originalBackground = element.style.background;
        const originalTransition = element.style.transition;
        
        element.style.transition = 'background-color 0.3s ease';
        element.style.backgroundColor = 'rgba(14, 165, 233, 0.2)';
        
        setTimeout(() => {
          element.style.backgroundColor = originalBackground;
          setTimeout(() => {
            element.style.transition = originalTransition;
          }, 300);
        }, 1500);
        
        console.log('✨ 텍스트 위치로 스크롤 이동 완료:', targetText);
        found = true;
        break;
      }
    }
    
    if (!found) {
      // 찾지 못한 경우 대안: 알림으로 설명 표시
      console.log('⚠️ 텍스트를 찾을 수 없어 알림으로 대체');
      alert(`편향 분석: ${highlight.explanation}`);
    }
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
