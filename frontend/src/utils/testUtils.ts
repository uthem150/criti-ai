import type { TrustAnalysis, HighlightedText } from '@shared/types';
import { collectAllHighlights } from './highlightUtils';

/**
 * 개발 환경에서 하이라이트 시스템을 테스트하기 위한 유틸리티
 */

// 더미 분석 결과 생성 (테스트용)
export function createTestAnalysisData(): TrustAnalysis {
  return {
    overallScore: 72,
    analysisSummary: "일부 편향적 표현과 과장된 언어가 발견되지만, 전반적으로 신뢰할 만한 수준의 콘텐츠입니다.",
    
    sourceCredibility: {
      score: 78,
      level: "trusted",
      domain: "test-news.com",
      reputation: {
        description: "신뢰할 만한 언론사로 사실 확인 시스템을 운영하고 있습니다.",
        factors: ["주요 언론사", "사실 확인 시스템", "편집 원칙"],
        historicalReliability: 85,
        expertiseArea: ["정치", "경제", "사회"]
      }
    },

    biasAnalysis: {
      emotionalBias: {
        score: 65,
        manipulativeWords: [
          {
            word: "충격적인",
            category: "emotional",
            impact: "high",
            explanation: "독자의 감정을 자극하여 객관적 판단을 흐릴 수 있습니다."
          },
          {
            word: "반드시",
            category: "urgency",
            impact: "medium", 
            explanation: "절대적 표현으로 선택의 여지를 제한합니다."
          },
          {
            word: "완벽한",
            category: "exaggeration",
            impact: "medium",
            explanation: "과장된 표현으로 현실을 왜곡할 수 있습니다."
          }
        ],
        intensity: "medium"
      },
      
      politicalBias: {
        direction: "neutral",
        confidence: 82,
        indicators: ["균형 잡힌 시각", "다양한 입장 제시"]
      },
      
      clickbaitElements: [
        {
          type: "emotional_trigger",
          text: "이것만 알면 당신의 인생이 바뀝니다",
          explanation: "과도한 기대감을 조성하는 클릭베이트 표현입니다.",
          severity: "high"
        },
        {
          type: "curiosity_gap",
          text: "전문가들이 절대 알려주지 않는 비밀",
          explanation: "호기심을 자극하여 클릭을 유도합니다.",
          severity: "medium"
        }
      ],
      
      highlightedTexts: [
        {
          text: "충격적인",
          type: "manipulation",
          position: { start: 0, end: 4, selector: "" },
          explanation: "독자의 감정을 자극하는 표현입니다.",
          severity: "high",
          category: "감정 조작"
        },
        {
          text: "반드시 해야 하는",
          type: "bias", 
          position: { start: 0, end: 7, selector: "" },
          explanation: "절대적 표현으로 편향성을 나타냅니다.",
          severity: "medium",
          category: "과장 표현"
        }
      ]
    },

    advertisementAnalysis: {
      isAdvertorial: true,
      confidence: 75,
      nativeAdScore: 65,
      commercialIntentScore: 70,
      indicators: [
        {
          type: "product_mention",
          evidence: "이 제품을 사용해보니 정말 좋더라구요",
          explanation: "특정 제품을 언급하며 긍정적으로 소개하고 있습니다.",
          weight: 7
        },
        {
          type: "call_to_action", 
          evidence: "지금 바로 구매하세요",
          explanation: "명확한 구매 행동을 유도하는 표현입니다.",
          weight: 9
        },
        {
          type: "promotional_language",
          evidence: "특별 할인가로 만나보세요",
          explanation: "홍보성 언어가 사용되었습니다.",
          weight: 6
        }
      ]
    },

    logicalFallacies: [
      {
        type: "성급한 일반화",
        description: "소수의 사례로 전체를 판단하는 오류",
        affectedText: "몇 명의 사람들이 좋다고 했으니 모든 사람이 좋아할 것이다",
        position: { start: 0, end: 30, selector: "" },
        severity: "medium",
        explanation: "몇 명의 의견만으로 모든 사람의 의견을 단정할 수는 없습니다.",
        examples: ["우리 반에서 3명이 축구를 좋아하니까 모든 학생이 축구를 좋아한다고 말하는 것"]
      },
      {
        type: "흑백논리",
        description: "중간 지대를 배제하는 이분법적 사고",
        affectedText: "이 방법이 아니면 실패할 수밖에 없다",
        position: { start: 0, end: 18, selector: "" },
        severity: "high",
        explanation: "성공과 실패 사이에는 다양한 중간 단계가 있을 수 있습니다.",
        examples: ["공부를 안 하면 무조건 시험에서 0점을 받는다고 말하는 것"]
      }
    ],

    crossReference: {
      keyClaims: [
        "새로운 기술이 생산성을 30% 향상시킨다",
        "전문가들은 이 방법을 추천한다",
        "사용자 만족도가 95%에 달한다"
      ],
      relatedArticleKeywords: "기술 생산성 향상 전문가 추천",
      relatedArticles: [],
      consensus: "mixed",
      factCheckSources: [
        {
          organization: "팩트체크센터",
          url: "https://factcheck.example.com",
          verdict: "mixed",
          summary: "일부 통계는 정확하나 전문가 의견은 확인이 필요합니다."
        }
      ]
    },

    detailedScores: {
      sourceScore: 78,
      objectivityScore: 65,
      logicScore: 58,
      advertisementScore: 45,
      evidenceScore: 72
    }
  };
}

/**
 * 하이라이트 데이터 검증 함수
 */
export function validateHighlightData(highlights: HighlightedText[]): {
  valid: HighlightedText[];
  invalid: Array<{ highlight: HighlightedText; reason: string }>;
} {
  const valid: HighlightedText[] = [];
  const invalid: Array<{ highlight: HighlightedText; reason: string }> = [];

  highlights.forEach(highlight => {
    if (!highlight.text || highlight.text.trim().length < 3) {
      invalid.push({ highlight, reason: "텍스트가 너무 짧습니다 (3글자 미만)" });
      return;
    }

    if (!highlight.type || !['bias', 'fallacy', 'manipulation', 'advertisement', 'claim'].includes(highlight.type)) {
      invalid.push({ highlight, reason: "유효하지 않은 타입입니다" });
      return;
    }

    if (!highlight.explanation || highlight.explanation.trim().length === 0) {
      invalid.push({ highlight, reason: "설명이 비어있습니다" });
      return;
    }

    valid.push(highlight);
  });

  return { valid, invalid };
}

/**
 * 콘솔에서 하이라이트 시스템을 테스트하는 함수
 */
export function testHighlightSystem() {
  console.log('🧪 하이라이트 시스템 테스트 시작');
  
  const testData = createTestAnalysisData();
  
  // collectAllHighlights 함수 테스트
  const allHighlights = collectAllHighlights(testData);
  
  console.log('📊 수집된 하이라이트 통계:');
  console.log(`- 총 개수: ${allHighlights.length}`);
  
  const byType = allHighlights.reduce((acc: Record<string, number>, h: HighlightedText) => {
    acc[h.type] = (acc[h.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('- 타입별 분포:', byType);
  
  // 검증
  const { valid, invalid } = validateHighlightData(allHighlights);
  console.log(`✅ 유효한 하이라이트: ${valid.length}개`);
  
  if (invalid.length > 0) {
    console.log(`❌ 유효하지 않은 하이라이트: ${invalid.length}개`);
    invalid.forEach(({ highlight, reason }) => {
      console.log(`  - "${highlight.text}": ${reason}`);
    });
  }
  
  console.log('🎯 테스트 완료');
  return { testData, allHighlights, valid, invalid };
}

/**
 * 브라우저에서 하이라이트 테스트 (개발자 도구에서 실행)
 */
export function browserHighlightTest() {
  // 테스트용 하이라이트 요소들을 페이지에 추가
  const testTexts = [
    { text: "충격적인", type: "manipulation" },
    { text: "반드시 해야 하는", type: "bias" },
    { text: "몇 명의 사람들이 좋다고 했으니 모든 사람이 좋아할 것이다", type: "fallacy" },
    { text: "지금 바로 구매하세요", type: "advertisement" },
    { text: "새로운 기술이 생산성을 30% 향상시킨다", type: "claim" }
  ];

  console.log('🎨 브라우저 하이라이트 테스트');
  
  testTexts.forEach((testText, index) => {
    const element = document.createElement('p');
    element.innerHTML = `테스트 문장 ${index + 1}: ${testText.text}`;
    element.style.margin = '10px';
    element.style.padding = '10px';
    element.style.backgroundColor = '#f9f9f9';
    element.style.border = '1px solid #ddd';
    element.id = `test-text-${index}`;
    
    document.body.appendChild(element);
  });

  console.log('✅ 테스트용 텍스트가 페이지에 추가되었습니다.');
  console.log('💡 이제 Criti AI를 실행하여 하이라이트가 제대로 작동하는지 확인하세요.');
}
