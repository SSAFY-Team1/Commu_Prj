# Team A (레이아웃·공통 UI·배포) 작업 목록

목표: 1일 내에 레이아웃과 배포 준비를 완료하고 다른 팀원이 안정적으로 병렬 개발을 시작할 수 있도록 공통 컴포넌트·스타일을 제공합니다.

우선순위: 빠르게 통합 가능한 작은 단위로 작업을 쪼개세요.

---

## 0) 준비 (30분)
- 브랜치: `feature/layout-a` 생성 및 사용
- `npm install` 실행(문제 발생 시 `docs/BOOTSTRAP.md`의 npm Troubleshooting 참고)
- `npm run dev`로 앱 실행 확인

## 1) 공통 레이아웃 (1.5시간)
- 파일:
  - `src/App.vue` (레이아웃, 공통 컨테이너)
  - `src/components/Header.vue` (네비게이션)
  - `src/components/Footer.vue`
- 작업:
  - 헤더: 브랜드 텍스트, 주요 링크(홈/대시보드/커뮤니티)
  - 반응형 레이아웃: Tailwind로 색상·간격·그리드 설정
  - 공통 컨테이너(max-width, padding) 정의

## 2) 공통 컴포넌트 제공 (1.5시간)
- 파일(생성):
  - `src/components/ButtonPrimary.vue` (재사용 버튼)
  - `src/components/Modal.vue` (재사용 모달)
- 작업:
  - `@apply` 또는 Tailwind 클래스로 일관된 스타일을 제공
  - 문서(README 또는 컴포넌트 상단 주석)에 사용법 간단 명시

## 3) Tailwind 설정 확인 (30분)
- `tailwind.config.cjs`의 `content`에 src 경로가 들어있는지 확인
- `src/assets/tailwind.css`가 `src/main.js`에서 import 되었는지 확인

## 4) Netlify 배포 준비 (1시간)
- `netlify.toml` 검토(빌드·publish·functions 경로)
- 로컬 함수 테스트: `npx netlify dev` (환경변수 `.env` 필요 시 로컬에만 저장)
- Netlify 사이트에 `OPENAI_API_KEY` 등록(프로덕션 환경)

## 5) 문서화·PR (30분)
- 변경 목록 요약(한 줄씩) 작성
- PR 템플릿을 채워 작은 PR을 생성
- PR 체크리스트: 빌드 성공, UI 스크린샷 첨부, 리뷰어 요청

---

## 소스 변경 권장 규칙(충돌 방지)
- 공통파일(라우터, package.json, netlify.toml)은 변경 전 팀 합의
- 작은 단위로 커밋: 한 기능/컴포넌트당 3-5 커밋 권장
- 브랜치 작업 전 항상 최신화: `git fetch origin && git rebase origin/main`

---

## 예시 커밋 메시지
- `feat(layout): add responsive header (A)`
- `chore(styles): add ButtonPrimary component (A)`

---

필요하면 제가 `ButtonPrimary.vue`와 `Modal.vue`의 간단 템플릿을 생성해 드리겠습니다. 원하시면 생성하세요.