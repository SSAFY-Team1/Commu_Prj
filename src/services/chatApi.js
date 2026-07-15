const MAX_QUESTION_LENGTH = 300
const MAX_CONTEXT_ITEMS = 5

function normalizeContext(context) {
  if (!Array.isArray(context)) return []
  return context.slice(0, MAX_CONTEXT_ITEMS).map((item) => ({
    id: String(item?.id || ''),
    title: String(item?.title || item?.name || ''),
    category: String(item?.category || ''),
    address: String(item?.address || ''),
    tel: String(item?.tel || '')
  }))
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

  return data
}
