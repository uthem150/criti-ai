import React from 'react';
import type { LogicalFallacy } from '@criti-ai/shared';
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
  return (
    <FallaciesContainer>
      <SectionTitle>
        🧠 논리적 오류
      </SectionTitle>
      
      {fallacies.length === 0 ? (
        <EmptyState>
          논리적 오류가 발견되지 않았습니다.
        </EmptyState>
      ) : (
        <FallaciesList>
          {fallacies.map((fallacy, index) => (
            <FallacyItem key={index} severity={fallacy.severity}>
              <FallacyType>
                {fallacy.type}
                <SeverityBadge severity={fallacy.severity}>
                  {fallacy.severity === 'high' ? '높음' : 
                   fallacy.severity === 'medium' ? '보통' : '낮음'}
                </SeverityBadge>
              </FallacyType>
              <FallacyDescription>
                {fallacy.description}
              </FallacyDescription>
              {fallacy.affectedText && (
                <AffectedText>
                  💬 "{fallacy.affectedText}"
                </AffectedText>
              )}
            </FallacyItem>
          ))}
        </FallaciesList>
      )}
    </FallaciesContainer>
  );
};
