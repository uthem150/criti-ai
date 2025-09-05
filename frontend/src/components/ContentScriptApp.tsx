import React, { useState } from 'react';
import type { TrustAnalysis, HighlightedText } from '@shared/types';
import { AnalysisSidebar } from './analysis/Sidebar';
import { TextHighlighter } from './analysis/TextHighlighter';
import { collectAllHighlights, getHighlightStats } from '../utils/highlightUtils';
import { apiService } from '../services/api';
// 전역 타입 import
import '@/types/global.d.ts';

interface ContentScriptAppProps {
  url: string;
  title: string;
  content: string;
  onClose?: () => void;
}

interface HighlightClickData {
  text: string; 
  explanation: string; 
  type?: string; 
  category?: string;
}

export const ContentScriptApp: React.FC<ContentScriptAppProps> = ({
  url,
  title,
  content,
  onClose
}) => {
  
  // 향상된 닫기 함수
  const handleClose = () => {
    console.log('📝 사이드바 닫기 및 하이라이트 제거');
    
    // 모든 하이라이트 제거
    if (window.critiAI?.clearAllHighlights) {
      window.critiAI.clearAllHighlights();
    }
    
    // 기존 닫기 콜백 호출
    if (onClose) {
      onClose();
    }
  };
  const [analysis, setAnalysis] = useState<TrustAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (): Promise<void> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log('🔍 분석 시작:', { url, title, contentLength: content.length });
      
      // 콘텐츠 타입 감지
      const domain = new URL(url).hostname.toLowerCase();
      const contentType = domain.includes('news') ? 'news' :
                         domain.includes('blog') ? 'blog' : 
                         domain.includes('cafe') ? 'social' : 
                         undefined;
      
      // 실제 API 서비스를 통한 분석
      const analysisResult = await apiService.analyzeContent({
        url,
        title,
        content: content.substring(0, 2000),
        contentType,
        analysisLevel: 'comprehensive'
      });

      console.log('✅ 분석 완료:', analysisResult);
      setAnalysis(analysisResult);
      
      // 하이라이트 통계 로깅
      const allHighlights = collectAllHighlights(analysisResult);
      const stats = getHighlightStats(allHighlights);
      console.log('📊 하이라이트 통계:', stats);
      
    } catch (error) {
      console.error('❌ 분석 실패:', error);
      
      // 명확한 에러 메시지 표시
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('연결할 수 없습니다')) {
        setError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else if (errorMessage.includes('timeout')) {
        setError('서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
      } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
        setError('인증 오류가 발생했습니다. API 키를 확인해주세요.');
      } else if (errorMessage.includes('429')) {
        setError('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (errorMessage.includes('500')) {
        setError('서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.');
      } else {
        setError(`분석 오류: ${errorMessage}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHighlightClick = (highlight: HighlightClickData): void => {
    console.log('💡 하이라이트 클릭:', highlight);
    
    // 사이드바에서 해당 섹션으로 스크롤
    const sidebarContainer = document.querySelector('.criti-ai-sidebar-container');
    if (!sidebarContainer) return;

    // 타입에 따른 섹션 ID 매핑
    const sectionMap: Record<string, string> = {
      'bias': 'bias',
      'manipulation': 'bias', // 감정 조작도 편향성 섹션에 포함
      'fallacy': 'logic',
      'advertisement': 'advertisement', 
      'claim': 'crossref'
    };

    const sectionId = highlight.type ? sectionMap[highlight.type] : null;
    
    if (sectionId) {
      // 해당 섹션 펼치기
      const sectionHeader = sidebarContainer.querySelector(`[data-section="${sectionId}"] .section-header`) as HTMLElement;
      if (sectionHeader && !sectionHeader.parentElement?.classList.contains('expanded')) {
        sectionHeader.click();
      }
      
      // 섹션으로 스크롤
      setTimeout(() => {
        const sectionElement = sidebarContainer.querySelector(`[data-section="${sectionId}"]`);
        if (sectionElement) {
          sectionElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          
          // 임시 강조 효과
          sectionElement.classList.add('highlighted-section');
          setTimeout(() => {
            sectionElement.classList.remove('highlighted-section');
          }, 2000);
        }
      }, 300);
    }

    // 상세 정보 표시 (fallback)
    if (highlight.explanation) {
      const alertMessage = [
        `🎯 ${highlight.type === 'bias' ? '편향성' :
              highlight.type === 'manipulation' ? '감정 조작' :
              highlight.type === 'fallacy' ? '논리적 오류' :
              highlight.type === 'advertisement' ? '광고성' :
              highlight.type === 'claim' ? '핵심 주장' : '분석'} 분석`,
        ``,
        `📋 발견된 텍스트: "${highlight.text}"`,
        `💡 분석 결과: ${highlight.explanation}`,
        ``,
        `💭 해당 섹션에서 더 자세한 정보를 확인하세요.`
      ].join('\n');
      
      // 브라우저의 기본 alert 대신 더 나은 사용자 경험을 위해 로깅
      console.log('📋 하이라이트 상세 정보:', alertMessage);
    }
  };

  // 사이드바 섹션 클릭 핸들러
  const handleSectionClick = (_sectionType: string, itemText?: string): void => {
    // 사이드바에서 항목 클릭 시 본문 하이라이트로 스크롤
    if (itemText && analysis) {
      const allHighlights = collectAllHighlights(analysis);
      const matchingHighlight = allHighlights.find(h => 
        h.text.includes(itemText) || itemText.includes(h.text)
      );
      
      if (matchingHighlight) {
        // TextHighlighter 컴포넌트의 스크롤 함수 호출
        const highlightId = `highlight-${allHighlights.indexOf(matchingHighlight)}-${matchingHighlight.type}-${matchingHighlight.text.substring(0, 10)}`;
        
        // 타입 안전한 window 접근
        if (window.critiAI?.scrollToHighlight) {
          window.critiAI.scrollToHighlight(highlightId);
        }
      }
    }
  };

  // 모든 하이라이트 데이터를 통합하여 전달
  const allHighlights: HighlightedText[] = analysis ? collectAllHighlights(analysis) : [];

  return (
    <>
      <AnalysisSidebar
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        error={error}
        onAnalyze={handleAnalyze}
        onClose={handleClose}
        onSectionClick={handleSectionClick}
      />
      
      {analysis && allHighlights.length > 0 && (
        <TextHighlighter
          highlights={allHighlights}
          onHighlightClick={handleHighlightClick}
        />
      )}
    </>
  );
};
