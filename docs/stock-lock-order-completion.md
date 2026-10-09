# 입출고 완료 재고 잠금 순서

PR #46 댓글 https://github.com/ChromaticClouds/ImsProject/pull/46#issuecomment-6079307713 의 후속 작업이다. 발주서 메일 발송 변경과 분리하고 main에서 시작했다.

## 작업 목록

- [x] 기존 `fix/stock-lock-order-on-completion` 브랜치를 비교한다. 기존 커밋 `2f9c999`의 MySQL 테스트 기반을 재사용하고 검증 범위를 확장했다.
- [x] 모든 대상의 품목 ID와 수량을 재고 잠금 전에 검증한다. 잘못된 행을 필터로 건너뛰지 않는다.
- [x] 입고 `vendorItemId -> productId`를 사전에 확정하고 동일 공급 품목은 한 번 조회한다. 처리 루프에서는 확정된 매핑만 사용한다.
- [x] 중복을 제거한 productId 오름차순으로 `ensureStockRow`와 단건 `SELECT ... FOR UPDATE`를 순차 실행한다. 모든 재고행을 잠근 뒤 이력, 재고, 주문을 변경한다.
- [x] 중복 품목은 메모리의 잠긴 수량을 갱신하여 다음 행의 before/after 이력이 이어지도록 한다.
- [x] 기존 트랜잭션, 수량 검증, 재고 부족 및 정수 오버플로 처리, 이력/재고 갱신 및 주문 상태 변경 행 수 검증을 유지한다.
- [x] 단위 테스트에서 매핑 확정, 잠금 순서, 품목당 단일 잠금, 처리 시작 시점, 잘못된 후속 품목 및 이력 연속성을 확인한다.
- [x] 실제 MySQL 테스트에 역순 출고/출고, 입고/입고, 입출고 교차 처리 각 10회, 3개 품목 경합, 없는 재고행 동시 생성, 중복 품목, 수량 변경 배지, 잘못된 수량, 재고 부족, 오버플로, 이력 저장 예외와 주문 상태 변경 불일치의 전체 롤백을 추가한다.
- [x] CI에 MySQL 테스트를 필수 단계로 추가하고 보고서를 보관한다. Docker와 전용 DB가 모두 없으면 이 단계는 실패하며 조용히 생략하지 않는다.
- [x] 다른 재고 변경 경로와 INSERT 경합을 조사한다. 아래 후속 작업은 이번 변경의 범위 밖이다.
- [ ] 서버 단위 테스트 및 MySQL 통합 테스트의 최종 실행 결과 확인.

## 실행

Java 21, 서버 Gradle wrapper를 사용한다.

```sh
cd server/ims-server
./gradlew test
./gradlew mysqlIntegrationTest
```

`test`는 MySQL 태그를 제외하고, `mysqlIntegrationTest`는 MySQL 태그만 실행한다. CI는 Testcontainers MySQL 8.4를 사용한다. 로컬 Docker를 쓸 수 없다면 **비어 있는 일회용 데이터베이스**를 직접 지정할 수 있다.

```sh
export IMS_IT_JDBC_URL='jdbc:mysql://127.0.0.1:13308/ims_lock_it_local?useSSL=false&allowPublicKeyRetrieval=true'
export IMS_IT_DB_USER=root
export IMS_IT_DB_PASSWORD=''
./gradlew mysqlIntegrationTest
```

외부 DB 이름은 `ims_lock_it_`로 시작해야 한다. 테스트는 `create-drop`과 데이터 삭제 및 테스트용 트리거를 사용한다. 애플리케이션 DB를 지정하지 않는다. 테스트는 Redis 및 이메일 전송을 호출하지 않는다.

보고서: `server/ims-server/build/reports/tests/test/`, `server/ims-server/build/reports/tests/mysqlIntegrationTest/`. CI artifact는 `server-test-reports`이다.

## INSERT와 인덱스 검토

`Stock.product`의 `unique=true, nullable=false` 매핑은 product_id 유니크 인덱스를 생성한다. MyBatis upsert와 FOR UPDATE, 수량 갱신은 모두 이 키로 접근한다. `ensureStockRow`는 기존 행에도 쓰기 잠금을 획득하므로 SELECT뿐 아니라 INSERT도 동일한 정렬 순서를 따라야 한다. upsert는 인덱스 레코드, 갭/next-key 및 auto-increment 등에서 경합할 수 있다. 정렬은 모든 InnoDB 데드락이 사라진다는 보장이 아니다. 빈 재고행의 동시 생성도 실제 MySQL 테스트에서 확인한다. 배포 DB에도 product_id 유니크 제약이 유지되어야 한다.

동시성 테스트는 실행 장벽과 수량 UPDATE의 지연 트리거를 이용해 요청을 겹치게 한다. 품목 사이에 다른 재고행을 두어 인덱스 경합이 역순 잠금 문제를 가리는 가능성을 줄인다. 최종 수량뿐 아니라 각 품목의 before/after 이력 연속성과 주문 상태를 검증한다. 테스트 자체에 트랜잭션을 걸지 않아 실제 서비스 트랜잭션의 커밋/롤백을 검사한다.

## 후속 작업 및 잔여 위험

1. `AdjustService.adjustProducts`는 `StockRepository.findByProductIdIn`의 단일 `IN` 쿼리에 `PESSIMISTIC_WRITE`를 사용한다. 순차적인 productId 잠금 순서를 명시하지 않는다. 정렬된 ID별 잠금과 입출고/조정 교차 MySQL 테스트를 후속 변경에서 추가해야 한다. 쿼리 결과의 ORDER BY만으로 실제 잠금 순서를 가정하지 않는다.
2. 입고 수량 수정 및 완료 처리의 주문행/재고행 잠금 순서, 품목 연결 변경/삭제와 외래키 잠금도 전체적으로 검토할 필요가 있다. 이번 변경은 재고행 간 순서만 통일한다.
3. 이번 작업은 DB 트랜잭션 자동 재시도를 도입하지 않는다. 재시도 정책을 별도로 도입할 때 이메일 등 외부 부작용을 포함한 전체 요청을 재실행하지 않는다.

`AdjustService` 외의 주 애플리케이션 재고 수량 쓰기는 두 완료 서비스에서 확인했다. 단위 및 통합 테스트 결과와 CI 링크는 별도 PR 설명에 기록한다.
