export default async function handler(req, res) {
  console.log('=== API Proxy Function Called ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Query:', JSON.stringify(req.query, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
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
    
    // URL에서 경로 추출 (/api/proxy → 실제 API 경로로 변환)
    // req.url 예시: '/api/proxy?apiPath=/health' 또는 '/api/proxy?apiPath=/challenge/daily'
    let targetPath = req.query.apiPath || req.url.replace('/api/proxy', '') || '/';
    console.log('Target path:', targetPath);
    
    // health 요청의 경우 /api/health → /health로 변경
    if (targetPath === '/health' || targetPath.endsWith('/health')) {
      targetPath = '/health';
    } else if (!targetPath.startsWith('/api/')) {
      // 다른 API 요청들은 /api/ prefix 추가
      targetPath = '/api' + targetPath;
    }
    
    // GET 요청의 경우 쿼리 파라미터도 포함
    const queryParams = new URLSearchParams();
    Object.keys(req.query).forEach(key => {
      if (key !== 'apiPath') {
        queryParams.append(key, req.query[key]);
      }
    });
    const queryString = queryParams.toString();
    const backendUrl = `${BACKEND_URL}${targetPath}${queryString ? '?' + queryString : ''}`;

    console.log(`Proxying ${req.method} ${req.url} to ${backendUrl}`);

    // 백엔드로 요청 전달
    const requestOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0',
        'Origin': 'https://criti-ai-challenge.vercel.app',
      },
    };
    
    // POST/PUT 요청일 경우만 body 추가
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
      if (req.body && Object.keys(req.body).length > 0) {
        requestOptions.body = JSON.stringify(req.body);
        console.log('Request body:', JSON.stringify(req.body, null, 2));
      }
    }
    
    const backendResponse = await fetch(backendUrl, requestOptions);

    console.log('Backend response status:', backendResponse.status);
    console.log('Backend response headers:', JSON.stringify([...backendResponse.headers.entries()]));

    // JSON 응답으로 파싱
    let responseData;
    try {
      responseData = await backendResponse.json();
      console.log('Backend response parsed as JSON:', JSON.stringify(responseData, null, 2));
    } catch (error) {
      console.error('Failed to parse JSON, trying text:', error);
      responseData = await backendResponse.text();
      console.log('Backend response as text:', responseData.substring(0, 200));
    }
    
    // 백엔드 응답 헤더를 프론트엔드로 전달 (압축 관련 헤더 제외)
    backendResponse.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // CORS 관련 헤더와 압축 관련 헤더는 제외
      if (!lowerKey.startsWith('access-control-') && 
          !lowerKey.includes('content-encoding') && 
          !lowerKey.includes('content-length') &&
          !lowerKey.includes('transfer-encoding')) {
        res.setHeader(key, value);
      }
    });

    res.status(backendResponse.status);
    
    // JSON 데이터는 바로 전송, 텍스트는 그대로 전송
    if (typeof responseData === 'object' && responseData !== null) {
      console.log('Sending JSON response');
      res.json(responseData);
    } else {
      console.log('Sending text response');
      res.send(responseData);
    }
    
  } catch (error) {
    console.error('=== PROXY ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request URL:', req.url);
    console.error('Request Method:', req.method);
    console.error('Path segments:', req.query.path);
    
    // 타임아웃 에러 등 구체적인 에러 메시지 제공
    let errorMessage = 'Internal proxy error';
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Backend server connection refused';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Backend server timeout';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Failed to connect to backend server';
    }
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: error.message,
      code: error.code || 'UNKNOWN',
      timestamp: new Date().toISOString()
    });
  }
}
