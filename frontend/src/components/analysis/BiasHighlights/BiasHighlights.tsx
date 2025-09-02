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
  return (
    <HighlightsContainer>
      <SectionTitle>
        🎯 편향 표현
      </SectionTitle>
      
      {highlights.length === 0 ? (
        <EmptyState>
          편향된 표현이 발견되지 않았습니다.
        </EmptyState>
      ) : (
        <HighlightsList>
          {highlights.map((highlight, index) => (
            <HighlightItem key={index}>
              <HighlightText>
                "{highlight.text}"
              </HighlightText>
              <HighlightExplanation>
                {highlight.explanation}
              </HighlightExplanation>
            </HighlightItem>
          ))}
        </HighlightsList>
      )}
    </HighlightsContainer>
  );
};
