// import { lazy } from 'react';

import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage/NotFoundPage";
import Layout from "../components/Layout/Layout";
import { ROUTES } from "../constants/routes";

// Lazy-loaded page components
// const ChallengePage = lazy(() => import('../pages/ChallengePage/ChallengePage'));
// const YoutubeAnalysisPage = lazy(() => import('../pages/YoutubeAnalysisPage/YoutubeAnalysisPage'));

import ChallengePage from "../pages/ChallengePage/ChallengePage";
import YoutubeAnalysisPage from "../pages/YoutubeAnalysisPage/YoutubeAnalysisPage";
// import GuidePage from "../pages/GuidePage/GuidePage";

/**
 * Application Router Configuration
 *
 * Layout을 부모로 하는 중첩 라우트 구조
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.HOME, // 기본 경로 '/'
    element: <Layout />, // 부모 요소로 Layout
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, // path: '/'일 때 렌더링될 자식 컴포넌트
        element: <ChallengePage />,
      },
      {
        path: ROUTES.YOUTUBE_ANALYSIS, // path: '/youtube'
        element: <YoutubeAnalysisPage />,
      },
      // {
      //   path: ROUTES.GUIDE, // path: '/guide'
      //   element: <GuidePage />,
      // },
    ],
  },
  {
    // '/challenge' 경로는 '/'로 리다이렉트
    path: ROUTES.CHALLENGE,
    element: <Navigate to={ROUTES.HOME} replace />,
  },
  {
    // 일치하는 라우트가 없을 경우 404 페이지
    path: "*",
    element: <NotFoundPage />,
  },
]);
