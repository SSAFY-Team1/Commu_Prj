# Team C — Community & Chatbot Tasks

Goal: Harden community features (localStorage CRUD, search, likes/bookmarks) and implement safe Netlify Function integration with OpenAI for the chatbot.

Priority: High (chatbot and community are Must features)

## Quick start
1. Clone repository and create branch `feature/community-<initial>`
2. `npm ci` and `npm run dev`
3. Test existing community UI at `/community` and Chatbot floating button

## Community tasks
- localStorage schema
  - Use `src/utils/localStorage.js` as canonical helper
  - Schema for posts: `{ id, title, content, password, created, category?, views?, likes?, bookmarks? }`
- Features to add
  - Search within posts by title/content
  - View count increment on view
  - Like/bookmark toggles (persist in localStorage)
  - Optional: simple sorting/filtering
- Security/validation
  - Ensure password required for edit/delete
  - Avoid XSS: sanitize displayed content (or use text-only insertion)

## Chatbot tasks
- Netlify Function
  - Implement `netlify/functions/chat.mjs` to call OpenAI with `process.env.OPENAI_API_KEY`
  - Validate request body: allow only POST, require `question` and optional `context` array
  - Build system prompt that restricts answers to provided data (e.g., "Answer only based on the following dataset...")
  - Limit tokens and context length; trim context to N items

- Frontend contract
  - `sendChat(question, context)` should POST `{ question, context }`
  - Context items should be small: `{ id, name, category, address }`

- Cost & safety control
  - Enforce maximum question length
  - Enforce maximum context items (e.g., 5)
  - Catch OpenAI errors and return friendly messages

## Files to modify / touch
- `netlify/functions/chat.mjs` (implement OpenAI call)
- `src/components/Chatbot.vue` (fine-tune UI/UX)
- `src/services/chatApi.js` (ensure proper error handling)

## PR checklist
- [ ] Function uses `process.env.OPENAI_API_KEY` and does not log key
- [ ] Error cases tested (invalid input, OpenAI errors)
- [ ] Chatbot displays loading, errors, and displays answers correctly

---
