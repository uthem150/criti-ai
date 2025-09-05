import type { TrustAnalysis, HighlightedText } from '@shared/types';

/**
 * 모든 분석 결과에서 하이라이트할 텍스트를 통합하여 수집합니다.
 * 각 분석 타입별로 색상과 우선순위를 다르게 적용합니다.
 */
export function collectAllHighlights(analysis: TrustAnalysis): HighlightedText[] {
  const highlights: HighlightedText[] = [];

  if (!analysis) return highlights;

  // 1. 편향성 분석에서 하이라이트 수집
  if (analysis.biasAnalysis) {
    // 기존 highlightedTexts
    if (analysis.biasAnalysis.highlightedTexts) {
      highlights.push(...analysis.biasAnalysis.highlightedTexts);
    }

    // 감정적 편향 - 조작적 표현들
    if (analysis.biasAnalysis.emotionalBias?.manipulativeWords) {
      analysis.biasAnalysis.emotionalBias.manipulativeWords.forEach((wordObj) => {
        const word = typeof wordObj === 'string' ? wordObj : wordObj.word;
        const explanation = typeof wordObj === 'string' 
          ? `조작적 표현이 감지되었습니다: "${word}"`
          : wordObj.explanation || `${wordObj.category} 카테고리의 조작적 표현입니다.`;

        highlights.push({
          text: word,
          type: 'manipulation',
          explanation,
          severity: typeof wordObj !== 'string' ? wordObj.impact : 'medium',
          category: typeof wordObj !== 'string' ? wordObj.category : 'emotional',
          position: { start: 0, end: word.length, selector: `*:contains("${word}")` }
        });
      });
    }

    // 클릭베이트 요소들
    if (analysis.biasAnalysis.clickbaitElements) {
      analysis.biasAnalysis.clickbaitElements.forEach((element) => {
        highlights.push({
          text: element.text,
          type: 'bias',
          explanation: `클릭베이트 요소 (${element.type}): ${element.explanation}`,
          severity: element.severity,
          category: 'clickbait',
          position: { start: 0, end: element.text.length, selector: `*:contains("${element.text.replace(/"/g, '\\"')}")` }
        });
      });
    }
  }

  // 2. 논리적 오류에서 하이라이트 수집
  if (analysis.logicalFallacies) {
    analysis.logicalFallacies.forEach((fallacy) => {
      if (fallacy.affectedText && fallacy.affectedText.trim()) {
        highlights.push({
          text: fallacy.affectedText,
          type: 'fallacy',
          explanation: `논리적 오류 (${fallacy.type}): ${fallacy.explanation}`,
          severity: fallacy.severity,
          category: fallacy.type,
          position: fallacy.position
        });
      }
    });
  }

  // 3. 광고성 분석에서 하이라이트 수집
  if (analysis.advertisementAnalysis?.indicators) {
    analysis.advertisementAnalysis.indicators.forEach((indicator) => {
      if (indicator.evidence && indicator.evidence.trim()) {
        highlights.push({
          text: indicator.evidence,
          type: 'advertisement',
          explanation: `광고성 지표 (${indicator.type}): ${indicator.explanation}`,
          severity: indicator.weight > 7 ? 'high' : indicator.weight > 4 ? 'medium' : 'low',
          category: indicator.type,
          position: { start: 0, end: indicator.evidence.length, selector: `*:contains("${indicator.evidence.replace(/"/g, '\\"')}")` }
        });
      }
    });
  }

  // 4. 교차 검증에서 핵심 주장들 하이라이트
  if (analysis.crossReference?.keyClaims) {
    analysis.crossReference.keyClaims.forEach((claim) => {
      if (claim && claim.trim()) {
        highlights.push({
          text: claim,
          type: 'claim',
          explanation: `핵심 주장: 이 주장에 대한 교차 검증이 필요합니다.`,
          severity: 'medium',
          category: 'key-claim',
          position: { start: 0, end: claim.length, selector: `*:contains("${claim.replace(/"/g, '\\"')}")` }
        });
      }
    });
  }

  // 중복 제거 및 정렬
  return deduplicateAndSortHighlights(highlights);
}

/**
 * 하이라이트 중복 제거 및 우선순위에 따른 정렬
 */
function deduplicateAndSortHighlights(highlights: HighlightedText[]): HighlightedText[] {
  // 텍스트 기준으로 중복 제거 (같은 텍스트는 더 높은 우선순위만 유지)
  const uniqueHighlights = new Map<string, HighlightedText>();
  
  const priorityMap = {
    'fallacy': 4,      // 논리적 오류 (최고 우선순위)
    'manipulation': 3,  // 감정 조작
    'advertisement': 2, // 광고성
    'bias': 1,         // 편향성
    'claim': 0         // 주장 (최저 우선순위)
  };

  highlights.forEach((highlight) => {
    const key = highlight.text.trim().toLowerCase();
    const currentPriority = priorityMap[highlight.type as keyof typeof priorityMap] || 0;
    
    const existing = uniqueHighlights.get(key);
    if (!existing) {
      uniqueHighlights.set(key, highlight);
    } else {
      const existingPriority = priorityMap[existing.type as keyof typeof priorityMap] || 0;
      if (currentPriority > existingPriority) {
        uniqueHighlights.set(key, highlight);
      }
    }
  });

  // 길이 순으로 정렬 (긴 텍스트부터 적용해야 중복 방지)
  return Array.from(uniqueHighlights.values())
    .filter(h => h.text.trim().length >= 3) // 너무 짧은 텍스트 필터링
    .sort((a, b) => b.text.length - a.text.length);
}

/**
 * 특정 분석 타입의 하이라이트만 필터링
 */
export function filterHighlightsByType(
  highlights: HighlightedText[], 
  types: string[]
): HighlightedText[] {
  return highlights.filter(h => types.includes(h.type));
}

/**
 * 심각도별로 하이라이트 필터링
 */
export function filterHighlightsBySeverity(
  highlights: HighlightedText[], 
  severities: string[]
): HighlightedText[] {
  return highlights.filter(h => h.severity && severities.includes(h.severity));
}

/**
 * 하이라이트 통계 정보 생성
 */
export function getHighlightStats(highlights: HighlightedText[]) {
  const stats = {
    total: highlights.length,
    byType: {} as Record<string, number>,
    bySeverity: {} as Record<string, number>,
    byCategory: {} as Record<string, number>
  };

  highlights.forEach((highlight) => {
    // 타입별 통계
    stats.byType[highlight.type] = (stats.byType[highlight.type] || 0) + 1;
    
    // 심각도별 통계
    if (highlight.severity) {
      stats.bySeverity[highlight.severity] = (stats.bySeverity[highlight.severity] || 0) + 1;
    }
    
    // 카테고리별 통계
    if (highlight.category) {
      stats.byCategory[highlight.category] = (stats.byCategory[highlight.category] || 0) + 1;
    }
  });

  return stats;
}
