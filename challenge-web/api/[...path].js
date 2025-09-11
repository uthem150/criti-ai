export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONS 요청 처리 (Preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 환경변수에서 백엔드 URL 가져오기
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
    
    // 요청 경로에서 /api 제거
    const path = req.url;
    const backendUrl = `${BACKEND_URL}${path}`;

    console.log(`Proxying ${req.method} ${req.url} to ${backendUrl}`);

    // 백엔드로 요청 전달
    const backendResponse = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await backendResponse.text();
    
    // 응답 헤더 복사
    backendResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(backendResponse.status);
    
    // JSON인 경우 파싱하여 반환, 아니면 텍스트로 반환
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch {
      res.send(data);
    }
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal proxy error',
      timestamp: new Date().toISOString()
    });
  }
}
