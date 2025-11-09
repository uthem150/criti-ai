import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { ROUTES } from "../../constants";
import * as S from "./Layout.style";

// 아이콘
import Chart from "@/assets/icons/chart-bar.svg?react";
import Seeding from "@/assets/icons/seeding.svg?react";
import Menu from "@/assets/icons/menu.svg?react";
import Close from "@/assets/icons/chevron-up.svg?react";

// 화면 크기 감지 훅
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1025px 이상일 때 true
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  // 사이드바 상태. 데스크톱일 땐 true(열림), 모바일일 땐 false(닫힘)
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 화면 크기 변경 시 사이드바 상태 초기화
  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  const navItems = [
    {
      icon: Chart,
      label: "유튜브 영상 분석",
      path: ROUTES.YOUTUBE_ANALYSIS,
    },
    {
      icon: Seeding,
      label: "비판적 사고 훈련",
      path: ROUTES.HOME,
    },
    {
      icon: () => <div style={{ fontSize: "1.5rem" }}>🏆</div>,
      label: "내 뱃지",
      path: ROUTES.BADGES,
    },
    // {
    //   icon: 'ℹ️',
    //   label: '이용 가이드',
    //   path: ROUTES.GUIDE,
    // },
  ];

  return (
    <S.LayoutContainer>
      {/* 모바일용 백드롭 (사이드바 열렸을 때) */}
      <S.Backdrop
        isOpen={isSidebarOpen && !isDesktop}
        onClick={toggleSidebar}
      />

      {/* 사이드바 */}
      <S.Sidebar isOpen={isSidebarOpen}>
        <S.LogoWrapper isOpen={isSidebarOpen}>
          <S.Logo onClick={() => navigate("/")}>
            <S.LogoText isOpen={isSidebarOpen}>CritiAI</S.LogoText>
          </S.Logo>
          {/* 데스크톱용 토글 버튼 */}
          <S.DesktopToggleBtn onClick={toggleSidebar}>
            <Menu />
          </S.DesktopToggleBtn>

          {/* 모바일용 닫기 버튼 */}
          <S.MobileCloseBtn onClick={toggleSidebar}>
            <Close />
          </S.MobileCloseBtn>
        </S.LogoWrapper>

        <S.Nav>
          {navItems.map((item) => (
            <S.NavItem
              key={item.path}
              $active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              isOpen={isSidebarOpen}
            >
              <S.NavIcon $active={location.pathname === item.path}>
                <item.icon />
              </S.NavIcon>
              <S.NavLabel
                $active={location.pathname === item.path}
                isOpen={isSidebarOpen}
              >
                {item.label}
              </S.NavLabel>
            </S.NavItem>
          ))}
        </S.Nav>
      </S.Sidebar>

      {/* 메인 콘텐츠 */}
      <S.MainContent isSidebarOpen={isSidebarOpen} isDesktop={isDesktop}>
        {/* 모바일용 헤더 및 토글 버튼 */}
        <S.MobileHeader>
          <S.MobileToggleBtn onClick={toggleSidebar}>
            <Menu />
          </S.MobileToggleBtn>
        </S.MobileHeader>
        <Outlet />
      </S.MainContent>
    </S.LayoutContainer>
  );
};

export default Layout;
