import styled from "@emotion/styled";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  animations,
} from "@/styles/style";

export const PopupContainer = styled.div`
  padding: ${spacing[5]};
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  background: ${colors.background.primary};
`;

export const Header = styled.div`
  margin-bottom: ${spacing[5]};

  h2 {
    margin: 0 0 ${spacing[2]} 0;
    color: ${colors.primary.dark};
    ${typography.styles.title1};

    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[2]};
  }

  p {
    margin: 0;
    color: ${colors.text.secondary};

    ${typography.styles.caption3};
  }
`;

export const GuideSection = styled.div`
  margin-bottom: ${spacing[5]};
  flex: 1;
`;

export const GuideCard = styled.div`
  background: ${colors.background.secondary};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.lg};
  margin-bottom: ${spacing[4]};
  box-shadow: ${shadows.sm};

  h3 {
    margin: 0 0 ${spacing[2]} 0;
    color: ${colors.text.primary};

    ${typography.styles.title4};

    display: flex;
    align-items: center;
    gap: ${spacing[2]};
  }

  ol {
    text-align: left;
    color: ${colors.text.primary};
    padding-left: ${spacing[5]};
    margin: 0;

    ${typography.styles.caption3};

    li {
      margin-bottom: ${spacing[1]};
    }
  }
`;

export const StatusText = styled.div`
  color: ${colors.text.disabled};
  margin-bottom: ${spacing[5]};

  ${typography.styles.body4};
`;

export const ActionButton = styled.button`
  background: ${colors.primary.main};
  color: ${colors.text.inverse};
  border: none;
  padding: ${spacing[2]} ${spacing[4]};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all ${animations.transition.normal};

  ${typography.styles.title5};

  &:hover {
    background: ${colors.primary.hover};
    transform: translateY(-1px);
    box-shadow: ${shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const FeaturesList = styled.div`
  display: grid;
  gap: ${spacing[3]};
  margin-top: ${spacing[4]};
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  padding: ${spacing[3]};
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.primary};
  border-radius: ${borderRadius.md};
  text-align: left;

  .icon {
    font-size: 1.5rem;
  }

  .content {
    flex: 1;

    .title {
      color: ${colors.text.primary};
      margin-bottom: 2px;

      ${typography.styles.title5};
    }

    .description {
      color: ${colors.text.secondary};
      margin: 0;

      ${typography.styles.body4};
    }
  }
`;
