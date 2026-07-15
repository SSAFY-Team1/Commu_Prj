# PR Body Draft

## 제목

`chore(team-a): prepare LocalHub scaffold and collaboration docs`

## 요약

- 개발 의뢰서와 최종 기획서를 기준으로 Team A 공통 구조를 정리했습니다.
- 서울 JSON을 `public/data/`에 배치하고 `manifest.json` 및 데이터 로더 기본 helper를 구성했습니다.
- 홈, 지역 정보, 대시보드, 챗봇 기본 흐름이 실제 데이터 기준으로 동작하도록 정리했습니다.
- Team A/B/C 역할, 파일 소유권, PR 기준, QA 체크리스트, WBS를 문서화했습니다.

## 주요 변경

- 공통 UI: Header, Footer, ButtonPrimary, Modal, Spinner
- 화면: HomeView, CategoryView, DashboardView
- 데이터: `public/data/manifest.json`, 서울 JSON 파일, `dataLoader.js`
- 챗봇: `Chatbot.vue`, `chatApi.js`, `netlify/functions/chat.mjs`
- 문서: README, TEAM 문서, 요구사항 추적표, QA 체크리스트, WBS

## 테스트

```bash
npm ci
npm run build
npm run test -- --run
```

PowerShell 정책 문제가 있으면:

```bash
npm.cmd run build
npm.cmd run test -- --run
```

## 주의

- `OPENAI_API_KEY`는 Netlify 환경변수로만 설정합니다.
- 실제 GitHub CODEOWNERS 핸들은 팀 계정에 맞게 교체해야 합니다.
- Team B/C는 각자 브랜치에서 담당 문서를 기준으로 작업합니다.
