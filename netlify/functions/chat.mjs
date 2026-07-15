export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const question = (body.question || '').toString()
    const contextItems = Array.isArray(body.context) ? body.context : []

    if (!question || question.trim().length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'question required' }) }
    }

    if (question.length > 2000) {
      return { statusCode: 400, body: JSON.stringify({ error: 'question too long' }) }
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'OpenAI API key not configured' }) }
    }

    // Limit context items and build a short context string
    const maxContext = 5
    const trimmed = contextItems.slice(0, maxContext).map((c, i) => {
      const name = c.name || c.title || ''
      const category = c.category || ''
      const address = c.address || ''
      return `${i+1}. ${name} | ${category} | ${address}`
    }).join('\n')

    const systemPrompt = `You are a helpful assistant. Answer the user's question ONLY using the provided context items. If the information is not present in the context, say you don't know. Do not fabricate addresses, phone numbers, or dates.`

    const userPrompt = `QUESTION:\n${question}\n\nCONTEXT:\n${trimmed}`

    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.0,
      max_tokens: 500
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const text = await res.text()
      return { statusCode: 502, body: JSON.stringify({ error: 'OpenAI error', details: text }) }
    }

    const data = await res.json()
    const answer = data?.choices?.[0]?.message?.content || null

    return { statusCode: 200, body: JSON.stringify({ answer }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
