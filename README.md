# IMS Project

MS Project는 재고, 발주, 입고, 출고, 협력사, 사용자 권한 관리를 하나의 흐름으로 연결한 풀스택 재고 관리 시스템입니다. 단순 CRUD 구현보다 실제 운영자가 사용하는 업무 흐름을 기준으로 화면과 API를 구성하는 데 초점을 두었고, React 기반 SPA와 Spring Boot API 서버를 분리하여 구현했습니다.

프로젝트에서는 JWT 인증, 권한 및 rank 기반 접근 제어, 발주서 PDF 생성, 메일 발송, 파일 업로드, 재고 이력 조회, 통계 대시보드 등을 구현했습니다. 특히 발주서 생성과 메일 발송 기능은 PDF 생성, 메일 본문 구성, 발송 처리 단계를 분리하여 유지보수성을 높였고, 일괄 발송 시 개별 실패 건을 분리 처리할 수 있도록 응답 구조를 구성했습니다.

이 프로젝트를 통해 업무 도메인 분석, 프론트엔드 기능 단위 구조화, 서버 API 설계, 인증/권한 처리, 운영성 있는 부가기능 통합 경험을 쌓았습니다.

## 한눈에 보기

- 도메인: Inventory Management System
- 형태: Full-stack web application
- 목적: 재고 운영 흐름을 화면 단위가 아닌 업무 흐름 단위로 통합
- 핵심 포인트: 권한 기반 접근 제어, 기능별 모듈 분리, 다중 저장소 연동, 발주/입출고 흐름 관리

## 프로젝트 배경과 목표

일반적인 CRUD 중심 예제가 아니라, 실제 운영에서 자주 함께 움직이는 재고 업무를 하나의 시스템으로 정리하는 데 초점을 둔 프로젝트다. 이 프로젝트의 목표는 다음과 같다.

- 품목, 협력사, 사용자, 공지 같은 기준 정보를 한곳에서 관리
- 발주, 입고, 출고, 재고 조정 같은 물류 흐름을 연결된 업무로 처리
- 권한과 직급에 따라 접근 가능한 화면과 기능을 분리
- 통계, 이력, 메일 발송, 파일 업로드 같은 운영 보조 기능까지 포함

## 주요 기능

### 인증과 사용자 운영

- 로그인, 회원가입, 비밀번호 재설정
- JWT 기반 인증
- 사용자 설정
- 사용자 그룹 조회
- 권한 및 rank 기반 라우트 접근 제어

### 기준 정보 관리

- 품목 관리
- 협력사 목록, 등록, 상세, 수정

### 재고 운영 흐름

- 발주서 생성 및 수정
- 입고 대기 조회 및 등록
- 출고 대기 조회 및 등록
- 수령 처리
- 재고 조정
- 이력 조회

### 운영 지원 기능

- 공지사항
- Todo 관리
- 통계 대시보드
- 메일 발송
- 파일 업로드
- PDF 생성

## 이 프로젝트가 보여주는 것

포트폴리오 관점에서 이 프로젝트는 아래 역량을 보여준다.

- 기능 단위 폴더링을 적용한 프론트엔드 구조화
- 인증, 권한, 직급을 함께 고려한 접근 제어 설계
- MySQL, MongoDB, Redis를 함께 쓰는 백엔드 구성
- 발주 메일 발송, PDF 생성, 업로드 처리 같은 실무형 부가기능 통합
- 화면 중심이 아닌 업무 흐름 중심의 라우팅과 도메인 분리

## 기술 스택

### Frontend

- React 19
- Vite 7
- React Router
- TanStack Query
- Zustand
- Tailwind CSS 4
- Radix UI
- Recharts
- Zod

### Backend

- Java 21
- Spring Boot 4.0.1
- Spring Security
- Spring Data JPA
- MyBatis
- MySQL
- MongoDB
- Redis
- JWT
- Resend Java SDK
- OpenHTMLToPDF
- Apache PDFBox

## 아키텍처 요약

### Frontend

- `client/src/app`: 앱 부트스트랩, 라우터, 공통 provider
- `client/src/features`: 기능 단위 UI, API, 상태, 훅, 스키마
- `client/src/pages`: 라우팅 엔트리 페이지

프론트는 `client/src/app/router/router.jsx`를 기준으로 공개 페이지와 보호 페이지를 분리한다. `/dashboard/**` 하위 화면은 인증 상태뿐 아니라 권한과 최소 rank를 함께 검사한다.

### Backend

- `features`: 도메인별 controller, service, repository, dto, entity
- `security`: JWT, 필터, Spring Security 설정
- `global`: 공통 설정, 외부 연동, properties

백엔드는 기능 모듈별로 패키지를 분리했고, 인증은 JWT 필터 체인으로 처리한다. 데이터 저장은 관계형 데이터와 문서형 데이터, 캐시 저장소를 함께 사용한다.

## 기능 모듈 맵

- `auth`
- `user`
- `vendor`
- `product`
- `purchase-order`
- `receive-order`
- `inbound`
- `outbound`
- `adjust`
- `statistics`
- `history`
- `notice`
- `todo`

백엔드에는 추가로 `invitation`, `order`, `stock` 모듈이 포함되어 있다.

## 디렉터리 구조

```text
.
├── client/
│   └── src/
│       ├── app/
│       ├── features/
│       └── pages/
├── server/
│   └── ims-server/
│       └── src/main/java/com/example/ims/
│           ├── features/
│           ├── global/
│           └── security/
└── README.md
```

## 실행 방법

### 사전 요구사항

- Node.js 24 LTS 이상 권장
- pnpm 10 계열
- Java 21
- MySQL
- MongoDB
- Redis

### Frontend

```bash
cd client
pnpm install
pnpm dev
```

### Backend

`gradlew` 실행 권한이 없을 수 있으므로 아래 방식이 가장 안전하다.

```bash
cd server/ims-server
bash ./gradlew bootRun
```

실행 권한이 이미 있다면 아래 방식도 가능하다.

```bash
./gradlew bootRun
```

## 환경 변수

백엔드는 `server/ims-server/src/main/resources/application.yml` 기준으로 `.env` 파일을 읽는다.

주요 환경 변수:

- `DB_URL`
- `DB_USER`
- `DB_PASS`
- `MONGO_URI`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_USER`
- `REDIS_PASS`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CLIENT_BASE_URL`
- `FRONTEND_ORIGIN`
- `AUTH_COOKIE_SECURE` (기본값: `true`)
- `AUTH_COOKIE_SAME_SITE` (기본값: `Lax`)
- `STORAGE_PROVIDER` (`local` 또는 `supabase`, 기본값: `local`)
- `UPLOAD_DIR`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_PRODUCT_IMAGE_BUCKET` (기본값: `ims-product-images`)
- `SUPABASE_NOTICE_ATTACHMENT_BUCKET` (기본값: `ims-notice-attachments`)
- `SUPABASE_SIGNED_URL_TTL_SECONDS` (기본값: `600`)

클라이언트 개발 서버는 `VITE_SERVER_URL`을 `/api` 프록시 대상으로 사용하며,
값을 생략하면 `http://localhost:8080`으로 전달한다. 프로덕션 클라이언트는
백엔드 주소를 번들에 포함하지 않고 동일 출처의 `/api`만 호출한다.

## Vercel 프런트엔드 배포

Vercel 프로젝트의 Root Directory는 `client`로 지정한다. `client/vercel.json`은
`/api/*` 요청을 Render 백엔드로 전달하므로 브라우저의 refresh 쿠키가
서드파티 쿠키로 취급되지 않는다. Vercel의 `VITE_SERVER_URL` 환경 변수는
프로덕션 빌드에 필요하지 않다.

## Render 백엔드 배포

저장소 루트의 `render.yaml` Blueprint를 사용하면 Java 21 Docker Web Service로
백엔드를 배포할 수 있다. Blueprint 생성 시 `sync: false`로 선언된 DB, Redis,
JWT, Resend 환경 변수 값을 Render 대시보드에서 입력한다.

무료 Web Service의 파일 시스템은 재시작 또는 재배포 시 초기화된다. 운영 환경에서는
`STORAGE_PROVIDER=supabase`로 설정해 공지 첨부파일을
`SUPABASE_NOTICE_ATTACHMENT_BUCKET` 비공개 버킷에 저장한다. 백엔드는 자체 JWT 인증을
마친 뒤 제한 시간 signed URL을 발급하며, `SUPABASE_SECRET_KEY`는 Render에만 보관한다.
`UPLOAD_DIR`는 `STORAGE_PROVIDER=local`인 로컬 개발 환경에서만 사용한다.

상품 및 박스 이미지는 `SUPABASE_PRODUCT_IMAGE_BUCKET` 공개 버킷의 `products/`,
`boxes/` 경로에 저장하고 MySQL의 `product.image_url`, `product.box_image_url`에는
Supabase 공개 URL을 기록한다. 프론트엔드에는 Supabase 키를 설정하지 않는다.
