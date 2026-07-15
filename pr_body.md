PR 제목:
chore(scaffold): add scaffold, docs and deps bump (Team A)

PR 본문:
- 요약:
  - 프로젝트 최소 스캐폴드 추가 및 문서 정리(`docs/*`).
  - `tailwindcss` 및 `netlify-cli` devDependencies 버전 업데이트 및 `package-lock.json` 추가.
  - Team A(레이아웃·공통 UI·배포) 작업 준비 완료.

- 변경 주요 항목:
  - `src/` (앱 엔트리, 컴포넌트, 뷰)
  - `public/data/sample.json`
  - `netlify/functions/chat.mjs` (스텁)
  - `docs/` (`BOOTSTRAP.md`, `TEAM_A_TASKS.md`, 등)
  - `package.json`, `package-lock.json` (의존성 업데이트)

- 테스트 방법 (로컬):
  1. 브랜치 체크아웃:
     git fetch origin
     git switch feature/layout-a
  2. 일관된 설치:
     npm ci
  3. 개발 서버 확인:
     npm run dev
  4. 빌드 확인:
     npm run build
  5. (선택) Netlify 함수 로컬 테스트:
     npx netlify dev
  6. UI/기능 수동검증:
     - 홈, 대시보드, 커뮤니티 기본 화면 렌더링 확인
     - 게시판(작성/수정/삭제) 기본 동작 확인
     - 챗봇 UI가 함수 스텁에 요청을 보내 200 응답 받는지 확인

- 주의사항:
  - `OPENAI_API_KEY`는 프로덕션에서 Netlify 환경변수로만 설정하세요. 로컬 `.env`는 절대 커밋하지 마세요.
  - 의존성(특히 `package.json`/`package-lock.json`) 변경은 모든 팀원에게 영향이 큽니다. PR 머지 전에 빌드/테스트 확인 및 리뷰 필수.
  - 취약점 경고가 있을 수 있으니 필요한 경우 `npm audit`로 검토합니다.

- 요청 리뷰어:
  - CODEOWNERS에 지정된 자동 리뷰어 또는 `@team-a`, `@team-b`에게 리뷰 요청

- 머지 방식 권장:
  - `Squash and merge` (머지 전 CI/로컬 빌드 통과 확인)

- 머지 후 팀원 안내(모든 팀원):
  git fetch origin
  git switch main
  git pull origin main
  npm ci

- 추가 메모:
  - 문제가 발생하면 바로 이 PR에 코멘트 또는 이슈 생성하세요. Team A가 우선 대응합니다.
