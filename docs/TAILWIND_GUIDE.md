# Tailwind CSS 빠른 가이드 (Vue 3 + Vite)

요청: Tailwind를 참조하여 CSS 규칙을 간단히 정리합니다. 아래는 Vite + Vue 3 환경에서 빠르게 통합하는 방법입니다.

## 1) 설치
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 2) `tailwind.config.cjs` 설정
```js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 3) 글로벌 CSS 생성 (`src/assets/tailwind.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

그리고 `src/main.js`에 import 추가:
```js
import './assets/tailwind.css'
```

## 4) 빠른 CDN(프로토타입용)
시간이 부족하면 CDN을 임시로 사용할 수 있습니다(권장 아님).
```html
<script src="https://cdn.tailwindcss.com"></script>
```

## 5) 사용 예시
- 헤더
```html
<header class="bg-indigo-600 text-white p-4">
  <div class="max-w-4xl mx-auto flex justify-between items-center">
    <h1 class="text-lg font-semibold">LocalHub</h1>
    <nav class="space-x-4">
      <a class="hover:underline">Home</a>
    </nav>
  </div>
</header>
```

- 버튼
```html
<button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  질문하기
</button>
```

- 반응형 카드
```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="p-4 bg-white shadow rounded">카드</div>
</div>
```

## 6) 생산성 팁
- 자주 쓰는 스타일은 `@apply`를 사용해 재사용 클래스(.btn 등)를 만들자.
- 모바일 우선 클래스 사용 권장(e.g., `md:`, `lg:` 접두어)
- Tailwind 플러그인(Forms, Typography) 필요 시 추가 설치

## 7) 빌드 주의
- `tailwind.config.cjs`의 `content`에 사용 경로를 정확히 넣어야 빌드 시 사용하지 않는 CSS가 제거됩니다.

---
참고: 더 작은 디자인 토큰(색상 변수, spacing 등)을 정리해 드리면 팀이 통일해서 쓸 수 있도록 도와드리겠습니다.