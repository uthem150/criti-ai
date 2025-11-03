import { css, Global } from "@emotion/react";
import { colors, typography } from "./design-system";

export const GlobalStyles = () => (
  <Global
    styles={css`
      /* CSS Reset & Base Styles */
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        font-size: 16px;
        scroll-behavior: smooth;
        -webkit-text-size-adjust: 100%;
      }

      body {
        margin: 0;
        padding: 0;
        font-family: ${typography.fontFamily.primary};
        line-height: 1.5;
        color: ${colors.light.grayscale[90]};
        background-color: ${colors.light.grayscale[5]};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
      }

      #root {
        min-height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      /* Typography */
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 0;
        font-weight: ${typography.fontWeight.semibold};
      }

      p {
        margin: 0;
      }

      /* Links */
      a {
        color: ${colors.light.brand.primary100};
        text-decoration: none;
        transition: color 0.2s ease;
      }

      a:hover {
        color: ${colors.light.etc.purple};
      }

      /* Buttons */
      button {
        font-family: ${typography.fontFamily.primary};
        border: none;
        background: none;
        cursor: pointer;
      }

      /* Input */
      input,
      textarea,
      select {
        font-family: ${typography.fontFamily.primary};
      }

      /* Accessibility */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }

      /* Focus Styles */
      *:focus-visible {
        outline: 2px solid ${colors.light.brand.primary100};
        outline-offset: 2px;
      }

      button:focus-visible,
      a:focus-visible {
        outline: 2px solid ${colors.light.brand.primary100};
        outline-offset: 2px;
      }

      /* Selection */
      ::selection {
        background-color: ${colors.light.brand.primary20};
        color: ${colors.light.grayscale[90]};
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: ${colors.light.grayscale[10]};
      }

      ::-webkit-scrollbar-thumb {
        background: ${colors.light.grayscale[40]};
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${colors.light.grayscale[50]};
      }

      /* Spinner Animation */
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}
  />
);
