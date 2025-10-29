import React from 'react';
import { 
  MeterContainer, 
  ScoreBarContainer,
  ScoreBar,
  ScoreText,
  LevelContainer,
  TrustLabel,
  TrustDescription,
  DetailedScoresContainer,
  DetailedScoreItem,
  ScoreLabel,
  ScoreValue,
  ScoreMiniBar
} from './TrustMeter.style';
import type { TrustAnalysis } from '@criti-ai/shared';

interface TrustMeterProps {
  score: number; // 0-100 (전체 신뢰도)
  analysis?: TrustAnalysis; // 세부 점수 표시용 (선택적)
}

export const TrustMeter: React.FC<TrustMeterProps> = ({ score, analysis }) => {
  const getTrustLevel = (score: number): string => {
    if (score >= 80) return '신뢰';
    if (score >= 60) return '보통';
    if (score >= 40) return '주의';
    return '위험';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#00B29A'; // trust.high
    if (score >= 50) return '#FAB007'; // trust.medium
    if (score >= 30) return '#FF7700'; // trust.low
    return '#FF5E5E'; // trust.veryLow
  };

  const getScoreLabel = (key: string): string => {
    const labels = {
      sourceScore: '출처 신뢰도',
      objectivityScore: '객관성',
      logicScore: '논리성',
      advertisementScore: '비광고성',
      evidenceScore: '근거 충실도'
    };
    return labels[key as keyof typeof labels] || key;
  };

  const getScoreIcon = (key: string): string => {
    const icons = {
      sourceScore: '🏛️',
      objectivityScore: '⚖️',
      logicScore: '🧠',
      advertisementScore: '🚫',
      evidenceScore: '📊'
    };
    return icons[key as keyof typeof icons] || '📈';
  };

  // 세부 점수 데이터 준비
  const detailedScores = analysis?.detailedScores ? [
    { key: 'sourceScore', value: analysis.detailedScores.sourceScore },
    { key: 'objectivityScore', value: analysis.detailedScores.objectivityScore },
    { key: 'logicScore', value: analysis.detailedScores.logicScore },
    { key: 'advertisementScore', value: analysis.detailedScores.advertisementScore },
    { key: 'evidenceScore', value: analysis.detailedScores.evidenceScore }
  ] : [];

  return (
    <MeterContainer>
      {/* 메인 신뢰도 바 */}
      <ScoreBarContainer>
        <ScoreBar 
          score={score} 
          color={getScoreColor(score)}
        >
          <ScoreText score={score}>
            {score}점
          </ScoreText>
        </ScoreBar>
      </ScoreBarContainer>
      
      <LevelContainer>
        <TrustLabel score={score}>
          {getTrustLevel(score)}
        </TrustLabel>
        <TrustDescription>
          전체 신뢰도
        </TrustDescription>
      </LevelContainer>

      {/* 세부 점수들 (분석 결과가 있을 때만 표시) */}
      {analysis?.detailedScores && (
        <DetailedScoresContainer>
          <h4>세부 분석</h4>
          {detailedScores.map(({ key, value }) => (
            <DetailedScoreItem key={key}>
              <ScoreLabel>
                {getScoreIcon(key)} {getScoreLabel(key)}
                <ScoreValue score={value}>{value}점</ScoreValue>
              </ScoreLabel>
              <ScoreMiniBar>
                <div 
                  className="fill" 
                  style={{
                    width: `${value}%`,
                    backgroundColor: getScoreColor(value)
                  }}
                />
              </ScoreMiniBar>
            </DetailedScoreItem>
          ))}
        </DetailedScoresContainer>
      )}
    </MeterContainer>
  );
};
