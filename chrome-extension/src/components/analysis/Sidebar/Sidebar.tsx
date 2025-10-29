import React, { useState } from "react";
import type { TrustAnalysis } from "@shared/types";
import { Global } from "@emotion/react";
import * as S from "./Sidebar.style";

interface SidebarProps {
  analysis: TrustAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  onAnalyze: () => void;
  onClose?: () => void;
  onSectionClick?: (sectionType: string, itemText?: string) => void;
}

interface ExpandableSectionProps {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  sectionType?: string;
}

interface ClickableTextProps {
  text: string;
  type: "bias" | "fallacy" | "manipulation" | "advertisement" | "claim";
  className?: string;
  onTextClick?: (text: string, type: string) => void;
  children?: React.ReactNode;
}

// 클릭 가능한 텍스트 컴포넌트
const ClickableText: React.FC<ClickableTextProps> = ({
  text,
  type,
  className = "",
  onTextClick,
  children,
}) => {
  const handleClick = () => {
    console.log("📝 사이드바에서 텍스트 클릭:", text, type);

    if (onTextClick) {
      onTextClick(text, type);
    }

    // 향상된 스크롤 로직
    const critiAI = window.critiAI;
    if (critiAI?.scrollToHighlightByText) {
      const success = critiAI.scrollToHighlightByText(text, type);
      if (success) {
        console.log("✅ 스크롤 성공:", text);
      } else {
        console.log("❌ 스크롤 실패:", text);
        // 백업 전략: 더 느슨한 매칭
        const allHighlights = document.querySelectorAll(".criti-ai-highlight");
        let found = false;

        for (const highlight of allHighlights) {
          const highlightText =
            highlight.textContent?.toLowerCase().trim() || "";
          const searchText = text.toLowerCase().trim();

          // 더 유연한 매칭 (부분 일치, 20% 이상 일치)
          const similarity = calculateTextSimilarity(highlightText, searchText);
          if (similarity > 0.2) {
            highlight.scrollIntoView({ behavior: "smooth", block: "center" });
            highlight.classList.add("criti-ai-highlight-focused");
            setTimeout(() => {
              highlight.classList.remove("criti-ai-highlight-focused");
            }, 2000);
            found = true;
            console.log("✅ 백업 스크롤 성공 (유사도:", similarity, ")");
            break;
          }
        }

        if (!found) {
          console.log("⚠️ 어떤 방법으로도 하이라이트를 찾을 수 없음");
        }
      }
    }
  };

  // 텍스트 유사도 계산 함수
  const calculateTextSimilarity = (text1: string, text2: string): number => {
    if (text1.length === 0 && text2.length === 0) return 1.0;
    if (text1.length === 0 || text2.length === 0) return 0.0;

    // 단순한 부분 일치 및 단어 매칭 체크
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    let matchCount = 0;

    for (const word1 of words1) {
      if (
        word1.length > 2 &&
        words2.some((word2) => word2.includes(word1) || word1.includes(word2))
      ) {
        matchCount++;
      }
    }

    return matchCount / Math.max(words1.length, words2.length);
  };

  return (
    <S.ClickableTextStyled
      type={type}
      className={className} // .word-badge 등이 여기 전달됨
      onClick={handleClick}
      title="클릭하여 본문에서 찾기"
    >
      {children || text}
    </S.ClickableTextStyled>
  );
};

// ExpandableSection (S. 컴포넌트 사용)
const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  badge,
  badgeColor = "#0ea5e9",
  sectionType,
}) => (
  <S.ExpandableSectionContainer data-section={sectionType}>
    <S.SectionHeader onClick={onToggle}>
      <S.HeaderLeft>
        <S.SectionIcon>{icon}</S.SectionIcon>
        <S.SectionTitle>{title}</S.SectionTitle>
        {badge && (
          <S.SectionBadge style={{ backgroundColor: badgeColor }}>
            {badge}
          </S.SectionBadge>
        )}
      </S.HeaderLeft>
      <S.ExpandArrow expanded={isExpanded}>▼</S.ExpandArrow>
    </S.SectionHeader>
    {isExpanded && <S.SectionContent>{children}</S.SectionContent>}
  </S.ExpandableSectionContainer>
);

export const AnalysisSidebar: React.FC<SidebarProps> = ({
  analysis,
  isAnalyzing,
  error,
  onAnalyze,
  onClose,
  onSectionClick,
}) => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    overview: true,
    source: false,
    bias: false,
    logic: false,
    advertisement: false,
    crossref: false,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleTextClick = (text: string, type: string) => {
    console.log("📍 사이드바에서 텍스트 클릭:", text, type);
    onSectionClick?.(type, text);
  };

  return (
    <S.Container>
      <Global styles={S.globalStyles} />
      <S.CloseButtonContainer>
        <S.CloseButton onClick={onClose} type="button" title="닫기">
          ✕
        </S.CloseButton>
      </S.CloseButtonContainer>

      <S.HeaderSection>
        <S.HeaderTitle>🔍 Criti AI</S.HeaderTitle>
        <S.HeaderSubtitle>콘텐츠 신뢰도 종합 분석</S.HeaderSubtitle>
      </S.HeaderSection>

      {error && (
        <S.ErrorSection>
          <S.ErrorIcon>❌</S.ErrorIcon>
          <S.ErrorTitle>연결 오류</S.ErrorTitle>
          <S.ErrorText>{error}</S.ErrorText>

          <S.ErrorSolutions>
            <S.ErrorSolutionsTitle>🔧 해결 방법:</S.ErrorSolutionsTitle>
            <S.ErrorSolutionsList>
              <S.ErrorSolutionsItem>
                백엔드 서버 실행 확인 (http://localhost:3001)
              </S.ErrorSolutionsItem>
              <S.ErrorSolutionsItem>API 키 설정 확인</S.ErrorSolutionsItem>
              <S.ErrorSolutionsItem>
                네트워크 연결 상태 확인
              </S.ErrorSolutionsItem>
            </S.ErrorSolutionsList>
          </S.ErrorSolutions>

          <S.ErrorActions>
            <S.ErrorButton primary onClick={() => window.location.reload()}>
              🔄 새로고침
            </S.ErrorButton>
            <S.ErrorButton onClick={onAnalyze}>⚡ 재시도</S.ErrorButton>
          </S.ErrorActions>
        </S.ErrorSection>
      )}

      {!analysis && !isAnalyzing && !error && (
        <S.WelcomeSection>
          <S.WelcomeIcon>🎯</S.WelcomeIcon>
          <S.WelcomeTitle>분석 시작하기</S.WelcomeTitle>
          <S.WelcomeText>
            AI가 이 콘텐츠의 신뢰도, 편향성, 광고성을 종합적으로 분석해드립니다
          </S.WelcomeText>
          <S.AnalyzeButton onClick={onAnalyze}>
            <S.ButtonIcon>🔍</S.ButtonIcon>이 글 분석하기
          </S.AnalyzeButton>

          <S.AnalysisFeatures>
            <S.FeatureItem>
              <S.FeatureIcon>🏛️</S.FeatureIcon>
              <span>출처 신뢰도</span>
            </S.FeatureItem>
            <S.FeatureItem>
              <S.FeatureIcon>🎭</S.FeatureIcon>
              <span>편향성 분석</span>
            </S.FeatureItem>
            <S.FeatureItem>
              <S.FeatureIcon>🧠</S.FeatureIcon>
              <span>논리적 오류</span>
            </S.FeatureItem>
            <S.FeatureItem>
              <S.FeatureIcon>🎯</S.FeatureIcon>
              <span>광고성 탐지</span>
            </S.FeatureItem>
          </S.AnalysisFeatures>
        </S.WelcomeSection>
      )}

      {isAnalyzing && (
        <S.LoadingSection>
          <S.LoadingAnimation>
            <S.Spinner />
            <S.LoadingDots>
              <S.LoadingDot />
              <S.LoadingDot />
              <S.LoadingDot />
            </S.LoadingDots>
          </S.LoadingAnimation>
          <S.LoadingTitle>AI 분석 진행중...</S.LoadingTitle>
          <S.LoadingText>
            신뢰도, 편향성, 광고성, 논리적 오류를 종합 분석하고 있습니다
          </S.LoadingText>

          <S.AnalysisSteps>
            <S.Step active>📊 데이터 수집</S.Step>
            <S.Step active>🔍 패턴 분석</S.Step>
            <S.Step active>🎯 결과 생성</S.Step>
          </S.AnalysisSteps>
        </S.LoadingSection>
      )}

      {analysis && (
        <S.ResultsSection>
          {/* 전체 점수 섹션 */}
          <ExpandableSection
            title="종합 분석 결과"
            icon="📊"
            isExpanded={expandedSections.overview}
            onToggle={() => toggleSection("overview")}
            badge={`${analysis.overallScore}/100`}
            badgeColor={
              analysis.overallScore >= 70
                ? "#10b981"
                : analysis.overallScore >= 50
                  ? "#f59e0b"
                  : "#ef4444"
            }
            sectionType="overview"
          >
            <S.OverviewContent>
              <S.OverallScoreDisplay>
                <S.ScoreCircle>
                  <S.ScoreNumber>{analysis.overallScore}</S.ScoreNumber>
                  <S.ScoreLabel>신뢰도 점수</S.ScoreLabel>
                </S.ScoreCircle>
                <S.ScoreDescription>
                  <S.ScoreDescriptionTitle>
                    🎯 분석 요약
                  </S.ScoreDescriptionTitle>
                  <S.ScoreDescriptionText>
                    {analysis.analysisSummary}
                  </S.ScoreDescriptionText>
                </S.ScoreDescription>
              </S.OverallScoreDisplay>

              {analysis.detailedScores && (
                <S.DetailedScores>
                  <S.DetailedScoresTitle>📈 상세 점수</S.DetailedScoresTitle>
                  <S.ScoreBars>
                    <S.ScoreBar>
                      <S.BarInfo>
                        <S.BarLabel>🏛️ 출처</S.BarLabel>
                        <S.BarValue>
                          {analysis.detailedScores.sourceScore}
                        </S.BarValue>
                      </S.BarInfo>
                      <S.BarTrack>
                        <S.BarFill
                          type="source"
                          style={{
                            width: `${analysis.detailedScores.sourceScore}%`,
                          }}
                        />
                      </S.BarTrack>
                    </S.ScoreBar>

                    <S.ScoreBar>
                      <S.BarInfo>
                        <S.BarLabel>⚖️ 객관성</S.BarLabel>
                        <S.BarValue>
                          {analysis.detailedScores.objectivityScore}
                        </S.BarValue>
                      </S.BarInfo>
                      <S.BarTrack>
                        <S.BarFill
                          type="objectivity"
                          style={{
                            width: `${analysis.detailedScores.objectivityScore}%`,
                          }}
                        />
                      </S.BarTrack>
                    </S.ScoreBar>

                    <S.ScoreBar>
                      <S.BarInfo>
                        <S.BarLabel>🧠 논리성</S.BarLabel>
                        <S.BarValue>
                          {analysis.detailedScores.logicScore}
                        </S.BarValue>
                      </S.BarInfo>
                      <S.BarTrack>
                        <S.BarFill
                          type="logic"
                          style={{
                            width: `${analysis.detailedScores.logicScore}%`,
                          }}
                        />
                      </S.BarTrack>
                    </S.ScoreBar>

                    <S.ScoreBar>
                      <S.BarInfo>
                        <S.BarLabel>🚫 광고성</S.BarLabel>
                        <S.BarValue>
                          {analysis.detailedScores.advertisementScore}
                        </S.BarValue>
                      </S.BarInfo>
                      <S.BarTrack>
                        <S.BarFill
                          type="advertisement"
                          style={{
                            width: `${analysis.detailedScores.advertisementScore}%`,
                          }}
                        />
                      </S.BarTrack>
                    </S.ScoreBar>

                    <S.ScoreBar>
                      <S.BarInfo>
                        <S.BarLabel>📚 근거</S.BarLabel>
                        <S.BarValue>
                          {analysis.detailedScores.evidenceScore}
                        </S.BarValue>
                      </S.BarInfo>
                      <S.BarTrack>
                        <S.BarFill
                          type="evidence"
                          style={{
                            width: `${analysis.detailedScores.evidenceScore}%`,
                          }}
                        />
                      </S.BarTrack>
                    </S.ScoreBar>
                  </S.ScoreBars>
                </S.DetailedScores>
              )}
            </S.OverviewContent>
          </ExpandableSection>

          {/* 출처 신뢰도 섹션 */}
          <ExpandableSection
            title="출처 신뢰도"
            icon="🏛️"
            isExpanded={expandedSections.source}
            onToggle={() => toggleSection("source")}
            badge={`${analysis.sourceCredibility.score}/100`}
            badgeColor={
              analysis.sourceCredibility.level === "trusted"
                ? "#10b981"
                : analysis.sourceCredibility.level === "neutral"
                  ? "#6b7280"
                  : analysis.sourceCredibility.level === "caution"
                    ? "#f59e0b"
                    : "#ef4444"
            }
            sectionType="source"
          >
            <S.SourceContent>
              <S.TrustLevel>
                <S.TrustBadge level={analysis.sourceCredibility.level}>
                  {analysis.sourceCredibility.level === "trusted"
                    ? "✅ 신뢰할 만함"
                    : analysis.sourceCredibility.level === "neutral"
                      ? "⚖️ 중립적"
                      : analysis.sourceCredibility.level === "caution"
                        ? "⚠️ 주의 필요"
                        : "🚨 신뢰하기 어려움"}
                </S.TrustBadge>
              </S.TrustLevel>

              <S.SourceDetails>
                <S.SourceDetailsTitle>
                  📰 {analysis.sourceCredibility.domain}
                </S.SourceDetailsTitle>
                <S.SourceDescriptionText>
                  {analysis.sourceCredibility.reputation.description}
                </S.SourceDescriptionText>

                <S.ReputationFactors>
                  <S.ReputationFactorsTitle>
                    평가 근거:
                  </S.ReputationFactorsTitle>
                  <S.FactorTags>
                    {analysis.sourceCredibility.reputation.factors.map(
                      (factor, idx) => (
                        <S.FactorTag key={idx}>• {factor}</S.FactorTag>
                      )
                    )}
                  </S.FactorTags>
                </S.ReputationFactors>

                {analysis.sourceCredibility.reputation
                  .historicalReliability && (
                  <S.HistoricalData>
                    <S.HistoricalItem>
                      <S.HistoricalLabel>과거 신뢰도:</S.HistoricalLabel>
                      <S.HistoricalValue>
                        {
                          analysis.sourceCredibility.reputation
                            .historicalReliability
                        }
                        %
                      </S.HistoricalValue>
                    </S.HistoricalItem>
                    {analysis.sourceCredibility.reputation.expertiseArea && (
                      <S.HistoricalItem>
                        <S.HistoricalLabel>전문 분야:</S.HistoricalLabel>
                        <S.HistoricalValue>
                          {analysis.sourceCredibility.reputation.expertiseArea.join(
                            ", "
                          )}
                        </S.HistoricalValue>
                      </S.HistoricalItem>
                    )}
                  </S.HistoricalData>
                )}
              </S.SourceDetails>
            </S.SourceContent>
          </ExpandableSection>

          {/* 편향성 분석 섹션 */}
          <ExpandableSection
            title="편향성 분석"
            icon="🎭"
            isExpanded={expandedSections.bias}
            onToggle={() => toggleSection("bias")}
            badge={`${analysis.biasAnalysis.emotionalBias.score}/100`}
            badgeColor={
              analysis.biasAnalysis.emotionalBias.score >= 70
                ? "#10b981"
                : "#f59e0b"
            }
            sectionType="bias"
          >
            <S.BiasContent>
              {/* 감정적 편향 */}
              <S.BiasSection>
                <S.BiasSectionTitle>💥 감정적 편향</S.BiasSectionTitle>
                <S.IntensityDisplay>
                  <S.IntensityBadge
                    intensity={analysis.biasAnalysis.emotionalBias.intensity}
                  >
                    {analysis.biasAnalysis.emotionalBias.intensity === "high"
                      ? "🔥 매우 높음"
                      : analysis.biasAnalysis.emotionalBias.intensity ===
                          "medium"
                        ? "🟡 보통"
                        : analysis.biasAnalysis.emotionalBias.intensity ===
                            "low"
                          ? "🟢 낮음"
                          : "✅ 거의 없음"}
                  </S.IntensityBadge>
                </S.IntensityDisplay>

                {analysis.biasAnalysis.emotionalBias.manipulativeWords?.length >
                  0 && (
                  <S.ManipulativeWords>
                    <S.ManipulativeWordsTitle>
                      🎯 조작적 표현 탐지 (클릭하여 본문에서 찾기):
                    </S.ManipulativeWordsTitle>
                    <S.WordsGrid>
                      {analysis.biasAnalysis.emotionalBias.manipulativeWords.map(
                        (wordObj, idx) => {
                          const word =
                            typeof wordObj === "string"
                              ? wordObj
                              : wordObj.word;
                          const explanation =
                            typeof wordObj === "string"
                              ? `조작적 표현: "${word}"`
                              : wordObj.explanation;
                          const impact =
                            typeof wordObj === "string"
                              ? "medium"
                              : wordObj.impact;

                          return (
                            <S.WordItem key={idx}>
                              <S.WordHeader>
                                <ClickableText
                                  text={word}
                                  type="manipulation"
                                  onTextClick={handleTextClick}
                                  className={`word-badge ${impact}`}
                                >
                                  "{word}"
                                </ClickableText>
                                {typeof wordObj !== "string" && (
                                  <S.WordCategory>
                                    {wordObj.category === "emotional"
                                      ? "😭 감정적"
                                      : wordObj.category === "exaggeration"
                                        ? "📈 과장"
                                        : wordObj.category === "urgency"
                                          ? "⏰ 긴급"
                                          : wordObj.category === "authority"
                                            ? "👑 권위"
                                            : wordObj.category === "fear"
                                              ? "😰 공포"
                                              : "⚠️ 기타"}
                                  </S.WordCategory>
                                )}
                              </S.WordHeader>
                              {typeof wordObj !== "string" && (
                                <S.WordExplanation>
                                  {explanation}
                                </S.WordExplanation>
                              )}
                            </S.WordItem>
                          );
                        }
                      )}
                    </S.WordsGrid>
                  </S.ManipulativeWords>
                )}
              </S.BiasSection>

              {/* 클릭베이트 요소 */}
              {analysis.biasAnalysis.clickbaitElements &&
                analysis.biasAnalysis.clickbaitElements.length > 0 && (
                  <S.BiasSection>
                    <S.BiasSectionTitle>
                      🎣 클릭베이트 요소 (클릭하여 본문에서 찾기)
                    </S.BiasSectionTitle>
                    <S.ClickbaitGrid>
                      {analysis.biasAnalysis.clickbaitElements.map(
                        (element, idx) => (
                          <S.ClickbaitItem
                            key={idx}
                            severity={element.severity}
                          >
                            <S.ClickbaitHeader>
                              <S.ClickbaitType>
                                {element.type === "curiosity_gap"
                                  ? "🔍 호기심 갭"
                                  : element.type === "emotional_trigger"
                                    ? "💥 감정 트리거"
                                    : element.type === "urgency"
                                      ? "⚡ 긴급성"
                                      : "⭐ 최상급"}
                              </S.ClickbaitType>
                              <S.SeverityIndicator severity={element.severity}>
                                {element.severity}
                              </S.SeverityIndicator>
                            </S.ClickbaitHeader>
                            <S.ClickbaitText>
                              <ClickableText
                                text={element.text}
                                type="bias"
                                onTextClick={handleTextClick}
                              >
                                "{element.text}"
                              </ClickableText>
                            </S.ClickbaitText>
                            <S.ClickbaitExplanation>
                              {element.explanation}
                            </S.ClickbaitExplanation>
                          </S.ClickbaitItem>
                        )
                      )}
                    </S.ClickbaitGrid>
                  </S.BiasSection>
                )}

              {/* 정치적 편향 */}
              <S.BiasSection>
                <S.BiasSectionTitle>🗳️ 정치적 편향</S.BiasSectionTitle>
                <S.PoliticalBias>
                  <S.PoliticalDirection>
                    <S.PoliticalBadge
                      direction={analysis.biasAnalysis.politicalBias.direction}
                    >
                      {analysis.biasAnalysis.politicalBias.direction === "left"
                        ? "⬅️ 진보적"
                        : analysis.biasAnalysis.politicalBias.direction ===
                            "right"
                          ? "➡️ 보수적"
                          : analysis.biasAnalysis.politicalBias.direction ===
                              "center"
                            ? "🎯 중도"
                            : "⚖️ 중립적"}
                    </S.PoliticalBadge>
                    <S.Confidence>
                      확신도: {analysis.biasAnalysis.politicalBias.confidence}%
                    </S.Confidence>
                  </S.PoliticalDirection>

                  {analysis.biasAnalysis.politicalBias.indicators &&
                    analysis.biasAnalysis.politicalBias.indicators.length >
                      0 && (
                      <S.PoliticalIndicators>
                        <S.PoliticalIndicatorsTitle>
                          편향 지표:
                        </S.PoliticalIndicatorsTitle>
                        <S.PoliticalIndicatorsList>
                          {analysis.biasAnalysis.politicalBias.indicators.map(
                            (indicator, idx) => (
                              <S.PoliticalIndicatorsItem key={idx}>
                                {indicator}
                              </S.PoliticalIndicatorsItem>
                            )
                          )}
                        </S.PoliticalIndicatorsList>
                      </S.PoliticalIndicators>
                    )}
                </S.PoliticalBias>
              </S.BiasSection>
            </S.BiasContent>
          </ExpandableSection>

          {/* 논리적 오류 섹션 */}
          {analysis.logicalFallacies &&
            analysis.logicalFallacies.length > 0 && (
              <ExpandableSection
                title="논리적 오류"
                icon="🧠"
                isExpanded={expandedSections.logic}
                onToggle={() => toggleSection("logic")}
                badge={`${analysis.logicalFallacies.length}개 발견`}
                badgeColor={
                  analysis.logicalFallacies.length > 3
                    ? "#ef4444"
                    : analysis.logicalFallacies.length > 1
                      ? "#f59e0b"
                      : "#10b981"
                }
                sectionType="logic"
              >
                <S.LogicContent>
                  <S.FallaciesGrid>
                    {analysis.logicalFallacies.map((fallacy, idx) => (
                      <S.FallacyItem key={idx} severity={fallacy.severity}>
                        <S.FallacyHeader>
                          <S.FallacyType>
                            <S.FallacyIcon>
                              {fallacy.severity === "high"
                                ? "🚨"
                                : fallacy.severity === "medium"
                                  ? "⚠️"
                                  : "💡"}
                            </S.FallacyIcon>
                            <S.FallacyName>{fallacy.type}</S.FallacyName>
                          </S.FallacyType>
                          <S.SeverityBadge severity={fallacy.severity}>
                            {fallacy.severity}
                          </S.SeverityBadge>
                        </S.FallacyHeader>

                        <S.FallacyContent>
                          <S.FallacyDescription>
                            {fallacy.description}
                          </S.FallacyDescription>

                          {fallacy.affectedText && (
                            <S.AffectedText>
                              <S.AffectedTextTitle>
                                🎯 문제가 된 부분 (클릭하여 본문에서 찾기):
                              </S.AffectedTextTitle>
                              <S.AffectedTextQuote>
                                <ClickableText
                                  text={fallacy.affectedText}
                                  type="fallacy"
                                  onTextClick={handleTextClick}
                                >
                                  "{fallacy.affectedText}"
                                </ClickableText>
                              </S.AffectedTextQuote>
                            </S.AffectedText>
                          )}

                          <S.FallacyExplanation>
                            <S.FallacyExplanationTitle>
                              💡 쉬운 설명:
                            </S.FallacyExplanationTitle>
                            <S.FallacyExplanationText>
                              {fallacy.explanation}
                            </S.FallacyExplanationText>
                          </S.FallacyExplanation>

                          {fallacy.examples && fallacy.examples.length > 0 && (
                            <S.FallacyExamples>
                              <S.FallacyExamplesTitle>
                                📚 비슷한 예시:
                              </S.FallacyExamplesTitle>
                              <S.FallacyExamplesList>
                                {fallacy.examples.map((example, exIdx) => (
                                  <S.FallacyExamplesItem key={exIdx}>
                                    {example}
                                  </S.FallacyExamplesItem>
                                ))}
                              </S.FallacyExamplesList>
                            </S.FallacyExamples>
                          )}
                        </S.FallacyContent>
                      </S.FallacyItem>
                    ))}
                  </S.FallaciesGrid>
                </S.LogicContent>
              </ExpandableSection>
            )}

          {/* 광고성 분석 섹션 */}
          {analysis.advertisementAnalysis && (
            <ExpandableSection
              title="광고성 분석"
              icon="🎯"
              isExpanded={expandedSections.advertisement}
              onToggle={() => toggleSection("advertisement")}
              badge={
                analysis.advertisementAnalysis.isAdvertorial
                  ? "광고성"
                  : "비광고성"
              }
              badgeColor={
                analysis.advertisementAnalysis.isAdvertorial
                  ? "#f59e0b"
                  : "#10b981"
              }
              sectionType="advertisement"
            >
              <S.AdvertisementContent>
                <S.AdOverview>
                  <S.AdStatus>
                    <S.AdBadge
                      isAdvertorial={
                        analysis.advertisementAnalysis.isAdvertorial
                      }
                    >
                      {analysis.advertisementAnalysis.isAdvertorial
                        ? "🚨 광고성 콘텐츠"
                        : "✅ 일반 콘텐츠"}
                    </S.AdBadge>
                    <S.AdConfidence>
                      확신도: {analysis.advertisementAnalysis.confidence}%
                    </S.AdConfidence>
                  </S.AdStatus>

                  <S.AdScores>
                    <S.AdScoreItem>
                      <S.AdScoreLabel>네이티브 광고:</S.AdScoreLabel>
                      <S.AdScoreValue>
                        {analysis.advertisementAnalysis.nativeAdScore}/100
                      </S.AdScoreValue>
                    </S.AdScoreItem>
                    <S.AdScoreItem>
                      <S.AdScoreLabel>상업적 의도:</S.AdScoreLabel>
                      <S.AdScoreValue>
                        {analysis.advertisementAnalysis.commercialIntentScore}
                        /100
                      </S.AdScoreValue>
                    </S.AdScoreItem>
                  </S.AdScores>
                </S.AdOverview>

                {analysis.advertisementAnalysis.indicators &&
                  analysis.advertisementAnalysis.indicators.length > 0 && (
                    <S.AdIndicators>
                      <S.AdIndicatorsTitle>
                        🔍 광고성 지표 탐지 (클릭하여 본문에서 찾기):
                      </S.AdIndicatorsTitle>
                      <S.WordsGrid>
                        {analysis.advertisementAnalysis.indicators.map(
                          (indicator, idx) => {
                            // 광고성 표현 텍스트와 설명을 변수로 추출
                            const text = indicator.evidence;
                            const explanation = indicator.explanation;
                            // 가중치(weight)에 따라 영향도를 low, medium, high로 매핑
                            const impact =
                              indicator.weight > 6
                                ? "high"
                                : indicator.weight > 3
                                  ? "medium"
                                  : "low";

                            return (
                              <S.WordItem key={idx}>
                                <S.WordHeader>
                                  <ClickableText
                                    text={text}
                                    type="advertisement"
                                    onTextClick={handleTextClick}
                                    className={`word-badge ${impact}`}
                                  >
                                    "{text}"
                                  </ClickableText>

                                  <S.WordCategory>
                                    {indicator.type === "product_mention"
                                      ? "🛍️ 제품 언급"
                                      : indicator.type ===
                                          "promotional_language"
                                        ? "📢 홍보 언어"
                                        : indicator.type === "call_to_action"
                                          ? "👆 행동 유도"
                                          : indicator.type === "brand_focus"
                                            ? "🏷️ 브랜드 중심"
                                            : indicator.type ===
                                                "affiliate_link"
                                              ? "🔗 제휴 링크"
                                              : "📝 후원 콘텐츠"}
                                  </S.WordCategory>
                                </S.WordHeader>

                                {/* 광고성 표현에 대한 설명 */}
                                <S.WordExplanation>
                                  {explanation}
                                </S.WordExplanation>
                              </S.WordItem>
                            );
                          }
                        )}
                      </S.WordsGrid>
                    </S.AdIndicators>
                  )}
              </S.AdvertisementContent>
            </ExpandableSection>
          )}

          {/* 교차 검증 섹션 */}
          {analysis.crossReference && (
            <ExpandableSection
              title="교차 검증"
              icon="🔍"
              isExpanded={expandedSections.crossref}
              onToggle={() => toggleSection("crossref")}
              badge={
                analysis.crossReference.consensus === "agree"
                  ? "일치"
                  : analysis.crossReference.consensus === "disagree"
                    ? "불일치"
                    : analysis.crossReference.consensus === "mixed"
                      ? "혼재"
                      : "불충분"
              }
              badgeColor={
                analysis.crossReference.consensus === "agree"
                  ? "#10b981"
                  : analysis.crossReference.consensus === "disagree"
                    ? "#ef4444"
                    : "#f59e0b"
              }
              sectionType="crossref"
            >
              <S.CrossRefContent>
                {analysis.crossReference.keyClaims &&
                  analysis.crossReference.keyClaims.length > 0 && (
                    <S.KeyClaims>
                      <S.KeyClaimsTitle>🎯 핵심 주장</S.KeyClaimsTitle>
                      <S.ClaimsList>
                        {analysis.crossReference.keyClaims.map((claim, idx) => (
                          <S.ClaimItem key={idx}>
                            <ClickableText
                              text={claim}
                              type="claim"
                              onTextClick={handleTextClick}
                            >
                              {claim}
                            </ClickableText>
                          </S.ClaimItem>
                        ))}
                      </S.ClaimsList>
                    </S.KeyClaims>
                  )}

                {analysis.crossReference.relatedArticleKeywords && (
                  <S.SearchKeywords>
                    <S.SearchKeywordsTitle>
                      🔎 추천 검색 키워드
                    </S.SearchKeywordsTitle>
                    <S.KeywordsBox>
                      {analysis.crossReference.relatedArticleKeywords}
                    </S.KeywordsBox>
                  </S.SearchKeywords>
                )}

                {analysis.crossReference.factCheckSources &&
                  analysis.crossReference.factCheckSources.length > 0 && (
                    <S.FactCheckSources>
                      <S.FactCheckSourcesTitle>
                        ✅ 팩트체크 소스
                      </S.FactCheckSourcesTitle>
                      <S.SourcesGrid>
                        {analysis.crossReference.factCheckSources.map(
                          (source, idx) => (
                            <S.FactCheckItem key={idx} verdict={source.verdict}>
                              <S.SourceHeader>
                                <S.SourceOrg>{source.organization}</S.SourceOrg>
                                <S.VerdictBadge verdict={source.verdict}>
                                  {source.verdict === "true"
                                    ? "✅ 사실"
                                    : source.verdict === "false"
                                      ? "❌ 거짓"
                                      : source.verdict === "mixed"
                                        ? "🔄 부분적"
                                        : "❓ 미확인"}
                                </S.VerdictBadge>
                              </S.SourceHeader>
                              <S.SourceSummary>
                                {source.summary}
                              </S.SourceSummary>
                              {source.url && (
                                <S.SourceLink
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  🔗 소스 확인하기
                                </S.SourceLink>
                              )}
                            </S.FactCheckItem>
                          )
                        )}
                      </S.SourcesGrid>
                    </S.FactCheckSources>
                  )}

                <S.ConsensusDisplay>
                  <S.ConsensusDisplayTitle>
                    📊 전체적 합의
                  </S.ConsensusDisplayTitle>
                  <S.ConsensusBadge
                    consensus={analysis.crossReference.consensus}
                  >
                    {analysis.crossReference.consensus === "agree"
                      ? "✅ 대체로 일치함"
                      : analysis.crossReference.consensus === "disagree"
                        ? "❌ 대체로 불일치함"
                        : analysis.crossReference.consensus === "mixed"
                          ? "🔄 의견이 혼재됨"
                          : "❓ 검증 정보 부족"}
                  </S.ConsensusBadge>
                </S.ConsensusDisplay>
              </S.CrossRefContent>
            </ExpandableSection>
          )}

          {/* 분석 팁 */}
          <S.AnalysisTips>
            <S.AnalysisTipsTitle>💡 비판적 사고 팁</S.AnalysisTipsTitle>
            <S.TipsGrid>
              <S.TipItem>
                <S.TipIcon>🔍</S.TipIcon>
                <S.TipText>여러 출처에서 정보를 교차 확인하세요</S.TipText>
              </S.TipItem>
              <S.TipItem>
                <S.TipIcon>⚖️</S.TipIcon>
                <S.TipText>
                  감정적 언어에 휩쓸리지 말고 객관적으로 판단하세요
                </S.TipText>
              </S.TipItem>
              <S.TipItem>
                <S.TipIcon>🎯</S.TipIcon>
                <S.TipText>
                  광고성 콘텐츠는 상업적 목적을 염두에 두고 읽으세요
                </S.TipText>
              </S.TipItem>
              <S.TipItem>
                <S.TipIcon>🧠</S.TipIcon>
                <S.TipText>
                  논리적 근거가 충분한지 스스로 판단해보세요
                </S.TipText>
              </S.TipItem>
            </S.TipsGrid>
          </S.AnalysisTips>
        </S.ResultsSection>
      )}
    </S.Container>
  );
};
