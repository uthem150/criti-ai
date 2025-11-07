import styled from "@emotion/styled";
import { colors, typography } from "../../styles/design-system";

// 공용 버튼 스타일 (토글 버튼용)
const baseToggleButtonStyle = `
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${colors.light.grayscale[10]};
  }

  & svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke: ${colors.light.grayscale[70]};
  }
`;

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative; // 모바일 사이드바 기준점
`;

export const Sidebar = styled.aside<{ isOpen: boolean }>`
  width: ${(props) => (props.isOpen ? "250px" : "80px")};
  border-right: 1px solid ${colors.light.grayscale[20]};
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  transition: width 0.3s ease-in-out;
  z-index: 1000;
  background: ${colors.light
    .grayscale[0]}; // 배경색 추가 (모바일 오버레이시 필요)

  /* 모바일 스타일 */
  @media (max-width: 1024px) {
    width: 250px; // 모바일에선 열릴 때 항상 250px
    transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
    transition: transform 0.3s ease-in-out;
    border-right: 1px solid ${colors.light.grayscale[20]};
  }
`;

export const LogoWrapper = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isOpen ? "space-between" : "center")};
  padding: ${(props) => (props.isOpen ? "1.75rem" : "1.75rem 0rem")};
  box-sizing: border-box;

  /* 모바일 패딩 */
  @media (max-width: 1024px) {
    padding-right: 1rem; // 모바일 닫기 버튼 공간 확보
  }
`;

export const MobileHeader = styled.header`
  display: none; // 데스크톱에선 숨김
  height: 4.5rem; // 로고 높이와 맞춤
  padding: 0 1rem;
  align-items: center;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

export const MobileToggleBtn = styled.button`
  ${baseToggleButtonStyle}
`;

export const Backdrop = styled.div<{ isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;

  @media (max-width: 1024px) {
    display: ${(props) => (props.isOpen ? "block" : "none")};
  }
`;

export const DesktopToggleBtn = styled.button`
  ${baseToggleButtonStyle}
  display: none; // 모바일에선 숨김

  @media (min-width: 1025px) {
    display: flex; // 데스크톱에서만 보임
  }
`;

/* 모바일 닫기 버튼 스타일  */
export const MobileCloseBtn = styled.button`
  ${baseToggleButtonStyle}
  transform: rotate(270deg);
  display: none; // 데스크톱에선 숨김

  @media (max-width: 1024px) {
    display: flex; // 모바일에서만 보임
  }

  & svg {
    stroke: ${colors.light.grayscale[70]};
  }
`;

export const Logo = styled.div`
  cursor: pointer;
  overflow: hidden;
`;

export const LogoText = styled.h1<{ isOpen: boolean }>`
  color: ${colors.light.grayscale[100]};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap; // 줄바꿈 방지

  /* 데스크톱에서 닫힐 때 숨김 */
  @media (min-width: 1025px) {
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    transition: opacity 0.2s ease;
    display: ${(props) => (props.isOpen ? "block" : "none")};
  }
`;

export const Nav = styled.nav`
  display: flex;
  padding: 0 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
`;

export const NavItem = styled.button<{ $active: boolean; isOpen: boolean }>`
  display: flex;
  height: 3.25rem;
  padding: 1rem 1.25rem;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;

  background: ${(props) =>
    props.$active ? colors.light.brand.primary10 : "transparent"};
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  overflow: hidden; // 텍스트 숨김 처리

  &:hover {
    background: ${(props) =>
      props.$active
        ? colors.light.brand.primary10
        : colors.light.grayscale[10]};
  }

  /* 데스크톱 닫힘 상태 */
  @media (min-width: 1025px) {
    justify-content: ${(props) => (props.isOpen ? "flex-start" : "center")};
    padding: 1rem; // 닫혔을 때 패딩 조절
    gap: ${(props) => (props.isOpen ? "0.5rem" : "0")};
  }
`;

export const NavIcon = styled.span<{ $active: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; // 아이콘이 찌그러지지 않게

  & path {
    stroke: ${(props) =>
      props.$active
        ? colors.light.brand.primary100
        : colors.light.grayscale[70]};
  }
`;

export const NavLabel = styled.span<{ $active: boolean; isOpen: boolean }>`
  ${typography.styles.body2};
  color: ${colors.light.grayscale[70]};
  font-weight: ${typography.fontWeight.regular};
  white-space: nowrap; // 줄바꿈 방지

  color: ${(props) =>
    props.$active ? colors.light.grayscale[100] : colors.light.grayscale[70]};

  /* 데스크톱 닫힘 상태 */
  @media (min-width: 1025px) {
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    transition: opacity 0.2s ease;
    display: ${(props) => (props.isOpen ? "block" : "none")};
  }
`;

export const MainContent = styled.main<{
  isSidebarOpen: boolean;
  isDesktop: boolean;
}>`
  flex: 1;
  min-height: 100vh;
  transition: margin-left 0.3s ease-in-out;

  /* 데스크톱 */
  margin-left: ${(props) =>
    props.isDesktop ? (props.isSidebarOpen ? "250px" : "80px") : "0"};

  /* 모바일 */
  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;
