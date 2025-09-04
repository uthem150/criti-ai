import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TrustAnalysis, AnalysisRequest } from "@criti-ai/shared";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor() {
    console.log('🔍 환경변수 디버그:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- GEMINI_API_KEY 존재:', !!process.env.GEMINI_API_KEY);
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY가 설정되지 않았습니다.');
      throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
    }
    
    console.log('✅ GEMINI_API_KEY 로드 성공');

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1, // 일관된 분석을 위해 낮은 temperature
        topK: 1,
        topP: 1,
      },
    });
  }

  async analyzeContent(request: AnalysisRequest): Promise<TrustAnalysis> {
    console.log('🔍 Gemini API 분석 시작:', {
      url: request.url,
      contentLength: request.content.length,
      contentType: request.contentType || 'unknown'
    });

    const prompt = this.buildAnalysisPrompt(request);

    try {
      console.log('🤖 Gemini API 호출 중...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();
      
      console.log('✅ Gemini API 응답 성공');
      return this.parseAnalysisResult(analysisText);
    } catch (error) {
      console.error('❌ Gemini API 에러:', error);
      throw new Error(`분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  private buildAnalysisPrompt(request: AnalysisRequest): string {
    const contentType = this.detectContentType(request.url, request.content);
    
    return `
# MISSION
당신은 세계 최고의 디지털 미디어 리터러시 전문가이자, 텍스트 콘텐츠의 신뢰도를 다차원적으로 분석하는 AI 애널리스트 'Criti.AI'입니다. 

당신의 목표는 제공된 콘텐츠를 매우 엄격하고 체계적인 기준으로 분석하여, 사용자가 비판적 사고를 기를 수 있도록 돕는 것입니다. 

**분석 대상**: ${contentType} 콘텐츠
**분석 수준**: 종합적 분석 (신뢰도, 편향성, 논리성, 광고성, 근거성)

# ANALYSIS INSTRUCTIONS (Step-by-Step Thinking)

## 1단계: 콘텐츠 전체 정독 및 맥락 파악
- 제공된 콘텐츠의 제목과 내용을 처음부터 끝까지 꼼꼼하게 읽습니다
- 전체적인 맥락과 핵심 주장을 파악합니다
- 콘텐츠의 목적과 대상 독자를 추정합니다

## 2단계: 출처 및 신뢰도 평가
- URL과 도메인을 기반으로 언론사/작성자의 성향, 평판, 전문성을 평가합니다
- 주요 언론사, 전문 매체, 개인 블로그, 상업적 사이트 등을 구분합니다
- 과거 보도 이력, 사실 확인 시스템, 편집 원칙 등을 고려합니다

## 3단계: 광고성 및 상업적 의도 분석 ⭐ (중요)
- 상품/서비스 홍보 의도를 탐지합니다
- 제휴 링크, 광고성 표현, 브랜드 언급, 구매 유도 등을 찾습니다  
- 네이티브 광고, 협찬 콘텐츠, 인플루언서 마케팅 여부를 판단합니다
- 객관적 정보 제공 vs 상업적 목적의 균형을 평가합니다

## 4단계: 편향성 및 감성 분석
- 감정을 자극하는 단어, 선동적인 문구를 모두 찾아냅니다
- "충격", "반드시", "절대", "최고", "완벽" 등 과장 표현을 탐지합니다
- 특정 이념이나 집단에 치우친 표현을 식별합니다
- 클릭베이트 요소(호기심 갭, 감정 트리거, 긴급성, 최상급 표현)를 분석합니다

## 5단계: 논리적 오류 및 근거 분석
- 성급한 일반화, 흑백논리, 허수아비 공격, 인신공격 등의 오류를 찾습니다
- 주장에 대한 근거와 출처의 적절성을 평가합니다
- 통계나 데이터의 오용, 인과관계의 오류를 탐지합니다
- 사실과 의견을 구분하여 분석합니다

## 6단계: 종합 점수 산정 및 근거 제시
- 각 분석 항목별 점수와 그 근거를 명확히 제시합니다
- 발견된 문제점들이 전체 신뢰도에 미치는 영향을 계산합니다
- 사용자가 이해하기 쉬운 구체적인 예시와 함께 설명합니다

# CONTENT TO ANALYZE
- URL: ${request.url}
- Title: ${request.title ?? "제목 없음"}
- Content Type: ${contentType}
- Content: """
${request.content}
"""

# REQUIRED JSON OUTPUT FORMAT

다른 설명 없이 반드시 아래 JSON 형식으로만 응답하세요:

{
  "overallScore": "0-100 사이의 정수. 종합 신뢰도 점수",
  "analysisSummary": "이 콘텐츠에 대한 핵심 분석 결과를 1-2문장으로 요약",
  
  "sourceCredibility": {
    "score": "0-100 사이의 정수. 출처 신뢰도 점수",
    "level": "'trusted' | 'neutral' | 'caution' | 'unreliable' 중 하나",
    "domain": "${new URL(request.url).hostname}",
    "reputation": {
      "description": "출처에 대한 2-3문장의 간결한 설명",
      "factors": ["분석 근거가 된 요소들의 배열", "예: 주요 언론사", "사실 확인 시스템", "편집 원칙"],
      "historicalReliability": "0-100 사이의 정수. 과거 신뢰도",
      "expertiseArea": ["해당 출처의 전문 분야들"]
    }
  },
  
  "biasAnalysis": {
    "emotionalBias": {
      "score": "0-100 사이의 정수. 감정적 중립성 점수 (높을수록 중립적)",
      "manipulativeWords": [
        {
          "word": "감지된 조작적 단어",
          "category": "'emotional' | 'exaggeration' | 'urgency' | 'authority' | 'fear'",
          "impact": "'low' | 'medium' | 'high'",
          "explanation": "왜 이 단어가 조작적인지 설명"
        }
      ],
      "intensity": "'none' | 'low' | 'medium' | 'high'"
    },
    "politicalBias": {
      "direction": "'left' | 'center' | 'right' | 'neutral'",
      "confidence": "0-100 사이의 정수. 정치적 편향 판단의 확신도",
      "indicators": ["정치적 편향을 나타내는 구체적 지표들"]
    },
    "clickbaitElements": [
      {
        "type": "'curiosity_gap' | 'emotional_trigger' | 'urgency' | 'superlative'",
        "text": "클릭베이트 요소에 해당하는 실제 텍스트",
        "explanation": "왜 이것이 클릭베이트인지 설명",
        "severity": "'low' | 'medium' | 'high'"
      }
    ],
    "highlightedTexts": [
      {
        "text": "본문에서 하이라이트할 정확한 텍스트",
        "type": "'bias' | 'fallacy' | 'manipulation' | 'advertisement' | 'claim'",
        "explanation": "이 텍스트를 하이라이트한 구체적 이유",
        "severity": "'low' | 'medium' | 'high'",
        "category": "세부 카테고리 (예: 과장 표현, 감정 호소 등)"
      }
    ],
    "advertisementScore": "0-100 사이의 정수. 광고성 점수 (높을수록 덜 광고적)"
  },
  
  "advertisementAnalysis": {
    "isAdvertorial": "true/false. 광고성 콘텐츠 여부",
    "confidence": "0-100 사이의 정수. 광고성 판단 확신도",
    "nativeAdScore": "0-100 사이의 정수. 네이티브 광고 점수 (높을수록 광고적)",
    "commercialIntentScore": "0-100 사이의 정수. 상업적 의도 점수",
    "indicators": [
      {
        "type": "'product_mention' | 'affiliate_link' | 'sponsored_content' | 'promotional_language' | 'call_to_action' | 'brand_focus'",
        "evidence": "광고성을 나타내는 실제 텍스트 증거",
        "explanation": "왜 이것이 광고성 지표인지 설명",
        "weight": "1-10 사이의 정수. 가중치"
      }
    ]
  },
  
  "logicalFallacies": [
    {
      "type": "논리적 오류의 구체적 유형 (예: 성급한 일반화, 흑백논리, 인신공격)",
      "affectedText": "오류가 포함된 원문의 정확한 텍스트",
      "explanation": "왜 이것이 논리적 오류인지 초등학생도 이해할 수 있게 설명",
      "severity": "'low' | 'medium' | 'high'",
      "examples": ["유사한 논리적 오류의 간단한 예시들"]
    }
  ],
  
  "crossReference": {
    "keyClaims": ["이 콘텐츠의 핵심 주장 2-3가지를 간결하게 요약"],
    "relatedArticleKeywords": "교차 검증을 위한 추천 검색 키워드",
    "relatedArticles": [],
    "consensus": "'agree' | 'disagree' | 'mixed' | 'insufficient'",
    "factCheckSources": [
      {
        "organization": "팩트체크 기관명",
        "url": "#fact-check-url",
        "verdict": "'true' | 'false' | 'mixed' | 'unverified'",
        "summary": "팩트체크 결과 요약"
      }
    ]
  },
  
  "detailedScores": {
    "sourceScore": "0-100. 출처 점수",
    "objectivityScore": "0-100. 객관성 점수 (편향성 역산)",
    "logicScore": "0-100. 논리성 점수",
    "advertisementScore": "0-100. 광고성 점수 (높을수록 덜 광고적)",
    "evidenceScore": "0-100. 근거 충실도 점수"
  }
}

# FINAL CRITICAL INSTRUCTIONS

⚠️ **반드시 준수해야 할 사항들**:

1. **JSON ONLY**: 응답은 반드시 위의 형식을 완전히 준수하는 JSON 객체여야 합니다. JSON 앞뒤로 \`\`\`json 마크다운이나 다른 설명을 붙이지 마세요.

2. **정확한 텍스트 매칭**: "affectedText", "highlightedTexts"의 "text" 필드는 반드시 원문에 존재하는 내용과 정확히 일치해야 합니다.

3. **구체적 근거 제시**: 모든 점수와 판단에 대해 구체적이고 납득할 만한 근거를 제시하세요.

4. **한국어 응답**: 모든 설명과 분석은 자연스러운 한국어로 작성하세요.

5. **광고성 분석 중시**: 현대 디지털 환경에서 광고성 콘텐츠 탐지는 매우 중요합니다. 세심하게 분석하세요.

6. **분석 불가능 시**: 콘텐츠가 너무 짧거나 분석 불가능할 경우, "overallScore"를 -1로 설정하고 "analysisSummary"에 분석 불가 사유를 작성하세요.

7. **균형 잡힌 판단**: 지나치게 관대하거나 엄격하지 말고, 균형 잡힌 기준으로 분석하세요.

`;
  }

  private detectContentType(url: string, content: string): string {
    const hostname = new URL(url).hostname.toLowerCase();
    
    // 도메인 기반 콘텐츠 타입 감지
    if (hostname.includes('news') || hostname.includes('chosun') || hostname.includes('joongang') || hostname.includes('hankyoreh')) {
      return '뉴스 기사';
    }
    
    if (hostname.includes('blog') || hostname.includes('tistory') || hostname.includes('wordpress')) {
      return '블로그 포스트';
    }
    
    if (hostname.includes('naver.com') && url.includes('cafe')) {
      return '카페 글';
    }
    
    if (hostname.includes('instagram') || hostname.includes('facebook') || hostname.includes('twitter')) {
      return '소셜 미디어 포스트';
    }
    
    if (hostname.includes('shopping') || hostname.includes('market') || hostname.includes('coupang') || hostname.includes('11st')) {
      return '쇼핑몰/상업적 콘텐츠';
    }
    
    // 콘텐츠 내용 기반 감지
    const commercialKeywords = ['구매', '할인', '특가', '이벤트', '쿠폰', '무료배송', '리뷰', '추천'];
    const hasCommercialKeywords = commercialKeywords.some(keyword => content.includes(keyword));
    
    if (hasCommercialKeywords) {
      return '상업적/광고성 콘텐츠';
    }
    
    return '일반 웹 콘텐츠';
  }

  private parseAnalysisResult(analysisText: string): TrustAnalysis {
    try {
      // JSON 부분만 추출
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("유효한 JSON 응답을 찾을 수 없습니다.");
      }

      const parsed = JSON.parse(jsonMatch[0]) as TrustAnalysis;
      
      // 분석 결과 검증
      this.validateAnalysisResult(parsed);
      
      return parsed;
    } catch (error) {
      console.error("Analysis parsing error:", error);
      console.error("Raw response:", analysisText);
      throw new Error("AI 분석 결과를 파싱할 수 없습니다: " + (error instanceof Error ? error.message : '알 수 없는 오류'));
    }
  }

  private validateAnalysisResult(analysis: TrustAnalysis): void {
    // 필수 필드 검증
    if (typeof analysis.overallScore !== 'number' || analysis.overallScore < 0 || analysis.overallScore > 100) {
      throw new Error("overallScore가 유효하지 않습니다");
    }
    
    if (!analysis.analysisSummary || typeof analysis.analysisSummary !== 'string') {
      throw new Error("analysisSummary가 유효하지 않습니다");
    }
    
    if (!analysis.sourceCredibility || typeof analysis.sourceCredibility.score !== 'number') {
      throw new Error("sourceCredibility.score가 유효하지 않습니다");
    }
    
    // 배열 필드 검증
    if (!Array.isArray(analysis.logicalFallacies)) {
      throw new Error("logicalFallacies가 배열이 아닙니다");
    }
    
    if (!Array.isArray(analysis.biasAnalysis.highlightedTexts)) {
      throw new Error("highlightedTexts가 배열이 아닙니다");
    }
    
    console.log("✅ 분석 결과 검증 완료");
  }

  async generateChallenge(type: string, difficulty: string): Promise<Record<string, unknown>> {
    const prompt = `
당신은 미디어 리터러시 교육용 챌린지를 생성하는 전문가입니다.

**챌린지 타입**: ${type}
**난이도**: ${difficulty}

${type}에 맞는 교육용 챌린지를 생성해주세요. 
사용자가 비판적 사고 능력을 기를 수 있도록 의도적으로 논리적 오류나 편향성을 포함한 가상의 콘텐츠를 만들어주세요.

JSON 형식으로 응답해주세요:
{
  "id": "unique-id",
  "type": "${type}",
  "title": "챌린지 제목",
  "content": "챌린지 내용 (가상의 기사나 텍스트)",
  "correctAnswers": ["정답 배열"],
  "explanation": "정답 설명",
  "difficulty": "${difficulty}",
  "points": 점수,
  "hints": ["힌트 배열"]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const challengeText = response.text();
      
      const jsonMatch = challengeText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("유효한 JSON 응답을 찾을 수 없습니다.");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Challenge generation error:", error);
      throw new Error("챌린지 생성 중 오류가 발생했습니다.");
    }
  }
}
