import styled from "@emotion/styled";
import { colors, typography } from "../../styles/design-system";

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const Sidebar = styled.aside`
  width: 250px;
  border-right: 1px solid ${colors.light.grayscale[20]};
  position: fixed;
  height: 100vh;
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const Logo = styled.div`
  padding: 1.75rem;
  cursor: pointer;
`;

export const LogoText = styled.h1`
  color: ${colors.light.grayscale[100]};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const Nav = styled.nav`
  display: flex;
  padding: 0 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
`;

export const NavItem = styled.button<{ active: boolean }>`
  display: flex;
  height: 3.25rem;
  padding: 1rem 1.25rem;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;

  background: ${(props) =>
    props.active ? colors.light.brand.primary10 : "transparent"};
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${(props) =>
      props.active ? colors.light.brand.primary10 : colors.light.grayscale[10]};
  }
`;

export const NavIcon = styled.span<{ active: boolean }>`
  width: 1.25rem;
  height: 1.25rem;

  display: flex;
  align-items: center;
  justify-content: center;

  & path {
    stroke: ${(props) =>
      props.active
        ? colors.light.brand.primary100
        : colors.light.grayscale[70]};
  }
`;

export const NavLabel = styled.span<{ active: boolean }>`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[70]};
  font-weight: ${typography.fontWeight.regular};

  color: ${(props) =>
    props.active ? colors.light.grayscale[100] : colors.light.grayscale[70]};
`;

export const MainContent = styled.main`
  margin-left: 250px;
  flex: 1;
  min-height: 100vh;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;
