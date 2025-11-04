import { useState, useRef } from "react";
// 훅을 import 합니다.
import { useYoutubeAnalysis } from "../../hooks/useYoutubeAnalysis";
import * as S from "./YoutubeAnalysisPage.style";
import { useNavigate } from "react-router-dom";
import YouTube, { YouTubePlayer } from "react-youtube";
// challengeApiService는 훅 내부에서 사용되므로 여기서는 제거해도 됩니다.
// import { challengeApiService } from "../../services/challengeApiService";
// YoutubeTrustAnalysis 타입은 훅에서 반환되므로 여전히 필요할 수 있습니다.
// (훅의 반환 타입에 이미 포함되어 있다면 제거 가능)
// import type { YoutubeTrustAnalysis } from "@criti-ai/shared";

const YoutubeAnalysisPage = () => {
  const navigate = useNavigate();

  // 1. 유튜브 분석 훅 사용
  const {
    url,
    loading,
    error,
    analysis,
    setUrl, // URL 상태 설정
    analyzeVideo, // 분석 실행 함수 (handleAnalyze 대체)
    reset, // 상태 초기화 함수 (handleReset 대체)
  } = useYoutubeAnalysis();

  // 기존 컴포넌트 상태 (UI 제어용)
  const [sourceOpen, setSourceOpen] = useState(true);

  // YouTube 플레이어 객체 저장할 ref (컴포넌트에 유지)
  const playerRef = useRef<YouTubePlayer | null>(null);

  // --- 유틸리티 함수 (컴포넌트에 유지) ---

  // 시간을 분:초 형식으로 변환
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 숫자 포맷팅 (천 단위 구분)
  const formatNumber = (num: number): string => {
    if (num === null || num === undefined) return "0";
    return num.toLocaleString("ko-KR");
  };

  // 점수에 따른 색상 반환
  const getScoreColor = (score: number): string => {
    if (score >= 70) return "#10b981";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  // --- 이벤트 핸들러 ---

  // 분석 요청 핸들러 (훅의 analyzeVideo 호출)
  const handleAnalyze = () => {
    // 훅의 analyzeVideo 함수를 직접 호출합니다.
    // 유효성 검사 등은 훅 내부에서 처리됩니다.
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
    playerRef.current = null; // 플레이어 참조 초기화 (이 로직은 컴포넌트에 남음)
  };

  // 타임스탬프 클릭 핸들러 (컴포넌트에 유지)
  const handleTimestampClick = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds); // 해당 시간(초)으로 이동
      playerRef.current.playVideo(); // 즉시 재생
    }
  };

  return (
    <S.Container>
      <S.ContentWrapper>
        {/* 헤더 */}
        <S.Header>
          <S.Logo>
            <S.LogoIcon>🔍</S.LogoIcon>
            <S.LogoText>Criti AI</S.LogoText>
          </S.Logo>
          <S.NavButton onClick={() => navigate("/")}>
            비판적 사고 훈련
          </S.NavButton>
        </S.Header>

        {/* 입력 카드 */}
        {!analysis && !loading && (
          <S.InputCard>
            <S.InputTitle>신뢰도 분석을 원하는 링크를 입력하세요.</S.InputTitle>
            <S.InputDescription>
              분석하고 싶은 유튜브 영상 또는 쇼츠 가상의 URL을 입력하세요.
            </S.InputDescription>

            <S.InputGroup>
              <S.Input
                type="text"
                placeholder="https://www.youtube.com/watch?v=QW1sMP6zr4k"
                value={url} // 훅에서 제공하는 url
                onChange={(e) => setUrl(e.target.value)} // 훅에서 제공하는 setUrl
                onKeyPress={handleKeyPress}
                disabled={loading} // 훅에서 제공하는 loading
              />
              <S.SubmitButton
                onClick={handleAnalyze} // 수정된 handleAnalyze
                disabled={loading} // 훅에서 제공하는 loading
              >
                <span>📤</span>
              </S.SubmitButton>
            </S.InputGroup>

            {error && ( // 훅에서 제공하는 error
              <S.ErrorMessage>
                <span>⚠️</span>
                {error}
              </S.ErrorMessage>
            )}
          </S.InputCard>
        )}

        {/* 로딩 상태 */}
        {loading && ( // 훅에서 제공하는 loading
          <S.LoadingCard>
            <S.LoadingSpinner />
            <S.LoadingText>
              영상을 분석하고 있습니다... 잠시만 기다려주세요.
            </S.LoadingText>
          </S.LoadingCard>
        )}

        {/* 분석 결과 */}
        {analysis &&
          !loading && ( // 훅에서 제공하는 analysis와 loading
            <S.ResultCard>
              <S.ResultLayout>
                {/* 왼쪽: 입력 및 비디오 정보 */}
                <S.LeftSection>
                  <S.ResultTitle>
                    입력한 링크의 분석 결과를 알려드릴게요.
                  </S.ResultTitle>

                  {/* 다른 영상 분석 버튼 */}
                  <S.InputGroup style={{ marginBottom: "1.5rem" }}>
                    <S.Input
                      type="text"
                      value={url} // 훅의 url
                      readOnly
                      disabled
                    />
                    <S.SubmitButton onClick={handleReset}>
                      <span>🔄</span>
                    </S.SubmitButton>
                  </S.InputGroup>

                  {/* === 비디오 프리뷰 섹션 === */}
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

                      {/* 비디오 정보 (S.VideoLink 제거) */}
                      <S.VideoInfo>
                        <S.VideoTitle>{analysis.videoInfo.title}</S.VideoTitle>
                      </S.VideoInfo>
                    </>
                  )}

                  {/* 출처 신뢰도 섹션 */}
                  <S.CollapsibleSection>
                    <S.CollapsibleHeader
                      onClick={() => setSourceOpen(!sourceOpen)}
                    >
                      <S.CollapsibleTitle>
                        출처 신뢰도 {analysis.channelCredibility.score}점
                      </S.CollapsibleTitle>
                      <S.CollapsibleIcon isOpen={sourceOpen}>
                        ▼
                      </S.CollapsibleIcon>
                    </S.CollapsibleHeader>

                    <S.CollapsibleContent isOpen={sourceOpen}>
                      <S.SourceInfo>
                        <S.SourceInfoWrapper>
                          {analysis.channelCredibility.channelImageUrl && (
                            <S.ChannelImage
                              src={analysis.channelCredibility.channelImageUrl}
                              alt={`${analysis.videoInfo?.channelName} 프로필 이미지`}
                            />
                          )}
                          <S.SourceTextInfo>
                            <S.SourceLink>
                              {analysis.videoInfo?.channelName || "채널명 없음"}
                            </S.SourceLink>

                            <S.SourceDetail>
                              <S.SourceDetailLabel>
                                구독자 수
                              </S.SourceDetailLabel>
                              <S.SourceDetailValue>
                                {formatNumber(
                                  analysis.channelCredibility.subscriberCount
                                )}
                                명
                              </S.SourceDetailValue>
                            </S.SourceDetail>

                            <S.SourceDetail>
                              <S.SourceDetailLabel>
                                과거 신뢰도
                              </S.SourceDetailLabel>
                              <S.SourceDetailValue>
                                {analysis.channelCredibility.score}%
                              </S.SourceDetailValue>
                            </S.SourceDetail>
                          </S.SourceTextInfo>
                        </S.SourceInfoWrapper>

                        <S.SourceDescription>
                          <strong>전문 분야:</strong>{" "}
                          {analysis.channelCredibility.reputation.factors.join(
                            ", "
                          )}
                        </S.SourceDescription>
                      </S.SourceInfo>
                    </S.CollapsibleContent>
                  </S.CollapsibleSection>
                </S.LeftSection>

                {/* 오른쪽: 점수 표시 */}
                <S.RightSection>
                  {/* 전체 점수 */}
                  <S.ScoreDisplay>
                    <S.ScoreValue score={analysis.overallScore}>
                      {analysis.overallScore}점
                    </S.ScoreValue>
                    <S.ScoreLabel>신뢰도 총점</S.ScoreLabel>
                  </S.ScoreDisplay>

                  <S.ScoreSummary>{analysis.analysisSummary}</S.ScoreSummary>

                  {/* 막대 그래프 */}
                  <S.ChartContainer>
                    <S.ChartBar>
                      <S.ChartLabel>
                        <S.ChartLabelText>출처</S.ChartLabelText>
                        <S.ChartLabelValue
                          score={analysis.detailedScores.channelScore}
                        >
                          {analysis.detailedScores.channelScore}
                        </S.ChartLabelValue>
                      </S.ChartLabel>
                      <S.ChartBarBackground>
                        <S.ChartBarFill
                          width={analysis.detailedScores.channelScore}
                          color={getScoreColor(
                            analysis.detailedScores.channelScore
                          )}
                        />
                      </S.ChartBarBackground>
                    </S.ChartBar>

                    <S.ChartBar>
                      <S.ChartLabel>
                        <S.ChartLabelText>객관성</S.ChartLabelText>
                        <S.ChartLabelValue
                          score={analysis.detailedScores.objectivityScore}
                        >
                          {analysis.detailedScores.objectivityScore}
                        </S.ChartLabelValue>
                      </S.ChartLabel>
                      <S.ChartBarBackground>
                        <S.ChartBarFill
                          width={analysis.detailedScores.objectivityScore}
                          color={getScoreColor(
                            analysis.detailedScores.objectivityScore
                          )}
                        />
                      </S.ChartBarBackground>
                    </S.ChartBar>

                    <S.ChartBar>
                      <S.ChartLabel>
                        <S.ChartLabelText>논리성</S.ChartLabelText>
                        <S.ChartLabelValue
                          score={analysis.detailedScores.logicScore}
                        >
                          {analysis.detailedScores.logicScore}
                        </S.ChartLabelValue>
                      </S.ChartLabel>
                      <S.ChartBarBackground>
                        <S.ChartBarFill
                          width={analysis.detailedScores.logicScore}
                          color={getScoreColor(
                            analysis.detailedScores.logicScore
                          )}
                        />
                      </S.ChartBarBackground>
                    </S.ChartBar>

                    <S.ChartBar>
                      <S.ChartLabel>
                        <S.ChartLabelText>광고성</S.ChartLabelText>
                        <S.ChartLabelValue
                          score={analysis.detailedScores.advertisementScore}
                        >
                          {analysis.detailedScores.advertisementScore}
                        </S.ChartLabelValue>
                      </S.ChartLabel>
                      <S.ChartBarBackground>
                        <S.ChartBarFill
                          width={analysis.detailedScores.advertisementScore}
                          color={getScoreColor(
                            analysis.detailedScores.advertisementScore
                          )}
                        />
                      </S.ChartBarBackground>
                    </S.ChartBar>

                    <S.ChartBar>
                      <S.ChartLabel>
                        <S.ChartLabelText>근거</S.ChartLabelText>
                        <S.ChartLabelValue
                          score={analysis.detailedScores.evidenceScore}
                        >
                          {analysis.detailedScores.evidenceScore}
                        </S.ChartLabelValue>
                      </S.ChartLabel>
                      <S.ChartBarBackground>
                        <S.ChartBarFill
                          width={analysis.detailedScores.evidenceScore}
                          color={getScoreColor(
                            analysis.detailedScores.evidenceScore
                          )}
                        />
                      </S.ChartBarBackground>
                    </S.ChartBar>
                  </S.ChartContainer>
                </S.RightSection>
              </S.ResultLayout>

              {/* 전체 너비 섹션들 */}

              {/* 경고 사항 (타임스탬프 없음) */}
              {analysis.warnings && analysis.warnings.length > 0 && (
                <S.FullWidthSection>
                  <S.SectionTitle>⚠️ 주의 사항</S.SectionTitle>
                  <S.AnalysisContent>
                    {analysis.warnings.map((warning, idx) => (
                      <S.AnalysisItem key={idx}>
                        <S.ItemHeader>
                          <S.ItemTitle>{warning.type}</S.ItemTitle>
                          <S.Badge severity={warning.severity}>
                            {warning.severity}
                          </S.Badge>
                        </S.ItemHeader>
                        <S.ItemDescription>{warning.message}</S.ItemDescription>
                        {warning.actionRecommendation && (
                          <S.ItemDescription>
                            💡 추천: {warning.actionRecommendation}
                          </S.ItemDescription>
                        )}
                      </S.AnalysisItem>
                    ))}
                  </S.AnalysisContent>
                </S.FullWidthSection>
              )}

              {/* 클릭베이트 요소 */}
              {analysis.biasAnalysis.clickbaitElements.length > 0 && (
                <S.FullWidthSection>
                  <S.SectionTitle>🎯 클릭베이트 요소</S.SectionTitle>
                  <S.AnalysisContent>
                    {analysis.biasAnalysis.clickbaitElements.map(
                      (element, idx) => (
                        <S.AnalysisItem key={idx}>
                          <S.ItemHeader>
                            <S.ItemTitle>{element.text}</S.ItemTitle>
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              {element.timestamp > 0 && (
                                <S.ItemTimestamp
                                  // === 클릭 이벤트 ===
                                  onClick={() =>
                                    handleTimestampClick(element.timestamp)
                                  }
                                >
                                  {formatTime(element.timestamp)}
                                </S.ItemTimestamp>
                              )}
                              <S.Badge severity={element.severity}>
                                {element.severity}
                              </S.Badge>
                            </div>
                          </S.ItemHeader>
                          <S.ItemDescription>
                            {element.explanation}
                          </S.ItemDescription>
                        </S.AnalysisItem>
                      )
                    )}
                  </S.AnalysisContent>
                </S.FullWidthSection>
              )}

              {/* 감정적 편향 */}
              {analysis.biasAnalysis.emotionalBias.manipulativeWords.length >
                0 && (
                <S.FullWidthSection>
                  <S.SectionTitle>😤 감정적 표현</S.SectionTitle>
                  <S.AnalysisContent>
                    {analysis.biasAnalysis.emotionalBias.manipulativeWords
                      .slice(0, 5)
                      .map((word, idx) => (
                        <S.AnalysisItem key={idx}>
                          <S.ItemHeader>
                            <S.ItemTitle>"{word.word}"</S.ItemTitle>
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              <S.ItemTimestamp
                                // === 클릭 이벤트 ===
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
                            <strong>문맥:</strong> {word.contextText}
                          </S.ItemDescription>
                          <S.ItemDescription>
                            {word.explanation}
                          </S.ItemDescription>
                        </S.AnalysisItem>
                      ))}
                    {analysis.biasAnalysis.emotionalBias.manipulativeWords
                      .length > 5 && (
                      <S.EmptyState>
                        그 외{" "}
                        {analysis.biasAnalysis.emotionalBias.manipulativeWords
                          .length - 5}
                        개의 감정적 표현이 더 발견되었습니다.
                      </S.EmptyState>
                    )}
                  </S.AnalysisContent>
                </S.FullWidthSection>
              )}

              {/* 논리적 오류 */}
              {analysis.logicalFallacies.length > 0 && (
                <S.FullWidthSection>
                  <S.SectionTitle>🤔 논리적 오류</S.SectionTitle>
                  <S.AnalysisContent>
                    {analysis.logicalFallacies.map((fallacy, idx) => (
                      <S.AnalysisItem key={idx}>
                        <S.ItemHeader>
                          <S.ItemTitle>{fallacy.type}</S.ItemTitle>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              alignItems: "center",
                            }}
                          >
                            <S.ItemTimestamp
                              // === 클릭 이벤트 ===
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
                          <strong>해당 내용:</strong> "{fallacy.affectedText}"
                        </S.ItemDescription>
                        <S.ItemDescription>
                          {fallacy.explanation}
                        </S.ItemDescription>
                      </S.AnalysisItem>
                    ))}
                  </S.AnalysisContent>
                </S.FullWidthSection>
              )}

              {/* 광고성 분석 */}
              {analysis.advertisementAnalysis.indicators.length > 0 && (
                <S.FullWidthSection>
                  <S.SectionTitle>
                    💰 광고성 콘텐츠{" "}
                    {analysis.advertisementAnalysis.isAdvertorial && (
                      <S.Badge severity="high">광고</S.Badge>
                    )}
                  </S.SectionTitle>
                  <S.AnalysisContent>
                    {analysis.advertisementAnalysis.indicators.map(
                      (indicator, idx) => (
                        <S.AnalysisItem key={idx}>
                          <S.ItemHeader>
                            <S.ItemTitle>{indicator.type}</S.ItemTitle>
                            <S.ItemTimestamp
                              // === 클릭 이벤트 ===
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
                          <S.ItemDescription>
                            {indicator.explanation}
                          </S.ItemDescription>
                        </S.AnalysisItem>
                      )
                    )}
                  </S.AnalysisContent>
                </S.FullWidthSection>
              )}

              {/* 핵심 주장 */}
              {analysis.keyClaims && analysis.keyClaims.length > 0 && (
                <S.FullWidthSection>
                  <S.SectionTitle>🎯 핵심 주장</S.SectionTitle>
                  <S.AnalysisContent>
                    {analysis.keyClaims.map((claim, idx) => (
                      <S.AnalysisItem key={idx}>
                        <S.ItemHeader>
                          <S.ItemTitle>{claim.claim}</S.ItemTitle>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              alignItems: "center",
                            }}
                          >
                            <S.ItemTimestamp
                              // === 클릭 이벤트 ===
                              onClick={() =>
                                handleTimestampClick(claim.timestamp)
                              }
                            >
                              {formatTime(claim.timestamp)}
                            </S.ItemTimestamp>
                            {claim.needsFactCheck && (
                              <S.Badge severity="medium">팩트체크 필요</S.Badge>
                            )}
                          </div>
                        </S.ItemHeader>
                      </S.AnalysisItem>
                    ))}
                  </S.AnalysisContent>
                </S.FullWidthSection>
              )}
            </S.ResultCard>
          )}
      </S.ContentWrapper>
    </S.Container>
  );
};

export default YoutubeAnalysisPage;
