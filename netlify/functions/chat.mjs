const MAX_QUESTION_LENGTH = 300
const MAX_CONTEXT_ITEMS = 12
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'
const DEFAULT_MODEL = 'gpt-5-mini'
const FALLBACK_MODELS = ['gpt-4.1-mini', 'gpt-4o-mini']

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
    type: String(item?.type || 'place').slice(0, 20),
    id: String(item?.id || '').slice(0, 80),
    title: String(item?.title || item?.name || '').slice(0, 80),
    category: String(item?.category || '').slice(0, 40),
    district: String(item?.district || '').slice(0, 40),
    address: String(item?.address || '').slice(0, 120),
    tel: String(item?.tel || '').slice(0, 40),
    eventStartDate: String(item?.eventStartDate || '').slice(0, 20),
    eventEndDate: String(item?.eventEndDate || '').slice(0, 20),
    eventPlace: String(item?.eventPlace || '').slice(0, 120),
    playtime: String(item?.playtime || '').slice(0, 120),
    fee: String(item?.fee || '').slice(0, 120),
    program: String(item?.program || '').slice(0, 600),
    description: String(item?.description || '').slice(0, 300),
    content: String(item?.content || '').slice(0, 300),
    tags: Array.isArray(item?.tags) ? item.tags.slice(0, 5).map((tag) => String(tag).slice(0, 30)) : [],
    views: Number(item?.views || 0),
    likes: Number(item?.likes || 0),
    bookmarks: Number(item?.bookmarks || 0)
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

function fallbackAnswer(question, context, reason = '') {
  if (!context.length) {
    return `현재 제공 데이터에서 "${question}"와 직접 관련된 항목을 찾지 못했습니다. 지역명, 카테고리, 장소명을 조금 더 구체적으로 입력해 주세요.`
  }

  const items = context
    .map((item, index) => {
      if (item.type === 'post') {
        const postDetails = [item.district, item.category, item.tags.length ? `태그 ${item.tags.join(', ')}` : '']
          .filter(Boolean)
          .join(' · ')
        return `${index + 1}. [커뮤니티] ${item.title}${postDetails ? ` (${postDetails})` : ''}`
      }

      const date = item.eventStartDate || item.eventEndDate ? `${item.eventStartDate || '?'}~${item.eventEndDate || '?'}` : ''
      const details = [item.category, item.district, date, item.eventPlace || item.address, item.tel ? `문의 ${item.tel}` : '']
        .filter(Boolean)
        .join(' · ')
      return `${index + 1}. ${item.title}${details ? ` (${details})` : ''}`
    })
    .join('\n')

  const suffix = reason ? '\n\n현재 AI 응답 생성이 원활하지 않아 제공 데이터 기준으로 우선 안내합니다.' : ''
  return `질문과 관련된 LocalHub 제공 데이터는 다음과 같습니다.\n${items}${suffix}`
}

async function requestOpenAI(input) {
  const models = Array.from(new Set([DEFAULT_MODEL, ...FALLBACK_MODELS]))
  let lastError = null

  for (const model of models) {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        input,
        max_output_tokens: 500
      })
    })

    const data = await response.json().catch(() => ({}))
    if (response.ok) return data

    lastError = {
      status: response.status,
      message: data?.error?.message || `OpenAI status ${response.status}`
    }

    if (![400, 404].includes(response.status)) break
  }

  throw new Error(lastError?.message || 'OpenAI request failed')
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
        'You are LocalHub Seoul assistant. Answer in Korean. Use only the provided Seoul public JSON and localStorage community context. If the context is insufficient, say that the provided data is insufficient. Never invent addresses, phone numbers, dates, fees, programs, or event details. Prefer concise bullet lists for recommendations.'
    },
    {
      role: 'user',
      content: `질문: ${question}\n\n제공 데이터:\n${JSON.stringify(context, null, 2)}`
    }
  ]

  try {
    const data = await requestOpenAI(input)
    return json(200, { answer: extractText(data) || '제공된 데이터에서 답변을 찾지 못했습니다.' })
  } catch (error) {
    console.error('Chat function error', error.message)
    return json(200, { answer: fallbackAnswer(question, context, error.message) })
  }
}
