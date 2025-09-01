import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TrustAnalysis, AnalysisRequest } from "@criti-ai/shared";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
      },
    });
  }

  async analyzeContent(request: AnalysisRequest): Promise<TrustAnalysis> {
    const prompt = this.buildAnalysisPrompt(request);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      return this.parseAnalysisResult(analysisText);
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("AI 분석 중 오류가 발생했습니다.");
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

  async generateChallenge(type: string, difficulty: string): Promise<any> {
    return {};
  }
}
