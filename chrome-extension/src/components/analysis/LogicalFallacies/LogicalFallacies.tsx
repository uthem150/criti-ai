import React from 'react';
import type { LogicalFallacy } from '@shared/types';
import {
  FallaciesContainer,
  SectionTitle,
  EmptyState,
  FallaciesList,
  FallacyItem,
  FallacyType,
  FallacyDescription,
  SeverityBadge,
  AffectedText
} from './LogicalFallacies.style';

interface LogicalFallaciesProps {
  fallacies: LogicalFallacy[];
}

export const LogicalFallacies: React.FC<LogicalFallaciesProps> = ({ fallacies }) => {
  // 방어적 코딩: fallacies가 undefined이거나 배열이 아닌 경우 처리
  const safeFallacies = React.useMemo(() => {
    if (!fallacies) {
      console.warn('🔴 LogicalFallacies: fallacies가 undefined입니다');
      return [];
    }
    
    if (!Array.isArray(fallacies)) {
      console.warn('🔴 LogicalFallacies: fallacies가 배열이 아닙니다:', typeof fallacies, fallacies);
      // 객체인 경우 배열로 변환 시도
      if (typeof fallacies === 'object' && fallacies !== null) {
        // 객체가 fallacy 형태를 가지고 있는지 확인
        if ('type' in fallacies && 'description' in fallacies) {
          return [fallacies as LogicalFallacy];
        }
      }
      return [];
    }
    
    return fallacies;
  }, [fallacies]);
  
  return (
    <FallaciesContainer>
      <SectionTitle>
        🧠 논리적 오류
      </SectionTitle>
      
      {safeFallacies.length === 0 ? (
        <EmptyState>
          논리적 오류가 발견되지 않았습니다.
        </EmptyState>
      ) : (
        <FallaciesList>
          {safeFallacies.map((fallacy, index) => {
            // 각 fallacy 객체도 방어적으로 처리
            if (!fallacy || typeof fallacy !== 'object') {
              console.warn(`🔴 LogicalFallacies: 잘못된 fallacy 데이터 (index: ${index}):`, fallacy);
              return null;
            }
            
            return (
              <FallacyItem key={index} severity={fallacy.severity || 'low'}>
                <FallacyType>
                  {fallacy.type || '알 수 없는 오류'}
                  <SeverityBadge severity={fallacy.severity || 'low'}>
                    {(fallacy.severity === 'high') ? '높음' : 
                     (fallacy.severity === 'medium') ? '보통' : '낮음'}
                  </SeverityBadge>
                </FallacyType>
                <FallacyDescription>
                  {fallacy.description || '설명이 없습니다.'}
                </FallacyDescription>
                {fallacy.affectedText && (
                  <AffectedText>
                    💬 "{fallacy.affectedText}"
                  </AffectedText>
                )}
              </FallacyItem>
            );
          }).filter(Boolean)}
        </FallaciesList>
      )}
    </FallaciesContainer>
  );
};
