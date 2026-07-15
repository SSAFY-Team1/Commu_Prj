# Team B 작업 지시서 — 데이터 & 대시보드

담당자: 팀원 B  
브랜치: `feature/dashboard-b`  
최종 PR 검토자: 팀원 A

## 목표

제공된 서울 TourAPI JSON 전체 데이터를 앱에서 사용할 수 있도록 정규화하고, Chart.js 기반 데이터 시각화 대시보드를 완성한다.

Team B의 핵심 산출물은 다음 3가지다.

- 서울 전체 JSON 데이터 로딩/정규화 유틸
- 카테고리/자치구/게시글 통계 집계
- 발표에 사용할 수 있는 대시보드 화면

## 담당 파일

Team B가 주로 수정한다.

- `src/utils/dataLoader.js`
- `src/views/DashboardView.vue`
- `src/components/KpiCard.vue`
- `public/data/`

필요 시 테스트 파일을 추가할 수 있다.

- `src/utils/dataLoader.test.js`

## 수정 금지 또는 사전 협의 파일

아래 파일은 팀원 A와 먼저 합의한 뒤 수정한다.

- `src/App.vue`
- `src/router/index.js`
- `src/components/Header.vue`
- `src/components/Footer.vue`
- `src/components/ButtonPrimary.vue`
- `src/components/Modal.vue`
- `src/assets/tailwind.css`
- `tailwind.config.cjs`
- `package.json`
- `package-lock.json`
- `netlify.toml`

Team C 담당 파일은 수정하지 않는다.

- `src/views/CommunityView.vue`
- `src/components/Chatbot.vue`
- `src/services/chatApi.js`
- `src/utils/localStorage.js`
- `netlify/functions/chat.mjs`

## 구현 범위

### 1. 서울 데이터 배치

- `서울/` 폴더의 원본 JSON 7개를 앱에서 읽을 수 있는 구조로 준비한다.
- 원본 데이터 내용은 직접 수정하지 않는다.
- 앱에서 사용하기 위해 필요한 변환은 `dataLoader.js`에서 처리한다.
- 출처와 라이선스 문구는 유지한다.

대상 파일:

- `서울_관광지.json`
- `서울_문화시설.json`
- `서울_축제공연행사.json`
- `서울_여행코스.json`
- `서울_레포츠.json`
- `서울_숙박.json`
- `서울_쇼핑.json`

현재 저장소의 7개 JSON 파일 합산은 6,518건이다. `서울/SOURCE.md`의 총 8,150건 표기와 차이가 있으므로, PR에는 실제 로딩 건수와 검증 기준을 반드시 적는다.

### 2. 데이터 정규화

`dataLoader.js`에서 화면과 챗봇이 함께 쓸 수 있는 공통 형태로 변환한다.

권장 정규화 필드:

```js
{
  id,
  contentTypeId,
  category,
  title,
  address,
  addressDetail,
  tel,
  image,
  thumbnail,
  mapx,
  mapy,
  district,
  raw
}
```

처리 기준:

- `contentid` → `id`
- `contenttypeid` → `contentTypeId`
- `title` → `title`
- `addr1` → `address`
- `addr2` → `addressDetail`
- `firstimage` → `image`
- `firstimage2` → `thumbnail`
- `mapx`, `mapy`는 문자열에서 숫자로 변환
- 이미지/주소/전화번호가 없으면 화면에서 깨지지 않도록 기본값 처리
- `addr1`에서 서울 자치구 이름을 추출해 `district`로 제공

### 3. 제공할 helper

최소 아래 함수들을 제공한다.

```js
loadAllData()
getAllItems()
getByCategory(category)
searchItems(keyword)
aggregateByCategory(items)
aggregateByDistrict(items)
getDashboardStats()
toChatContext(items, limit)
```

주의:

- 현재 Team A가 위 helper의 기본 구현을 넣어 두었다. Team B는 동작 검증, 성능 개선, 집계 정확도 개선을 담당한다.
- Team C 챗봇은 `toChatContext()` 또는 `searchItems()`를 사용할 수 있으므로 함수 이름과 반환 형태를 PR 설명에 반드시 적는다.
- 함수 시그니처를 바꾸면 Team C와 팀원 A에게 공유한다.

### 4. 대시보드

`DashboardView.vue`에서 다음을 구현한다.

- KPI 카드: 전체 콘텐츠 수
- KPI 카드: 카테고리 수
- KPI 카드: 커뮤니티 게시글 수
- 막대그래프: 콘텐츠 유형별 건수
- 도넛그래프: 콘텐츠 유형 비율
- 막대그래프: 서울 자치구별 콘텐츠 수 Top 10
- 빈 데이터 상태 안내
- 차트 destroy 처리로 화면 이동 시 중복 렌더링 방지

선택 개선:

- 축제공연행사 수
- 이미지 보유 콘텐츠 수
- 주소 누락 콘텐츠 수

## 충돌 방지 규칙

- 공통 레이아웃 스타일을 직접 고치지 않는다.
- 대시보드 내부 스타일은 `DashboardView.vue` 안에서만 처리한다.
- 공통 버튼/모달이 필요하면 기존 컴포넌트를 사용하고, 새 공통 컴포넌트가 필요하면 팀원 A에게 요청한다.
- `localStorage.js`는 Team C 소유이므로 직접 수정하지 않는다.
- 게시글 수는 `getPosts()`를 import해서 읽기만 한다.

## 완료 기준

- `npm run build` 성공
- `npm run test -- --run` 성공
- 대시보드가 전체 서울 데이터 기준으로 표시됨
- 데이터가 비어 있거나 이미지/주소가 없어도 화면이 깨지지 않음
- 자치구 Top 10 차트가 표시됨
- PR 본문에 데이터 건수, 집계 기준, 테스트 방법을 작성함

## PR 체크리스트

- [ ] 브랜치명이 `feature/dashboard-b`이다.
- [ ] `src/utils/dataLoader.js` helper 목록을 PR에 적었다.
- [ ] 전체 데이터 로딩 결과 건수를 PR에 적었다.
- [ ] `npm run build` 결과를 PR에 적었다.
- [ ] 대시보드 화면 캡처를 첨부했다.
- [ ] Team C 담당 파일을 수정하지 않았다.
- [ ] 공통 파일 수정이 있다면 팀원 A에게 사전 공유했다.
