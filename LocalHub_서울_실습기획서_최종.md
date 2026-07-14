# LocalHub 서울 프로젝트 실습기획서 — 최종안

- 작성 기준일: 2026-07-14
- 납기: 2026-07-16(목) 15:00
- 선정 권역: 서울
- 프론트엔드: Vue.js 3 + Vite SPA
- 저장 방식: 제공 JSON + 브라우저 `localStorage`
- 배포: Netlify
- 챗봇: **Vue → Netlify Functions → OpenAI API**
- 1순위 선택기능: 데이터 시각화 대시보드
- 예비 기능: 커뮤니티 게시판 추가기능, 축제 캘린더
- 허용 AI 개발 도구: VSCode Copilot + OpenAI API만 사용

---

## 1. 최종 변경사항

RFP 원문은 Vue 프론트엔드에서 OpenAI API를 직접 호출하고 `VITE_` 환경변수를 사용하는 구조를 제시한다. 그러나 최종 구현안에서는 Netlify 배포 시 키 처리와 빌드 문제를 방지하고 브라우저 노출을 차단하기 위해 다음 구조로 변경한다.

> 사용자 → Vue 챗봇 UI → `/.netlify/functions/chat` → Netlify Function → OpenAI API

핵심 원칙은 다음과 같다.

1. 프론트엔드에서 `VITE_OPENAI_API_KEY`를 사용하지 않는다.
2. 운영 키는 Netlify 환경변수 `OPENAI_API_KEY`에만 등록한다.
3. Vue는 OpenAI API를 직접 호출하지 않고 Netlify Function만 호출한다.
4. Git 저장소, `.env`, 정적 JS 번들, 브라우저 Network 응답에 실제 키를 포함하지 않는다.
5. Netlify Function은 별도 상시 백엔드나 데이터 저장소가 아니라 OpenAI 요청 중계용 서버리스 함수 1개로 제한한다.

> 이 방식은 RFP의 ‘프론트엔드 직접 호출’ 문구와 다르므로, 기능 명세서와 발표에서 **Netlify 배포 안정성 및 API 키 비노출을 위한 배포 보완 결정**이라고 명시한다.

---

## 2. 프로젝트 목표

서울 관광·문화·축제·숙박·쇼핑 등 지역 정보를 한곳에서 검색하고, 익명 게시판에서 개인 경험을 기록하며, 자연어 챗봇과 시각화 대시보드로 정보를 빠르게 파악할 수 있는 LocalHub MVP를 3일 안에 완성한다.

### 타깃 사용자

- 서울을 방문하는 관광객
- 서울 시민
- 서울 관광지·문화시설·축제 정보를 한곳에서 확인하려는 사용자

### 성공 지표

- 서울 제공 JSON 정상 로딩·검색
- 익명 게시판 CRUD 정상 동작
- 비밀번호 기반 수정·삭제 검증 정상 동작
- Netlify Functions 챗봇 정상 응답
- OpenAI API 키 브라우저 비노출
- Chart.js 데이터 시각화 대시보드 구현
- Netlify Production URL에서 모바일 포함 정상 동작
- 필수 산출물 전체 제출

---

## 3. 요구사항 분석

| 구분 | 항목 | 최종 구현 내용 | 근거·판단 |
|---|---|---|---|
| Must | 서울 권역 데이터 | 제공된 서울 JSON을 Vue에서 불러와 카테고리 목록·상세·검색 제공 | RFP II-2, III-1 |
| Must | 익명 커뮤니티 | 회원가입·로그인 없이 게시글 사용 | RFP III-2-가 |
| Must | CRUD | 목록, 상세, 작성, 수정, 삭제 구현 | RFP III-2-다 |
| Must | localStorage | 게시글과 수정용 비밀번호를 브라우저에 저장 | RFP III-2-나 |
| Must | 비밀번호 검증 | 수정·삭제 시 저장된 비밀번호와 프론트엔드에서 비교 | 교육 목적 설계 |
| Must | LLM 챗봇 | Vue가 Netlify Function을 호출하고 Function이 OpenAI API 호출 | RFP III-3 + 배포 보완 |
| Must | 챗봇 UI | 플로팅 버튼, 대화 히스토리, 로딩·오류·재시도, 모바일 대응 | RFP III-3-다 |
| Must | Vue SPA | Vue.js 3 + Vite + Router 기반 정적 SPA | RFP III-4 |
| Must | Netlify 배포 | SPA와 `netlify/functions`를 Git 연동으로 통합 배포 | RFP III-5 |
| Must | 산출물 | Git URL, Netlify URL, 기능 명세서, WBS, 발표자료 | RFP IV 참고1 |
| Should | 데이터 시각화 | Chart.js로 콘텐츠·게시글 통계 시각화 | 선택기능 1순위 |
| Could | 게시판 추가기능 | 검색, 조회수, 좋아요, 북마크 | 예비 1 |
| Could | 축제 캘린더 | 날짜 필드가 확인될 때 월·목록형 일정 제공 | 예비 2 |
| Won’t | 지도·경로 | 지도 API·경로 계산 범위가 커 제외 | 3일 일정 |
| Won’t | 날씨·다국어·소셜 공유 | 외부 API·SDK·번역·테스트 부담으로 제외 | 3일 일정 |
| Won’t | 회원·서버 DB | 익명 SPA와 localStorage 구조 유지 | RFP 구조 |
| Won’t | 상시 백엔드 | 서버 DB·WebSocket·상시 서버 제외. OpenAI 중계 Function 1개만 사용 | 배포 보완 |

---

## 4. 데이터 출처 및 라이선스

| 항목 | 내용 |
|---|---|
| 제공 기관 | 한국관광공사 |
| 데이터명 | 국문 관광정보 서비스(TourAPI 4.0) |
| 지역 | 서울 |
| 총 건수 | SOURCE.md 기준 8,150건 |
| 라이선스 | 공공누리 제3유형 |
| 필수 조건 | 출처 표시, 원본 데이터 내용 변경 금지 |
| 공공데이터 URL | https://www.data.go.kr/data/15101578/openapi.do |

### 제공 목록

| 파일 | 유형 | SOURCE.md 건수 |
|---|---:|---:|
| `서울_관광지.json` | 관광지 | 783 |
| `서울_문화시설.json` | 문화시설 | 566 |
| `서울_축제공연행사.json` | 축제공연행사 | 201 |
| `서울_여행코스.json` | 여행코스 | 51 |
| `서울_레포츠.json` | 레포츠 | 126 |
| `서울_숙박.json` | 숙박 | 423 |
| `서울_쇼핑.json` | 쇼핑 | 4,368 |
| `서울_음식점.json` | 음식점 | 1,632 |

### 데이터 확인 주의사항

- 현재 전달된 작업 파일 목록에는 `서울_음식점.json`이 보이지 않는다. 실제 프로젝트 폴더에도 없다면 음식점 검색·통계·챗봇 답변을 임의로 만들지 않고 기능 범위에서 제외하거나 파일 제공 여부를 확인한다.
- `SCHEMA.md`에는 축제 시작일·종료일 필드가 정의되어 있지 않다. 축제 캘린더는 실제 JSON에 날짜 필드가 있는지 먼저 확인하고, 없다면 단순 축제 목록으로 제한하거나 추가 데이터 사용 가능 여부를 별도 검토한다.
- `mapx`, `mapy`는 문자열이므로 시각화·지역 집계 시 숫자로 변환한다.
- 이미지·주소가 빈 문자열일 수 있으므로 대체 이미지와 ‘정보 없음’ 처리를 구현한다.

### 출처 표시 문구

> 이 서비스는 한국관광공사 TourAPI 4.0의 데이터를 활용하였습니다.  
> 출처: 한국관광공사  
> 라이선스: 공공누리 제3유형

---

## 5. 선택기능 평가

평가기준은 구현난이도 1~5, 실현가능성 `6 - 난이도`, 임팩트 1~5, 종합점수 `실현가능성 × 임팩트 × 2`로 한다.

| 선택기능 | 난이도 | 실현가능성 | 임팩트 | 점수 | 결과 |
|---|---:|---:|---:|---:|---|
| 데이터 시각화 대시보드 | 2 | 4 | 5 | 40 | **1순위 선정** |
| 커뮤니티 게시판 추가기능 | 2 | 4 | 4 | 32 | 예비 1 |
| 축제 캘린더 | 3 | 3 | 4 | 24 | 예비 2 |
| 지도 시각화 | 4 | 2 | 5 | 20 | 제외 |
| 날씨 정보 | 3 | 3 | 3 | 18 | 제외 |
| 소셜 공유 | 3 | 3 | 3 | 18 | 제외 |
| 실시간 알림 | 2 | 4 | 2 | 16 | 제외 |
| 경로 안내 | 5 | 1 | 4 | 8 | 제외 |
| 다국어 | 4 | 2 | 2 | 8 | 제외 |

### 1순위 선정 이유

Chart.js는 제공 JSON과 localStorage 데이터를 브라우저에서 즉시 집계할 수 있어 구현 난도가 낮고, 발표에서 사용자 체감 효과가 크다. 지도·외부 API 없이도 서울 카테고리별 콘텐츠 수, 자치구별 분포, 게시글 현황을 한 화면에서 보여줄 수 있다.

### 추천 대시보드 구성

- KPI 카드: 전체 콘텐츠 수, 카테고리 수, 게시글 수, 북마크 수
- 막대그래프: 콘텐츠 유형별 건수
- 도넛그래프: 관광·문화·숙박·쇼핑 비율
- 막대그래프: 주소에서 추출한 서울 자치구별 콘텐츠 수
- 커뮤니티 통계: 카테고리별 게시글 수, 조회수, 좋아요
- 데이터 주의 문구: localStorage 통계는 현재 브라우저 기준

---

## 6. MVP 범위

### Must have

1. Vue.js 3 + Vite SPA
2. 서울 지역 정보 목록·상세·검색
3. 익명 게시판 CRUD
4. localStorage 저장
5. 수정용 비밀번호 검증
6. Netlify Functions 기반 OpenAI 챗봇
7. 플로팅 챗봇 UI 및 모바일 대응
8. Netlify 통합 배포
9. 기능 명세서·WBS·발표자료 제출

### Should / Could have

- 1순위: 데이터 시각화 대시보드
- 예비 1: 게시글 검색·조회수·좋아요·북마크
- 예비 2: 축제 날짜 필드 확인 후 월·목록형 캘린더

### 제외

- 지도 시각화 및 경로 안내
- 날씨 정보
- 실시간 다중 사용자 공유
- 회원가입·로그인
- 서버 DB·WebSocket
- 다국어·소셜 공유
- 허용되지 않은 AI 코딩 도구
- 제공되지 않은 데이터의 임의 생성

---

## 7. 최종 기술구성

### 호출 흐름

```text
Vue Chatbot.vue
  └─ POST /.netlify/functions/chat
       └─ Netlify Function
            ├─ 요청 검증
            ├─ 서울 JSON 관련 항목 선별
            ├─ localStorage 게시글 컨텍스트 수신
            ├─ process.env.OPENAI_API_KEY 참조
            └─ OpenAI API 호출
```

### 권장 파일 구조

```text
src/
  components/
    Chatbot.vue
  services/
    chatApi.js
  utils/
    localStorage.js
    dataLoader.js
  views/
    HomeView.vue
    CategoryView.vue
    CommunityView.vue
    DashboardView.vue

netlify/
  functions/
    chat.mjs

public/
  data/
    서울_관광지.json
    서울_문화시설.json
    ...

netlify.toml
```

### `netlify.toml` 기준

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 프론트엔드 호출 기준

```js
const response = await fetch('/.netlify/functions/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question, context }),
})
```

프론트엔드에는 OpenAI 키를 전달하지 않는다.

### 환경변수

| 환경 | 변수 | 저장 위치 |
|---|---|---|
| Netlify 운영 | `OPENAI_API_KEY` | Site configuration → Environment variables |
| 로컬 Functions 테스트 | `OPENAI_API_KEY` | 로컬 `.env` 또는 Netlify CLI 환경 |
| Vue 프론트엔드 | 없음 | `VITE_OPENAI_API_KEY` 사용 금지 |

---

## 8. 3인 역할 분담

| 구분 | 주역할 | 핵심 담당 | Day1 | Day2 | Day3 |
|---|---|---|---|---|---|
| 팀원 A | PM·공통 UI·배포 | 범위 통제, 라우터, 레이아웃, 반응형, Netlify 배포, 발표 통합 | 화면·라우트 설계 | 공통 UI·모바일 지원 | 배포·PPT·제출 |
| 팀원 B | 데이터·대시보드 | JSON 로더, 필터·검색, Chart.js, 데이터 출처 문서 | 데이터·스키마 분석 | 지역정보·대시보드 | 통합 QA·기능명세서 |
| 팀원 C | 커뮤니티·챗봇 | localStorage CRUD, 비밀번호 검증, Netlify Function, 챗봇 UI | 저장 스키마·Function 설계 | CRUD·챗봇 | 챗봇 QA·데모 |

### 충돌 방지 기준

- 공통 컴포넌트·라우터는 팀원 A가 관리한다.
- 데이터 유틸은 팀원 B가 관리한다.
- localStorage와 챗봇 관련 파일은 팀원 C가 관리한다.
- 각 기능 완료 후 작은 단위로 커밋하고, 병합 전에 담당자 간 파일 충돌을 확인한다.

---

## 9. 3일 WBS

### Day1 — 7월 14일

- RFP 요구사항·금지사항 최종 확인
- 서울 권역과 MVP 범위 동결
- JSON 파일·스키마·라이선스 대조
- Vue/Vite·Router·공통 레이아웃 구성
- localStorage 게시글 스키마 정의
- Netlify Function 요청·응답 스키마 정의
- 대시보드 집계 항목 결정

### Day2 — 7월 15일

- 서울 지역 정보 목록·상세·검색 구현
- 익명 게시판 CRUD와 비밀번호 모달 구현
- `netlify/functions/chat.mjs` 구현
- 챗봇 플로팅 UI·히스토리·오류 처리 구현
- Chart.js 데이터 시각화 대시보드 구현
- 모바일 반응형 적용

### Day3 — 7월 16일

- 오전 기능 동결
- Netlify 환경변수·Functions·SPA redirect 설정
- Production URL 배포
- CRUD·챗봇·대시보드·모바일 통합 테스트
- API 키 비노출 검사
- 기능 명세서·README·WBS·PPT 완성
- 데모 리허설 및 SSAFY GitLab 최종 제출

---

## 10. 챗봇 구현 기준

### 요청 데이터 최소화

전체 JSON 8천여 건을 매 질문마다 전송하지 않는다.

1. 브라우저에서 질문 키워드·카테고리를 분석한다.
2. 관련 데이터만 검색해 최대 N건으로 제한한다.
3. 제목, 주소, 전화번호, 유형 등 필요한 필드만 Function에 전달한다.
4. Function에서 시스템 프롬프트와 사용자 질문을 구성한다.
5. 응답 토큰과 질문 길이를 제한한다.

### 응답 원칙

- 제공 JSON에 있는 정보만 근거로 답변한다.
- 데이터가 없으면 없다고 명시한다.
- 주소·전화번호·행사 정보를 추측하지 않는다.
- localStorage 게시글은 현재 브라우저 데이터라고 안내한다.
- OpenAI 오류 시 사용자에게 재시도 메시지를 표시한다.

### 보안·비용 제어

- 허용 메서드: POST
- 질문 빈값 차단
- 질문 최대 길이 제한
- 전송 컨텍스트 최대 건수 제한
- 응답 토큰 제한
- 전송 버튼 연속 클릭 방지
- 과도한 요청 시 잠시 대기 안내
- 로그에 실제 API 키 출력 금지

---

## 11. 최종 QA 체크리스트

### 기능

- [ ] 서울 JSON 전체 파일이 정상 로딩된다.
- [ ] 카테고리 목록·상세·검색이 정상 동작한다.
- [ ] 게시글 작성·조회·수정·삭제가 정상 동작한다.
- [ ] 잘못된 비밀번호로 수정·삭제할 수 없다.
- [ ] 새로고침 후 localStorage 데이터가 유지된다.
- [ ] Chart.js 차트가 빈 데이터에서도 오류 없이 표시된다.
- [ ] 챗봇 히스토리·로딩·오류·재시도가 동작한다.

### Functions·키 보안

- [ ] `/.netlify/functions/chat`이 POST 요청에 정상 응답한다.
- [ ] 빈 질문·과도한 길이 요청을 차단한다.
- [ ] `OPENAI_API_KEY`가 Netlify 환경변수에 등록되어 있다.
- [ ] Git 저장소에 `.env`가 없다.
- [ ] 코드에 `sk-` 키가 하드코딩되어 있지 않다.
- [ ] 정적 JS 번들에서 `OPENAI_API_KEY` 또는 실제 키가 검색되지 않는다.
- [ ] 브라우저 Network 요청·응답에 실제 키가 없다.

### 배포

- [ ] Build command는 `npm run build`이다.
- [ ] Publish directory는 `dist`이다.
- [ ] Functions directory는 `netlify/functions`이다.
- [ ] SPA 하위 URL 새로고침 시 404가 발생하지 않는다.
- [ ] 모바일에서 챗봇과 게시판을 사용할 수 있다.
- [ ] Netlify Production URL을 산출물에 기록했다.

### 제출

- [ ] Git Repository URL
- [ ] Netlify URL
- [ ] 기능 명세서
- [ ] 데이터 출처·라이선스 목록
- [ ] WBS
- [ ] 발표 PPT 또는 PDF
- [ ] README 환경변수 설정 방법
- [ ] `.env` 미포함 최종 확인

---

## 12. 핵심 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| RFP 직접 호출과 Functions 구조 차이 | 요구사항 해석 이슈 | 배포 보완 결정으로 명세·발표에 명시하고 담당자 확인 |
| `서울_음식점.json` 누락 가능성 | 맛집 검색·통계 불가 | 실제 파일 확인 후 없으면 기능·표현에서 제외 |
| 축제 날짜 필드 미확인 | 캘린더 구현 불가 | 날짜 필드 확인 후 착수, 없으면 단순 목록으로 전환 |
| 전체 JSON 전송 | 비용·지연·토큰 초과 | 브라우저에서 관련 항목만 선별 |
| localStorage 기기 종속 | 사용자 간 공유 불가 | UI와 발표에서 현재 브라우저 기준임을 고지 |
| API 키 노출 | 보안·비용 사고 | Netlify Functions와 서버 환경변수만 사용 |
| 기능 범위 증가 | 3일 내 미완성 | 대시보드까지만 필수, 예비 기능은 조건부 착수 |

---

## 최종 결론

3일 프로젝트의 최종 범위는 **서울 JSON 기반 지역 정보 조회 + 익명 localStorage 커뮤니티 CRUD + Netlify Functions 기반 OpenAI 챗봇 + Chart.js 데이터 시각화 대시보드 + Netlify 배포**이다.

프론트엔드에 OpenAI 키를 포함하는 방식은 사용하지 않는다. `OPENAI_API_KEY`는 Netlify Functions에서만 읽고, Vue는 `/.netlify/functions/chat` 엔드포인트만 호출한다. 필수기능과 대시보드를 먼저 완성하며 게시판 추가기능과 축제 캘린더는 시간이 남을 때만 구현한다.
