export async function sendChat(question, context = {}) {
  const res = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, context })
  })
  if (!res.ok) throw new Error('Network error')
  return res.json()
}
