import styled from "@emotion/styled";
import { colors, typography } from "../../styles/design-system";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 6rem 1rem 2rem;
  }

  @media (max-width: 768px) {
    padding: 5.5rem 1rem 1.5rem;
  }
`;

export const Header = styled.header`
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

export const Title = styled.h1`
  ${typography.styles.headline1};
  color: ${colors.light.grayscale[90]};
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    ${typography.styles.headline2};
    margin-bottom: 0.5rem;
  }
`;

export const Description = styled.p`
  ${typography.styles.body1};
  color: ${colors.light.grayscale[70]};
  line-height: 1.6;

  @media (max-width: 768px) {
    ${typography.styles.body2};
  }
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(
      3,
      1fr
    ); /* 3열 고정으로 모든 통계가 한 줄에 보이도록 */
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
`;

export const StatCard = styled.div`
  padding: 1.5rem;
  background: ${colors.light.grayscale[0]};
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    border-radius: 12px;
  }
`;

export const StatValue = styled.div`
  ${typography.styles.headline1};
  color: ${colors.light.brand.primary100};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    ${typography.styles.headline2};
    margin-bottom: 0.25rem;
  }

  @media (max-width: 480px) {
    ${typography.styles.title1};
  }
`;

export const StatLabel = styled.div`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};

  @media (max-width: 768px) {
    ${typography.styles.caption4};
  }
`;

export const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${colors.light.grayscale[20]};
  overflow-x: auto;

  /* 스크롤바 숨김 (디자인 개선) */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    gap: 0.25rem;
  }
`;

export const CategoryTab = styled.button<{ active?: boolean }>`
  padding: 1rem 1.5rem;
  ${typography.styles.body2};
  font-weight: ${typography.fontWeight.semibold};
  color: ${(props) =>
    props.active ? colors.light.brand.primary100 : colors.light.grayscale[70]};
  background: none;
  border: none;
  border-bottom: 3px solid
    ${(props) => (props.active ? colors.light.brand.primary100 : "transparent")};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: ${colors.light.brand.primary100};
    background: ${colors.light.grayscale[10]};
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0.75rem;
    ${typography.styles.body3};
  }
`;

export const BadgesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr; /* 모바일에서는 2열로 표시 */
    gap: 1rem;
  }
`;

export const BadgeCard = styled.div<{ earned?: boolean }>`
  padding: 1.5rem;
  background: ${colors.light.grayscale[0]};
  border: 2px solid
    ${(props) =>
      props.earned
        ? colors.light.brand.primary100
        : colors.light.grayscale[20]};
  border-radius: 16px;
  box-shadow: ${(props) =>
    props.earned
      ? "0 4px 12px rgba(0, 0, 0, 0.15)"
      : "0 1px 3px rgba(0, 0, 0, 0.1)"};
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  opacity: ${(props) => (props.earned ? 1 : 0.6)};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    border-radius: 12px;
  }
`;

export const BadgeIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
`;

export const BadgeName = styled.h3`
  ${typography.styles.title2};
  color: ${colors.light.grayscale[90]};
  margin-bottom: 0.5rem;
  text-align: center;

  @media (max-width: 768px) {
    ${typography.styles.title5};
  }
`;

export const BadgeDescription = styled.p`
  ${typography.styles.body3};
  color: ${colors.light.grayscale[70]};
  text-align: center;
  margin-bottom: 0.5rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    ${typography.styles.caption4};
  }
`;

export const BadgeEarnedDate = styled.div`
  ${typography.styles.caption4};
  color: ${colors.light.grayscale[60]};
  text-align: center;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    ${typography.styles.caption4};
    font-size: 0.5rem;
  }
`;

export const LockedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    top: 0.75rem;
    right: 0.75rem;
  }
`;

export const ProgressInfo = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: ${colors.light.grayscale[5]};
  border-radius: 12px;
  ${typography.styles.caption4};
  color: ${colors.light.grayscale[70]};
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${colors.light.grayscale[70]};

  h3 {
    ${typography.styles.title1};
    margin-bottom: 1rem;
  }

  p {
    ${typography.styles.body2};
  }

  @media (max-width: 768px) {
    padding: 2rem;
    h3 {
      ${typography.styles.title2};
    }
    p {
      ${typography.styles.body3};
    }
  }
`;
