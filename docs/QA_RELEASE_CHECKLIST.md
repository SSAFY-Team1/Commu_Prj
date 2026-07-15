# 최종 QA 및 배포 체크리스트

## 기능 QA

- [ ] 홈 화면에서 전체 데이터 건수가 표시된다.
- [ ] 지역 정보 화면에서 전체/카테고리 목록이 표시된다.
- [ ] 지역 정보 검색이 장소명, 주소, 자치구 기준으로 동작한다.
- [ ] 대시보드 KPI와 차트가 표시된다.
- [ ] 커뮤니티 게시글 작성이 동작한다.
- [ ] 커뮤니티 게시글 수정 시 비밀번호를 확인한다.
- [ ] 커뮤니티 게시글 삭제 시 비밀번호를 확인한다.
- [ ] 새로고침 후 localStorage 게시글이 유지된다.
- [ ] 챗봇 플로팅 버튼이 모바일/데스크톱에서 보인다.
- [ ] 챗봇 빈 질문이 차단된다.
- [ ] 챗봇 API 오류 시 사용자 메시지가 표시된다.

## 데이터 QA

- [ ] `public/data/manifest.json`의 7개 파일이 모두 로딩된다.
- [ ] 전체 데이터 건수가 현재 제공 JSON 합산 6,518건으로 표시된다.
- [ ] `서울/SOURCE.md`의 총 8,150건 표기와 실제 파일 합산 6,518건 차이를 발표자료/PR에 설명한다.
- [ ] `mapx`, `mapy`가 숫자 또는 `null`로 정규화된다.
- [ ] 이미지 없는 항목이 깨지지 않는다.
- [ ] 주소 없는 항목이 깨지지 않는다.
- [ ] 자치구 미분류 항목이 있어도 차트가 깨지지 않는다.

## 보안/키 QA

- [ ] `.env`가 git에 포함되지 않았다.
- [ ] 프론트 코드에 `VITE_OPENAI_API_KEY`가 없다.
- [ ] 코드에 실제 `sk-` 키가 없다.
- [ ] Netlify에 `OPENAI_API_KEY`가 환경변수로 등록되어 있다.
- [ ] 브라우저 Network 요청/응답에 API 키가 노출되지 않는다.
- [ ] 빌드 결과에서 `OPENAI_API_KEY` 또는 `sk-` 검색 결과가 없다.

## 명령어 QA

```bash
npm ci
npm run build
npm run test -- --run
```

PowerShell 정책 문제가 있으면:

```bash
npm.cmd run build
npm.cmd run test -- --run
```

## 배포 QA

- [ ] Netlify build command가 `npm run build`이다.
- [ ] Netlify publish directory가 `dist`이다.
- [ ] Netlify functions directory가 `netlify/functions`이다.
- [ ] `/dashboard`, `/community`, `/category/all` 새로고침 시 404가 나지 않는다.
- [ ] Production URL을 README/발표자료에 기록했다.

## 제출 산출물

- [ ] Git Repository URL
- [ ] Netlify Production URL
- [ ] 기능 명세서
- [ ] WBS
- [ ] 발표 PPT 또는 PDF
- [ ] 데이터 출처/라이선스 목록
- [ ] README 환경변수 설명
