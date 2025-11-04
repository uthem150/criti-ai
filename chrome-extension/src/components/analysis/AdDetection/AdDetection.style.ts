import styled from "@emotion/styled";
import { colors, typography } from "@/styles/design";

export const AdDetectionContainer = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: ${colors.light.etc.mintLight};
  border-radius: 8px;
  border: 1px solid ${colors.light.etc.mint};
  font-family: inherit !important;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h4 {
      margin: 0;
      font-size: ${typography.styles.title4.fontSize} !important;
      font-weight: ${typography.fontWeight.semibold};
      color: ${colors.light.etc.mint};
      font-family: inherit !important;
    }
  }
`;

interface AdStatusBadgeProps {
  status: "danger" | "warning" | "info" | "safe";
}

export const AdStatusBadge = styled.div<AdStatusBadgeProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: ${typography.styles.title5.fontSize};
  font-weight: ${typography.fontWeight.regular};
  margin-bottom: 12px;

  background: ${(props) => {
    switch (props.status) {
      case "danger":
        return colors.light.state.errorLight;
      case "warning":
        return colors.light.etc.yellowLight;
      case "info":
        return colors.light.brand.primary10;
      case "safe":
        return colors.light.etc.mintLight;
      default:
        return colors.light.etc.grayLight;
    }
  }};

  color: ${(props) => {
    switch (props.status) {
      case "danger":
        return colors.light.state.error;
      case "warning":
        return colors.light.etc.orange;
      case "info":
        return colors.light.brand.primary100;
      case "safe":
        return colors.light.etc.mint;
      default:
        return colors.light.grayscale[60];
    }
  }};

  border: 1px solid
    ${(props) => {
      switch (props.status) {
        case "danger":
          return colors.light.state.error;
        case "warning":
          return colors.light.etc.orange;
        case "info":
          return colors.light.brand.primary100;
        case "safe":
          return colors.light.etc.mint;
        default:
          return colors.light.grayscale[20];
      }
    }};

  .icon {
    font-size: ${typography.styles.title4.fontSize};
  }

  .status {
    font-weight: ${typography.fontWeight.semibold};
  }

  .confidence {
    font-size: ${typography.styles.caption4.fontSize};
    opacity: 0.8;
  }
`;

interface AdWarningProps {
  status: "danger" | "warning" | "info" | "safe";
}

export const AdWarning = styled.div<AdWarningProps>`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: ${typography.styles.caption4.fontSize};
  line-height: 1.4;
  margin-bottom: 16px;

  background: ${(props) => {
    switch (props.status) {
      case "danger":
        return colors.light.state.errorLight;
      case "warning":
        return colors.light.etc.yellowLight;
      case "info":
        return colors.light.brand.primary10;
      case "safe":
        return colors.light.etc.mintLight;
      default:
        return colors.light.etc.grayLight;
    }
  }};

  color: ${(props) => {
    switch (props.status) {
      case "danger":
        return colors.light.state.error;
      case "warning":
        return colors.light.etc.orange;
      case "info":
        return colors.light.brand.primary100;
      case "safe":
        return colors.light.etc.mint;
      default:
        return colors.light.grayscale[80];
    }
  }};

  border-left: 3px solid
    ${(props) => {
      switch (props.status) {
        case "danger":
          return colors.light.state.error;
        case "warning":
          return colors.light.etc.yellow;
        case "info":
          return colors.light.brand.primary100;
        case "safe":
          return colors.light.etc.mint;
        default:
          return colors.light.grayscale[60];
      }
    }};
`;

interface ToggleButtonProps {
  isExpanded: boolean;
}

export const ToggleButton = styled.button<ToggleButtonProps>`
  background: ${colors.light.etc.mintLight};
  border: 1px solid ${colors.light.etc.mint};
  color: ${colors.light.etc.mint};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: ${typography.styles.caption4.fontSize};
  font-weight: ${typography.fontWeight.regular};
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit !important;

  &:hover {
    background: ${colors.light.etc.mintLight};
    border-color: ${colors.light.etc.mint};
  }

  &::after {
    content: "${(props) => (props.isExpanded ? " ▼" : " ▶")}";
    margin-left: 4px;
  }
`;

export const DetailedView = styled.div`
  .analysis-tip {
    margin-top: 16px;
    padding: 12px;
    background: ${colors.light.transparency.white[70]};
    border-radius: 6px;
    border: 1px solid ${colors.light.etc.mintLight};

    h5 {
      margin: 0 0 8px 0;
      font-size: ${typography.styles.caption4.fontSize};
      font-weight: ${typography.fontWeight.semibold};
      color: ${colors.light.etc.mint};
      font-family: inherit !important;
    }

    ul {
      margin: 0;
      padding-left: 16px;

      li {
        font-size: ${typography.styles.caption4.fontSize};
        line-height: 1.4;
        margin-bottom: 4px;
        color: ${colors.light.grayscale[80]};

        strong {
          color: ${colors.light.etc.mint};
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
  background: ${colors.light.transparency.white[80]};
  border-radius: 6px;
  border: 1px solid ${colors.light.etc.mintLight};
  text-align: center;

  .label {
    font-size: ${typography.styles.caption4.fontSize};
    color: ${colors.light.grayscale[60]};
    margin-bottom: 4px;
    font-weight: ${typography.fontWeight.regular};
  }

  .score {
    font-size: ${typography.styles.title4.fontSize};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.light.etc.mint};

    &[data-high="true"] {
      color: ${colors.light.state.error};
    }
  }
`;

export const AdIndicatorsList = styled.div`
  margin-bottom: 16px;

  h5 {
    margin: 0 0 8px 0;
    font-size: ${typography.styles.caption4.fontSize};
    font-weight: ${typography.fontWeight.semibold};
    color: ${colors.light.etc.mint};
    font-family: inherit !important;
  }
`;

interface AdIndicatorItemProps {
  weight: number;
}

export const AdIndicatorItem = styled.div<AdIndicatorItemProps>`
  margin-bottom: 12px;
  padding: 10px;
  background: ${colors.light.transparency.white[90]};
  border-radius: 6px;
  border: 1px solid ${colors.light.etc.mintLight};

  ${(props) =>
    props.weight >= 5 &&
    `
    border-color: ${colors.light.state.error}; 
    background: ${colors.light.state.errorLight}; 
  `}

  ${(props) =>
    props.weight >= 7 &&
    `
    border-color: ${colors.light.state.error}; 
    background: ${colors.light.state.errorLight}; 
    box-shadow: 0 1px 3px ${colors.light.state.errorLight}; 
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
    font-size: ${typography.styles.title5.fontSize};
  }

  .label {
    font-size: ${typography.styles.caption4.fontSize};
    font-weight: ${typography.fontWeight.semibold};
    color: ${(props) => props.color};
  }

  .weight {
    font-size: 10px;
    color: ${colors.light.grayscale[60]};
    background: ${colors.light.etc.grayLight};
    padding: 1px 4px;
    border-radius: 3px;
    margin-left: auto;
  }
`;

export const IndicatorEvidence = styled.div`
  font-size: ${typography.styles.caption4.fontSize};
  color: ${colors.light.grayscale[80]};
  font-style: italic;
  margin-bottom: 4px;
  padding: 4px 8px;
  background: ${colors.light.etc.mintLight};
  border-radius: 4px;
  border-left: 2px solid ${colors.light.etc.mint};
`;

export const IndicatorExplanation = styled.div`
  font-size: ${typography.styles.caption4.fontSize};
  color: ${colors.light.grayscale[60]};
  line-height: 1.3;
`;
