import React, { useState } from "react";
import type { TrustAnalysis } from "@shared/types";
import * as S from "./Sidebar.style";
import Magnifier from "@/assets/icons/magnifier.svg?react";
import Logo from "@/assets/icons/CritiAI_Logo.svg?react";

import styled from "@emotion/styled";
import {
  getAdColor,
  getConsensusColor,
  getFallacyColor,
  getScoreColor,
} from "@/utils/colorUtils";
import {
  getAdIndicatorText,
  getClickbaitTypeText,
  getConsensusBadgeText,
  getConsensusStatusText,
  getIntensityText,
  getManipulativeCategoryText,
  getPoliticalDirectionText,
  getTrustLevelText,
  getVerdictText,
} from "@/utils/textUtils";

const StyledMagnifier = styled(Magnifier)`
  display: flex;
  width: 4.5rem;
  height: 4.5rem;
  padding: 0.32975rem;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;

  animation: bounce 2s infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.625rem);
    }
  }
`;
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

// ChevronDown 아이콘 컴포넌트
const ChevronDownIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ExpandableSection (S. 컴포넌트 사용)
const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
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
        <S.SectionTitle>
          {title}
          {badge && <span style={{ color: badgeColor }}>{badge}</span>}
        </S.SectionTitle>
      </S.HeaderLeft>
      <S.ExpandArrow expanded={isExpanded}>
        <ChevronDownIcon />
      </S.ExpandArrow>
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
      <S.HeaderSection>
        <S.LogoWrapper>
          <Logo />
          <h2>Criti AI</h2>
        </S.LogoWrapper>
        <S.CloseButton onClick={onClose} type="button" title="닫기">
          ✕
        </S.CloseButton>
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
          <StyledMagnifier />
          <S.WelcomeTitle>분석 시작하기</S.WelcomeTitle>
          <S.WelcomeText>
            AI가 이 콘텐츠의 신뢰도, 편향성, 광고성을
            <br />
            종합적으로 분석해드립니다
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

          <S.OverviewContent>
            <S.OverallScoreDisplay>
              <S.ScoreNumber score={analysis.overallScore}>
                {analysis.overallScore}점
              </S.ScoreNumber>
              <S.ScoreDescriptionText>
                {analysis.analysisSummary}
              </S.ScoreDescriptionText>
            </S.OverallScoreDisplay>
          </S.OverviewContent>

          {analysis.detailedScores && (
            <S.DetailedScores>
              {/* 1. 상단: 그래프 영역 (높이 15rem) */}
              <S.ChartGraphBox>
                {/* 출처 */}
                <S.ChartGraphColumn>
                  <S.ChartValue score={analysis.detailedScores.sourceScore}>
                    {analysis.detailedScores.sourceScore}
                  </S.ChartValue>
                  <S.ChartBarVertical
                    height={analysis.detailedScores.sourceScore}
                    color={getScoreColor(analysis.detailedScores.sourceScore)}
                  />
                </S.ChartGraphColumn>

                {/* 객관성 */}
                <S.ChartGraphColumn>
                  <S.ChartValue
                    score={analysis.detailedScores.objectivityScore}
                  >
                    {analysis.detailedScores.objectivityScore}
                  </S.ChartValue>
                  <S.ChartBarVertical
                    height={analysis.detailedScores.objectivityScore}
                    color={getScoreColor(
                      analysis.detailedScores.objectivityScore
                    )}
                  />
                </S.ChartGraphColumn>

                {/* 논리성 */}
                <S.ChartGraphColumn>
                  <S.ChartValue score={analysis.detailedScores.logicScore}>
                    {analysis.detailedScores.logicScore}
                  </S.ChartValue>
                  <S.ChartBarVertical
                    height={analysis.detailedScores.logicScore}
                    color={getScoreColor(analysis.detailedScores.logicScore)}
                  />
                </S.ChartGraphColumn>

                {/* 광고성 */}
                <S.ChartGraphColumn>
                  <S.ChartValue
                    score={analysis.detailedScores.advertisementScore}
                  >
                    {analysis.detailedScores.advertisementScore}
                  </S.ChartValue>
                  <S.ChartBarVertical
                    height={analysis.detailedScores.advertisementScore}
                    color={getScoreColor(
                      analysis.detailedScores.advertisementScore
                    )}
                  />
                </S.ChartGraphColumn>

                {/* 근거 */}
                <S.ChartGraphColumn>
                  <S.ChartValue score={analysis.detailedScores.evidenceScore}>
                    {analysis.detailedScores.evidenceScore}
                  </S.ChartValue>
                  <S.ChartBarVertical
                    height={analysis.detailedScores.evidenceScore}
                    color={getScoreColor(analysis.detailedScores.evidenceScore)}
                  />
                </S.ChartGraphColumn>
              </S.ChartGraphBox>

              {/* 2. 하단: 텍스트 라벨 영역 */}
              <S.ChartLabelsBox>
                <S.ChartLabel>출처</S.ChartLabel>
                <S.ChartLabel>객관성</S.ChartLabel>
                <S.ChartLabel>논리성</S.ChartLabel>
                <S.ChartLabel>비광고성</S.ChartLabel>
                <S.ChartLabel>근거</S.ChartLabel>
              </S.ChartLabelsBox>
            </S.DetailedScores>
          )}

          {/* 출처 신뢰도 섹션 */}
          <ExpandableSection
            title="출처 신뢰도"
            isExpanded={expandedSections.source}
            onToggle={() => toggleSection("source")}
            badge={`${analysis.sourceCredibility.score}점`}
            badgeColor={getScoreColor(analysis.sourceCredibility.score)}
            sectionType="source"
          >
            <S.SourceContent>
              <S.TrustLevel>
                <S.TrustBadge level={analysis.sourceCredibility.level}>
                  {getTrustLevelText(analysis.sourceCredibility.level)}
                </S.TrustBadge>
              </S.TrustLevel>

              <S.SourceDetails>
                <S.SourceDetailsTitle>
                  {analysis.sourceCredibility.domain}
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
            isExpanded={expandedSections.bias}
            onToggle={() => toggleSection("bias")}
            badge={`${analysis.biasAnalysis.emotionalBias.score}점`}
            badgeColor={getScoreColor(
              analysis.biasAnalysis.emotionalBias.score
            )}
            sectionType="bias"
          >
            <S.BiasContent>
              {/* 감정적 편향 */}
              <S.BiasSection>
                <S.BiasSectionHeader>
                  <S.BiasSectionTitle>감정적 편향</S.BiasSectionTitle>
                  <S.IntensityBadge
                    intensity={analysis.biasAnalysis.emotionalBias.intensity}
                  >
                    {getIntensityText(
                      analysis.biasAnalysis.emotionalBias.intensity
                    )}
                  </S.IntensityBadge>
                </S.BiasSectionHeader>

                {analysis.biasAnalysis.emotionalBias.manipulativeWords?.length >
                  0 && (
                  <S.ManipulativeWords>
                    <S.ManipulativeWordsTitle>
                      조작적 표현 탐지 (클릭하여 본문에서 찾기):
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
                                    {getManipulativeCategoryText(
                                      wordObj.category
                                    )}
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
                      클릭베이트 요소 (클릭하여 본문에서 찾기)
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
                                {getClickbaitTypeText(element.type)}
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
                <S.BiasSectionTitle>정치적 편향</S.BiasSectionTitle>
                <S.PoliticalBias>
                  <S.PoliticalDirection>
                    <S.PoliticalBadge
                      direction={analysis.biasAnalysis.politicalBias.direction}
                    >
                      {getPoliticalDirectionText(
                        analysis.biasAnalysis.politicalBias.direction
                      )}
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
                isExpanded={expandedSections.logic}
                onToggle={() => toggleSection("logic")}
                badge={`${analysis.logicalFallacies.length}개`}
                badgeColor={getFallacyColor(analysis.logicalFallacies.length)}
                sectionType="logic"
              >
                <S.LogicContent>
                  <S.FallaciesGrid>
                    {analysis.logicalFallacies.map((fallacy, idx) => (
                      <S.FallacyItem key={idx}>
                        <S.FallacyHeader>
                          <S.FallacyType>
                            <S.FallacyName>{fallacy.type}</S.FallacyName>
                          </S.FallacyType>
                        </S.FallacyHeader>

                        <S.FallacyContent>
                          <S.FallacyDescription>
                            {fallacy.description}
                          </S.FallacyDescription>

                          {fallacy.affectedText && (
                            <S.AffectedText>
                              <S.AffectedTextTitle>
                                문제가 된 부분
                              </S.AffectedTextTitle>
                              <S.FallacyDescriptionWrapper>
                                <S.SeverityBadge severity={fallacy.severity}>
                                  {fallacy.severity}
                                </S.SeverityBadge>
                                <S.AffectedTextQuote>
                                  <ClickableText
                                    text={fallacy.affectedText}
                                    type="fallacy"
                                    onTextClick={handleTextClick}
                                  >
                                    "{fallacy.affectedText}"
                                  </ClickableText>
                                </S.AffectedTextQuote>

                                <S.FallacyExplanationText>
                                  {fallacy.explanation}
                                </S.FallacyExplanationText>
                              </S.FallacyDescriptionWrapper>
                            </S.AffectedText>
                          )}

                          {fallacy.examples && fallacy.examples.length > 0 && (
                            <S.FallacyExamples>
                              <S.FallacyExamplesTitle>
                                비슷한 예시
                              </S.FallacyExamplesTitle>
                              <S.FallacyDescriptionWrapper>
                                <S.FallacyExamplesList>
                                  {fallacy.examples.map((example, exIdx) => (
                                    <S.FallacyExamplesItem key={exIdx}>
                                      {example}
                                    </S.FallacyExamplesItem>
                                  ))}
                                </S.FallacyExamplesList>
                              </S.FallacyDescriptionWrapper>
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
              isExpanded={expandedSections.advertisement}
              onToggle={() => toggleSection("advertisement")}
              badge={
                analysis.advertisementAnalysis.isAdvertorial
                  ? "광고성"
                  : "비광고성"
              }
              badgeColor={getAdColor(
                analysis.advertisementAnalysis.isAdvertorial
              )}
              sectionType="advertisement"
            >
              <S.AdvertisementContent>
                <S.AdOverview>
                  <S.AdStatus
                    isAdvertorial={analysis.advertisementAnalysis.isAdvertorial}
                  >
                    <S.AdBadge
                      isAdvertorial={
                        analysis.advertisementAnalysis.isAdvertorial
                      }
                    >
                      {analysis.advertisementAnalysis.isAdvertorial
                        ? "광고성 콘텐츠"
                        : "일반 콘텐츠"}
                    </S.AdBadge>
                    <S.AdConfidence>
                      확신도: {analysis.advertisementAnalysis.confidence}%
                    </S.AdConfidence>
                  </S.AdStatus>

                  {/* 프로그레스 바 형태 점수 표시 */}
                  <S.AdScores>
                    <S.AdScoreItem>
                      <S.AdScoreHeader>
                        <S.AdScoreLabel>네이티브 광고</S.AdScoreLabel>
                        <S.AdScoreValue
                          score={analysis.advertisementAnalysis.nativeAdScore}
                        >
                          {analysis.advertisementAnalysis.nativeAdScore}
                        </S.AdScoreValue>
                      </S.AdScoreHeader>
                      <S.AdScoreBar>
                        <S.AdScoreBarFill
                          score={analysis.advertisementAnalysis.nativeAdScore}
                        />
                      </S.AdScoreBar>
                    </S.AdScoreItem>

                    <S.AdScoreItem>
                      <S.AdScoreHeader>
                        <S.AdScoreLabel>상업적 의도</S.AdScoreLabel>
                        <S.AdScoreValue
                          score={
                            analysis.advertisementAnalysis.commercialIntentScore
                          }
                        >
                          {analysis.advertisementAnalysis.commercialIntentScore}
                        </S.AdScoreValue>
                      </S.AdScoreHeader>
                      <S.AdScoreBar>
                        <S.AdScoreBarFill
                          score={
                            analysis.advertisementAnalysis.commercialIntentScore
                          }
                        />
                      </S.AdScoreBar>
                    </S.AdScoreItem>
                  </S.AdScores>
                </S.AdOverview>

                {analysis.advertisementAnalysis.indicators &&
                  analysis.advertisementAnalysis.indicators.length > 0 && (
                    <S.AdIndicators>
                      <S.AdIndicatorsTitle>
                        🔍 광고성 지표 탐지 (클릭하여 본문에서 찾기)
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
                                  <S.ClickableTextWrapper>
                                    <ClickableText
                                      text={text}
                                      type="advertisement"
                                      onTextClick={handleTextClick}
                                      className={`word-badge ${impact}`}
                                    >
                                      "{text}"
                                    </ClickableText>
                                    <S.WordCategory>
                                      {getAdIndicatorText(indicator.type)}
                                    </S.WordCategory>
                                  </S.ClickableTextWrapper>
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
              isExpanded={expandedSections.crossref}
              onToggle={() => toggleSection("crossref")}
              badge={getConsensusBadgeText(analysis.crossReference.consensus)}
              badgeColor={getConsensusColor(analysis.crossReference.consensus)}
              sectionType="crossref"
            >
              <S.CrossRefContent>
                {/* 상태 표시 박스 */}
                <S.CrossRefStatus consensus={analysis.crossReference.consensus}>
                  <S.CrossRefStatusText
                    consensus={analysis.crossReference.consensus}
                  >
                    {getConsensusStatusText(analysis.crossReference.consensus)}
                  </S.CrossRefStatusText>
                </S.CrossRefStatus>

                {/* 핵심 주장 */}
                {analysis.crossReference.keyClaims &&
                  analysis.crossReference.keyClaims.length > 0 && (
                    <S.KeyClaims>
                      <S.KeyClaimsTitle>핵심 주장</S.KeyClaimsTitle>
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

                {/* 추천 검색 키워드 */}
                {analysis.crossReference.relatedArticleKeywords && (
                  <S.SearchKeywords>
                    <S.SearchKeywordsTitle>
                      추천 검색 키워드
                    </S.SearchKeywordsTitle>
                    <S.KeywordsContainer>
                      <S.KeywordTagsWrapper>
                        {analysis.crossReference.relatedArticleKeywords
                          .split(/[,\s]+/)
                          .filter((keyword) => keyword.trim())
                          .map((keyword, idx) => (
                            <S.KeywordTag key={idx}>
                              {keyword.trim()}
                            </S.KeywordTag>
                          ))}
                      </S.KeywordTagsWrapper>
                    </S.KeywordsContainer>
                  </S.SearchKeywords>
                )}

                {/* 팩트체크 소스 */}
                {analysis.crossReference.factCheckSources &&
                  analysis.crossReference.factCheckSources.length > 0 && (
                    <S.FactCheckSources>
                      <S.FactCheckSourcesTitle>
                        팩트체크 소스
                      </S.FactCheckSourcesTitle>
                      <S.SourcesGrid>
                        {analysis.crossReference.factCheckSources.map(
                          (source, idx) => (
                            <S.FactCheckItem key={idx} verdict={source.verdict}>
                              <S.SourceHeader>
                                <S.SourceOrg>{source.organization}</S.SourceOrg>
                                <S.VerdictBadge verdict={source.verdict}>
                                  {getVerdictText(source.verdict)}
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
              </S.CrossRefContent>
            </ExpandableSection>
          )}

          {/* 분석 팁 */}
          <S.AnalysisTips>
            <S.AnalysisTipsTitle>비판적 사고 Tips</S.AnalysisTipsTitle>
            <S.TipsList>
              <S.TipItem>
                <S.TipCheckIcon>✓</S.TipCheckIcon>
                <S.TipText>여러 출처에서 정보를 교차 확인하세요</S.TipText>
              </S.TipItem>
              <S.TipItem>
                <S.TipCheckIcon>✓</S.TipCheckIcon>
                <S.TipText>
                  감정적 언어에 휩쓸리지 말고 객관적으로 판단하세요
                </S.TipText>
              </S.TipItem>
              <S.TipItem>
                <S.TipCheckIcon>✓</S.TipCheckIcon>
                <S.TipText>
                  광고성 콘텐츠는 상업적 목적을 염두에 두고 읽으세요
                </S.TipText>
              </S.TipItem>
              <S.TipItem>
                <S.TipCheckIcon>✓</S.TipCheckIcon>
                <S.TipText>
                  논리적 근거가 충분한지 스스로 판단해보세요
                </S.TipText>
              </S.TipItem>
            </S.TipsList>
            <S.CriticalThinkingButton
              onClick={() =>
                window.open(
                  "https://criti-ai-web.vercel.app/",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              비판적 사고 훈련하기
            </S.CriticalThinkingButton>
          </S.AnalysisTips>
        </S.ResultsSection>
      )}
    </S.Container>
  );
};
