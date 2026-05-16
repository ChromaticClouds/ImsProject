# ImsProject 빠른 리스크 완화 보고서

기준 시점:
- 로컬 워크스페이스 `/root/storage/code-bind/ims-project`
- 이번 정리는 빠르게 반영 가능한 설정, 의존성, 패키지 관리 리스크만 대상으로 했다.

## 이번에 반영한 수정

### 1. 운영 설정 분리

- 기본 설정에서 `ddl-auto: update`를 제거했다.
- `local` 프로필은 `update`, `prod` 프로필은 `validate`로 분리했다.
- 기본 프로필을 `local`로 지정해 기존 개발 흐름은 유지했다.

관련 파일:
- `server/ims-server/src/main/resources/application.yml`
- `server/ims-server/src/main/resources/application-local.yml`
- `server/ims-server/src/main/resources/application-prod.yml`

### 2. CORS와 외부 메일 URL 변수 분리

- `app.cors.allowed-origins`가 `RESEND_URL`을 직접 쓰던 구조를 분리했다.
- 이제 `FRONTEND_ORIGIN`을 우선 사용하고, 기존 환경을 깨지 않도록 `RESEND_URL`을 임시 fallback으로 둔다.
- `resend.base-url`은 `RESEND_BASE_URL`로 분리하고 기본값을 `https://api.resend.com`으로 정리했다.

관련 파일:
- `server/ims-server/src/main/resources/application.yml`

### 3. 동적 의존성 제거

- `com.resend:resend-java:+`를 고정 버전 `4.12.0`으로 변경했다.
- 목적은 빌드 재현성과 장애 분석 가능성 확보다.

관련 파일:
- `server/ims-server/build.gradle`

### 4. 패키지 매니저 기준 정리

- 루트 `package.json`에 `packageManager: pnpm@10.24.0`를 명시했다.
- `client/package.json`에서 `pnpm`을 일반 dependency로 설치하던 항목을 제거했다.
- `client/pnpm-lock.yaml`도 동일 기준으로 정리했다.

관련 파일:
- `package.json`
- `client/package.json`
- `client/pnpm-lock.yaml`

### 5. 업로드, 개발 환경 산출물 무시 규칙 추가

- 서버 업로드 디렉터리를 `.gitignore`에 추가했다.
- 루트 `.gitignore`에 `.idea/`, `server/.metadata/`를 추가했다.

관련 파일:
- `.gitignore`
- `server/ims-server/.gitignore`

## 아직 남아 있는 리스크

- 이미 Git에 들어가 있는 `server/ims-server/uploads`, `server/ims-server/src/main/resources/static/uploads` 파일은 아직 추적 해제가 필요하다.
- 이미 Git에 들어가 있는 `.idea`, `server/.metadata`도 추적 해제가 필요하다.
- 평문 비밀번호 처리 문제는 여전히 가장 큰 보안 리스크다. 이건 별도 작업으로 해시 전환이 필요하다.

## 권장 운영 기준

- 개발 실행: `SPRING_PROFILES_ACTIVE=local`
- 운영 실행: `SPRING_PROFILES_ACTIVE=prod`
- 프론트 허용 출처: `FRONTEND_ORIGIN`
- Resend API URL: `RESEND_BASE_URL`
- 프론트 패키지 매니저: `pnpm` 단일 사용
