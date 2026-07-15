# LocalHub Seoul

서울 권역 공공데이터를 기반으로 지역 정보를 탐색하고, 익명 커뮤니티와 챗봇, 데이터 시각화 대시보드를 제공하는 Vue 3 + Vite SPA 프로젝트입니다.

## 기준 문서

- 개발 의뢰서: `02_3일차_팀프로젝트_개발 의뢰서_비전공.pdf`
- 최종 기획서: `LocalHub_서울_실습기획서_최종.md`
- 데이터 스키마/출처: `서울/SCHEMA.md`, `서울/SOURCE.md`
- 테스트 이론: `4일차_보충자료_유닛테스트_실무이론.md`

## 역할

| 팀원 | 브랜치 | 담당 |
|---|---|---|
| Team A | `feature/layout-a` | PM, 공통 UI/UX, 라우터, 배포, 문서, PR 최종 검토 |
| Team B | `feature/dashboard-b` | 서울 JSON 데이터 로더, 정규화, 대시보드 |
| Team C | `feature/community-chatbot-c` | 커뮤니티, 챗봇, Netlify Function |

전체 협업 규칙은 [docs/TEAM_WORKFLOW.md](docs/TEAM_WORKFLOW.md)를 먼저 읽으세요.

## 빠른 시작

```bash
git clone <repo-url>
cd Commu_Prj
npm ci
npm run dev
```

Windows PowerShell 실행 정책 때문에 `npm`이 막히면 아래처럼 실행합니다.

```bash
npm.cmd run dev
npm.cmd run build
npm.cmd run test -- --run
```

Netlify Function 로컬 테스트:

```bash
npx netlify dev
```

## 주요 명령

```bash
npm run dev          # Vite 개발 서버
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run test -- --run # Vitest 1회 실행
```

## 데이터

- 원본 데이터: `서울/`
- 앱 제공 데이터: `public/data/`
- manifest: `public/data/manifest.json`

원본 데이터는 한국관광공사 TourAPI 4.0 기반이며 공공누리 제3유형입니다. 원본 JSON 내용을 직접 수정하지 말고, 앱에서 필요한 변환은 `src/utils/dataLoader.js`에서 처리합니다.

## 환경 변수

프론트엔드에서 OpenAI API 키를 사용하지 않습니다.

| 환경 | 변수 | 위치 |
|---|---|---|
| Netlify 운영 | `OPENAI_API_KEY` | Netlify Site Environment variables |
| 로컬 Functions 테스트 | `OPENAI_API_KEY` | 로컬 `.env` 또는 Netlify CLI 환경 |
| OpenAI 모델 선택 | `OPENAI_MODEL` | 선택 사항 |

`.env`는 커밋하지 않습니다.

## 문서

- [docs/TEAM_WORKFLOW.md](docs/TEAM_WORKFLOW.md): 역할, 브랜치, 파일 소유권
- [docs/TEAM_A_TASKS.md](docs/TEAM_A_TASKS.md): Team A 작업 기준
- [docs/TEAM_B_TASKS.md](docs/TEAM_B_TASKS.md): Team B 작업 기준
- [docs/TEAM_C_TASKS.md](docs/TEAM_C_TASKS.md): Team C 작업 기준
- [docs/REQUIREMENTS_TRACE.md](docs/REQUIREMENTS_TRACE.md): 의뢰서 요구사항 추적표
- [docs/QA_RELEASE_CHECKLIST.md](docs/QA_RELEASE_CHECKLIST.md): 최종 검수 체크리스트
- [docs/CHECKLIST_AND_TESTS.md](docs/CHECKLIST_AND_TESTS.md): 테스트 가이드

## PR 기준

1. 자기 담당 브랜치에서 작업합니다.
2. 담당 파일 외 수정이 필요하면 Team A에게 먼저 공유합니다.
3. PR에는 빌드 결과, 수동 테스트, 스크린샷, 남은 이슈를 적습니다.
4. Team A가 최종 검토 후 병합합니다.
