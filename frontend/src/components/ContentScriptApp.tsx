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
      
      // 콘텐츠 타입 감지
      const domain = new URL(url).hostname.toLowerCase();
      const contentType = domain.includes('news') ? 'news' :
                         domain.includes('blog') ? 'blog' : 
                         domain.includes('cafe') ? 'social' : 
                         undefined;
      
      // 실제 API 서비스를 통한 분석 (더미데이터 fallback 제거)
      const analysisResult = await apiService.analyzeContent({
        url,
        title,
        content: content.substring(0, 2000),
        contentType,
        analysisLevel: 'comprehensive'
      });

      console.log('✅ 분석 완료:', analysisResult);
      setAnalysis(analysisResult);
      
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

  const handleHighlightClick = (highlight: { text: string; explanation: string }) => {
    console.log('💡 하이라이트 클릭:', highlight);
    
    // 본문에서 해당 텍스트 찾아서 스크롤 이동
    const targetText = highlight.text;
    
    // 포괄적인 선택자로 본문 영역 찾기
    const contentSelectors = [
      'article',
      '.article-content', '.news-content', '.post-content', '.entry-content',
      '.content', '.main-content', '[role="main"]', 'main',
      '.article-body', '.story-body', '.post-body', '.content-body',
      '.article-text', '.news-body', '.detail-content', '.view-content',
      '.read-content', '.txt_content', '.se-main-container'
    ];
    
    let found = false;
    
    for (const selector of contentSelectors) {
      const contentElement = document.querySelector(selector);
      if (!contentElement) continue;
      
      // 텍스트 노드 워커로 정확한 텍스트 위치 찾기
      const walker = document.createTreeWalker(
        contentElement,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const text = node.textContent?.trim() || '';
            return text.includes(targetText) && text.length > 10
              ? NodeFilter.FILTER_ACCEPT 
              : NodeFilter.FILTER_REJECT;
          }
        }
      );
      
      const textNode = walker.nextNode();
      if (textNode && textNode.parentElement) {
        const element = textNode.parentElement;
        
        // 부드럽게 스크롤
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
        
        // 임시 하이라이트 효과
        const originalStyle = {
          background: element.style.backgroundColor,
          transition: element.style.transition,
          border: element.style.border
        };
        
        element.style.transition = 'all 0.3s ease';
        element.style.backgroundColor = 'rgba(14, 165, 233, 0.2)';
        element.style.border = '2px solid rgba(14, 165, 233, 0.5)';
        
        setTimeout(() => {
          element.style.backgroundColor = originalStyle.background;
          element.style.border = originalStyle.border;
          setTimeout(() => {
            element.style.transition = originalStyle.transition;
          }, 300);
        }, 2000);
        
        console.log('✨ 텍스트 위치로 스크롤 및 하이라이트 완료:', targetText);
        found = true;
        break;
      }
    }
    
    if (!found) {
      // 찾지 못한 경우 상세 설명 표시
      const alertMessage = `📋 분석 상세 정보\n\n🔍 발견된 요소: "${highlight.text}"\n💡 분석: ${highlight.explanation}`;
      alert(alertMessage);
    }
  };

  return (
    <>
      <AnalysisSidebar
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        error={error}
        onAnalyze={handleAnalyze}
        onClose={onClose}
      />
      
      {analysis && (
        <TextHighlighter
          highlights={analysis.biasAnalysis.highlightedTexts}
          onHighlightClick={handleHighlightClick}
        />
      )}
    </>
  );
};
