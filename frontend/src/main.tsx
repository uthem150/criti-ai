import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChallengePage } from './pages/Challenge/ChallengePage'
import './index.css'

// 메인 페이지를 Challenge 게임으로 설정
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChallengePage />
  </React.StrictMode>,
)
