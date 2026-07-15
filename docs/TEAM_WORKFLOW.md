# 팀 협업 및 충돌 방지 가이드

## 역할 분담

| 팀원 | 역할 | 브랜치 | 주요 책임 |
|---|---|---|---|
| Team A | 팀장, PM, 공통 UI/UX, 배포, PR 최종 검토 | `feature/layout-a` | 공통 구조, 디자인 기준, 라우터, 배포, 문서, 최종 통합 |
| Team B | 데이터 시각화 대시보드 | `feature/dashboard-b` | 서울 JSON 로딩, 데이터 정규화, 대시보드 차트 |
| Team C | 커뮤니티 및 챗봇 | `feature/community-chatbot-c` | localStorage 게시판, 챗봇 UI, Netlify Function, OpenAI 연동 |

## 파일 소유권

| 영역 | 담당 | 파일 |
|---|---|---|
| 공통 앱 구조 | A | `src/App.vue`, `src/router/index.js`, `src/main.js` |
| 공통 UI | A | `src/components/Header.vue`, `Footer.vue`, `ButtonPrimary.vue`, `Modal.vue`, `Spinner.vue` |
| 스타일/메타 | A | `src/assets/tailwind.css`, `tailwind.config.cjs`, `index.html` |
| 홈/카테고리 기본 화면 | A | `src/views/HomeView.vue`, `src/views/CategoryView.vue` |
| 데이터 로더 | B | `src/utils/dataLoader.js` |
| 대시보드 | B | `src/views/DashboardView.vue`, `src/components/KpiCard.vue` |
| 데이터 파일 | B | `public/data/` |
| 커뮤니티 | C | `src/views/CommunityView.vue`, `src/utils/localStorage.js` |
| 챗봇 | C | `src/components/Chatbot.vue`, `src/services/chatApi.js`, `netlify/functions/chat.mjs` |
| 배포/문서 | A | `netlify.toml`, `README.md`, `docs/`, `.github/` |

## 공통 변경 규칙

- 담당자가 아닌 파일은 수정하지 않는다.
- 꼭 수정해야 하면 작업 전에 팀 채팅에 공유하고 Team A 승인을 받는다.
- `package.json`, `package-lock.json`, `netlify.toml`, 라우터는 충돌 위험이 높으므로 Team A만 수정한다.
- 공통 컴포넌트가 필요하면 Team A에게 요청한다.
- 각 팀은 자기 화면 내부 스타일만 조정한다.
- `dataLoader.js`의 helper 이름은 Team B/C 연동 계약이므로 변경 시 Team A 승인 후 PR 본문에 명시한다.

## 브랜치 작업 흐름

1. 최신 main 가져오기

```bash
git fetch origin
git switch main
git pull origin main
```

2. 자기 브랜치 생성

```bash
git switch -c feature/dashboard-b
```

또는

```bash
git switch -c feature/community-chatbot-c
```

3. 작업 중 주기적으로 최신화

```bash
git fetch origin
git rebase origin/main
```

4. 빌드 확인

```bash
npm run build
```

Windows PowerShell 실행 정책 문제가 있으면:

```bash
npm.cmd run build
```

5. 푸시

```bash
git push -u origin feature/dashboard-b
```

또는

```bash
git push -u origin feature/community-chatbot-c
```

6. PR 생성 후 Team A에게 리뷰 요청

## PR 작성 기준

PR에는 아래 내용을 반드시 포함한다.

- 작업 요약
- 수정한 주요 파일
- 담당 범위 밖 파일 수정 여부
- 실행한 명령어와 결과
- 수동 테스트 절차
- 화면 캡처
- 남은 이슈

## 머지 순서

권장 머지 순서:

1. Team A 공통 UI/구조
2. Team B 데이터/대시보드
3. Team C 커뮤니티/챗봇
4. Team A 최종 통합/배포

이유:

- Team B의 `dataLoader.js` helper가 먼저 정해져야 Team C 챗봇 context 선별이 안정적이다.
- Team C는 Team B helper를 읽기만 하고, 수정하지 않는다.
- Team A는 마지막에 공통 UI와 발표 품질을 맞춘다.

## 충돌 위험 파일

아래 파일은 한 명만 수정한다.

- `src/router/index.js`: Team A
- `package.json`: Team A
- `package-lock.json`: Team A
- `netlify.toml`: Team A
- `src/assets/tailwind.css`: Team A
- `src/utils/dataLoader.js`: Team B
- `src/utils/localStorage.js`: Team C
- `netlify/functions/chat.mjs`: Team C

## 최종 QA 기준

- 홈, 카테고리, 대시보드, 커뮤니티, 챗봇 화면 확인
- 전체 서울 JSON 로딩 확인
- 게시글 작성/검색/수정/삭제 확인
- 잘못된 비밀번호 검증 확인
- 챗봇 정상 응답/오류 응답 확인
- 모바일 화면 확인
- Netlify Production URL 확인
- 코드와 번들에 `OPENAI_API_KEY`, `sk-` 키가 없는지 확인
