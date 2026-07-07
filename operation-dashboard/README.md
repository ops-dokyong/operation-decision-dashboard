# Operation Decision Support Dashboard

교육 운영자가 여러 기수의 수강생 위험군을 한눈에 파악하고 개입 우선순위를 판단할 수 있도록 돕는 Operation Decision Support Dashboard 프로토타입입니다.

React + Vite + Tailwind CSS로 제작되었으며, 백엔드 없이 프론트엔드 더미 데이터로 동작합니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 빌드

```bash
npm run build
npm run preview
```

## 배포

Vercel에 GitHub 저장소를 연결하면 자동으로 빌드 설정을 인식합니다. (Framework: Vite / Build Command: `npm run build` / Output Directory: `dist`)

## 폴더 구조

```
operation-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── OperationDashboard.jsx
```
