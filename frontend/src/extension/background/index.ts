// 크롬 확장 프로그램 백그라운드 스크립트

chrome.runtime.onInstalled.addListener(() => {
  console.log('🔍 크리티 AI 확장 프로그램이 설치되었습니다.');
});

// 확장 프로그램 아이콘 클릭 시
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    // Content script 주입 (필요한 경우)
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  }
});

// 메시지 수신 (Content Script와 통신)
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'analyze') {
    // AI 분석 요청을 백엔드로 전달
    fetch('http://localhost:3001/api/analysis/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: request.url,
        content: request.content,
        title: request.title
      })
    })
    .then(response => response.json())
    .then(data => {
      sendResponse({ success: true, data });
    })
    .catch(error => {
      console.error('Analysis error:', error);
      sendResponse({ success: false, error: error.message });
    });
    
    return true; // 비동기 응답을 위해 true 반환
  }
});

export {};
