export default async function handler(req, res) {
  console.log('=== API Proxy Function Called ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Environment BACKEND_URL:', process.env.BACKEND_URL);

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
    console.log('Handling OPTIONS request');
    res.status(200).end();
    return;
  }

  try {
    // 환경변수에서 백엔드 URL 가져오기
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
    console.log('Using BACKEND_URL:', BACKEND_URL);
    
    // 경로 변환: /api/health → /health, 나머지는 그대로
    let path = req.url;
    if (path === '/api/health') {
      path = '/health';
      console.log('Converting /api/health to /health');
    }
    
    const backendUrl = `${BACKEND_URL}${path}`;

    console.log(`Proxying ${req.method} ${req.url} to ${backendUrl}`);

    // 백엔드로 요청 전달
    const backendResponse = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0',
        // Origin 헤더 추가 (CORS용)
        'Origin': 'https://criti-ai-challenge.vercel.app',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    console.log('Backend response status:', backendResponse.status);
    console.log('Backend response headers:', JSON.stringify([...backendResponse.headers.entries()]));

    const data = await backendResponse.text();
    console.log('Backend response data length:', data.length);
    console.log('Backend response data preview:', data.substring(0, 200));
    
    // 백엔드 응답 헤더를 프론트엔드로 전달
    backendResponse.headers.forEach((value, key) => {
      // CORS 관련 헤더는 이미 설정했으므로 제외
      if (!key.toLowerCase().startsWith('access-control-')) {
        res.setHeader(key, value);
      }
    });

    res.status(backendResponse.status);
    
    // JSON인 경우 파싱하여 반환, 아니면 텍스트로 반환
    try {
      const jsonData = JSON.parse(data);
      console.log('Sending JSON response');
      res.json(jsonData);
    } catch {
      console.log('Sending text response');
      res.send(data);
    }
    
  } catch (error) {
    console.error('=== PROXY ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      error: 'Internal proxy error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
