import styled from '@emotion/styled';
import { colors, typography } from '../../styles/design-system';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.light.grayscale[5]};
`;

export const Sidebar = styled.aside`
  width: 250px;
  background: ${colors.light.grayscale[0]};
  border-right: 1px solid ${colors.light.grayscale[20]};
  padding: 2rem 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const Logo = styled.div`
  padding: 0 1.5rem;
  margin-bottom: 2rem;
`;

export const LogoText = styled.h1`
  ${typography.styles.title2};
  color: ${colors.light.grayscale[100]};
  margin: 0;
  font-weight: ${typography.fontWeight.bold};
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
`;

export const NavItem = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${(props) =>
    props.active ? colors.light.brand.primary10 : 'transparent'};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${(props) =>
      props.active
        ? colors.light.brand.primary10
        : colors.light.grayscale[10]};
  }
`;

export const NavIcon = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavLabel = styled.span`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[90]};
  font-weight: ${typography.fontWeight.regular};
`;

export const MainContent = styled.main`
  margin-left: 250px;
  flex: 1;
  min-height: 100vh;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;
