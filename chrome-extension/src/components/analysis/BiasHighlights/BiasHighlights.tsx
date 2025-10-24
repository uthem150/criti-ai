import React from 'react';
import type { HighlightedText } from '@shared/types';
import {
  HighlightsContainer,
  SectionTitle,
  EmptyState,
  HighlightsList,
  HighlightItem,
  HighlightText,
  HighlightExplanation
} from './BiasHighlights.style';

interface BiasHighlightsProps {
  highlights: HighlightedText[];
}

export const BiasHighlights: React.FC<BiasHighlightsProps> = ({ highlights }) => {
  // 방어적 코딩: highlights가 undefined이거나 배열이 아닌 경우 처리
  const safeHighlights = React.useMemo(() => {
    if (!highlights) {
      console.warn('🔴 BiasHighlights: highlights가 undefined입니다');
      return [];
    }
    
    if (!Array.isArray(highlights)) {
      console.warn('🔴 BiasHighlights: highlights가 배열이 아닙니다:', typeof highlights, highlights);
      return [];
    }
    
    return highlights.filter(h => h && typeof h === 'object' && h.text && h.explanation);
  }, [highlights]);
  
  return (
    <HighlightsContainer>
      <SectionTitle>
        🎯 편향 표현 분석
      </SectionTitle>
      
      {safeHighlights.length === 0 ? (
        <EmptyState>
          편향된 표현이 발견되지 않았습니다.
        </EmptyState>
      ) : (
        <HighlightsList>
          {safeHighlights.map((highlight, index) => (
            <HighlightItem key={index} type={highlight.type}>
              <div className="highlight-header">
                <span className="highlight-type">
                  {highlight.type === 'bias' ? '🎭 편향' :
                   highlight.type === 'fallacy' ? '🧠 오류' :
                   highlight.type === 'manipulation' ? '⚠️ 조작' : '🔍 분석'}
                </span>
              </div>
              <HighlightText>
                “{highlight.text}”
              </HighlightText>
              <HighlightExplanation>
                {highlight.explanation}
              </HighlightExplanation>
              {highlight.position && (
                <div className="position-info">
                  위치: {highlight.position.start}-{highlight.position.end}
                </div>
              )}
            </HighlightItem>
          ))}
        </HighlightsList>
      )}
    </HighlightsContainer>
  );
};
