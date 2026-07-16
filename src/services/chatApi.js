const MAX_QUESTION_LENGTH = 300
const MAX_CONTEXT_ITEMS = 12

function normalizeContext(context) {
  if (!Array.isArray(context)) return []
  return context.slice(0, MAX_CONTEXT_ITEMS).map((item) => ({
    type: String(item?.type || 'place'),
    id: String(item?.id || ''),
    title: String(item?.title || item?.name || ''),
    category: String(item?.category || ''),
    district: String(item?.district || ''),
    address: String(item?.address || ''),
    tel: String(item?.tel || ''),
    eventStartDate: String(item?.eventStartDate || ''),
    eventEndDate: String(item?.eventEndDate || ''),
    eventPlace: String(item?.eventPlace || ''),
    playtime: String(item?.playtime || ''),
    fee: String(item?.fee || ''),
    program: String(item?.program || '').slice(0, 600),
    description: String(item?.description || '').slice(0, 300),
    content: String(item?.content || '').slice(0, 300),
    tags: Array.isArray(item?.tags) ? item.tags.slice(0, 5).map(String) : [],
    views: Number(item?.views || 0),
    likes: Number(item?.likes || 0),
    bookmarks: Number(item?.bookmarks || 0)
  }))
}

function fallbackAnswer(question, context) {
  if (!context.length) {
    return `제공된 서울 공공데이터와 커뮤니티 글에서 "${question}"와 관련된 항목을 찾지 못했습니다. 자치구나 카테고리를 조금 더 구체적으로 입력해 주세요.`
  }

  const lines = context.slice(0, 5).map((item, index) => {
    if (item.type === 'post') {
      return `${index + 1}. [커뮤니티] ${item.title} - ${item.district || '자치구 미상'} / ${item.category || '분류 없음'}`
    }

    const date = item.eventStartDate || item.eventEndDate ? ` / ${item.eventStartDate || '?'}~${item.eventEndDate || '?'}` : ''
    const place = item.eventPlace ? ` / ${item.eventPlace}` : ''
    const tel = item.tel && item.tel !== '전화번호 정보 없음' ? ` / 문의 ${item.tel}` : ''
    return `${index + 1}. ${item.title} - ${item.category}${item.district ? ` / ${item.district}` : ''}${date}${place}${tel}`
  })

  return `현재 OpenAI 키가 설정되지 않아 데이터 검색 결과를 먼저 보여드립니다.\n${lines.join('\n')}\n\nOpenAI 답변을 사용하려면 로컬 또는 Netlify 환경변수에 OPENAI_API_KEY를 설정하세요.`
}

export async function sendChat(question, context = []) {
  const trimmedQuestion = String(question || '').trim()
  if (!trimmedQuestion) {
    throw new Error('질문을 입력하세요.')
  }
  if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
    throw new Error(`질문은 ${MAX_QUESTION_LENGTH}자 이내여야 합니다.`)
  }

  const normalizedContext = normalizeContext(context)

  const res = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: trimmedQuestion, context: normalizedContext })
  })

  let data = null
  let text = null

  try {
    data = await res.json()
  } catch (parseError) {
    text = await res.text().catch(() => '')
  }

  if (!res.ok) {
    const message = data?.error || text || `챗봇 요청에 실패했습니다. status=${res.status}`
    throw new Error(message)
  }

  return data?.answer ? data : { answer: fallbackAnswer(trimmedQuestion, normalizedContext), source: 'local-fallback' }
}
