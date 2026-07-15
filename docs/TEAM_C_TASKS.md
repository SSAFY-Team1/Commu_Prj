# Team C 작업 지시서 — 커뮤니티 & 챗봇

담당자: 팀원 C  
브랜치: `feature/community-chatbot-c`  
최종 PR 검토자: 팀원 A

## 목표

익명 커뮤니티 기능을 완성하고, Vue 챗봇 UI가 Netlify Function을 통해 OpenAI API를 안전하게 호출하도록 구현한다.

Team C의 핵심 산출물은 다음 3가지다.

- localStorage 기반 익명 게시판 CRUD 고도화
- 챗봇 UI/요청/오류 처리 완성
- Netlify Function 기반 OpenAI API 연동

## 담당 파일

Team C가 주로 수정한다.

- `src/views/CommunityView.vue`
- `src/components/Chatbot.vue`
- `src/services/chatApi.js`
- `src/utils/localStorage.js`
- `netlify/functions/chat.mjs`

필요 시 테스트 파일을 추가할 수 있다.

- `src/utils/localStorage.test.js`
- `src/services/chatApi.test.js`

## 수정 금지 또는 사전 협의 파일

아래 파일은 팀원 A와 먼저 합의한 뒤 수정한다.

- `src/App.vue`
- `src/router/index.js`
- `src/components/Header.vue`
- `src/components/Footer.vue`
- `src/components/ButtonPrimary.vue`
- `src/components/Modal.vue`
- `src/components/KpiCard.vue`
- `src/assets/tailwind.css`
- `tailwind.config.cjs`
- `package.json`
- `package-lock.json`
- `netlify.toml`

Team B 담당 파일은 직접 수정하지 않는다.

- `src/views/DashboardView.vue`
- `public/data/`

예외:

- 챗봇 context 선별을 위해 `src/utils/dataLoader.js`의 helper를 사용할 수 있다.
- `dataLoader.js` 자체 수정이 필요하면 Team B와 팀원 A에게 먼저 공유한다.
- `chatApi.js`는 `{ question, context }` 요청 형식을 유지한다.

## 구현 범위

### 1. 커뮤니티 게시판

현재 localStorage 기반 게시글 기능을 확장한다.

필수 스키마:

```js
{
  id,
  title,
  content,
  password,
  created,
  category,
  views,
  likes,
  bookmarks
}
```

필수 기능:

- 게시글 목록
- 게시글 작성
- 게시글 수정
- 게시글 삭제
- 수정/삭제 시 비밀번호 검증
- 제목/내용 검색
- 조회수 증가
- 좋아요 토글
- 북마크 토글
- 새로고침 후 데이터 유지

주의:

- 서버 DB를 만들지 않는다.
- 회원가입/로그인을 만들지 않는다.
- 게시글은 현재 브라우저 localStorage 기준임을 UI 또는 발표에서 설명한다.
- 사용자가 입력한 내용은 Vue 텍스트 렌더링으로 표시해 XSS 위험을 줄인다.

### 2. 챗봇 프론트엔드

`Chatbot.vue`와 `chatApi.js`에서 다음을 구현한다.

- 플로팅 챗봇 버튼
- 대화 히스토리
- 로딩 상태
- 오류 메시지
- 재시도 가능 상태
- 빈 질문 차단
- 질문 최대 길이 제한
- 전송 중 버튼 비활성화
- 모바일 화면 대응

요청 형식:

```js
{
  question,
  context
}
```

context는 Team B의 `dataLoader.js` helper를 사용해 최대 N건만 전달한다.

권장 context 형태:

```js
{
  id,
  title,
  category,
  address,
  tel
}
```

### 3. Netlify Function

`netlify/functions/chat.mjs`에서 OpenAI API 호출을 구현한다.

필수 기준:

- POST만 허용
- 빈 질문 차단
- 질문 최대 길이 제한
- context 배열 검증
- context 최대 건수 제한
- 응답 토큰 제한
- `process.env.OPENAI_API_KEY`만 사용
- API 키를 응답, 로그, 프론트 코드에 노출하지 않음
- OpenAI 오류 시 사용자 친화적인 메시지 반환

응답 원칙:

- 제공된 서울 데이터 context에 근거해서 답변한다.
- 없는 정보는 없다고 말한다.
- 주소, 전화번호, 행사 정보를 추측하지 않는다.
- localStorage 게시글은 현재 브라우저 기준임을 안내한다.

## 충돌 방지 규칙

- 공통 레이아웃과 디자인 토큰은 직접 수정하지 않는다.
- 챗봇/커뮤니티 내부 스타일은 해당 컴포넌트 안에서만 처리한다.
- 데이터 로더의 함수 이름이나 반환 구조를 바꾸지 않는다.
- 대시보드 파일은 수정하지 않는다.
- OpenAI SDK 또는 새 패키지 추가가 필요하면 팀원 A에게 먼저 공유한다.

## 완료 기준

- `npm run build` 성공
- `npm run test -- --run` 성공
- 게시글 작성/검색/수정/삭제/조회수/좋아요/북마크가 동작함
- 잘못된 비밀번호로 수정/삭제할 수 없음
- 챗봇이 Netlify Function에 요청하고 정상 응답/오류 응답을 처리함
- `OPENAI_API_KEY`가 코드에 하드코딩되어 있지 않음
- PR 본문에 테스트 방법과 환경변수 설정 방법을 작성함

## PR 체크리스트

- [ ] 브랜치명이 `feature/community-chatbot-c`이다.
- [ ] `npm run build` 결과를 PR에 적었다.
- [ ] 커뮤니티 CRUD 수동 테스트 결과를 적었다.
- [ ] 잘못된 비밀번호 테스트 결과를 적었다.
- [ ] 챗봇 정상/오류 케이스 테스트 결과를 적었다.
- [ ] OpenAI 키가 코드와 번들에 포함되지 않았다.
- [ ] Team B 담당 파일을 수정하지 않았다.
- [ ] 공통 파일 수정이 있다면 팀원 A에게 사전 공유했다.
