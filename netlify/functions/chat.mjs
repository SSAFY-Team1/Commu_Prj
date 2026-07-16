const MAX_QUESTION_LENGTH = 300
const MAX_CONTEXT_ITEMS = 5
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  }
}

function normalizeContext(context) {
  if (!Array.isArray(context)) return []

  return context.slice(0, MAX_CONTEXT_ITEMS).map((item) => ({
    id: String(item?.id || '').slice(0, 80),
    title: String(item?.title || item?.name || '').slice(0, 80),
    category: String(item?.category || '').slice(0, 40),
    address: String(item?.address || '').slice(0, 120),
    tel: String(item?.tel || '').slice(0, 40)
  }))
}

function extractText(data) {
  if (data.output_text) return data.output_text

  const parts = []
  for (const output of data.output || []) {
    for (const content of output.content || []) {
      if (content.type === 'output_text' && content.text) {
        parts.push(content.text)
      }
    }
  }
  return parts.join('\n').trim()
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' })
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch (error) {
    return json(400, { error: 'Invalid JSON body' })
  }

  const question = String(payload.question || '').trim()
  if (!question) {
    return json(400, { error: 'question required' })
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return json(400, { error: `question must be ${MAX_QUESTION_LENGTH} characters or less` })
  }

  const rawContext = payload.context
  if (rawContext !== undefined && !Array.isArray(rawContext)) {
    return json(400, { error: 'context는 배열이어야 합니다.' })
  }

  if (Array.isArray(rawContext) && rawContext.length > MAX_CONTEXT_ITEMS) {
    return json(400, { error: `context는 최대 ${MAX_CONTEXT_ITEMS}개만 허용됩니다.` })
  }

  const context = normalizeContext(rawContext)
  if (!process.env.OPENAI_API_KEY) {
    return json(200, {
      answer: `로컬 스텁 응답입니다. Netlify 환경변수 OPENAI_API_KEY가 설정되면 실제 OpenAI API로 답변합니다. 질문: ${question}`
    })
  }

  const input = [
    {
      role: 'system',
      content:
        'You are LocalHub Seoul assistant. Answer in Korean. Use only the provided Seoul public-data context. If the context is insufficient, say that the data is not available. Never invent addresses, phone numbers, or event details.'
    },
    {
      role: 'user',
      content: `질문: ${question}\n\n제공 데이터:\n${JSON.stringify(context, null, 2)}`
    }
  ]

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input,
        max_output_tokens: 500
      })
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('OpenAI request failed', data?.error?.message || response.status)
      return json(502, { error: 'OpenAI 응답을 가져오지 못했습니다.' })
    }

    return json(200, { answer: extractText(data) || '제공된 데이터에서 답변을 찾지 못했습니다.' })
  } catch (error) {
    console.error('Chat function error', error.message)
    return json(500, { error: '챗봇 처리 중 오류가 발생했습니다.' })
  }
}
