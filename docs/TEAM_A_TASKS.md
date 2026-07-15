# Team A 작업 지시서 — PM, 공통 UI, PR 최종 검토

담당자: 팀원 A  
브랜치: `feature/layout-a`  
역할: 팀장, PM, 공통 UI/UX, 배포, PR 최종 검토

## 목표

팀원 B와 C가 기능 구현에 집중할 수 있도록 공통 구조와 디자인 기준을 잡고, PR 충돌을 관리하며, 최종 산출물과 배포 품질을 책임진다.

## Team A 책임

- 프로젝트 범위 관리
- 공통 레이아웃과 UI/UX 기준 수립
- Header, Footer, 공통 버튼, 모달 등 공통 컴포넌트 관리
- 라우터와 배포 설정 관리
- 팀원 B/C PR 최종 리뷰
- Netlify 배포와 환경변수 확인
- README, WBS, 기능 명세서, 발표자료 통합
- 의뢰서와 최종 기획서 차이를 발표자료에 설명

## 담당 파일

Team A가 주로 수정한다.

- `src/App.vue`
- `src/router/index.js`
- `src/views/HomeView.vue`
- `src/views/CategoryView.vue`
- `src/components/Header.vue`
- `src/components/Footer.vue`
- `src/components/ButtonPrimary.vue`
- `src/components/Modal.vue`
- `src/components/Spinner.vue`
- `src/assets/tailwind.css`
- `tailwind.config.cjs`
- `index.html`
- `netlify.toml`
- `README.md`
- `docs/`
- `.github/`

## Team A가 직접 수정하지 않는 영역

Team B/C 브랜치 작업 중에는 아래 파일을 직접 수정하지 않는다. 필요하면 PR 리뷰 코멘트나 별도 합의 후 수정한다.

Team B 담당:

- `src/utils/dataLoader.js`
- `src/views/DashboardView.vue`
- `src/components/KpiCard.vue`
- `public/data/`

Team C 담당:

- `src/views/CommunityView.vue`
- `src/components/Chatbot.vue`
- `src/services/chatApi.js`
- `src/utils/localStorage.js`
- `netlify/functions/chat.mjs`

## UI/UX 가이드라인

### 전체 톤

- 관광/지역 정보 서비스답게 밝고 신뢰감 있는 톤을 유지한다.
- 과한 장식보다 정보 탐색, 검색, 비교가 쉬운 화면을 우선한다.
- 모바일에서도 주요 기능이 가려지지 않게 한다.

### 레이아웃

- 상단 Header에는 홈, 대시보드, 커뮤니티 주요 이동 링크를 유지한다.
- 페이지 본문은 공통 max-width와 padding을 유지한다.
- 각 팀은 자기 화면 내부 레이아웃만 조정한다.
- 공통 레이아웃 변경은 Team A만 진행한다.

### 컴포넌트

- 주요 CTA는 `ButtonPrimary.vue`를 우선 사용한다.
- 모달이 필요하면 `Modal.vue`를 사용하거나 Team A에게 확장을 요청한다.
- 로딩 표시는 `Spinner.vue`를 우선 사용한다.
- 새 공통 컴포넌트가 필요하면 Team A가 생성한다.

### 접근성

- 버튼은 실제 `button` 요소를 사용한다.
- 입력창에는 placeholder만 의존하지 말고 필요한 경우 label 또는 aria-label을 둔다.
- 이미지에는 alt를 둔다.
- 키보드로 주요 기능을 사용할 수 있게 한다.

### 데이터 표시

- 주소, 이미지, 전화번호가 없을 때 빈 화면이 나오지 않게 한다.
- localStorage 기반 통계는 “현재 브라우저 기준”임을 명확히 한다.
- 한국관광공사 TourAPI 출처와 공공누리 제3유형 라이선스를 표시한다.

## PR 리뷰 기준

Team A는 PR에서 아래를 확인한다.

- 담당 범위 밖 파일을 수정하지 않았는가
- `npm run build`가 성공했는가
- `npm run test -- --run`이 성공했는가
- 화면이 모바일에서 깨지지 않는가
- OpenAI 키가 노출되지 않았는가
- 전체 JSON을 챗봇 요청에 통째로 보내지 않는가
- 빈 데이터/오류 상태가 처리되는가
- PR 본문에 테스트 방법이 적혀 있는가

## 최종 통합 순서

1. Team A 공통 UI/라우터/배포 기준 확정
2. Team B 대시보드 PR 리뷰 및 머지
3. Team C 커뮤니티/챗봇 PR 리뷰 및 머지
4. 충돌 해결 및 통합 QA
5. Netlify 환경변수 등록
6. Production 배포
7. 기능 명세서, WBS, 발표자료 최종 정리

## 완료 기준

- Team B/C PR이 main에 안정적으로 병합됨
- Netlify Production URL에서 홈/대시보드/커뮤니티/챗봇이 동작함
- README와 발표자료에 환경변수, 출처, 기능 범위가 명시됨
- 제출 산출물 전체가 준비됨
