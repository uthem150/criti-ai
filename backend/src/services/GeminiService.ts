import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";
import type {
  TrustAnalysis,
  YoutubeTrustAnalysis,
  AnalysisRequest,
  LogicalFallacy,
  AdvertisementIndicator,
} from "@criti-ai/shared";
import { ChannelInfo } from "../types/youtube-api.types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    console.log("🔍 환경변수 디버그:");
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log("- GEMINI_API_KEY 존재:", !!process.env.GEMINI_API_KEY);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY가 설정되지 않았습니다.");
      throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
    }

    console.log("✅ GEMINI_API_KEY 로드 성공");

    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeContent(request: AnalysisRequest): Promise<TrustAnalysis> {
    console.log("🔍 Gemini API 분석 시작:", {
      url: request.url,
      contentLength: request.content.length,
      contentType: request.contentType || "unknown",
    });

    const prompt = this.buildAnalysisPrompt(request);

    try {
      console.log("🤖 Gemini API 호출 중...");

      // Google Search 그라운딩 설정
      const groundingTool = {
        googleSearch: {},
      };

      // 분석용 설정 (낮은 temperature + Google Search)
      const config = {
        tools: [groundingTool], // Google 검색 기능 활성화
        temperature: 0.1, // 일관된 분석을 위해 낮은 temperature
        topK: 1,
        topP: 1,
        generationConfig: {
          responseMimeType: "application/json",
        },
      };

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: config,
      });

      console.log("✅ Gemini API 응답 성공");

      // 그라운딩 메타데이터 확인
      if (response.candidates?.[0]?.groundingMetadata) {
        const metadata = response.candidates[0].groundingMetadata;
        console.log(
          "🔍 [일반 분석] 그라운딩 검색어:",
          metadata.webSearchQueries
        );
        console.log(
          "📚 [일반 분석] 그라운딩 소스 개수:",
          metadata.groundingChunks?.length || 0
        );
      }

      console.log("🔍 응답 객체 타입:", typeof response);
      console.log("🔍 응답 키들:", Object.keys(response));

      const responseText = response.text;
      console.log("🔍 responseText 타입:", typeof responseText);
      console.log("🔍 responseText 길이:", responseText?.length || 0);

      if (!responseText) {
        throw new Error("AI 응답이 비어있습니다.");
      }

      return this.parseAnalysisResult(responseText);
    } catch (error) {
      console.error("❌ Gemini API 에러:", error);
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(`분석 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }

  private buildAnalysisPrompt(request: AnalysisRequest): string {
    const contentType = this.detectContentType(request.url, request.content);

    return `
# ⚠️ 중요: 현재 날짜 및 팩트체크 규칙

**현재 날짜**: ${new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
**현재 시간**: ${new Date().toISOString()}

🔴 **핵심 규칙 - 반드시 준수**:

1. **Google 검색 결과가 콘텐츠보다 항상 우선**:
   - 콘텐츠에서 "A가 B다"라고 해도 Google 검색에서 "A는 C다"라고 확인되면 **Google 검색 결과를 사실로 채택**
   - 콘텐츠 내용이 검색 결과와 다르면 "misleading_data" 경고 추가

2. **정치인/공직자는 반드시 검색 검증**:
   - 대통령, 장관, 국회의원 등 공직자 언급 시 반드시 Google 검색으로 현직 확인

3. **최근 사건은 반드시 검색 확인**:
   - "최근", "오늘", "어제", "이번 주" 같은 시간 표현은 반드시 Google 검색으로 확인
   - 수치(코스피, 주가, 환율 등)는 반드시 검색으로 확인

4. **검색 결과와 불일치 시 대응**:
   - logicalFallacies에 "사실 오류" 항목 추가
   - crossReference.factCheckSources에 검색 결과 추가 (verdict: 'false')
   - detailedScores.evidenceScore를 낮게 평가

# MISSION
당신은 세계 최고의 디지털 미디어 리터러시 전문가이자, 텍스트 콘텐츠의 신뢰도를 다차원적으로 분석하는 AI 애널리스트 'Criti.AI'입니다. 

당신의 목표는 제공된 콘텐츠를 매우 엄격하고 체계적인 기준으로 분석하여, 사용자가 비판적 사고를 기를 수 있도록 돕는 것입니다. 

**분석 대상**: ${contentType} 콘텐츠
**분석 수준**: 종합적 분석 (신뢰도, 편향성, 논리성, 광고성, 근거성)
**사용 도구**: Google 검색 (출처 신뢰도 및 팩트체크용)

# ⭐ 중요: 분석 지침 ⭐

⚠️ **정확한 원문 텍스트 추출**:
- 모든 분석 항목에서 원본 텍스트를 정확히 추출하세요
- 원본에 없는 내용을 만들어내지 마세요
- 텍스트 길이: 5-50글자 권장 (매칭 가능한 범위)

분석 과정에서 다음 요소들을 각각의 해당 섹션에 정확히 기록하세요:

## 📊 각 분석 섹션별 텍스트 추출

**manipulativeWords**: 감정 자극/과장 표현 추출  
**clickbaitElements**: 클릭베이트 문구 추출  
**logicalFallacies**: 논리적 오류 포함 문장 추출  
**advertisementIndicators**: 광고성 표현 추출  
**keyClaims**: 핵심 주장 문장 추출

# ANALYSIS INSTRUCTIONS (Step-by-Step Thinking)

## 1단계: 콘텐츠 전체 정독 및 맥락 파악
- 제공된 콘텐츠의 제목과 내용을 처음부터 끝까지 꼼꼼하게 읽습니다
- 전체적인 맥락과 핵심 주장을 파악합니다
- 콘텐츠의 목적과 대상 독자를 추정합니다

## 2단계: 출처 및 신뢰도 평가 (Google 검색 활용) ⭐
- **[Google 검색]** 제공된 Google 검색 기능을 활용하여 URL과 도메인을 기반으로 언론사/작성자의 성향, 평판, 전문성을 평가합니다.
- **[Google 검색]** 검색 결과를 바탕으로 과거 보도 이력, 사실 확인 시스템, 편집 원칙 등을 고려하여 신뢰도를 판단합니다.
- 주요 언론사, 전문 매체, 개인 블로그, 상업적 사이트 등을 구분합니다.
- 검색 결과를 \`sourceCredibility.reputation\` 항목에 반영합니다.

## 3단계: 광고성 및 상업적 의도 분석 ⭐ (중요)
- 상품/서비스 홍보 의도를 탐지합니다
- 제휴 링크, 광고성 표현, 브랜드 언급, 구매 유도 등을 찾습니다  
- 네이티브 광고, 협찬 콘텐츠, 인플루언서 마케팅 여부를 판단합니다
- 객관적 정보 제공 vs 상업적 목적의 균형을 평가합니다
- **중요**: 광고성 지표로 발견된 텍스트를 정확히 기록합니다

## 4단계: 편향성 및 감성 분석  
- 감정을 자극하는 단어, 선동적인 문구를 모두 찾아냅니다
- "충격", "반드시", "절대", "최고", "완벽" 등 과장 표현을 탐지합니다
- 특정 이념이나 집단에 치우친 표현을 식별합니다
- 클릭베이트 요소(호기심 갭, 감정 트리거, 긴급성, 최상급 표현)를 분석합니다
- **중요**: 편향적 표현의 정확한 텍스트를 기록합니다

## 5단계: 논리적 오류 및 근거 분석
- 성급한 일반화, 흑백논리, 허수아비 공격, 인신공격 등의 오류를 찾습니다
- 주장에 대한 근거와 출처의 적절성을 평가합니다
- 통계나 데이터의 오용, 인과관계의 오류를 탐지합니다
- 사실과 의견을 구분하여 분석합니다
- **중요**: 논리적 오류가 포함된 정확한 문장을 affectedText에 기록합니다

## 6단계: 핵심 주장 및 교차 검증 필요 사항 식별 (Google 검색 활용)
- 기사의 핵심 주장과 메시지를 추출합니다
- 팩트체크가 필요한 중요한 주장들을 식별합니다
- **[Google 검색]** 팩트체크가 필요한 주장에 대해 Google 검색을 활용하여 관련 정보를 \`crossReference.relatedArticles\` 또는 \`crossReference.factCheckSources\`에 반영합니다.
- **중요**: 핵심 주장의 정확한 텍스트를 keyClaims에 기록합니다

## 7단계: 종합 점수 산정 및 근거 제시
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
  "overallScore": 0-100 사이의 정수. 종합 신뢰도 점수,
  "analysisSummary": "이 콘텐츠에 대한 핵심 분석 결과를 1-2문장으로 요약",
  
  "sourceCredibility": {
    "score": 0-100 사이의 정수. 출처 신뢰도 점수,
    "level": "'trusted' | 'neutral' | 'caution' | 'unreliable' 중 하나",
    "domain": "${new URL(request.url).hostname}",
    "reputation": {
      "description": "출처에 대한 2-3문장의 간결한 설명 (Google 검색 결과 반영)",
      "factors": ["분석 근거가 된 요소들의 배열", "예: 주요 언론사", "사실 확인 시스템", "편집 원칙"],
      "historicalReliability": 0-100 사이의 정수. 과거 신뢰도,
      "expertiseArea": ["해당 출처의 전문 분야들"]
    }
  },
  
  "biasAnalysis": {
    "emotionalBias": {
      "score": "0-100 사이의 정수. 감정적 중립성 점수 (높을수록 중립적)",
      "manipulativeWords": [
        {
          "word": "감지된 조작적 단어 (원문에서 정확히 추출한 텍스트)",
          "category": "'emotional' | 'exaggeration' | 'urgency' | 'authority' | 'fear'",
          "impact": "'low' | 'medium' | 'high'",
          "explanation": "왜 이 단어가 조작적인지 설명"
        }
      ],
      "intensity": "'none' | 'low' | 'medium' | 'high'"
    },
    "politicalBias": {
      "direction": "'left' | 'center' | 'right' | 'neutral'",
      "confidence": 0-100 사이의 정수. 정치적 편향 판단의 확신도,
      "indicators": ["정치적 편향을 나타내는 구체적 지표들"]
    },
    "clickbaitElements": [
      {
        "type": "'curiosity_gap' | 'emotional_trigger' | 'urgency' | 'superlative'",
        "text": "클릭베이트 요소에 해당하는 실제 텍스트 (원문에서 정확히 추출)",
        "explanation": "왜 이것이 클릭베이트인지 설명",
        "severity": "'low' | 'medium' | 'high'"
      }
    ],
    "advertisementScore": "0-100 사이의 정수. 광고성 점수 (높을수록 덜 광고적)"
  },
  
  "advertisementAnalysis": {
    "isAdvertorial": "true/false. 광고성 콘텐츠 여부",
    "confidence": 0-100 사이의 정수. 광고성 판단 확신도,
    "nativeAdScore": 0-100 사이의 정수. 네이티브 광고 점수 (높을수록 광고적),
    "commercialIntentScore": 0-100 사이의 정수. 상업적 의도 점수 (높을수록 광고적),
    "indicators": [
      {
        "type": "'product_mention' | 'affiliate_link' | 'sponsored_content' | 'promotional_language' | 'call_to_action' | 'brand_focus'",
        "evidence": "광고성을 나타내는 실제 텍스트 증거 (원문에서 정확히 추출)",
        "explanation": "왜 이것이 광고성 지표인지 설명",
        "weight": "1-10 사이의 정수. 가중치"
      }
    ]
  },
  
  "logicalFallacies": [
    {
      "type": "논리적 오류의 구체적 유형 (예: 성급한 일반화, 흑백논리, 인신공격)",
      "description": "이 논리적 오류에 대한 간단한 설명",
      "affectedText": "오류가 포함된 원문의 정확한 텍스트 (원문과 정확히 일치해야 함)",
      "explanation": "왜 이것이 논리적 오류인지 초등학생도 이해할 수 있게 설명",
      "severity": "'low' | 'medium' | 'high'",
      "examples": ["유사한 논리적 오류의 간단한 예시들"],
      "position": {
        "start": 0,
        "end": 0,
        "selector": ""
      }
    }
  ],
  
  "crossReference": {
    "keyClaims": [
      "이 콘텐츠의 핵심 주장들을 원문에서 정확히 추출한 텍스트",
      "팩트체크가 필요한 중요한 주장들"
    ],
    "relatedArticleKeywords": "교차 검증을 위한 추천 검색 키워드",
    "relatedArticles": [],
    "consensus": "'agree' | 'disagree' | 'mixed' | 'insufficient'",
    "factCheckSources": [
      {
        "organization": "팩트체크 기관명 (Google 검색 기반)",
        "url": "**실제 Google 검색을 통해 찾은 유효한 팩트체크 기사의 URL (반드시 유효한 URL 제공)**",
        "verdict": "'true' | 'false' | 'mixed' | 'unverified'",
        "summary": "팩트체크 결과 요약 (Google 검색 기반)"
      }
    ]
  },
  
  "detailedScores": {
    "sourceScore": 0-100. 출처 점수,
    "objectivityScore": 0-100. 객관성 점수 (편향성 역산),
    "logicScore": 0-100. 논리성 점수,
    "advertisementScore": 0-100. 광고성 점수 (높을수록 덜 광고적),
    "evidenceScore": 0-100. 근거 충실도 점수
  }
}

# FINAL CRITICAL INSTRUCTIONS

⚠️ **반드시 준수해야 할 사항들**:

1. **JSON ONLY**: 응답은 반드시 위의 형식을 완전히 준수하는 JSON 객체여야 합니다. JSON 앞뒤로 \`\`\`json 마크다운이나 다른 설명을 붙이지 마세요.

2. **정확한 텍스트 매칭**: 모든 텍스트 필드("affectedText", "text", "evidence", "keyClaims" 등)는 반드시 원문에 존재하는 내용과 정확히 일치해야 합니다. 단 한 글자도 다르면 안 됩니다.

3. **분석 항목별 텍스트 필수 포함**: 
   - manipulativeWords[].word에는 조작적 단어들을 포함
   - clickbaitElements[].text에는 클릭베이트 문구들을 포함
   - logicalFallacies[].affectedText에는 오류가 포함된 문장들을 포함
   - advertisementAnalysis.indicators[].evidence에는 광고성 표현들을 포함
   - crossReference.keyClaims에는 핵심 주장들을 포함

4. **구체적 근거 제시**: 모든 점수와 판단에 대해 구체적이고 납득할 만한 근거를 제시하세요.

5. **한국어 응답**: 모든 설명과 분석은 자연스러운 한국어로 작성하세요.

6. **광고성 분석 중시**: 현대 디지털 환경에서 광고성 콘텐츠 탐지는 매우 중요합니다. 세심하게 분석하세요.

7. **분석 불가능 시**: 콘텐츠가 너무 짧거나 분석 불가능할 경우, "overallScore"를 -1로 설정하고 "analysisSummary"에 분석 불가 사유를 작성하세요.

8. **균형 잡힌 판단**: 지나치게 관대하거나 엄격하지 말고, 균형 잡힌 기준으로 분석하세요.

9. **텍스트 추출 핵심 원칙**:
   🚨 **원본 정확성 최우선**: 원본 콘텐츠에 정확히 존재하는 텍스트만 추출
   📏 **적절한 길이**: 5-30글자 범위의 텍스트 (매칭 성공률 최적화)
   🎯 **명확한 문제성**: 편향성, 논리오류, 광고성이 명확한 표현 우선
   💡 **단어 단위 지양**: "충격", "놀라운" 같은 단어보다는 "충격적인 사건", "놀라운 결과" 같은 구문 단위 선호
   🔍 **매칭 가능성 고려**: 웹페이지에서 실제로 찾을 수 있는 형태의 텍스트만 선택

10. **텍스트 추출 금지사항**:
    ❌ 원본에 없는 내용 생성 금지
    ❌ 여러 문장을 합치거나 재구성 금지  
    ❌ 따옴표나 특수문자 임의 추가/제거 금지
    ❌ 100글자 이상의 긴 문장 추출 금지
    ❌ 3글자 미만의 짧은 단어 추출 금지

11. **Google 검색 활용**:
    🔎 제공된 Google 검색 도구를 활용하여 'sourceCredibility' (출처 신뢰도) 및 'keyClaims' (핵심 주장)의 팩트체크를 수행하세요.
    🔎 출처의 평판, 전문성, 과거 이력 등을 검색하여 \`sourceCredibility.reputation.description\`에 반영하세요.
    🔎 팩트체크가 필요한 주장에 대한 검증 결과를 \`crossReference\` 섹션에 반영하세요.
    **🚨 \`crossReference.factCheckSources[].url\` 필드에는 Google 검색을 통해 실제로 조사된, 유효하고 접근 가능한 팩트체크 기사의 URL을 반드시 제공해야 합니다. 플레이스 홀더나 무효한 URL을 사용해서는 안 됩니다.**
`;
  }

  private detectContentType(url: string, content: string): string {
    const hostname = new URL(url).hostname.toLowerCase();

    // 도메인 기반 콘텐츠 타입 감지
    if (
      hostname.includes("news") ||
      hostname.includes("chosun") ||
      hostname.includes("joongang") ||
      hostname.includes("hankyoreh")
    ) {
      return "뉴스 기사";
    }

    if (
      hostname.includes("blog") ||
      hostname.includes("tistory") ||
      hostname.includes("wordpress")
    ) {
      return "블로그 포스트";
    }

    if (hostname.includes("naver.com") && url.includes("cafe")) {
      return "카페 글";
    }

    if (
      hostname.includes("instagram") ||
      hostname.includes("facebook") ||
      hostname.includes("twitter")
    ) {
      return "소셜 미디어 포스트";
    }

    if (
      hostname.includes("shopping") ||
      hostname.includes("market") ||
      hostname.includes("coupang") ||
      hostname.includes("11st")
    ) {
      return "쇼핑몰/상업적 콘텐츠";
    }

    // 콘텐츠 내용 기반 감지
    const commercialKeywords = [
      "구매",
      "할인",
      "특가",
      "이벤트",
      "쿠폰",
      "무료배송",
      "리뷰",
      "추천",
    ];
    const hasCommercialKeywords = commercialKeywords.some((keyword) =>
      content.includes(keyword)
    );

    if (hasCommercialKeywords) {
      return "상업적/광고성 콘텐츠";
    }

    return "일반 웹 콘텐츠";
  }

  /**
   * JSON 블록 추출 (코드펜스 및 불필요한 텍스트 제거)
   */
  /**
   * JSON 블록 추출 (코드펜스 및 불필요한 텍스트 제거)
   */
  private extractJsonObject(raw: string): string {
    let cleaned = raw.trim();

    // 1. 모든 종류의 Markdown 코드 펜스 제거
    // ```json\n 형태 (대소문자 무관)
    cleaned = cleaned.replace(/^```json\s*/i, "");
    // ```\n 형태
    cleaned = cleaned.replace(/^```\s*/, "");
    // 끝의 ``` 제거
    cleaned = cleaned.replace(/\s*```\s*$/, "");

    cleaned = cleaned.trim();

    // 2. 한국어 따옴표를 영어 따옴표로 변환
    cleaned = cleaned.replace(/"/g, '"').replace(/"/g, '"');
    cleaned = cleaned.replace(/'/g, "'").replace(/'/g, "'");

    // 3. {} 블록 추출
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");

    if (first === -1 || last === -1 || first >= last) {
      throw new Error(
        `JSON 블록을 찾지 못했습니다. 원본: ${raw.substring(0, 200)}...`
      );
    }

    // 첫번째 { 와 마지막 } 사이의 내용만 추출
    const jsonStr = cleaned.slice(first, last + 1);

    console.log("🔍 추출된 JSON (처음 200자):", jsonStr.substring(0, 200));

    return jsonStr;
  }

  private parseAnalysisResult(analysisText: string): TrustAnalysis {
    try {
      console.log("🔍 원본 Gemini 응답 길이:", analysisText.length);
      console.log("🔍 원본 응답 시작:", analysisText.substring(0, 300));

      // 1) JSON 추출
      const jsonSlice = this.extractJsonObject(analysisText);
      console.log("🔍 추출된 JSON 길이:", jsonSlice.length);
      console.log("🔍 JSON 시작:", jsonSlice.substring(0, 300));

      // 2) jsonrepair로 복구
      const repaired = jsonrepair(jsonSlice);
      console.log("🔧 JSON 복구 완료");

      // 3) 파싱
      const parsed = JSON.parse(repaired) as TrustAnalysis;

      // 분석 결과 검증
      this.validateAnalysisResult(parsed);

      // 하이라이트 텍스트 후처리 (중복 제거 및 정리)
      this.postProcessHighlights(parsed);

      return parsed;
    } catch (error) {
      console.error("❌ JSON 파싱 오류:", error);
      console.error("📄 원본 응답 전체:", analysisText);

      // 비상 방식: 기본 구조 반환
      console.log("⚙️ 비상 대응: 기본 분석 결과 생성");
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(
        `AI 분석 결과 파싱 실패 - 원인: ${errorMessage}. 전체 응답: ${analysisText.substring(0, 500)}...`
      );
    }
  }

  private validateAnalysisResult(analysis: TrustAnalysis): void {
    // 필수 필드 검증
    if (
      typeof analysis.overallScore !== "number" ||
      analysis.overallScore < -1 ||
      analysis.overallScore > 100
    ) {
      throw new Error("overallScore가 유효하지 않습니다");
    }

    if (
      !analysis.analysisSummary ||
      typeof analysis.analysisSummary !== "string"
    ) {
      throw new Error("analysisSummary가 유효하지 않습니다");
    }

    if (
      !analysis.sourceCredibility ||
      typeof analysis.sourceCredibility.score !== "number"
    ) {
      throw new Error("sourceCredibility.score가 유효하지 않습니다");
    }

    // 배열 필드 검증 및 초기화
    if (!Array.isArray(analysis.logicalFallacies)) {
      analysis.logicalFallacies = [];
    }

    if (!analysis.biasAnalysis) {
      throw new Error("biasAnalysis가 누락되었습니다");
    }

    if (!analysis.advertisementAnalysis) {
      throw new Error("advertisementAnalysis가 누락되었습니다");
    }

    if (
      !analysis.advertisementAnalysis.indicators ||
      !Array.isArray(analysis.advertisementAnalysis.indicators)
    ) {
      analysis.advertisementAnalysis.indicators = [];
    }

    if (!analysis.crossReference) {
      throw new Error("crossReference가 누락되었습니다");
    }

    if (!Array.isArray(analysis.crossReference.keyClaims)) {
      analysis.crossReference.keyClaims = [];
    }

    console.log("✅ 분석 결과 검증 완료");
  }

  private postProcessHighlights(analysis: TrustAnalysis): void {
    // 논리적 오류의 affectedText 정리
    if (analysis.logicalFallacies) {
      analysis.logicalFallacies = analysis.logicalFallacies
        .filter(
          (fallacy: LogicalFallacy) =>
            fallacy.affectedText && fallacy.affectedText.trim().length >= 3
        )
        .map((fallacy: LogicalFallacy) => ({
          ...fallacy,
          affectedText: fallacy.affectedText.trim(),
          position: fallacy.position || {
            start: 0,
            end: fallacy.affectedText?.length || 0,
            selector: "",
          },
        }));
    }

    // 광고성 지표의 evidence 정리
    if (analysis.advertisementAnalysis?.indicators) {
      analysis.advertisementAnalysis.indicators =
        analysis.advertisementAnalysis.indicators
          .filter(
            (indicator: AdvertisementIndicator) =>
              indicator.evidence && indicator.evidence.trim().length >= 3
          )
          .map((indicator: AdvertisementIndicator) => ({
            ...indicator,
            evidence: indicator.evidence.trim(),
          }));
    }

    // keyClaims 정리
    if (analysis.crossReference?.keyClaims) {
      analysis.crossReference.keyClaims = analysis.crossReference.keyClaims
        .filter((claim: string) => claim && claim.trim().length >= 3)
        .map((claim: string) => claim.trim());
    }

    console.log("✅ 하이라이트 텍스트 후처리 완료");
  }

  // 여러 개의 챌린지 한 번의 API 호출로 생성
  async generateMultipleChallenges(
    templates: Array<{ type: string; difficulty: string; topic: string }>
  ): Promise<Record<string, unknown>[]> {
    console.log(`🤖 챌린지 ${templates.length}개 동시 생성 시작...`);

    // 1. 5개 생성용 프롬프트 빌드
    const prompt = this.buildMultipleChallengesPrompt(templates);

    try {
      // 2. 창의적 생성용 설정으로 API 호출
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("AI 응답이 비어있습니다.");
      }

      console.log(
        "🤖 AI 챌린지 5개 생성 응답 (시작 부분):",
        responseText.substring(0, 300)
      );

      // 3. JSON 추출 (루트가 { "challenges": [...] } 형태라고 가정)
      const jsonSlice = this.extractJsonObject(responseText);
      const repaired = jsonrepair(jsonSlice);
      const parsedResponse = JSON.parse(repaired);

      // 4. "challenges" 배열 추출
      const challenges = parsedResponse.challenges;

      if (!Array.isArray(challenges) || challenges.length === 0) {
        throw new Error("AI 응답에서 'challenges' 배열을 찾을 수 없습니다.");
      }

      if (challenges.length !== templates.length) {
        console.warn(
          `⚠️ AI가 요청한 ${templates.length}개가 아닌 ${challenges.length}개의 챌린지를 반환했습니다.`
        );
      }

      // 5. 생성된 챌린지들 검증 및 정답 위치 랜덤화
      challenges.forEach((challenge: Record<string, unknown>) => {
        this.validateGeneratedChallenge(challenge); // 기존 검증 함수 재사용
      });

      console.log(`✅ 챌린지 ${challenges.length}개 동시 생성 및 검증 완료`);
      return challenges;
    } catch (error) {
      console.error("❌ 챌린지 5개 동시 생성 오류:", error);
      // 동시 생성 실패 시, 템플릿 기반으로 개별 폴백 챌린지 반환
      return templates.map((t) =>
        this.getFallbackChallenge(t.type, t.difficulty)
      );
    }
  }

  // 챌린지 5개 동시 생성을 위한 프롬프트
  private buildMultipleChallengesPrompt(
    templates: Array<{ type: string; difficulty: string; topic: string }>
  ): string {
    // 날짜 기반 시드를 추가하여 매일 다른 결과 보장
    const today = new Date().toISOString().split("T")[0];
    const randomSeed = Math.floor(Math.random() * 1000);

    // 템플릿 목록 문자열로 변환
    const templateStrings = templates
      .map(
        (t, i) =>
          `  ${i + 1}. 타입: ${t.type}, 난이도: ${t.difficulty}, 주제: ${t.topic}`
      )
      .join("\n");

    return `
# 다양성 보장 시드 키
날짜: ${today}
시드: ${randomSeed}

⚡ **중요**: 모든 챌린지는 서로 다른 주제와 시나리오로 생성해주세요!

# 미디어 리터러시 교육용 챌린지 생성 전문가

당신은 비판적 사고 능력을 기르는 교육용 챌린지를 생성하는 전문가입니다.
사용자가 실제 뉴스나 콘텐츠에서 마주칠 수 있는 문제들을 학습할 수 있도록, **'질문 + 4개 문장 선택지'** 형식의 퀴즈를 만듭니다.

## 📋 챌린지 사양

**타입**: type (article-analysis)
**난이도**: difficulty
**형식**: 4지 선다형 (하나의 정답)

## 🎯 난이도별 가이드라인

### Beginner (초급)
- **목표**: 명확하고 쉽게 식별 가능한 오류/편향 문장 1개
- **선택지 구성**: 정답 1개 (명확한 오류) + 오답 3개 (주로 중립적이거나 사실 기반 문장)
- **점수**: 80-120점

### Intermediate (중급)
- **목표**: 약간의 분석이 필요한 오류/편향 문장 1개
- **선택지 구성**: 정답 1개 (미묘한 오류) + 오답 3개 (중립적 문장, 또는 다른 유형의 미묘한 오류를 포함한 문장)
- **점수**: 120-180점

### Advanced (고급)
- **목표**: 복합적이고 미묘한 문제
- **선택지 구성**: 정답 1개 (정교한 오류) + 오답 3개 (매우 그럴듯하지만 정답이 아닌 문장, 다른 유형의 오류 포함)
- **점수**: 180-250점

## 📋 챌린지 생성 목록 (총 ${templates.length}개)

아래 명시된 사양에 맞춰 ${templates.length}개의 챌린지를 생성해야 합니다:
${templateStrings}

## 🎨 챌린지 카테고리 (필수 선택지 목록)

아래 목록에서 문제 카테고리(category)를 하나 선택하거나, 이와 유사한 새로운 미디어 리터러시 관련 카테고리를 자유롭게 생성하세요.

- "성급한 일반화": 적은 사례로 모든 경우에 적용하는 오류
- "허위 이분법": 복잡한 문제를 단순히 둘 중 하나로만 나누는 오류
- "인신공격": 논리 대신 사람을 비난하는 오류
- "권위에 호소": 근거 없이 권위를 내세우는 오류
- "감정적 편향": 이성적 판단보다 감정에 호소하는 표현
- "과장된 표현": 사실보다 과도하게 부풀리거나 축소되는 표현
- "허수아비 공격": 상대방 주장을 왜곡해서 공격하는 오류
- "순환논리": 증명할 것을 근거로 사용하는 오류
- "광고성 콘텐츠": 상품이나 서비스를 홍보하려는 의도가 숨어있음
- "긴급성 유도": 시간 압박을 가해 성급한 판단을 유도하는 표현
- "과장된 수치": 근거 없거나 의심스러운 통계나 수치
- "선동적 언어": 감정을 자극해 특정 의견을 유도하는 언어
- "인과관계의 오류": 단순히 먼저 일어났다고 원인으로 단정하는 오류
(이 외에도 자유롭게 미디어 리터러시 관련 카테고리 생성 가능)

## 🔥 생성 요구사항
0.  **${templates.length}개 생성**: 위 챌린지 목록의 모든 항목을 생성합니다.
1.  **카테고리 선택**: 위 목록에서 챌린지 주제(category)를 하나 선정합니다.
2.  **용어 설명 추가**: 해당 카테고리가 무엇인지 1-2 문장으로 설명하는 \`categoryDescription\`을 생성합니다. (필수)
3.  **제목(질문) 생성**: "다음 중 '[선택한 카테고리]'이/가 있는 기사 문장을 선택하세요." 형식으로 \`title\`을 생성합니다.
4.  **선택지(Options) 생성**: 
    - 4개의 문장 선택지를 생성합니다 (options 배열).
    - 각 선택지는 { "id": "1", "text": "..." } 형식을 따릅니다.
    - **정답 문장 (1개)**: 선택한 카테고리(예: '감정적 편향')의 특징이 명확히 드러나는 문장을 만듭니다.
    - **오답 문장 (3개)**: 중립적이거나, 사실을 전달하거나, 혹은 *다른 유형*의 미묘한 문제를 가진 그럴듯한 문장을 만듭니다.
    - 🎲 **정답은 순서대로 작성하되, ID는 1,2,3,4를 임의로 배치하세요**

5.  **정답(CorrectAnswers) 설정**: 정답 문장의 id를 배열에 담아 correctAnswers로 설정합니다. (예: ["2"] 또는 ["3"] 또는 ["1"])
6.  **해설(Explanation) 작성**:
    - 왜 해당 문장이 정답(선택한 카테고리)인지 명확히 설명합니다.
    - (선택 사항) 다른 오답 선택지들이 왜 정답이 아닌지 간략히 설명합니다.

7.  **힌트(Hints) 작성**:
    - 2-3개의 단계적 힌트를 제공합니다.
    - 직접적인 답 대신, 사고의 방향을 제시합니다. (예: "감정을 자극하는 단어가 있나요?")


## 🌟 주제 다양성 (필수)

각 챌린지는 서로 완전히 다른 주제와 상황을 다뤄야 합니다:
- 다양한 분야: 건강, 경제, 정치, 사회, 과학, 기술, 문화 등
- 다양한 상황: 제품 리뷰, 뉴스 보도, 연구 결과, 의견 글 등
- 창의적인 시나리오: 실제로 접할 법한 현실적인 상황

## 🎨 콘텐츠 작성 원칙

### DO (해야 할 것)
✅ 실제 뉴스처럼 자연스러운 문체
✅ 구체적이고 현실적인 상황 설정
✅ 명확한 문제점이 포함된 논리 구조
✅ 교육적 가치가 높은 예시
✅ 난이도에 맞는 복잡성 조절
✅ **정답 위치를 매번 다르게 배치** (1번, 2번, 3번, 4번 골고루)

### DON'T (하지 말 것)
❌ 인공적이거나 억지스러운 표현
❌ 지나치게 명백하거나 유치한 오류
❌ 실제로는 일어나지 않을 상황
❌ 특정 개인이나 단체 비방
❌ 사실과 전혀 맞지 않는 내용
❌ **정답을 항상 같은 위치(예: 2번)에 배치하는 것**

## 📊 출력 형식 (매우 중요)

반드시 아래 JSON 형식으로만 응답하세요.
루트 객체는 "challenges" 키를 가지며, 값은 ${templates.length}개의 챌린지 객체 배열입니다.

⚠️ **정답 위치 다양화 필수**: 각 챌린지마다 correctAnswers에 들어갈 ID를 **1, 2, 3, 4 중 랜덤하게** 선택하세요!

{
  "challenges": [
    {
      "id": "challenge-[랜덤숫자]",
      "type": type,
      "title": "다음 중 '[선택한 카테고리]'이/가 있는 기사 문장을 선택하세요.",
      "category": "[선택한 카테고리]",
      "categoryDescription": "[선택한 카테고리에 대한 1-2 문장의 간결한 설명]",
      "options": [
        { "id": "1", "text": "문장 A" },
        { "id": "2", "text": "문장 B" },
        { "id": "3", "text": "문장 C (예: 이 챌린지의 정답)" },
        { "id": "4", "text": "문장 D" }
      ],
      "correctAnswers": ["3"],
      "explanation": "3번 문장은 '[이유]' 때문에 '[선택한 카테고리]'에 해당합니다...",
      "difficulty": difficulty,
      "points": 100,
      "hints": ["힌트 1", "힌트 2"]
    },
    {
      "id": "challenge-[랜덤숫자2]",
      "type": "article-analysis",
      "title": "...",
      "category": "...",
      "categoryDescription": "...",
      "options": [
        { "id": "1", "text": "문장 A (예: 이 챌린지의 정답)" },
        { "id": "2", "text": "문장 B" },
        { "id": "3", "text": "문장 C" },
        { "id": "4", "text": "문장 D" }
      ],
      "correctAnswers": ["1"],
      "explanation": "1번 문장은...",
      "difficulty": "beginner",
      "points": 100,
      "hints": ["...", "..."]
    },
    // ... (여기에 총 ${templates.length}개의 챌린지 객체가 포함됩니다) ...
    // 각 챌린지의 정답 위치는 1, 2, 3, 4 중 골고루 분포되어야 합니다!
  ]
}

⚠️ **다시 강조**: 정답 위치는 반드시 다양하게! 모든 문제의 정답이 특정 번호에만 있으면 안 됩니다!

이제 ${templates.length}개의 챌린지를 "challenges" 배열에 담아 JSON으로 생성해주세요.
**각 챌린지의 correctAnswers는 1, 2, 3, 4 중에서 랜덤하게 선택하세요!**
`;
  }

  async generateChallenge(
    type: string,
    difficulty: string
  ): Promise<Record<string, unknown>> {
    // 날짜 기반 시드를 추가하여 매일 다른 결과 보장
    const today = new Date().toISOString().split("T")[0];
    const randomSeed = Math.floor(Math.random() * 1000);

    const prompt = `
# 다양성 보장 시드 키

날짜: ${today}
시드: ${randomSeed}
난이도: ${difficulty}
타입: ${type}

⚡ **중요**: 매일 완전히 다른 주제와 시나리오로 생성해주세요!
⚡ **정답 위치**: 1, 2, 3, 4번 중 **랜덤하게** 선택하세요! (항상 2번이면 안 됨)

# 미디어 리터러시 교육용 챌린지 생성 전문가

당신은 비판적 사고 능력을 기르는 교육용 챌린지를 생성하는 전문가입니다.
사용자가 실제 뉴스나 콘텐츠에서 마주칠 수 있는 문제들을 학습할 수 있도록, **'질문 + 4개 문장 선택지'** 형식의 퀴즈를 만듭니다.

## 📋 챌린지 사양

**타입**: ${type} (article-analysis)
**난이도**: ${difficulty}
**형식**: 4지 선다형 (하나의 정답)

## 🎯 난이도별 가이드라인

### Beginner (초급)
- **목표**: 명확하고 쉽게 식별 가능한 오류/편향 문장 1개
- **선택지 구성**: 정답 1개 (명확한 오류) + 오답 3개 (주로 중립적이거나 사실 기반 문장)
- **점수**: 80-120점

### Intermediate (중급)
- **목표**: 약간의 분석이 필요한 오류/편향 문장 1개
- **선택지 구성**: 정답 1개 (미묘한 오류) + 오답 3개 (중립적 문장, 또는 다른 유형의 미묘한 오류를 포함한 문장)
- **점수**: 120-180점

### Advanced (고급)
- **목표**: 복합적이고 미묘한 문제
- **선택지 구성**: 정답 1개 (정교한 오류) + 오답 3개 (매우 그럴듯하지만 정답이 아닌 문장, 다른 유형의 오류 포함)
- **점수**: 180-250점

## 🎨 챌린지 카테고리 (필수 선택지 목록)

아래 목록에서 문제 카테고리(category)를 하나 선택하거나, 이와 유사한 새로운 미디어 리터러시 관련 카테고리를 자유롭게 생성하세요.

- "성급한 일반화": 적은 사례로 모든 경우에 적용하는 오류
- "허위 이분법": 복잡한 문제를 단순히 둘 중 하나로만 나누는 오류
- "인신공격": 논리 대신 사람을 비난하는 오류
- "권위에 호소": 근거 없이 권위를 내세우는 오류
- "감정적 편향": 이성적 판단보다 감정에 호소하는 표현
- "과장된 표현": 사실보다 과도하게 부풀리거나 축소되는 표현
- "허수아비 공격": 상대방 주장을 왜곡해서 공격하는 오류
- "순환논리": 증명할 것을 근거로 사용하는 오류
- "광고성 콘텐츠": 상품이나 서비스를 홍보하려는 의도가 숨어있음
- "긴급성 유도": 시간 압박을 가해 성급한 판단을 유도하는 표현
- "과장된 수치": 근거 없거나 의심스러운 통계나 수치
- "선동적 언어": 감정을 자극해 특정 의견을 유도하는 언어
- "인과관계의 오류": 단순히 먼저 일어났다고 원인으로 단정하는 오류

## 🔥 생성 요구사항

1.  **카테고리 선택**: 위 목록에서 챌린지 주제(category)를 하나 선정합니다.
2.  **용어 설명 추가**: 해당 카테고리가 무엇인지 1-2 문장으로 설명하는 \`categoryDescription\`을 생성합니다. (필수)
3.  **제목(질문) 생성**: "다음 중 '[선택한 카테고리]'이/가 있는 기사 문장을 선택하세요." 형식으로 \`title\`을 생성합니다.
4.  **선택지(Options) 생성**: 
    - 4개의 문장 선택지를 생성합니다 (options 배열).
    - 각 선택지는 { "id": "1", "text": "..." } 형식을 따릅니다.
    - **정답 문장 (1개)**: 선택한 카테고리(예: '감정적 편향')의 특징이 명확히 드러나는 문장을 만듭니다.
    - **오답 문장 (3개)**: 중립적이거나, 사실을 전달하거나, 혹은 *다른 유형*의 미묘한 문제를 가진 그럴듯한 문장을 만듭니다.
    - 🎲 **정답 위치는 1, 2, 3, 4번 중 랜덤하게 선택하세요!**

5.  **정답(CorrectAnswers) 설정**: 정답 문장의 id를 배열에 담아 correctAnswers로 설정합니다. (예: ["1"], ["2"], ["3"], 또는 ["4"])
6.  **해설(Explanation) 작성**:
    - 왜 해당 문장이 정답(선택한 카테고리)인지 명확히 설명합니다.
    - (선택 사항) 다른 오답 선택지들이 왜 정답이 아닌지 간략히 설명합니다.

7.  **힌트(Hints) 작성**:
    - 2-3개의 단계적 힌트를 제공합니다.
    - 직접적인 답 대신, 사고의 방향을 제시합니다. (예: "감정을 자극하는 단어가 있나요?")

## 🌟 주제 다양성 (필수)

매번 완전히 다른 주제와 상황을 만들어주세요:
- 다양한 분야: 건강, 경제, 정치, 사회, 과학, 기술, 문화
- 다양한 상황: 제품 리뷰, 뉴스 보도, 연구 결과, 의견 글
- 창의적이고 현실적인 시나리오

## 🎨 콘텐츠 작성 원칙

### DO (해야 할 것)
✅ 실제 뉴스처럼 자연스러운 문체
✅ 구체적이고 현실적인 상황 설정
✅ 명확한 문제점이 포함된 논리 구조
✅ 교육적 가치가 높은 예시
✅ 난이도에 맞는 복잡성 조절
✅ **정답 위치를 다양하게** (1, 2, 3, 4번 골고루)

### DON'T (하지 말 것)
❌ 인공적이거나 억지스러운 표현
❌ 지나치게 명백하거나 유치한 오류
❌ 실제로는 일어나지 않을 상황
❌ 특정 개인이나 단체 비방
❌ 사실과 전혀 맞지 않는 내용
❌ **정답을 항상 2번에 배치**

## 📊 출력 형식

⚠️ **중요**: 정답 위치는 1번, 2번, 3번, 4번 중 **랜덤하게** 선택하세요!

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명이나 마크다운 부호 없이 순수 JSON만 반환하세요:

{
  "id": "challenge-[랜덤숫자]",
  "type": "${type}",
  "title": "다음 중 '[선택한 카테고리]'이/가 있는 기사 문장을 선택하세요.",
  "category": "[선택한 카테고리]",
  "categoryDescription": "[선택한 카테고리에 대한 1-2 문장의 간결한 설명]",
  "options": [
    { "id": "1", "text": "문장 1 (정답일 수도, 오답일 수도)" },
    { "id": "2", "text": "문장 2 (정답일 수도, 오답일 수도)" },
    { "id": "3", "text": "문장 3 (정답일 수도, 오답일 수도)" },
    { "id": "4", "text": "문장 4 (정답일 수도, 오답일 수도)" }
  ],
  "correctAnswers": ["1" | "2" | "3" | "4" 중 하나를 랜덤 선택],
  "explanation": "[정답 번호]번 문장은 '[이유]' 때문에 '[선택한 카테고리]'에 해당합니다...",
  "difficulty": "${difficulty}",
  "points": 100,
  "hints": ["힌트 1", "힌트 2"]
}

## 🎯 예시 (참고용)

### 예시 1: 정답이 3번
{
  "id": "challenge-12345",
  "type": "article-analysis",
  "title": "다음 중 '감정적 편향'이 있는 기사 문장을 선택하세요.",
  "category": "감정적 편향",
  "categoryDescription": "객관적인 사실 전달보다 '충격', '분노' 등 감정을 자극하는 단어를 사용하여 독자의 반응을 유도하는 표현입니다.",
  "options": [
    { "id": "1", "text": "최근 발표된 연구에 따르면, '뉴트리젠' 영양제를 섭취한 그룹은..." },
    { "id": "2", "text": "참가자들은 플라시보 그룹에 비해 평균 수면 시간이 20분 증가했습니다." },
    { "id": "3", "text": "이 '충격적인' 결과는 수면 보조제 시장에 큰 파장을 일으킬 것입니다." },
    { "id": "4", "text": "해당 연구는 6개월간 200명을 대상으로 진행되었습니다." }
  ],
  "correctAnswers": ["3"],
  "explanation": "3번 문장은 '충격적인'이라는 단어를 사용하여 감정을 자극합니다...",
  "difficulty": "beginner",
  "points": 100,
  "hints": ["감정을 자극하는 수식어를 찾아보세요.", "..."]
}

### 예시 2: 정답이 1번
{
  "id": "challenge-67890",
  "type": "article-analysis",
  "title": "다음 중 '성급한 일반화'가 있는 문장을 선택하세요.",
  "category": "성급한 일반화",
  "categoryDescription": "...",
  "options": [
    { "id": "1", "text": "한 명의 사례만으로 모든 사람이 그렇다고 주장하는 것은 성급합니다." },
    { "id": "2", "text": "..." },
    { "id": "3", "text": "..." },
    { "id": "4", "text": "..." }
  ],
  "correctAnswers": ["1"],
  "explanation": "1번 문장은...",
  "difficulty": "beginner",
  "points": 100,
  "hints": ["...", "..."]
}

이제 ${difficulty} 난이도의 ${type} 챌린지를 생성해주세요.
**정답 위치는 1, 2, 3, 4번 중 랜덤하게 선택하세요!**
`;

    try {
      // 창의적 생성용 설정 (높은 temperature)
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.9, // ⬆️ 더 높은 temperature (0.8 → 0.9)
          topK: 40,
          topP: 0.95,
        },
      });

      const challengeText = response.text;
      if (!challengeText) {
        throw new Error("AI 응답이 비어있습니다.");
      }

      console.log("🤖 AI 챌린지 생성 응답:", challengeText.substring(0, 200));

      // JSON 추출 (코드펜스 제거)
      const jsonSlice = this.extractJsonObject(challengeText);
      const repaired = jsonrepair(jsonSlice);
      const parsedChallenge = JSON.parse(repaired);

      // 생성된 챌린지 검증
      this.validateGeneratedChallenge(parsedChallenge);

      console.log("✅ 챌린지 생성 성공:", parsedChallenge.title);
      return parsedChallenge;
    } catch (error) {
      console.error("챌린지 생성 오류:", error);

      // 에러 시 기본 챌린지 반환
      return this.getFallbackChallenge(type, difficulty);
    }
  }

  /**
   * 생성된 챌린지 검증
   */
  private validateGeneratedChallenge(challenge: Record<string, unknown>): void {
    const requiredFields = [
      "id",
      "type",
      "title",
      "options",
      "category",
      "categoryDescription",
      "correctAnswers",
      "explanation",
      "difficulty",
      "points",
    ];

    for (const field of requiredFields) {
      if (!challenge[field]) {
        throw new Error(`필수 필드 누락: ${field}`);
      }
    }

    if (
      !Array.isArray(challenge.correctAnswers) ||
      (challenge.correctAnswers as unknown[]).length === 0
    ) {
      throw new Error("정답 배열이 유효하지 않습니다");
    }

    if (
      !Array.isArray(challenge.options) ||
      (challenge.options as unknown[]).length === 0
    ) {
      throw new Error("선택지 배열이 유효하지 않습니다");
    }

    const points = challenge.points as number;
    if (typeof points !== "number" || points < 50 || points > 300) {
      throw new Error("점수가 유효하지 않습니다 (50-300)");
    }
  }

  /**
   * 에러 시 기본 챌린지 반환
   */
  private getFallbackChallenge(
    type: string,
    difficulty: string
  ): Record<string, unknown> {
    const pointsByDifficulty: Record<string, number> = {
      beginner: 100,
      intermediate: 150,
      advanced: 200,
    };

    const fallbackByDifficulty: Record<
      string,
      {
        title: string;
        category: string;
        categoryDescription: string;
        options: Array<{ id: string; text: string }>;
        correctAnswers: string[];
        explanation: string;
        hints: string[];
      }
    > = {
      beginner: {
        title: "다음 중 '성급한 일반화'가 포함된 문장을 선택하세요.",
        category: "성급한 일반화",
        categoryDescription:
          "적은 사례만으로 전체를 판단하는 논리적 오류입니다.",
        options: [
          {
            id: "1",
            text: "최근 한 연구에 따르면 A를 하는 사람이 B 결과를 나타냈다고 합니다.",
          },
          { id: "2", text: "따라서 모든 사람이 A를 해야 합니다." },
          { id: "3", text: "이는 절대적인 진리입니다." },
          { id: "4", text: "이 연구는 매우 신뢰할 수 있습니다." },
        ],
        correctAnswers: ["2"],
        explanation:
          "2번 문장은 '한 연구 결과'만으로 '모든 사람'에게 적용하려 하므로 '성급한 일반화'의 오류입니다.",
        hints: [
          "한 연구의 결과로 전체를 판단하고 있지 않나요?",
          "'모든' 같은 극단적인 단어를 찾아보세요",
        ],
      },
      intermediate: {
        title: "다음 중 '과장된 수치'를 사용한 문장을 선택하세요.",
        category: "과장된 수치",
        categoryDescription:
          "출처가 불분명하거나 검증되지 않은 통계 수치를 사용하여 주장을 부풀리는 표현입니다.",
        options: [
          {
            id: "1",
            text: "충격적인 발표! 새로운 정책이 국민들을 분노하게 만들고 있습니다.",
          },
          { id: "2", text: "모든 전문가들이 이 정책에 반대하고 있습니다." },
          { id: "3", text: "이 정책은 반드시 철회되어야 합니다." },
          {
            id: "4",
            text: "무려 98%의 국민이 반대한다는 근거 없는 조사 결과도 나왔습니다.",
          },
        ],
        correctAnswers: ["4"],
        explanation:
          "4번 문장은 '98%'라는 구체적인 수치를 제시하지만 '근거 없는 조사 결과'라고 밝히거나, 출처가 불분명한 수치를 사용하여 주장을 과장하고 있습니다.",
        hints: [
          "구체적인 수치의 출처가 의심스럽지 않나요?",
          "'모든' 전문가라는 표현이 맞을까요?",
        ],
      },
      advanced: {
        title: "다음 중 '인신공격'의 오류를 범한 문장을 선택하세요.",
        category: "인신공격",
        categoryDescription:
          "주장의 논리적 근거 대신, 그 주장을 하는 사람의 인격이나 배경을 비난하는 오류입니다.",
        options: [
          {
            id: "1",
            text: "권위 있는 연구기관에서 최신 보고서를 발표했습니다.",
          },
          {
            id: "2",
            text: "보고서에 따르면, 특정 제품 사용자들의 만족도가 대폭 상승했습니다.",
          },
          {
            id: "3",
            text: "이는 명백히 해당 제품의 우수성을 증명하는 것입니다.",
          },
          {
            id: "4",
            text: "반대 의견을 제시하는 일부 연구자들은 신뢰할 수 없습니다. 그들은 원래 비판만 일삼는 사람들입니다.",
          },
        ],
        correctAnswers: ["4"],
        explanation:
          "4번 문장은 반대 의견의 '논리'를 반박하는 대신, 의견을 제시한 '사람'을 비난하며('원래 비판만 일삼는 사람들') 주장의 신뢰도를 떨어뜨리려 합니다. 이는 인신공격의 오류입니다.",
        hints: [
          "주장 대신 사람을 공격하는 문장이 있나요?",
          "권위를 내세우는 부분을 찾아보세요 (1번)",
        ],
      },
    };

    const selected =
      fallbackByDifficulty[difficulty] || fallbackByDifficulty.beginner;

    return {
      id: `fallback-${Date.now()}`,
      type,
      ...selected,
      difficulty,
      points: pointsByDifficulty[difficulty] || 100,
    };
  }

  /**
   * 유튜브 비디오 분석
   *
   * Gemini 멀티모달 기능을 활용하여 유튜브 URL을 직접 분석
   * - 비디오 내용 및 자막 자동 추출
   * - 타임스탬프 기반 분석
   * - 편향, 광고, 논리오류 시간대별로 식별
   * - Google 검색 그라운딩으로 할루시네이션 방지
   */
  async analyzeYoutubeVideo(url: string): Promise<YoutubeTrustAnalysis> {
    console.log("🎬 유튜브 비디오 분석 시작:", url);

    // URL에서 비디오 ID 추출
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      throw new Error("유효하지 않은 유튜브 URL입니다.");
    }

    try {
      console.log("🤖 Gemini API 호출 중 (유튜브 분석)...");
      console.log("🔗 Video ID:", videoId);

      // Google Search 그라운딩 설정
      const groundingTool = {
        googleSearch: {},
      };

      const config = {
        tools: [groundingTool],
        temperature: 0.1,
        topK: 1,
        topP: 1,
        generationConfig: {
          responseMimeType: "application/json",
        },
      };

      // YouTube URL과 분석 프롬프트를 함께 전달
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: this.buildYoutubeAnalysisPrompt(url),
              },
              {
                fileData: {
                  fileUri: url,
                  mimeType: "video/*",
                },
              },
            ],
          },
        ],
        config,
      });

      console.log("✅ Gemini API 응답 성공");

      // 그라운딩 메타데이터 확인
      if (response.candidates?.[0]?.groundingMetadata) {
        const metadata = response.candidates[0].groundingMetadata;
        console.log("🔍 그라운딩 검색어:", metadata.webSearchQueries);
        console.log(
          "📚 그라운딩 소스 개수:",
          metadata.groundingChunks?.length || 0
        );

        // 그라운딩 소스 상세 정보
        if (metadata.groundingChunks && metadata.groundingChunks.length > 0) {
          console.log("📄 그라운딩 소스들:");
          metadata.groundingChunks.forEach((chunk: any, index: number) => {
            if (chunk.web) {
              console.log(`  ${index + 1}. ${chunk.web.title || "No title"}`);
              console.log(`     ${chunk.web.uri}`);
            }
          });
        }
      }

      const responseText = response.text;
      console.log("🔍 유튜브 분석 응답 길이:", responseText?.length || 0);

      if (!responseText) {
        throw new Error("AI 응답이 비어있습니다.");
      }

      return this.parseYoutubeAnalysisResult(responseText);
    } catch (error) {
      console.error("❌ 유튜브 분석 오류:", error);
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(
        `유튜브 비디오 분석 중 오류가 발생했습니다: ${errorMessage}`
      );
    }
  }
  /**
   * 유튜브 비디오 빠른 분석 (텍스트 기반)
   *
   * 자막 + 메타데이터를 먼저 추출하고 텍스트로 분석
   * 비디오 파일 처리 없이 텍스트만 분석
   *
   * @param videoInfo - 비디오 메타데이터
   * @param transcript - 추출된 자막
   * @param ChannelInfo - 채널 정보 (구독자 수 등)
   * @returns YoutubeTrustAnalysis - 상세 분석 결과
   */
  async analyzeYoutubeWithTranscript(
    videoInfo: any,
    transcript: any,
    channelInfo: ChannelInfo
  ): Promise<YoutubeTrustAnalysis> {
    console.log("🚀 유튜브 빠른 분석 시작 (텍스트 기반)");
    console.log(`📺 비디오: ${videoInfo.title}`);
    console.log(`📝 자막 길이: ${transcript.fullText.length}자`);

    try {
      // Google Search 그라운딩 설정
      const groundingTool = {
        googleSearch: {},
      };

      const config = {
        tools: [groundingTool],
        temperature: 0.1,
        topK: 1,
        topP: 1,
        generationConfig: {
          responseMimeType: "application/json",
        },
      };

      // 텍스트 기반 분석 프롬프트
      const prompt = this.buildFastYoutubeAnalysisPrompt(
        videoInfo,
        transcript,
        channelInfo
      );

      console.log("🤖 Gemini API 호출 중 (텍스트 분석)...");

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config,
      });

      console.log("✅ Gemini API 응답 성공");

      // 그라운딩 메타데이터 확인
      if (response.candidates?.[0]?.groundingMetadata) {
        const metadata = response.candidates[0].groundingMetadata;
        console.log(
          "🔍 [빠른 분석] 그라운딩 검색어:",
          metadata.webSearchQueries
        );
        console.log(
          "📚 [빠른 분석] 그라운딩 소스 개수:",
          metadata.groundingChunks?.length || 0
        );
      }

      const responseText = response.text;

      if (!responseText) {
        throw new Error("AI 응답이 비어있습니다.");
      }

      return this.parseYoutubeAnalysisResult(responseText);
    } catch (error) {
      console.error("❌ 유튜브 빠른 분석 오류:", error);
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(`유튜브 분석 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }

  /**
   * 빠른 유튜브 분석 프롬프트 생성 (텍스트 기반)
   *
   * 자막과 메타데이터를 기반으로 상세한 분석
   */
  private buildFastYoutubeAnalysisPrompt(
    videoInfo: any,
    transcript: any,
    channelInfo: ChannelInfo
  ): string {
    // 자막 세그먼트를 타임스탬프 포함 형식으로 변환
    const transcriptWithTimestamps = transcript.segments
      .slice(0, 150) // 최대 150개 세그먼트
      .map((seg: any) => `[${Math.floor(seg.start)}초] ${seg.text}`)
      .join("\n");

    return `
# ⚠️ 중요: 현재 날짜 및 팩트체크 규칙

**현재 날짜**: ${new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
**현재 시간**: ${new Date().toISOString()}

🔴 **핵심 규칙 - 반드시 준수**:

1. **Google 검색 결과가 영상보다 항상 우선**:
   - 영상에서 "A가 B다"라고 해도 Google 검색에서 "A는 C다"라고 확인되면 **Google 검색 결과를 사실로 채택**
   - 영상 내용이 검색 결과와 다르면 "misleading_data" 경고 추가

2. **정치인/공직자는 반드시 검색 검증**:
   - 대통령, 장관, 국회의원 등 공직자 언급 시 반드시 Google 검색으로 현직 확인
   - "현 OO 대통령", "현직 OO" 같은 표현은 반드시 실제 현직자와 비교

3. **최근 사건은 반드시 검색 확인**:
   - "최근", "오늘", "어제", "이번 주" 같은 시간 표현은 반드시 Google 검색으로 확인
   - 수치(코스피, 주가, 환율 등)는 반드시 검색으로 확인

4. **가상/미래 시나리오 감지**:
   - 영상이 미래를 현재인 것처럼 보도하는지 확인

5. **검색 결과와 불일치 시 대응**:
   - logicalFallacies에 "사실 오류" 항목 추가
   - warnings에 "misleading_data" 타입으로 critical 경고 추가
   - keyClaims에 잘못된 주장을 needsFactCheck: true로 표시

# MISSION: 유튜브 비디오 전문 분석 AI

당신은 세계 최고의 **유튜브 콘텐츠 전문 분석가**이자 **미디어 리터러시 AI 'Criti.AI'**입니다.

당신의 목표는 유튜브 비디오의 신뢰도를 **타임라인 기반**으로 다차원 분석하여, 사용자가 비판적 사고를 기를 수 있도록 돕는 것입니다.

# 📊 제공된 데이터

## 비디오 정보
- **제목**: ${videoInfo.title}
- **채널명**: ${videoInfo.channelName}
- **채널 ID**: ${videoInfo.channelId}
- **비디오 ID**: ${videoInfo.videoId}
- **길이**: ${videoInfo.duration}초
- **조회수**: ${videoInfo.viewCount.toLocaleString()}회
- **좋아요 수**: ${videoInfo.likeCount?.toLocaleString() || 0}개
- **게시일**: ${videoInfo.publishedAt}
- **쇼츠 여부**: ${videoInfo.isShorts ? "예" : "아니오"}
- **설명**: ${videoInfo.description.substring(0, 500)}${videoInfo.description.length > 500 ? "..." : ""}

## 채널 정보
- **구독자 수**: ${channelInfo.subscriberCount.toLocaleString()}명
- **인증 상태**: ${channelInfo.verificationStatus}
- **채널 이미지**: ${channelInfo.channelImageUrl}

## 자막 전문 (타임스탬프 포함)
${transcriptWithTimestamps}

${transcript.segments.length > 150 ? `\n... (총 ${transcript.segments.length}개 세그먼트 중 일부)` : ""}

## 전체 자막 텍스트
${transcript.fullText.substring(0, 5000)}${transcript.fullText.length > 5000 ? "..." : ""}
# 🎯 핵심 분석 원칙

⚡ **정확성 최우선**: 실제 자막 내용에 기반한 분석만 제공
🕐 **타임스탬프 필수**: 모든 분석 항목에 정확한 시간대 명시 (위 자막 세그먼트의 타임스탬프 활용)
📊 **구조화된 출력**: JSON 형식의 명확한 분석 결과
🔍 **세밀한 관찰**: 편향, 광고, 논리오류를 시간대별로 포착

# 📊 분석 차원 (타임스탬프 필수)

## 1. 비디오 기본 정보 추출
- **제목 분석**: 클릭베이트 요소, 과장 표현
- **채널 정보**: 구독자 수, 인증 상태, 전문성
- **비디오 메타데이터**: 길이, 조회수, 좋아요, 게시일
- **쇼츠 여부**: 60초 미만이면 true

## 2. 채널 신뢰도 평가 (0-100점)
- **전문성 평가**: 해당 분야에서의 전문성
- **콘텐츠 품질**: 일관성, 정보의 정확성
- **구독자 신뢰도**: 규모와 참여도
- **인증 상태**: 공식 인증 여부

## 3. 자막 및 내용 추출
- **전체 자막 수집**: 시간대별 세그먼트 (start, duration, text)
- **주요 메시지 파악**: 영상이 전달하려는 핵심 메시지
- **언어 감지**: 주 사용 언어

## 4. 타임라인 기반 편향성 분석 ⭐ (핵심)

영상의 **시간대별**로 다음 요소들을 분석하세요:

### 4-1. 감정 조작 표현 (타임스탬프 필수)
- **과장 표현**: "최고", "역대급", "충격" 등의 시간대
- **선동적 언어**: 특정 감정을 자극하는 표현의 발생 시점
- **긴급성 유도**: "지금 당장", "빨리" 등의 타임스탬프
- **공포 조장**: 불안이나 두려움을 유발하는 구간

**중요**: 각 표현의 정확한 발생 시간(초)과 주변 문맥 제공

### 4-2. 제목 및 썸네일 클릭베이트 분석
- **호기심 갭**: 정보를 숨기고 클릭 유도
- **감정 트리거**: 분노, 놀람, 공포 유발
- **최상급 표현**: "최고의", "절대", "유일한"
- **긴급성 강조**: 시간 제한 암시

**타임스탬프**: 제목/썸네일은 0초로 표시

### 4-3. 정치적/이념적 편향 (시간대 명시)
- **특정 관점 편향**: 한쪽 관점만 제시하는 구간
- **대립 구도 조장**: 갈등을 부추기는 시간대
- **타임스탬프**: 편향이 드러나는 정확한 시점

## 5. 타임라인 기반 광고성 분석 ⭐ (매우 중요)

### 5-1. 제품/서비스 언급 (타임스탬프 필수)
- **직접 광고**: 제품명/브랜드 직접 언급 시간
- **간접 광고**: 제품이 화면에 노출되는 구간
- **협찬 표시**: 협찬 공지 시점
- **제휴 링크**: "설명란 링크" 언급 시간

### 5-2. 구매 유도 (타임스탬프 필수)
- **CTA (Call-to-Action)**: "지금 구매", "할인 코드" 발생 시점
- **긴급성 유도**: "한정 수량", "오늘만" 등의 시간대
- **추천 링크**: 제휴 마케팅 언급 구간

### 5-3. 협찬 세그먼트
- **협찬 구간 범위**: start(초) ~ end(초)
- **협찬 유형**: sponsored, product_placement, affiliate

**중요**: 모든 광고성 표현의 정확한 타임스탬프와 증거 텍스트 제공

## 6. 타임라인 기반 논리적 오류 분석

### 6-1. 주요 논리적 오류 탐지 (타임스탬프 필수)
- **성급한 일반화**: 불충분한 근거로 결론 - 발생 시간
- **흑백논리**: A 아니면 B 식 단순화 - 시간대
- **인과관계 오류**: 잘못된 인과 추론 - 발생 구간
- **권위 호소**: 근거 없이 권위에 의존 - 타임스탬프
- **인신공격**: 논리 대신 인격 공격 - 시간대

**형식**: 각 오류에 대해
- 오류 유형
- 발생 시간 (start, end)
- 해당 자막 텍스트
- 왜 오류인지 설명
- 심각도 (low/medium/high)

## 7. 핵심 주장 및 팩트체크 필요 항목

### 7-1. 주요 주장 추출 (타임스탬프 필수)
- 영상에서 제시하는 주요 주장들
- 각 주장의 정확한 발생 시간
- 팩트체크 필요 여부 판단
- 검증용 키워드 제시

### 7-2. 의심스러운 정보
- 출처 불명의 통계나 데이터
- 검증 필요한 주장들
- 오해의 소지가 있는 표현

## 8. 종합 평가 및 타임라인 하이라이트

### 8-1. 신뢰도 점수 (0-100)
- **전체 점수**: 종합 신뢰도
- **채널 점수**: 채널 신뢰도
- **객관성 점수**: 편향성 역산
- **논리성 점수**: 논리적 타당성
- **광고성 점수**: 높을수록 덜 광고적
- **근거 점수**: 주장의 근거 충실도
- **썸네일 일치도**: 제목/썸네일과 내용 일치 정도

### 8-2. 타임라인 하이라이트
주요 문제 발생 시점을 리스트로 제공:
- 타임스탬프
- 문제 유형 (bias/fallacy/advertisement/claim)
- 심각도 (low/medium/high)
- 설명

### 8-3. 시청 경고
- 높은 편향성, 다수의 논리적 오류, 신뢰할 수 없는 출처, 과도한 광고, 오해의 소지 데이터 등에 대한 경고
- 심각도별 권장 조치

# 🚨 중요: 타임스탬프 지침

1. **모든 분석 항목에 타임스탬프 필수**:
   - 편향적 표현 → 몇 초에 나오는지
   - 광고성 멘트 → 몇 초에 시작하는지
   - 논리적 오류 → 몇 초에 발생하는지

2. **타임스탬프 형식**:
   - 정수형 (초 단위): 125 (2분 5초를 의미)
   - 범위로 표현 가능: start=125, end=140

3. **정확성 최우선**:
   - 실제 영상에서 해당 시간대에 문제가 나타나야 함
   - 추측하지 말고 명확한 경우만 기록
   - 자막이나 음성 내용을 정확히 인용

4. **원문 정확성**:
   - 모든 증거 텍스트는 자막이나 음성과 정확히 일치
   - 임의로 생성하거나 변형하지 말 것

# REQUIRED JSON OUTPUT FORMAT

다른 설명 없이 반드시 아래 JSON 형식으로만 응답하세요:

{
  "videoInfo": {
    "videoId": "${videoInfo.videoId}",
    "title": "${videoInfo.title}",
    "channelName": "${videoInfo.channelName}",
    "channelId": "${videoInfo.channelId}",
    "duration": ${videoInfo.duration},
    "viewCount": ${videoInfo.viewCount},
    "likeCount": ${videoInfo.likeCount || 0},
    "publishedAt": "${videoInfo.publishedAt}",
    "description": "${videoInfo.description.substring(0, 200).replace(/\n/g, " ").replace(/"/g, '\\"')}",
    "thumbnailUrl": "${videoInfo.thumbnailUrl}",
    "isShorts": ${videoInfo.isShorts}
  },
  
  "transcript": {
    "segments": ${JSON.stringify(transcript.segments.slice(0, 50))},
    "fullText": "${transcript.fullText.substring(0, 1000).replace(/\n/g, " ").replace(/"/g, '\\"')}...",
    "language": "${transcript.language}"
   },
  
  "overallScore": 0-100 사이의 정수,
  "analysisSummary": "이 비디오에 대한 핵심 분석 결과 1-2문장 요약",
  
  "channelCredibility": {
    "score": 80,
    "level": "trusted | neutral | caution | unreliable",
    "subscriberCount": ${channelInfo.subscriberCount},
    "verificationStatus": ${channelInfo.verificationStatus},
    "channelImageUrl": ${channelInfo.channelImageUrl},
    "reputation": {
      "description": "채널에 대한 간결한 설명",
      "factors": ["신뢰도 판단 근거들"],
      "contentQuality": 85,
      "consistencyScore": 90
    }
  },
  
  "biasAnalysis": {
    "emotionalBias": {
      "score": 60,
      "manipulativeWords": [
        {
          "word": "충격적인",
          "timestamp": 45,
          "category": "emotional | exaggeration | urgency | authority | fear",
          "impact": "low | medium | high",
          "explanation": "왜 이 표현이 조작적인지",
          "contextText": "주변 문맥"
        }
      ],
      "intensity": "none | low | medium | high"
    },
    "politicalBias": {
      "direction": "left | center | right | neutral",
      "confidence": 50,
      "indicators": ["정치적 편향 지표들"]
    },
    "clickbaitElements": [
      {
        "type": "curiosity_gap | emotional_trigger | urgency | superlative",
        "text": "클릭베이트 텍스트",
        "timestamp": 0,
        "explanation": "왜 클릭베이트인지",
        "severity": "low | medium | high",
        "isInTitle": true,
        "isInThumbnail": false
      }
    ]
  },
  
  "advertisementAnalysis": {
    "isAdvertorial": true,
    "confidence": 85,
    "nativeAdScore": 70 네이티브 광고 점수 (높을수록 광고적),
    "commercialIntentScore": 80 상업적 의도 점수 (높을수록 광고적),
    "indicators": [
      {
        "type": "product_mention | affiliate_link | sponsored_content | promotional_language | call_to_action | brand_focus",
        "evidence": "광고성 표현 원문",
        "timestamp": 120,
        "explanation": "왜 광고성인지",
        "severity": "low | medium | high",
        "contextText": "주변 문맥"
      }
    ],
    "sponsoredSegments": [
      {
        "start": 60,
        "end": 90,
        "type": "sponsored | product_placement | affiliate"
      }
    ]
  },
  
  "logicalFallacies": [
    {
      "type": "Appeal to Fear (공포에 호소하는 오류)",
      "description": "논리적인 근거 대신 상대방의 공포심을 자극하여 자신의 주장을 받아들이게 하려는 오류입니다.",
      "affectedText": "오류가 포함된 정확한 텍스트",
      "timestamp": 150,
      "endTime": 165,
      "severity": "low | medium | high",
      "explanation": "초등학생도 이해할 수 있는 설명",
      "examples": ["유사한 오류 예시들"]
    }
  ],
  
  "argumentAnalysis": {
    // 1. 종합 분석 (영상 전체를 보고 판단)
    "consistency": "medium", // "high" | "medium" | "low" | "contradictory"
    "evidenceBasis": "partial", // "strong" | "partial" | "unsubstantiated"
    "summary": "영상은 전반적으로 일관된 주장을 하지만, 일부 주장에 대해서는 근거 제시가 부족합니다.",

    // 2. 단순 추출 (영상에서 주장 + 키워드 뽑아냄)
    "claims": [
      {
        "claim": "핵심 주장 1 텍스트 (예: '이 제품은 100% 천연 성분입니다')",
        "timestamp": 200,
        "verificationKeywords": ["100% 천연 성분", "제품명"]
      }
    ]
  },
  
  "detailedScores": {
    "channelScore": 0-100 사이의 정수,
    "objectivityScore": 0-100 사이의 정수,
    "logicScore": 0-100 사이의 정수,
    "advertisementScore": 0-100 사이의 정수,
    "evidenceScore": 0-100 사이의 정수,
    "thumbnailAccuracy": 0-100 사이의 정수
  },
  
  "warnings": [
    {
      "type": "high_bias | multiple_fallacies | unreliable_source | heavy_advertising | misleading_data",
      "severity": "low | medium | high | critical",
      "message": "경고 메시지",
      "actionRecommendation": "권장 조치"
    }
  ],
}

# FINAL CRITICAL INSTRUCTIONS

⚠️ **반드시 준수해야 할 사항들**:

1. **JSON ONLY**: 
   - 순수 JSON만 반환
   - 마크다운 코드 블록 사용하지 말 것
   - 다른 설명 없이 JSON만

2. **타임스탬프 정확성**: 
   - 모든 타임스탬프는 정수형 (초 단위)
   - 실제 영상 내용과 일치
   - 추측하지 말고 확실한 경우만 기록

3. **원문 정확성**:
   - affectedText, evidence, claim 등은 실제 자막이나 음성과 일치
   - 임의로 생성하지 말 것

4. **한국어 응답**: 
   - 모든 설명과 분석은 자연스러운 한국어

5. **비디오 정보 수집**: 
   - Gemini가 접근 가능한 메타데이터 최대한 수집
   - 접근 불가능한 정보는 빈 문자열이나 0

6. **타임라인 하이라이트 우선순위**:
   - 높은 심각도(high severity) 항목을 포함
   - 사용자가 주의 깊게 봐야 할 구간 명시

7. **Google 검색 그라운딩 활용**:
   - 팩트체크가 필요한 주장은 Google 검색으로 검증
   - 출처를 명확히 밝히고 신뢰도 평가

   # CRITICAL JSON FORMATTING RULES (절대 준수!)

⚠️ **JSON 생성 시 필수 규칙**:

1. **영어 큰따옴표만 사용**: "
   - ❌ 한국어 따옴표 사용 금지: " " ' '
   - ✅ 영어 따옴표만 사용: " '

2. **문자열 내부의 따옴표는 이스케이프**:

3. **JSON 포맷 검증**:
   - JSON.parse()로 파싱 가능한 형식
   - 마크다운 코드 블록 없이 순수 JSON만

이제 위 유튜브 URL을 철저히 분석하여 JSON으로 응답해주세요.
`;
  }

  /**
   * URL에서 유튜브 비디오 ID 추출
   */
  private extractVideoId(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      // youtube.com/watch?v=VIDEO_ID
      if (hostname.includes("youtube.com") && urlObj.pathname === "/watch") {
        return urlObj.searchParams.get("v");
      }

      // youtu.be/VIDEO_ID
      if (hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }

      // youtube.com/shorts/VIDEO_ID
      if (
        hostname.includes("youtube.com") &&
        urlObj.pathname.startsWith("/shorts/")
      ) {
        const parts = urlObj.pathname.split("/");
        return parts[2] || null;
      }

      return null;
    } catch (error) {
      console.error("URL 파싱 오류:", error);
      return null;
    }
  }

  /**
   * 유튜브 분석 프롬프트 생성
   *
   * 릴리스 AI 수준의 상세한 분석을 위한 프롬프트
   * - 타임스탬프 기반 세밀한 분석
   * - 영상 내용 정확성 우선
   * - 구조화된 JSON 출력
   */
  private buildYoutubeAnalysisPrompt(url: string): string {
    return `
# MISSION: 유튜브 비디오 전문 분석 AI

당신은 세계 최고의 **유튜브 콘텐츠 전문 분석가**이자 **미디어 리터러시 AI 'Criti.AI'**입니다.

당신의 목표는 유튜브 비디오의 신뢰도를 **타임라인 기반**으로 다차원 분석하여, 사용자가 비판적 사고를 기를 수 있도록 돕는 것입니다.

**분석 대상 유튜브 URL**: ${url}

# 🎯 핵심 분석 원칙

⚡ **정확성 최우선**: 실제 영상 내용에 기반한 분석만 제공
🕐 **타임스탬프 필수**: 모든 분석 항목에 정확한 시간대 명시
🎬 **영상 전체 이해**: 자막과 비주얼을 종합적으로 분석
🔍 **세밀한 관찰**: 편향, 광고, 논리오류를 시간대별로 포착
📊 **구조화된 출력**: JSON 형식의 명확한 분석 결과

# 📊 분석 차원 (타임스탬프 필수)

## 1. 비디오 기본 정보 추출
- **제목 분석**: 클릭베이트 요소, 과장 표현
- **채널 정보**: 구독자 수, 인증 상태, 전문성
- **비디오 메타데이터**: 길이, 조회수, 좋아요, 게시일
- **쇼츠 여부**: 60초 미만이면 true

## 2. 채널 신뢰도 평가 (0-100점)
- **전문성 평가**: 해당 분야에서의 전문성
- **콘텐츠 품질**: 일관성, 정보의 정확성
- **구독자 신뢰도**: 규모와 참여도
- **인증 상태**: 공식 인증 여부

## 3. 자막 및 내용 추출
- **전체 자막 수집**: 시간대별 세그먼트 (start, duration, text)
- **주요 메시지 파악**: 영상이 전달하려는 핵심 메시지
- **언어 감지**: 주 사용 언어

## 4. 타임라인 기반 편향성 분석 ⭐ (핵심)

영상의 **시간대별**로 다음 요소들을 분석하세요:

### 4-1. 감정 조작 표현 (타임스탬프 필수)
- **과장 표현**: "최고", "역대급", "충격" 등의 시간대
- **선동적 언어**: 특정 감정을 자극하는 표현의 발생 시점
- **긴급성 유도**: "지금 당장", "빨리" 등의 타임스탬프
- **공포 조장**: 불안이나 두려움을 유발하는 구간

**중요**: 각 표현의 정확한 발생 시간(초)과 주변 문맥 제공

### 4-2. 제목 및 썸네일 클릭베이트 분석
- **호기심 갭**: 정보를 숨기고 클릭 유도
- **감정 트리거**: 분노, 놀람, 공포 유발
- **최상급 표현**: "최고의", "절대", "유일한"
- **긴급성 강조**: 시간 제한 암시

**타임스탬프**: 제목/썸네일은 0초로 표시

### 4-3. 정치적/이념적 편향 (시간대 명시)
- **특정 관점 편향**: 한쪽 관점만 제시하는 구간
- **대립 구도 조장**: 갈등을 부추기는 시간대
- **타임스탬프**: 편향이 드러나는 정확한 시점

## 5. 타임라인 기반 광고성 분석 ⭐ (매우 중요)

### 5-1. 제품/서비스 언급 (타임스탬프 필수)
- **직접 광고**: 제품명/브랜드 직접 언급 시간
- **간접 광고**: 제품이 화면에 노출되는 구간
- **협찬 표시**: 협찬 공지 시점
- **제휴 링크**: "설명란 링크" 언급 시간

### 5-2. 구매 유도 (타임스탬프 필수)
- **CTA (Call-to-Action)**: "지금 구매", "할인 코드" 발생 시점
- **긴급성 유도**: "한정 수량", "오늘만" 등의 시간대
- **추천 링크**: 제휴 마케팅 언급 구간

### 5-3. 협찬 세그먼트
- **협찬 구간 범위**: start(초) ~ end(초)
- **협찬 유형**: sponsored, product_placement, affiliate

**중요**: 모든 광고성 표현의 정확한 타임스탬프와 증거 텍스트 제공

## 6. 타임라인 기반 논리적 오류 분석

### 6-1. 주요 논리적 오류 탐지 (타임스탬프 필수)
- **성급한 일반화**: 불충분한 근거로 결론 - 발생 시간
- **흑백논리**: A 아니면 B 식 단순화 - 시간대
- **인과관계 오류**: 잘못된 인과 추론 - 발생 구간
- **권위 호소**: 근거 없이 권위에 의존 - 타임스탬프
- **인신공격**: 논리 대신 인격 공격 - 시간대

**형식**: 각 오류에 대해
- 오류 유형
- 발생 시간 (start, end)
- 해당 자막 텍스트
- 왜 오류인지 설명
- 심각도 (low/medium/high)

## 7. 핵심 주장 및 팩트체크 필요 항목

### 7-1. 주요 주장 추출 (타임스탬프 필수)
- 영상에서 제시하는 주요 주장들
- 각 주장의 정확한 발생 시간
- 팩트체크 필요 여부 판단
- 검증용 키워드 제시

### 7-2. 의심스러운 정보
- 출처 불명의 통계나 데이터
- 검증 필요한 주장들
- 오해의 소지가 있는 표현

## 8. 종합 평가 및 타임라인 하이라이트

### 8-1. 신뢰도 점수 (0-100)
- **전체 점수**: 종합 신뢰도
- **채널 점수**: 채널 신뢰도
- **객관성 점수**: 편향성 역산
- **논리성 점수**: 논리적 타당성
- **광고성 점수**: 높을수록 덜 광고적
- **근거 점수**: 주장의 근거 충실도
- **썸네일 일치도**: 제목/썸네일과 내용 일치 정도

### 8-2. 타임라인 하이라이트
주요 문제 발생 시점을 리스트로 제공:
- 타임스탬프
- 문제 유형 (bias/fallacy/advertisement/claim)
- 심각도 (low/medium/high)
- 설명

### 8-3. 시청 경고
- 높은 편향성, 다수의 논리적 오류, 신뢰할 수 없는 출처, 과도한 광고, 오해의 소지 데이터 등에 대한 경고
- 심각도별 권장 조치

# 🚨 중요: 타임스탬프 지침

1. **모든 분석 항목에 타임스탬프 필수**:
   - 편향적 표현 → 몇 초에 나오는지
   - 광고성 멘트 → 몇 초에 시작하는지
   - 논리적 오류 → 몇 초에 발생하는지

2. **타임스탬프 형식**:
   - 정수형 (초 단위): 125 (2분 5초를 의미)
   - 범위로 표현 가능: start=125, end=140

3. **정확성 최우선**:
   - 실제 영상에서 해당 시간대에 문제가 나타나야 함
   - 추측하지 말고 명확한 경우만 기록
   - 자막이나 음성 내용을 정확히 인용

4. **원문 정확성**:
   - 모든 증거 텍스트는 자막이나 음성과 정확히 일치
   - 임의로 생성하거나 변형하지 말 것

# REQUIRED JSON OUTPUT FORMAT

다른 설명 없이 반드시 아래 JSON 형식으로만 응답하세요:

{
  "videoInfo": {
    "videoId": "추출된 비디오 ID",
    "title": "비디오 제목",
    "channelName": "채널명",
    "channelId": "채널 ID (확인 가능한 경우)",
    "duration": 123,
    "viewCount": 12345,
    "likeCount": 567,
    "publishedAt": "게시일 (ISO 형식)",
    "description": "비디오 설명 (처음 200자)",
    "thumbnailUrl": "썸네일 URL",
    "isShorts": false
  },
  
  "transcript": {
    "segments": [
      {
        "text": "자막 텍스트",
        "start": 0,
        "duration": 3
      }
    ],
    "fullText": "전체 자막을 합친 텍스트",
    "language": "ko"
  },
  
  "overallScore": 0-100 사이의 정수,
  "analysisSummary": "이 비디오에 대한 핵심 분석 결과 1-2문장 요약",
  
  "channelCredibility": {
    "score": 80,
    "level": "trusted | neutral | caution | unreliable",
    "subscriberCount": 100000,
    "verificationStatus": "verified | unverified",
    "reputation": {
      "description": "채널에 대한 간결한 설명",
      "factors": ["신뢰도 판단 근거들"],
      "contentQuality": 85,
      "consistencyScore": 90
    }
  },
  
  "biasAnalysis": {
    "emotionalBias": {
      "score": 60,
      "manipulativeWords": [
        {
          "word": "충격적인",
          "timestamp": 45,
          "category": "emotional | exaggeration | urgency | authority | fear",
          "impact": "low | medium | high",
          "explanation": "왜 이 표현이 조작적인지",
          "contextText": "주변 5초의 문맥"
        }
      ],
      "intensity": "none | low | medium | high"
    },
    "politicalBias": {
      "direction": "left | center | right | neutral",
      "confidence": 50,
      "indicators": ["정치적 편향 지표들"]
    },
    "clickbaitElements": [
      {
        "type": "curiosity_gap | emotional_trigger | urgency | superlative",
        "text": "클릭베이트 텍스트",
        "timestamp": 0,
        "explanation": "왜 클릭베이트인지",
        "severity": "low | medium | high",
        "isInTitle": true,
        "isInThumbnail": false
      }
    ]
  },
  
  "advertisementAnalysis": {
    "isAdvertorial": true,
    "confidence": 0-100 사이의 정수,
    "nativeAdScore": 0-100 사이의 정수 네이티브 광고 점수 (높을수록 광고적),
    "commercialIntentScore": 0-100 사이의 정수 상업적 의도 점수 (높을수록 광고적),
    "indicators": [
      {
        "type": "product_mention | affiliate_link | sponsored_content | promotional_language | call_to_action | brand_focus",
        "evidence": "광고성 표현 원문",
        "timestamp": 120,
        "explanation": "왜 광고성인지",
        "severity": "low | medium | high",
        "contextText": "주변 문맥"
      }
    ],
    "sponsoredSegments": [
      {
        "start": 60,
        "end": 90,
        "type": "sponsored | product_placement | affiliate"
      }
    ]
  },
  
  "logicalFallacies": [
    {
      "type": "성급한 일반화",
      "description": "오류에 대한 설명",
      "affectedText": "오류가 포함된 정확한 텍스트",
      "timestamp": 150,
      "endTime": 165,
      "severity": "low | medium | high",
      "explanation": "초등학생도 이해할 수 있는 설명",
      "examples": ["유사한 오류 예시들"]
    }
  ],
  
  "argumentAnalysis": {
    // 1. 종합 분석 (영상 전체를 보고 판단)
    "consistency": "medium", // "high" | "medium" | "low" | "contradictory"
    "evidenceBasis": "partial", // "strong" | "partial" | "unsubstantiated"
    "summary": "영상은 전반적으로 일관된 주장을 하지만, 일부 주장에 대해서는 근거 제시가 부족합니다.",

    // 2. 단순 추출 (영상에서 주장 + 키워드 뽑아냄)
    "claims": [
      {
        "claim": "핵심 주장 1 텍스트 (예: '이 제품은 100% 천연 성분입니다')",
        "timestamp": 200,
        "verificationKeywords": ["100% 천연 성분", "제품명"]
      }
    ]
  },
  
  "detailedScores": {
    "channelScore": 0-100 사이의 정수,
    "objectivityScore": 0-100 사이의 정수,
    "logicScore": 0-100 사이의 정수,
    "advertisementScore": 0-100 사이의 정수,
    "evidenceScore": 0-100 사이의 정수,
    "thumbnailAccuracy": 0-100 사이의 정수
  },
  
  "warnings": [
    {
      "type": "high_bias | multiple_fallacies | unreliable_source | heavy_advertising | misleading_data",
      "severity": "low | medium | high | critical",
      "message": "경고 메시지",
      "actionRecommendation": "권장 조치"
    }
  ]
}

# FINAL CRITICAL INSTRUCTIONS

⚠️ **반드시 준수해야 할 사항들**:

1. **JSON ONLY**: 
   - 순수 JSON만 반환
   - 마크다운 코드 블록 사용하지 말 것
   - 다른 설명 없이 JSON만

2. **타임스탬프 정확성**: 
   - 모든 타임스탬프는 정수형 (초 단위)
   - 실제 영상 내용과 일치
   - 추측하지 말고 확실한 경우만 기록

3. **원문 정확성**:
   - affectedText, evidence, claim 등은 실제 자막이나 음성과 일치
   - 임의로 생성하지 말 것

4. **한국어 응답**: 
   - 모든 설명과 분석은 자연스러운 한국어

5. **비디오 정보 수집**: 
   - Gemini가 접근 가능한 메타데이터 최대한 수집
   - 접근 불가능한 정보는 빈 문자열이나 0

6. **분석 불가능 시**: 
   - 비디오 접근 불가 시 overallScore를 -1
   - analysisSummary에 접근 불가 사유 작성

7. **타임라인 하이라이트 우선순위**:
   - 높은 심각도(high severity) 항목을 포함
   - 사용자가 주의 깊게 봐야 할 구간 명시

8. **Google 검색 그라운딩 활용**:
   - 팩트체크가 필요한 주장은 Google 검색으로 검증
   - 출처를 명확히 밝히고 신뢰도 평가

이제 위 유튜브 URL을 철저히 분석하여 JSON으로 응답해주세요.
`;
  }

  /**
   * 유튜브 분석 결과 파싱
   */
  private parseYoutubeAnalysisResult(
    analysisText: string
  ): YoutubeTrustAnalysis {
    try {
      console.log("🔍 유튜브 분석 응답 길이:", analysisText.length);
      console.log("🔍 응답 시작:", analysisText.substring(0, 300));

      // 1) JSON 추출
      const jsonSlice = this.extractJsonObject(analysisText);
      console.log("🔍 추출된 JSON 길이:", jsonSlice.length);
      console.log("🔍 JSON 시작:", jsonSlice.substring(0, 200));

      // 2) jsonrepair로 복구
      const repaired = jsonrepair(jsonSlice);
      console.log("🔧 JSON 복구 완료");

      // 3) 파싱
      const parsed = JSON.parse(repaired) as YoutubeTrustAnalysis;

      // 기본 검증
      if (typeof parsed.overallScore !== "number") {
        throw new Error("overallScore가 유효하지 않습니다");
      }

      console.log("✅ 유튜브 분석 결과 파싱 완료");
      return parsed;
    } catch (error) {
      console.error("❌ 유튜브 분석 JSON 파싱 오류:", error);
      console.error(
        "📄 원본 응답 (처음 1000자):",
        analysisText.substring(0, 1000)
      );
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(`유튜브 분석 결과 파싱 실패 - 원인: ${errorMessage}`);
    }
  }
}
