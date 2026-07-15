# LocalHub — Seoul (scaffold)

이 저장소는 `LocalHub 서울`의 최소 동작 스캐폴드입니다. 팀원들이 빠르게 clone → 개발 브랜치로 작업을 시작하도록 설계되어 있습니다.

## 빠른 시작
```bash
git clone <repo-url>
cd <repo-folder>
npm install
npm run dev
# 또는 로컬 Netlify 함수 테스트
npx netlify dev
```

## Tailwind
Tailwind 사용 가이드는 `docs/TAILWIND_GUIDE.md`를 참고하세요.

## Netlify 함수(챗봇)
- 로컬 테스트: `npx netlify dev` 사용
- 프로덕션: Netlify Site의 `OPENAI_API_KEY` 환경변수만 사용하세요. `.env`를 커밋하지 마세요.

## 파일 구조 (요약)
- `src/` 앱 소스
- `public/data/` 제공 JSON 샘플
- `netlify/functions/` 서버리스 함수
- `docs/` 프로젝트 운영 문서

## 주의
- OpenAI 키를 프론트엔드에 절대 저장하지 마세요.
- 배포 전 `README`와 `기능명세서`를 확인하세요.

## Team B & Team C Onboarding (quick)
These notes help Team B (Data & Dashboard) and Team C (Community & Chatbot) start work after cloning.

1) Clone & branch
```bash
git clone https://github.com/SSAFY-Team1/Commu_Prj.git
cd Commu_Prj
git fetch origin
git switch -c feature/<your-task>-<initial>
```

2) Install & run
```bash
npm ci
npm run dev
# To run functions locally
npx netlify dev
```

3) Data files
- Look in `public/data/` — provided sample files include `서울_관광지.json`, `서울_문화시설.json`, etc.
- Team B goal: implement `src/utils/dataLoader.js` to parse all JSONs, normalize fields (`mapx`/`mapy` to numbers), and provide aggregation helpers.

4) PR rules
- Create small feature branches and open PRs against `main`.
- Include `How to test` steps in PR body (local `npm ci`, `npm run build`).

5) Communication
- Use `docs/TEAM_B_TASKS.md` and `docs/TEAM_C_TASKS.md` for specific task lists and check them off as you complete.

---