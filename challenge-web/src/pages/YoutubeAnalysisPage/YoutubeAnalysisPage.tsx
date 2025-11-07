import { useState, useRef } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { useYoutubeAnalysis } from "../../hooks/useYoutubeAnalysis";
import Send from "@/assets/icons/send.svg?react";
import Magnifier from "@/assets/icons/magnifier.svg?react";

import {
  formatTime,
  formatNumber,
  formatLargeNumber,
  getScoreColor,
} from "../../utils";
import { colors } from "../../styles/design-system";
import * as S from "./YoutubeAnalysisPage.style";
import styled from "@emotion/styled";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

const StyledMagnifier = styled(Magnifier)`
  display: flex;
  width: 7.5rem;
  height: 7.5rem;
  padding: 0.32975rem;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
`;

const YoutubeAnalysisPage = () => {
  const playerRef = useRef<YouTubePlayer | null>(null);

  const {
    url,
    loading,
    error,
    analysis,
    setUrl, // URL 상태 설정
    analyzeVideo, // 분석 실행 함수
    reset, // 상태 초기화 함수
  } = useYoutubeAnalysis();

  // Collapsible 상태 관리
  const [openSections, setOpenSections] = useState({
    channel: true,
    warnings: true,
    clickbait: true,
    emotional: true,
    fallacies: true,
    advertisement: true,
    claims: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAnalyze = () => {
    // 유효성 검사 등은 훅 내부에서 처리
    analyzeVideo();
  };

  // Enter 키 입력 핸들러
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleAnalyze(); // 수정된 handleAnalyze 호출
    }
  };

  // 새로운 분석 시작 (훅의 reset 호출)
  const handleReset = () => {
    reset(); // 훅의 reset 함수로 url, analysis, error 상태 초기화
    playerRef.current = null; // 플레이어 참조 초기화
  };

  // 타임스탬프 클릭 핸들러
  const handleTimestampClick = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds); // 해당 시간(초)으로 이동
      playerRef.current.playVideo(); // 즉시 재생
    }
  };

  return (
    <S.Container>
      <S.ContentWrapper isAnalysis={!!analysis}>
        {/* 입력 화면 */}
        {!analysis && !loading && (
          <S.InputCard>
            <StyledMagnifier />

            <S.MiddleWrapper>
              <S.TitleAndDescriptionWrapper>
                <S.InputTitle>
                  신뢰도 분석을 원하는 링크를 입력하세요.
                </S.InputTitle>
                <S.InputDescription>
                  분석하고 싶은 유튜브 영상 또는 쇼츠의 URL을 입력하세요.
                </S.InputDescription>
              </S.TitleAndDescriptionWrapper>

              <S.InputGroup>
                <S.Input
                  type="text"
                  placeholder="유튜브 링크를 붙여넣어주세요"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <S.SubmitButton onClick={handleAnalyze} disabled={loading}>
                  <Send />
                </S.SubmitButton>
              </S.InputGroup>
            </S.MiddleWrapper>

            {error && ( // 훅에서 제공하는 error
              <S.ErrorMessage>
                <span>⚠️</span>
                {error}
              </S.ErrorMessage>
            )}
          </S.InputCard>
        )}
        {/* 로딩 화면 */}
        {loading && ( // 훅에서 제공하는 loading
          <S.LoadingCard>
            <LoadingSpinner />
            <S.LoadingText>
              영상을 분석하고 있습니다... 잠시만 기다려주세요.
            </S.LoadingText>
          </S.LoadingCard>
        )}

        {/* 분석 결과 */}
        {analysis && !loading && (
          <S.ResultLayout>
            {/* 왼쪽: 영상 + 채널 정보 (Sticky) */}
            <S.LeftSection>
              {/* 뒤로가기 (모바일) */}
              <S.BackButton onClick={handleReset}>←</S.BackButton>
              {/* 영상 플레이어 */}
              {analysis.videoInfo && (
                <>
                  <S.PlayerWrapper>
                    <YouTube
                      key={analysis.videoInfo.videoId}
                      videoId={analysis.videoInfo.videoId}
                      opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                          origin: window.location.origin,
                          autoplay: 0,
                        },
                      }}
                      // onReady 이벤트로 플레이어 ref 설정
                      onReady={(event) => {
                        playerRef.current = event.target;
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </S.PlayerWrapper>

                  {/* 영상 정보 */}
                  <S.VideoInfo>
                    <S.VideoTitle>{analysis.videoInfo.title}</S.VideoTitle>
                    <S.VideoMeta>
                      <span>
                        조회수 {formatNumber(analysis.videoInfo.viewCount)}
                      </span>
                      <span>•</span>
                      <span>
                        {analysis.videoInfo.isShorts ? "Shorts" : "Video"}
                      </span>
                    </S.VideoMeta>
                  </S.VideoInfo>

                  {/* 채널 정보 */}
                  <S.LeftBottom>
                    <S.ChannelInfo>
                      <S.ChannelHeader>
                        {analysis.channelCredibility.channelImageUrl && (
                          <S.ChannelImage
                            src={analysis.channelCredibility.channelImageUrl}
                            alt={analysis.videoInfo.channelName}
                          />
                        )}
                        <S.ChannelTextInfo>
                          <S.ChannelName>
                            {analysis.videoInfo.channelName}
                          </S.ChannelName>
                          <S.ChannelSubscribers>
                            구독자{" "}
                            {formatLargeNumber(
                              analysis.channelCredibility.subscriberCount
                            )}
                            명
                          </S.ChannelSubscribers>
                        </S.ChannelTextInfo>
                      </S.ChannelHeader>
                    </S.ChannelInfo>

                    {/* 다른 영상 분석 버튼 */}
                    <S.InputGroup style={{ marginTop: "1.5rem" }}>
                      <S.Input type="text" value={url} readOnly disabled />
                      <S.SubmitButton onClick={handleReset}>
                        <span>🔄</span>
                      </S.SubmitButton>
                    </S.InputGroup>
                  </S.LeftBottom>
                </>
              )}
            </S.LeftSection>

            {/* 오른쪽: 점수 + 분석 내용 (Scrollable) */}
            <S.RightSection>
              {/* 총점 카드 */}
              <S.ScoreCard>
                <S.TotalScore score={analysis.overallScore}>
                  {analysis.overallScore}점
                </S.TotalScore>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#6B7684",
                    marginBottom: "1rem",
                  }}
                >
                  신뢰도 총점
                </div>
                <S.ScoreDescription>
                  {analysis.analysisSummary}
                </S.ScoreDescription>
              </S.ScoreCard>

              {/* 세로 막대 그래프 */}
              <S.ChartCard>
                <S.ChartContainer>
                  <S.ChartColumn>
                    <S.ChartBarVertical
                      height={analysis.detailedScores.channelScore}
                      color={getScoreColor(
                        analysis.detailedScores.channelScore
                      )}
                    >
                      <S.ChartValue
                        score={analysis.detailedScores.channelScore}
                      >
                        {analysis.detailedScores.channelScore}
                      </S.ChartValue>
                    </S.ChartBarVertical>
                    <S.ChartLabel>출처</S.ChartLabel>
                  </S.ChartColumn>

                  <S.ChartColumn>
                    <S.ChartBarVertical
                      height={analysis.detailedScores.objectivityScore}
                      color={getScoreColor(
                        analysis.detailedScores.objectivityScore
                      )}
                    >
                      <S.ChartValue
                        score={analysis.detailedScores.objectivityScore}
                      >
                        {analysis.detailedScores.objectivityScore}
                      </S.ChartValue>
                    </S.ChartBarVertical>
                    <S.ChartLabel>객관성</S.ChartLabel>
                  </S.ChartColumn>

                  <S.ChartColumn>
                    <S.ChartBarVertical
                      height={analysis.detailedScores.logicScore}
                      color={getScoreColor(analysis.detailedScores.logicScore)}
                    >
                      <S.ChartValue score={analysis.detailedScores.logicScore}>
                        {analysis.detailedScores.logicScore}
                      </S.ChartValue>
                    </S.ChartBarVertical>
                    <S.ChartLabel>논리성</S.ChartLabel>
                  </S.ChartColumn>

                  <S.ChartColumn>
                    <S.ChartBarVertical
                      height={analysis.detailedScores.advertisementScore}
                      color={getScoreColor(
                        analysis.detailedScores.advertisementScore
                      )}
                    >
                      <S.ChartValue
                        score={analysis.detailedScores.advertisementScore}
                      >
                        {analysis.detailedScores.advertisementScore}
                      </S.ChartValue>
                    </S.ChartBarVertical>
                    <S.ChartLabel>광고성</S.ChartLabel>
                  </S.ChartColumn>

                  <S.ChartColumn>
                    <S.ChartBarVertical
                      height={analysis.detailedScores.evidenceScore}
                      color={getScoreColor(
                        analysis.detailedScores.evidenceScore
                      )}
                    >
                      <S.ChartValue
                        score={analysis.detailedScores.evidenceScore}
                      >
                        {analysis.detailedScores.evidenceScore}
                      </S.ChartValue>
                    </S.ChartBarVertical>
                    <S.ChartLabel>근거</S.ChartLabel>
                  </S.ChartColumn>
                </S.ChartContainer>
              </S.ChartCard>

              {/* 출처 신뢰도 (Collapsible) */}
              <S.CollapsibleCard>
                <S.CollapsibleHeader
                  isOpen={openSections.channel}
                  onClick={() => toggleSection("channel")}
                >
                  <S.CollapsibleTitle>
                    출처 신뢰도{" "}
                    <span
                      style={{
                        color: getScoreColor(analysis.channelCredibility.score),
                        fontWeight: "bold",
                      }}
                    >
                      {analysis.channelCredibility.score}점
                    </span>
                  </S.CollapsibleTitle>
                  <S.CollapsibleIcon isOpen={openSections.channel}>
                    ▼
                  </S.CollapsibleIcon>
                </S.CollapsibleHeader>
                <S.CollapsibleContent isOpen={openSections.channel}>
                  <S.CollapsibleBody>
                    <S.ChannelScoreContent>
                      <S.ScoreRow>
                        <S.ScoreLabel>구독자 수</S.ScoreLabel>
                        <S.ScoreValue>
                          {formatLargeNumber(
                            analysis.channelCredibility.subscriberCount
                          )}
                          명
                        </S.ScoreValue>
                      </S.ScoreRow>
                      <S.ScoreRow>
                        <S.ScoreLabel>과거 신뢰도</S.ScoreLabel>
                        <S.ScoreValue score={analysis.channelCredibility.score}>
                          {analysis.channelCredibility.score}%
                        </S.ScoreValue>
                      </S.ScoreRow>
                      {analysis.channelCredibility.reputation.factors.length >
                        0 && (
                        <S.ScoreRow>
                          <S.ScoreLabel>전문 분야</S.ScoreLabel>
                          <S.ScoreValue>
                            {analysis.channelCredibility.reputation.factors.join(
                              ", "
                            )}
                          </S.ScoreValue>
                        </S.ScoreRow>
                      )}
                    </S.ChannelScoreContent>
                  </S.CollapsibleBody>
                </S.CollapsibleContent>
              </S.CollapsibleCard>

              {/* 편향성 분석 (Collapsible) */}
              {analysis.biasAnalysis.clickbaitElements.length +
                analysis.biasAnalysis.emotionalBias.manipulativeWords.length >
                0 && (
                <S.CollapsibleCard>
                  <S.CollapsibleHeader
                    isOpen={openSections.clickbait}
                    onClick={() => toggleSection("clickbait")}
                  >
                    <S.CollapsibleTitle>
                      편향성 분석{" "}
                      <span style={{ color: colors.light.etc.orange }}>
                        {analysis.biasAnalysis.clickbaitElements.length +
                          analysis.biasAnalysis.emotionalBias.manipulativeWords
                            .length}
                        건
                      </span>
                    </S.CollapsibleTitle>
                    <S.CollapsibleIcon isOpen={openSections.clickbait}>
                      ▼
                    </S.CollapsibleIcon>
                  </S.CollapsibleHeader>
                  <S.CollapsibleContent isOpen={openSections.clickbait}>
                    <S.CollapsibleBody>
                      {/* 감정적 표현 */}
                      {analysis.biasAnalysis.emotionalBias.manipulativeWords
                        .length > 0 && (
                        <div style={{ marginBottom: "1rem" }}>
                          <h4
                            style={{
                              margin: "0 0 0.75rem 0",
                              fontSize: "0.9375rem",
                            }}
                          >
                            감정적 표현
                          </h4>
                          <S.AnalysisContent>
                            {analysis.biasAnalysis.emotionalBias.manipulativeWords.map(
                              (word, idx) => (
                                <S.AnalysisItem key={idx}>
                                  <S.ItemHeader>
                                    <S.ItemTitle>"{word.word}"</S.ItemTitle>
                                    <div
                                      style={{ display: "flex", gap: "0.5rem" }}
                                    >
                                      <S.ItemTimestamp
                                        onClick={() =>
                                          handleTimestampClick(word.timestamp)
                                        }
                                      >
                                        {formatTime(word.timestamp)}
                                      </S.ItemTimestamp>
                                      <S.Badge
                                        severity={
                                          word.impact === "high"
                                            ? "high"
                                            : word.impact === "medium"
                                              ? "medium"
                                              : "low"
                                        }
                                      >
                                        {word.impact}
                                      </S.Badge>
                                    </div>
                                  </S.ItemHeader>
                                  <S.ItemDescription>
                                    {word.contextText}
                                  </S.ItemDescription>
                                </S.AnalysisItem>
                              )
                            )}
                          </S.AnalysisContent>
                        </div>
                      )}
                    </S.CollapsibleBody>
                  </S.CollapsibleContent>
                </S.CollapsibleCard>
              )}

              {/* 논리적 오류 (Collapsible) */}
              {analysis.logicalFallacies.length > 0 && (
                <S.CollapsibleCard>
                  <S.CollapsibleHeader
                    isOpen={openSections.fallacies}
                    onClick={() => toggleSection("fallacies")}
                  >
                    <S.CollapsibleTitle>
                      논리적 오류{" "}
                      <span style={{ color: colors.light.state.error }}>
                        {analysis.logicalFallacies.length}개
                      </span>
                    </S.CollapsibleTitle>
                    <S.CollapsibleIcon isOpen={openSections.fallacies}>
                      ▼
                    </S.CollapsibleIcon>
                  </S.CollapsibleHeader>
                  <S.CollapsibleContent isOpen={openSections.fallacies}>
                    <S.CollapsibleBody>
                      <S.AnalysisContent>
                        {analysis.logicalFallacies.map((fallacy, idx) => (
                          <S.AnalysisItem key={idx}>
                            <S.ItemHeader>
                              <S.ItemTitle>{fallacy.type}</S.ItemTitle>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <S.ItemTimestamp
                                  onClick={() =>
                                    handleTimestampClick(fallacy.timestamp)
                                  }
                                >
                                  {formatTime(fallacy.timestamp)}
                                </S.ItemTimestamp>
                                <S.Badge severity={fallacy.severity}>
                                  {fallacy.severity}
                                </S.Badge>
                              </div>
                            </S.ItemHeader>
                            <S.ItemDescription>
                              <strong>해당 내용:</strong> "
                              {fallacy.affectedText}"
                            </S.ItemDescription>
                          </S.AnalysisItem>
                        ))}
                      </S.AnalysisContent>
                    </S.CollapsibleBody>
                  </S.CollapsibleContent>
                </S.CollapsibleCard>
              )}

              {/* 광고성 분석 (Collapsible) */}
              {analysis.advertisementAnalysis.indicators.length > 0 && (
                <S.CollapsibleCard>
                  <S.CollapsibleHeader
                    isOpen={openSections.advertisement}
                    onClick={() => toggleSection("advertisement")}
                  >
                    <S.CollapsibleTitle>
                      광고성 분석
                      {analysis.advertisementAnalysis.isAdvertorial && (
                        <S.Badge severity="high">광고 콘텐츠</S.Badge>
                      )}
                    </S.CollapsibleTitle>
                    <S.CollapsibleIcon isOpen={openSections.advertisement}>
                      ▼
                    </S.CollapsibleIcon>
                  </S.CollapsibleHeader>
                  <S.CollapsibleContent isOpen={openSections.advertisement}>
                    <S.CollapsibleBody>
                      <S.AnalysisContent>
                        {analysis.advertisementAnalysis.indicators.map(
                          (indicator, idx) => (
                            <S.AnalysisItem key={idx}>
                              <S.ItemHeader>
                                <S.ItemTitle>{indicator.type}</S.ItemTitle>
                                <S.ItemTimestamp
                                  onClick={() =>
                                    handleTimestampClick(indicator.timestamp)
                                  }
                                >
                                  {formatTime(indicator.timestamp)}
                                </S.ItemTimestamp>
                              </S.ItemHeader>
                              <S.ItemDescription>
                                <strong>근거:</strong> "{indicator.evidence}"
                              </S.ItemDescription>
                            </S.AnalysisItem>
                          )
                        )}
                      </S.AnalysisContent>
                    </S.CollapsibleBody>
                  </S.CollapsibleContent>
                </S.CollapsibleCard>
              )}

              {/* 교차 검증 (Collapsible) */}
              {analysis.keyClaims && analysis.keyClaims.length > 0 && (
                <S.CollapsibleCard>
                  <S.CollapsibleHeader
                    isOpen={openSections.claims}
                    onClick={() => toggleSection("claims")}
                  >
                    <S.CollapsibleTitle>
                      교차 검증
                      <span style={{ color: colors.light.state.error }}>
                        검증 필요
                      </span>
                    </S.CollapsibleTitle>
                    <S.CollapsibleIcon isOpen={openSections.claims}>
                      ▼
                    </S.CollapsibleIcon>
                  </S.CollapsibleHeader>
                  <S.CollapsibleContent isOpen={openSections.claims}>
                    <S.CollapsibleBody>
                      <S.AnalysisContent>
                        {analysis.keyClaims.map((claim, idx) => (
                          <S.AnalysisItem key={idx}>
                            <S.ItemHeader>
                              <S.ItemTitle>{claim.claim}</S.ItemTitle>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <S.ItemTimestamp
                                  onClick={() =>
                                    handleTimestampClick(claim.timestamp)
                                  }
                                >
                                  {formatTime(claim.timestamp)}
                                </S.ItemTimestamp>
                                {claim.needsFactCheck && (
                                  <S.Badge severity="medium">
                                    팩트체크 필요
                                  </S.Badge>
                                )}
                              </div>
                            </S.ItemHeader>
                          </S.AnalysisItem>
                        ))}
                      </S.AnalysisContent>
                    </S.CollapsibleBody>
                  </S.CollapsibleContent>
                </S.CollapsibleCard>
              )}
            </S.RightSection>
          </S.ResultLayout>
        )}
      </S.ContentWrapper>
    </S.Container>
  );
};

export default YoutubeAnalysisPage;
