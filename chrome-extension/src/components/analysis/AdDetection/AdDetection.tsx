import React, { useState } from 'react';
import type { AdvertisementAnalysis } from '@shared/types';
import {
  AdDetectionContainer,
  AdStatusBadge,
  AdIndicatorsList,
  AdIndicatorItem,
  IndicatorType,
  IndicatorEvidence,
  IndicatorExplanation,
  ScoreMetrics,
  ScoreItem,
  ToggleButton,
  DetailedView,
  AdWarning
} from './AdDetection.style';

interface AdDetectionProps {
  analysis: AdvertisementAnalysis;
}

type AdStatusColor = 'danger' | 'warning' | 'info' | 'safe';

export const AdDetection: React.FC<AdDetectionProps> = ({ analysis }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getAdStatusInfo = (isAdvertorial: boolean, confidence: number) => {
    if (isAdvertorial && confidence > 80) {
      return {
        status: '높은 광고성',
        icon: '🚨',
        color: 'danger' as AdStatusColor,
        message: '이 콘텐츠는 광고성이 매우 높습니다. 객관적 정보보다는 상품/서비스 홍보가 주목적일 가능성이 높습니다.'
      };
    } else if (isAdvertorial && confidence > 60) {
      return {
        status: '중간 광고성',
        icon: '⚠️',
        color: 'warning' as AdStatusColor,
        message: '이 콘텐츠에는 광고성 요소가 포함되어 있습니다. 정보의 객관성을 주의 깊게 판단해보세요.'
      };
    } else if (analysis.nativeAdScore > 50) {
      return {
        status: '경미한 광고성',
        icon: '💡',
        color: 'info' as AdStatusColor,
        message: '일부 홍보성 표현이 감지되었지만, 전반적으로는 정보 제공 목적으로 보입니다.'
      };
    } else {
      return {
        status: '비광고 콘텐츠',
        icon: '✅',
        color: 'safe' as AdStatusColor,
        message: '이 콘텐츠는 광고성이 낮고 정보 제공이 주목적으로 보입니다.'
      };
    }
  };

  const getIndicatorTypeInfo = (type: string) => {
    const typeMap = {
      'product_mention': { icon: '🛍️', label: '제품 언급', color: '#f59e0b' },
      'promotional_language': { icon: '📢', label: '홍보 언어', color: '#ef4444' },
      'call_to_action': { icon: '👆', label: '행동 유도', color: '#dc2626' },
      'brand_focus': { icon: '🏷️', label: '브랜드 중심', color: '#f97316' },
      'affiliate_link': { icon: '🔗', label: '제휴 링크', color: '#991b1b' },
      'sponsored_content': { icon: '📝', label: '후원 콘텐츠', color: '#7c2d12' }
    };
    
    return typeMap[type as keyof typeof typeMap] || { 
      icon: '📊', 
      label: '기타 지표', 
      color: '#6b7280' 
    };
  };

  const adStatusInfo = getAdStatusInfo(analysis.isAdvertorial, analysis.confidence);

  return (
    <AdDetectionContainer>
      <div className="header">
        <h4>🎯 광고성 분석</h4>
        <ToggleButton 
          onClick={() => setShowDetails(!showDetails)}
          isExpanded={showDetails}
        >
          {showDetails ? '간단히' : '자세히'}
        </ToggleButton>
      </div>

      <AdStatusBadge status={adStatusInfo.color}>
        <span className="icon">{adStatusInfo.icon}</span>
        <span className="status">{adStatusInfo.status}</span>
        <span className="confidence">({analysis.confidence}% 확신)</span>
      </AdStatusBadge>

      <AdWarning status={adStatusInfo.color}>
        {adStatusInfo.message}
      </AdWarning>

      {showDetails && (
        <DetailedView>
          <ScoreMetrics>
            <ScoreItem>
              <div className="label">네이티브 광고 점수</div>
              <div className="score" data-high={analysis.nativeAdScore > 60}>
                {analysis.nativeAdScore}/100
              </div>
            </ScoreItem>
            <ScoreItem>
              <div className="label">상업적 의도 점수</div>
              <div className="score" data-high={analysis.commercialIntentScore > 60}>
                {analysis.commercialIntentScore}/100
              </div>
            </ScoreItem>
          </ScoreMetrics>

          {analysis.indicators && analysis.indicators.length > 0 && (
            <AdIndicatorsList>
              <h5>탐지된 광고성 지표</h5>
              {analysis.indicators.map((indicator, index) => {
                const typeInfo = getIndicatorTypeInfo(indicator.type);
                return (
                  <AdIndicatorItem key={index} weight={indicator.weight}>
                    <IndicatorType color={typeInfo.color}>
                      <span className="icon">{typeInfo.icon}</span>
                      <span className="label">{typeInfo.label}</span>
                      <span className="weight">가중치: {indicator.weight}</span>
                    </IndicatorType>
                    
                    <IndicatorEvidence>
                      "{indicator.evidence}"
                    </IndicatorEvidence>
                    
                    <IndicatorExplanation>
                      {indicator.explanation}
                    </IndicatorExplanation>
                  </AdIndicatorItem>
                );
              })}
            </AdIndicatorsList>
          )}

          <div className="analysis-tip">
            <h5>💡 광고성 콘텐츠 판별 팁</h5>
            <ul>
              <li><strong>제품 언급 빈도:</strong> 특정 브랜드나 제품이 자주 언급되는지 확인</li>
              <li><strong>객관성:</strong> 장점만 강조하고 단점은 언급하지 않는지 확인</li>
              <li><strong>행동 유도:</strong> "구매", "신청", "방문" 등의 유도 문구가 있는지 확인</li>
              <li><strong>후기의 진정성:</strong> 과도하게 긍정적이거나 구체적 근거가 부족한지 확인</li>
            </ul>
          </div>
        </DetailedView>
      )}
    </AdDetectionContainer>
  );
};
