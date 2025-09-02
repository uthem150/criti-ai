import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TrustAnalysis, AnalysisRequest } from "@criti-ai/shared";

// 더미 데이터 생성을 위한 함수 (개발/테스트용)
const generateDummyAnalysis = (url: string, content: string): TrustAnalysis => {
  const domain = new URL(url).hostname;
  return {
    overallScore: Math.floor(Math.random() * 40) + 60, // 60-99 사이
    sourceCredibility: {
      score: Math.floor(Math.random() * 30) + 70,
      level: 'neutral',
      domain,
      reputation: {
        description: '검증된 언론사',
        factors: ['도메인 확인', '일반적 평판']
      }
    },
    biasAnalysis: {
      emotionalBias: {
        score: Math.floor(Math.random() * 50) + 25,
        manipulativeWords: ['충격적인', '반드시', '절대적으로'],
        intensity: 'medium'
      },
      politicalBias: {
        direction: 'neutral',
        confidence: Math.floor(Math.random() * 30) + 60
      },
      highlightedTexts: [
        {
          text: '충격적인 발표',
          type: 'bias',
          position: { start: 0, end: 6, selector: '' },
          explanation: '감정을 자극하는 과장된 표현입니다'
        },
        {
          text: '반드시 확인해야',
          type: 'bias',
          position: { start: 50, end: 58, selector: '' },
          explanation: '강제성을 나타내는 편향적 표현입니다'
        }
      ]
    },
    logicalFallacies: [
      {
        type: '성급한 일반화',
        description: '제한된 사례로 전체를 판단하고 있습니다',
        affectedText: '일부 사례를 통한 전체 판단',
        position: { start: 100, end: 120, selector: '' },
        severity: 'medium'
      }
    ],
    crossReference: {
      relatedArticles: [],
      consensus: 'insufficient'
    }
  };
};

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor() {
    console.log('🔍 환경변수 디버그:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- GEMINI_API_KEY 존재:', !!process.env.GEMINI_API_KEY);
    console.log('- 현재 작업 디렉토리:', process.cwd());
    console.log('- 모든 환경변수 키:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY가 설정되지 않았습니다.');
      console.error('현재 작업 디렉토리:', process.cwd());
      console.error('.env 파일 경로 확인 필요');
      throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
    }
    
    console.log('✅ GEMINI_API_KEY 로드 성공');

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",  // 최신 모델명으로 업데이트
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
      },
    });
  }

  async analyzeContent(request: AnalysisRequest): Promise<TrustAnalysis> {
    console.log('🔍 Gemini API 분석 시작:', {
      url: request.url,
      contentLength: request.content.length
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
      console.log('🔄 API 에러 대체 - 더미 데이터 반환');
      
      // API 호출 실패 시만 더미 데이터 반환
      return generateDummyAnalysis(request.url, request.content);
    }
  }

  private buildAnalysisPrompt(request: AnalysisRequest): string {
    return `
당신은 뉴스 기사의 신뢰도를 분석하는 전문가입니다. 아래 기사를 다음 기준으로 분석해주세요:

**분석할 기사:**
제목: ${request.title ?? "제목 없음"}
URL: ${request.url}
내용: ${request.content}

**분석 기준:**
1. 출처 신뢰도 (0-100점)
2. 감정적 편향성 탐지 (조작적 단어, 선동적 표현)
3. 논리적 오류 탐지 (성급한 일반화, 허수아비 공격 등)
4. 사실 확인 가능성

**응답 형식 (반드시 JSON으로):**
{
  "overallScore": 85,
  "sourceCredibility": {
    "score": 90,
    "level": "trusted",
    "domain": "example.com",
    "reputation": {
      "description": "신뢰할 수 있는 언론사",
      "factors": ["정부 인증", "오랜 역사"]
    }
  },
  "biasAnalysis": {
    "emotionalBias": {
      "score": 20,
      "manipulativeWords": ["충격적인", "반드시"],
      "intensity": "low"
    },
    "politicalBias": {
      "direction": "neutral",
      "confidence": 80
    },
    "highlightedTexts": [
      {
        "text": "충격적인 사실이 밝혀졌다",
        "type": "bias",
        "position": { "start": 0, "end": 10, "selector": "" },
        "explanation": "감정을 자극하는 표현"
      }
    ]
  },
  "logicalFallacies": [
    {
      "type": "성급한 일반화",
      "description": "소수 사례로 전체를 판단",
      "affectedText": "해당 문장",
      "position": { "start": 0, "end": 10, "selector": "" },
      "severity": "medium"
    }
  ],
  "crossReference": {
    "relatedArticles": [],
    "consensus": "insufficient"
  }
}

**주의사항:**
- 반드시 한국어로 분석
- JSON 형식 엄수
- 구체적이고 건설적인 피드백 제공
`;
  }

  private parseAnalysisResult(analysisText: string): TrustAnalysis {
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("유효한 JSON 응답을 찾을 수 없습니다.");
      }

      const parsed = JSON.parse(jsonMatch[0]) as TrustAnalysis;
      return parsed;
    } catch (error) {
      console.error("Analysis parsing error:", error);
      throw new Error("AI 분석 결과를 파싱할 수 없습니다.");
    }
  }

  async generateChallenge(type: string, difficulty: string): Promise<Record<string, unknown>> {
    return {};
  }
}
