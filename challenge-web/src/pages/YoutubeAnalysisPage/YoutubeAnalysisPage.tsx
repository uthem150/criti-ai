import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import YouTube, { YouTubePlayer } from "react-youtube";
import { useYoutubeAnalysis } from "../../hooks/useYoutubeAnalysis";
import { formatTime, formatNumber, getScoreColor } from "../../utils";
import * as S from "./YoutubeAnalysisPage.style";

const YoutubeAnalysisPage = () => {
  const navigate = useNavigate();
  const playerRef = useRef<YouTubePlayer | null>(null);

  const {
    url,
    loading,
    error,
    analysis,
    setUrl, // URL 상태 설정
    analyzeVideo, // 분석 실행 함수 (handleAnalyze 대체)
    reset, // 상태 초기화 함수
  } = useYoutubeAnalysis();

  // const [expandedSections, setExpandedSections] = useState({
  //   warnings: true,
  //   clickbait: true,
  //   emotional: true,
  //   fallacies: true,
  //   advertisement: true,
  //   claims: true,
  // });

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
      <S.ContentWrapper>
        {/* 뒤로가기 (모바일) */}
        <S.BackButton onClick={() => navigate("/")}>← 돌아가기</S.BackButton>

        {/* 입력 화면 */}
        {!analysis && !loading && (
          <S.InputCard>
            <S.InputTitle>신뢰도 분석을 원하는 링크를 입력하세요.</S.InputTitle>
            <S.InputDescription>
              분석하고 싶은 유튜브 영상 또는 쇼츠의 URL을 입력하세요.
            </S.InputDescription>

            <S.InputGroup>
              <S.Input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <S.SubmitButton onClick={handleAnalyze} disabled={loading}>
                <span>📤</span>
                분석하기
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

        {/* 로딩 화면 */}
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
            <S.ResultLayout>
              {/* 왼쪽: 영상 + 채널 정보 (Sticky) */}
              <S.LeftSection>
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
                            구독자
                            {formatNumber(
                              analysis.channelCredibility.subscriberCount
                            )}
                            명
                          </S.ChannelSubscribers>
                        </S.ChannelTextInfo>
                      </S.ChannelHeader>

                      <S.ChannelScore>
                        <S.ScoreRow>
                          <S.ScoreLabel>과거 신뢰도</S.ScoreLabel>
                          <S.ScoreValue
                            score={analysis.channelCredibility.score}
                          >
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
                      </S.ChannelScore>
                    </S.ChannelInfo>

                    {/* 다른 영상 분석 버튼 */}
                    <S.InputGroup style={{ marginTop: "1.5rem" }}>
                      <S.Input type="text" value={url} readOnly disabled />
                      <S.SubmitButton onClick={handleReset}>
                        <span>🔄</span>
                      </S.SubmitButton>
                    </S.InputGroup>
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

                {/* 차트 카드 */}
                <S.ChartCard>
                  <S.ChartTitle>세부 점수</S.ChartTitle>
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
                </S.ChartCard>

                {/* 경고 사항 */}
                {analysis.warnings && analysis.warnings.length > 0 && (
                  <S.AnalysisCard>
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
                          <S.ItemDescription>
                            {warning.message}
                          </S.ItemDescription>
                          {warning.actionRecommendation && (
                            <S.ItemDescription>
                              💡 추천: {warning.actionRecommendation}
                            </S.ItemDescription>
                          )}
                        </S.AnalysisItem>
                      ))}
                    </S.AnalysisContent>
                  </S.AnalysisCard>
                )}

                {/* 클릭베이트 요소 */}
                {analysis.biasAnalysis.clickbaitElements.length > 0 && (
                  <S.AnalysisCard>
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
                  </S.AnalysisCard>
                )}

                {/* 감정적 표현 */}
                {analysis.biasAnalysis.emotionalBias.manipulativeWords.length >
                  0 && (
                  <S.AnalysisCard>
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
                  </S.AnalysisCard>
                )}

                {/* 논리적 오류 */}
                {analysis.logicalFallacies.length > 0 && (
                  <S.AnalysisCard>
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
                  </S.AnalysisCard>
                )}

                {/* 광고성 콘텐츠 */}
                {analysis.advertisementAnalysis.indicators.length > 0 && (
                  <S.AnalysisCard>
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
                  </S.AnalysisCard>
                )}

                {/* 핵심 주장 */}
                {analysis.keyClaims && analysis.keyClaims.length > 0 && (
                  <S.AnalysisCard>
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
                  </S.AnalysisCard>
                )}
              </S.RightSection>
            </S.ResultLayout>
          )}
      </S.ContentWrapper>
    </S.Container>
  );
};

export default YoutubeAnalysisPage;
