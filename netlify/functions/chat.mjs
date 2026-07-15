export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }
  try {
    const { question } = JSON.parse(event.body || '{}')
    if (!question) {
      return { statusCode: 400, body: JSON.stringify({ error: 'question required' }) }
    }

    // 이 파일은 스텁입니다. 실제 OpenAI 호출은 배포 환경에서 구현하세요.
    const answer = `스텁 응답: "${question}"에 대해 실제 OpenAI 호출은 Netlify 환경에서 처리됩니다.`

    return {
      statusCode: 200,
      body: JSON.stringify({ answer })
    }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) }
  }
}
