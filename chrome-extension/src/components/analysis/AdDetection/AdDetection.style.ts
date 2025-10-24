import styled from '@emotion/styled';

export const AdDetectionContainer = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border-radius: 8px;
  border: 1px solid #bbf7d0;
  font-family: inherit !important;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h4 {
      margin: 0;
      font-size: 16px !important;
      font-weight: 600;
      color: #065f46;
      font-family: inherit !important;
    }
  }
`;

interface AdStatusBadgeProps {
  status: 'danger' | 'warning' | 'info' | 'safe';
}

export const AdStatusBadge = styled.div<AdStatusBadgeProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  
  background: ${props => {
    switch (props.status) {
      case 'danger': return 'rgba(239, 68, 68, 0.1)';
      case 'warning': return 'rgba(251, 191, 36, 0.1)';
      case 'info': return 'rgba(59, 130, 246, 0.1)';
      case 'safe': return 'rgba(34, 197, 94, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'danger': return '#dc2626';
      case 'warning': return '#d97706';
      case 'info': return '#2563eb';
      case 'safe': return '#059669';
      default: return '#6b7280';
    }
  }};
  
  border: 1px solid ${props => {
    switch (props.status) {
      case 'danger': return '#fecaca';
      case 'warning': return '#fed7aa';
      case 'info': return '#dbeafe';
      case 'safe': return '#bbf7d0';
      default: return '#e5e7eb';
    }
  }};

  .icon {
    font-size: 16px;
  }
  
  .status {
    font-weight: 600;
  }
  
  .confidence {
    font-size: 12px;
    opacity: 0.8;
  }
`;

interface AdWarningProps {
  status: 'danger' | 'warning' | 'info' | 'safe';
}

export const AdWarning = styled.div<AdWarningProps>`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 16px;
  
  background: ${props => {
    switch (props.status) {
      case 'danger': return 'rgba(239, 68, 68, 0.05)';
      case 'warning': return 'rgba(251, 191, 36, 0.05)';
      case 'info': return 'rgba(59, 130, 246, 0.05)';
      case 'safe': return 'rgba(34, 197, 94, 0.05)';
      default: return 'rgba(107, 114, 128, 0.05)';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'danger': return '#7f1d1d';
      case 'warning': return '#78350f';
      case 'info': return '#1e3a8a';
      case 'safe': return '#14532d';
      default: return '#374151';
    }
  }};
  
  border-left: 3px solid ${props => {
    switch (props.status) {
      case 'danger': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'safe': return '#22c55e';
      default: return '#6b7280';
    }
  }};
`;

interface ToggleButtonProps {
  isExpanded: boolean;
}

export const ToggleButton = styled.button<ToggleButtonProps>`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #065f46;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit !important;
  
  &:hover {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.4);
  }
  
  &::after {
    content: '${props => props.isExpanded ? ' ▼' : ' ▶'}';
    margin-left: 4px;
  }
`;

export const DetailedView = styled.div`
  .analysis-tip {
    margin-top: 16px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 6px;
    border: 1px solid rgba(16, 185, 129, 0.2);
    
    h5 {
      margin: 0 0 8px 0;
      font-size: 13px;
      font-weight: 600;
      color: #065f46;
      font-family: inherit !important;
    }
    
    ul {
      margin: 0;
      padding-left: 16px;
      
      li {
        font-size: 12px;
        line-height: 1.4;
        margin-bottom: 4px;
        color: #374151;
        
        strong {
          color: #065f46;
        }
      }
    }
  }
`;

export const ScoreMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

export const ScoreItem = styled.div`
  padding: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  text-align: center;
  
  .label {
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 4px;
    font-weight: 500;
  }
  
  .score {
    font-size: 16px;
    font-weight: 700;
    color: #059669;
    
    &[data-high="true"] {
      color: #dc2626;
    }
  }
`;

export const AdIndicatorsList = styled.div`
  margin-bottom: 16px;
  
  h5 {
    margin: 0 0 8px 0;
    font-size: 13px;
    font-weight: 600;
    color: #065f46;
    font-family: inherit !important;
  }
`;

interface AdIndicatorItemProps {
  weight: number;
}

export const AdIndicatorItem = styled.div<AdIndicatorItemProps>`
  margin-bottom: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  
  ${props => props.weight >= 5 && `
    border-color: rgba(239, 68, 68, 0.3);
    background: rgba(239, 68, 68, 0.02);
  `}
  
  ${props => props.weight >= 7 && `
    border-color: rgba(239, 68, 68, 0.4);
    background: rgba(239, 68, 68, 0.05);
    box-shadow: 0 1px 3px rgba(239, 68, 68, 0.1);
  `}
`;

interface IndicatorTypeProps {
  color: string;
}

export const IndicatorType = styled.div<IndicatorTypeProps>`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  
  .icon {
    font-size: 14px;
  }
  
  .label {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.color};
  }
  
  .weight {
    font-size: 10px;
    color: #6b7280;
    background: rgba(107, 114, 128, 0.1);
    padding: 1px 4px;
    border-radius: 3px;
    margin-left: auto;
  }
`;

export const IndicatorEvidence = styled.div`
  font-size: 12px;
  color: #374151;
  font-style: italic;
  margin-bottom: 4px;
  padding: 4px 8px;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 4px;
  border-left: 2px solid #10b981;
`;

export const IndicatorExplanation = styled.div`
  font-size: 11px;
  color: #6b7280;
  line-height: 1.3;
`;
