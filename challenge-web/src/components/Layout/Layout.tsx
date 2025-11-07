import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { ROUTES } from "../../constants";
import * as S from "./Layout.style";
import Chart from "@/assets/icons/chart-bar.svg?react";
import Seeding from "@/assets/icons/seeding.svg?react";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    // {
    //   icon: 'ℹ️',
    //   label: '이용 가이드',
    //   path: ROUTES.GUIDE,
    // },
  ];

  return (
    <S.LayoutContainer>
      {/* 사이드바 */}
      <S.Sidebar>
        <S.Logo onClick={() => navigate("/")}>
          <S.LogoText>CritiAI</S.LogoText>
        </S.Logo>

        <S.Nav>
          {navItems.map((item) => (
            <S.NavItem
              key={item.path}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <S.NavIcon
                active={location.pathname === item.path}
                as={item.icon}
              />
              <S.NavLabel active={location.pathname === item.path}>
                {item.label}
              </S.NavLabel>
            </S.NavItem>
          ))}
        </S.Nav>
      </S.Sidebar>

      {/* 메인 콘텐츠 */}
      <S.MainContent>
        <Outlet />
      </S.MainContent>
    </S.LayoutContainer>
  );
};

export default Layout;
