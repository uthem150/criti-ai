import React from 'react'
import ReactDOM from 'react-dom/client'
import { DevTestPage } from './pages/DevTestPage'
import './index.css'

// 개발 테스트용 진입점
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevTestPage />
  </React.StrictMode>,
)
