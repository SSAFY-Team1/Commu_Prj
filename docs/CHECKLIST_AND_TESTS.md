# QA 체크리스트 & 테스트 가이드

이 문서는 `LocalHub_서울_실습기획서_최종.md`와 실무 이론 문서(`4일차_보충자료_유닛테스트_실무이론.md`)를 참고해 작성한 실무 체크리스트 및 테스트 가이드입니다.

---

## 핵심 QA 체크리스트 (빠른 검증)
- [ ] 서울 JSON이 `public/data/`에서 정상 로드된다.
- [ ] 카테고리 목록·상세·검색 정상 동작
- [ ] 게시글 작성·조회·수정·삭제(CRUD) 정상
- [ ] 수정/삭제 시 비밀번호 검증 정상
- [ ] 새로고침 후 localStorage 데이터 유지
- [ ] Chart.js 차트가 빈 데이터에서도 오류 없이 표시
- [ ] 챗봇(함수 스텁) 호출 시 200 응답, 에러 처리
- [ ] Netlify Functions `/.netlify/functions/chat`이 POST 수신
- [ ] `OPENAI_API_KEY`는 Netlify 환경변수에만 존재(코드/번들에 포함 금지)

---

## 테스트 원칙 요약 (실무이론 참조)
- 테스트 피라미드: 유닛 테스트(많이) → 통합 테스트(중간) → E2E(적게)
- 테스트 구조: Given / When / Then (Arrange / Act / Assert)
- 이름 규칙: "[상황]에서 [동작]하면 [결과]"
- 3종 세트: 정상(Happy Path), 경계(Boundary), 예외(Edge/Error)
- F.I.R.S.T 원칙: Fast, Independent, Repeatable, Self-validating, Timely

---

## 단기(1일) 적용 가능한 테스트 권장
- 우선 유닛 테스트 5~10개만 만들기: 핵심 유틸(데이터 로더, localStorage helper, 비밀번호 검증 등)
- 프레임워크 추천: `vitest` (Vite와 호환) — 빠르게 설치 가능

설치 예시:
```bash
npm install -D vitest @vue/test-utils
# package.json에 "test": "vitest" 스크립트 추가
```

### 유닛 테스트 예제 (Given/When/Then)
```js
// 예: src/utils/localStorage.js 의 savePost 함수 테스트
import { describe, it, expect } from 'vitest'
import { savePost, getPosts } from '../src/utils/localStorage'

describe('savePost', () => {
  it('정상 데이터가 저장되면 getPosts에 포함되어야 한다', () => {
    // Given
    const post = { id: 'p1', title: '테스트', password: '1234' }

    // When
    savePost(post)

    // Then
    const posts = getPosts()
    expect(posts.find(p => p.id === 'p1')).toBeDefined()
  })
})
```

> 주의: 테스트는 서로 독립적으로 실행되어야 하므로 `localStorage` 관련 테스트는 각 테스트가 자체적으로 초기화해야 합니다.

---

## Mock(대역) 사용 지침
- 외부 API 호출, OpenAI 실제 호출 등은 목(Mock)으로 대체
- Netlify Function도 로컬/스텁 응답으로 대체하여 프론트 개발·테스트 병렬화
- 예: `chatApi.js`에서 실제 fetch 대신 스텁 함수를 주입하거나, Vitest의 mocking 기능 사용

---

## 수동 QA 절차(간단)
1. 최신 main을 받아 `npm install` 실행
2. `npm run dev`로 로컬 실행 확인
3. 게시판: 작성 → 수정(비밀번호 체크) → 삭제 시나리오 실행
4. 데이터: `public/data/sample.json`을 변경해 목록/차트 반응 확인
5. 챗봇: 입력 → 함수 스텁 응답 확인
6. 빌드: `npm run build` 성공 여부 확인

---

## 테스트 우선순위(짧게)
1. localStorage CRUD (작성·수정·삭제·비밀번호 검증)
2. dataLoader (public JSON 파싱·카테고리 추출)
3. chatApi(프론트 스텁 호출 로직)
4. 대시보드 차트가 빈데이터에서도 정상 렌더

---

문제가 생기면 `git` 브랜치와 관련 이슈를 만들고 빠르게 롤백/핫픽스 절차를 진행하세요.