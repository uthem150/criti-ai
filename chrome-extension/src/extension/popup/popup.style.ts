import styled from "@emotion/styled";
import { colors, typography } from "@/styles/design";

const spacing = ["0rem", "0.25rem", "0.5rem", "0.75rem", "1rem", "1.5rem"];

const borderRadius = {
  md: "8px",
  lg: "12px",
};

const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
};

const animations = {
  transition: {
    normal: "0.2s ease-out",
  },
};

export const PopupContainer = styled.div`
  padding: ${spacing[5]};
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  background: ${colors.light.grayscale[0]};
`;

export const Header = styled.div`
  margin-bottom: ${spacing[5]};

  h2 {
    margin: 0 0 ${spacing[2]} 0;
    color: ${colors.light.brand.primary100};
    ${typography.styles.title1};

    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[2]};
  }

  p {
    margin: 0;
    color: ${colors.light.grayscale[60]};
    ${typography.styles.caption3};
  }
`;

export const GuideSection = styled.div`
  margin-bottom: ${spacing[5]};
  flex: 1;
`;

export const GuideCard = styled.div`
  background: ${colors.light.grayscale[5]};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.lg};
  margin-bottom: ${spacing[4]};
  box-shadow: ${shadows.sm};

  h3 {
    margin: 0 0 ${spacing[2]} 0;
    color: ${colors.light.grayscale[90]};
    ${typography.styles.title4};

    display: flex;
    align-items: center;
    gap: ${spacing[2]};
  }

  ol {
    text-align: left;
    color: ${colors.light.grayscale[90]};
    padding-left: ${spacing[5]};
    margin: 0;
    ${typography.styles.caption3};

    li {
      margin-bottom: ${spacing[1]};
    }
  }
`;

export const StatusText = styled.div`
  color: ${colors.light.grayscale[40]};
  margin-bottom: ${spacing[5]};
  ${typography.styles.body4};
`;

export const ActionButton = styled.button`
  background: ${colors.light.brand.primary100};
  color: ${colors.light.static.white};
  border: none;
  padding: ${spacing[2]} ${spacing[4]};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all ${animations.transition.normal};
  ${typography.styles.title5};

  &:hover {
    background: ${colors.light.brand.primary80};
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
  background: ${colors.light.grayscale[0]};
  border: 1px solid ${colors.light.grayscale[20]};
  border-radius: ${borderRadius.md};
  text-align: left;

  .icon {
    font-size: 1.5rem;
  }

  .content {
    flex: 1;

    .title {
      color: ${colors.light.grayscale[90]};
      margin-bottom: 2px;
      ${typography.styles.title5};
    }

    .description {
      color: ${colors.light.grayscale[60]};
      margin: 0;
      ${typography.styles.body4};
    }
  }
`;
