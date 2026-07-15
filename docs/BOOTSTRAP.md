# Bootstrap 가이드 — 빠른 개발 온보딩 & Team A 체크리스트

목표: Team A(레이아웃·공통 UI·배포 담당)가 로컬에서 빠르게 개발 환경을 구성하고, 다른 팀원과 충돌 없이 작업을 시작하도록 돕습니다.

## 빠른 온보딩 (Team A)
1. 최신 main 가져오기

```bash
git fetch origin
git switch main
git pull origin main
```

2. 브랜치 생성(Team A 작업용)

```bash
git switch -c feature/layout-a
```

3. 의존성 설치

```bash
npm install
```

설치 문제(예: ETARGET)는 `package.json`의 devDependencies 버전 불일치가 원인일 수 있습니다. 해결 팁:

- `npm view <package> version`로 사용 가능한 최신 버전 확인
- `npm install --save-dev <pkg>@latest`로 버전 업그레이드
- 캐시 문제일 때: `npm cache clean --force`

4. 개발 서버 실행

```bash
npm run dev
```

로컬 Netlify Functions 테스트(선택):

```bash
npx netlify dev
```

> 주의: 로컬에서 `OPENAI_API_KEY`가 필요하면 `.env`에만 넣고 절대 커밋하지 마세요.

## npm 설치 자주 발생 에러와 해결 (요약)
- ETARGET / No matching version: 패키지 버전 명시가 레지스트리에 없을 때 발생. `npm view <pkg> versions --json`로 버전 목록 확인 후 `package.json` 수정.
- ERESOLVE / peer deps 충돌: `npm install --legacy-peer-deps` 시도.
- 네트워크/레지스트리 문제: `npm config set registry https://registry.npmjs.org/` 후 재시도.

## Team A 우선 작업 목록 (간단)
- 레이아웃: `src/App.vue`, `src/components/Header.vue`, `src/components/Footer.vue` 스타일 정리
- 반응형: Tailwind 클래스로 모바일 대응 검증 (`src/assets/tailwind.css` 임포트 확인)
- 공통 컴포넌트(버튼, 모달) 스텁 제공 — 다른 팀원이 재사용
- Netlify: `netlify.toml` 검토, 배포 시 `OPENAI_API_KEY` 등록

## 체크리스트 (머지 전)
- [ ] `npm run dev`가 에러 없이 실행된다
- [ ] 공통 컴포넌트(버튼/모달)가 재사용 가능하도록 export됨
- [ ] Tailwind 빌드 문제가 없고 스타일이 적용됨
- [ ] `netlify/functions/chat.mjs` 스텁이 정상 동작
- [ ] 변경사항은 `feature/layout-a`에서 PR로 제출(최소 1명 리뷰)

---
필요하시면 제가 Team A용 PR 템플릿과 초안 변경(예: 헤더 색상, 버튼 스타일)까지 만들어 드리겠습니다.