import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import NotFoundPage from '../components/NotFoundPage/NotFoundPage';

// Lazy-loaded page components
const ChallengePage = lazy(() => import('../pages/ChallengePage/ChallengePage'));
const YoutubeAnalysisPage = lazy(() => import('../pages/YoutubeAnalysisPage/YoutubeAnalysisPage'));

/**
 * Application Router Configuration
 * 
 * Routes:
 * - / : ChallengePage (Home)
 * - /youtube : YoutubeAnalysisPage
 * - /challenge : Redirect to /
 * - * : 404 NotFoundPage
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <ChallengePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/youtube',
    element: <YoutubeAnalysisPage />,
  },
  {
    path: '/challenge',
    element: <Navigate to="/" replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
