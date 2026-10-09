# 기존 재고의 INSERT 잠금 조사

MySQL 8.0.42, 전용 `ims_lock_it_insert_probe` 스키마, InnoDB의 AUTO_INCREMENT PK와 unique product_id를 가진 테이블에서 확인했다. 운영 데이터는 사용하지 않았다.

| 첫 세션이 product 10을 3초간 보유 | 잠금 | 다른 세션의 product 11 처리 시간 |
| --- | --- | --- |
| INSERT ON DUPLICATE KEY UPDATE | PRIMARY record + supremum X, product_id next-key X | 2.609초 |
| 단건 SELECT FOR UPDATE | PRIMARY와 product_id의 X,REC_NOT_GAP | 0.078초 |

product_id 오름차순은 동일 행의 역순 잠금을 줄이지만, 기존 행에 대한 no-op INSERT의 테이블 끝 인덱스 잠금으로 서로 다른 품목도 직렬화됐다. 이 실험에서 INSERT끼리의 교착은 재현되지 않았으므로 직렬화 결과를 교착 해결 증거로 사용하지 않는다.

입출고 완료는 비잠금 EXISTS 조회로 기존 행을 확인하고, 없는 행에만 기존 upsert를 실행한다. 수량은 EXISTS 조회에서 읽지 않고 이후 FOR UPDATE가 반환하는 최신 값만 사용한다. 일관 읽기의 스냅샷에서 없던 행을 다른 요청이 먼저 생성해도 기존 upsert가 중복 키를 처리한다. 부재 여부를 먼저 FOR UPDATE로 확인하는 방식은 동시 생성 시 gap 잠금의 승격 교착을 만들 수 있어 사용하지 않는다. 존재 확인 직후 삭제되면 잠금 조회가 실패하여 전체 작업이 롤백된다.

검증은 `./gradlew test mysqlIntegrationTest`로 실행한다. 신규 테스트는 기존 재고의 INSERT 생략을 단위 검증하고, 별도 트랜잭션이 다른 품목의 upsert 잠금을 계속 보유하는 동안 실제 입출고 완료가 끝나는지 확인한다. 기존 없는 재고행의 동시 생성, 역순 입출고, 조정과 입출고 경합, 수량·이력·상태 및 오류 롤백 테스트도 함께 실행한다. 새 재고 생성 자체의 INSERT 경합과 주문/외래키 잠금까지 모두 제거하는 변경은 아니다.
