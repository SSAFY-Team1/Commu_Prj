# Bootstrap 가이드 — 최소 스캐폴드와 빠른 시작 (LocalHub)

목표: 한 명이 60–90분 안에 동작하는 최소 스캐폴드를 만들고, 나머지 팀원은 이를 clone하여 병렬로 작업을 시작할 수 있도록 합니다.

## 포함할 최소 파일(스캐폴드)
- `package.json`, `README.md`, `.gitignore`
- `netlify.toml`
- `src/main.js` (앱 엔트리)
- `src/App.vue`
- `src/router/index.js`
- `src/views/` 폴더: `HomeView.vue`, `CommunityView.vue`, `DashboardView.vue`, `CategoryView.vue` (빈 템플릿)
- `src/components/` 폴더: `Header.vue`, `Footer.vue`, `Chatbot.vue` (스텁)
- `src/services/chatApi.js` (함수 호출 스텁)
- `src/utils/dataLoader.js`, `src/utils/localStorage.js` (기본 함수 스텁)
- `netlify/functions/chat.mjs` (POST 스텁, 200 JSON 반환)
- `public/data/sample.json` (샘플 5건)

## 빠른 설치 · 실행
1. 클론
```bash
git clone <repo-url>
cd <repo-folder>
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
# 또는 로컬 함수 테스트를 위해
npx netlify dev
```

4. 빌드
```bash
npm run build
```

## Netlify 로컬 함수 테스트
- 로컬에서 Netlify Functions를 테스트하려면 `npx netlify dev` 사용
- 로컬에서 `OPENAI_API_KEY`가 필요하면 `.env`에 넣어 실험하되 **절대** 커밋하지 마세요.

## 파일 트리 예시
```
project/
├─ src/
│  ├─ main.js
│  ├─ App.vue
│  ├─ router/
│  │  └─ index.js
│  ├─ views/
│  │  ├─ HomeView.vue
│  │  ├─ CommunityView.vue
│  │  └─ DashboardView.vue
│  ├─ components/
│  │  ├─ Header.vue
│  │  └─ Chatbot.vue
│  └─ utils/
│     ├─ dataLoader.js
│     └─ localStorage.js
├─ netlify/
│  └─ functions/
│     └─ chat.mjs
├─ public/
│  └─ data/
│     └─ sample.json
├─ package.json
└─ netlify.toml
```

## 권장 npm 스크립트 (package.json)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

## 빠른 개발 팁
- 공통 컴포넌트(버튼/모달)는 부트스트랩에서 먼저 스텁으로 만들어 두고 팀원들이 재사용하도록 하세요.
- 챗봇은 처음에 함수 스텁(고정 응답)으로 배포하면 프론트 개발을 병렬로 진행할 수 있습니다.
- `public/data/sample.json`에 작은 샘플 데이터를 넣어 UI 개발·데이터 로직을 빠르게 확인하세요.

---
더 필요한 스캐폴드(예: 실제 코드 템플릿)를 원하시면 알려주세요. 제가 바로 생성하겠습니다.