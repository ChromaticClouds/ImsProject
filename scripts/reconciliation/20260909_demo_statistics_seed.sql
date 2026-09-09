-- Synthetic operational data for statistics/report verification.
-- Idempotent: every insert is guarded by the DEMO order number.
-- Completed inbound/outbound quantities are paired by product, so current stock is unchanged.

START TRANSACTION;

-- 1) 190 completed inbound lines across Jan-Jul 2025 and Mar-Aug 2026.
INSERT INTO orders
  (user_id, order_number, order_date, recieve_date, `count`, qty_changed,
   lead_time, status, vendor_item_id, product_id, seller_vendor_id, manager_id)
SELECT
  ELT(MOD(e.n - 1, 6) + 1, 16, 20, 39, 52, 53, 58),
  CONCAT('PLA-DEMO-', DATE_FORMAT(e.event_date, '%Y%m%d'), '-', LPAD(e.n, 6, '0')),
  DATE_SUB(e.event_date, INTERVAL (MOD(e.n, 7) + 1) DAY),
  e.event_date,
  e.qty,
  0,
  MOD(e.n, 7) + 1,
  'INBOUND_COMPLETE',
  e.vendor_item_id,
  NULL,
  NULL,
  ELT(MOD(e.n - 1, 6) + 1, 14, 19, 23, 25, 26, 57)
FROM (
  SELECT
    seq.n,
    m.product_id,
    m.vendor_item_id,
    12 + MOD(seq.n * 17, 48) AS qty,
    CASE
      WHEN seq.n <= 70 THEN
        DATE_ADD(
          DATE_ADD('2025-01-01', INTERVAL FLOOR((seq.n - 1) / 10) MONTH),
          INTERVAL (MOD(seq.n - 1, 10) * 2 + 1) DAY
        )
      ELSE
        DATE_ADD(
          DATE_ADD('2026-03-01', INTERVAL FLOOR((seq.n - 71) / 20) MONTH),
          INTERVAL MOD(seq.n - 71, 20) DAY
        )
    END AS event_date
  FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY id) AS n
    FROM history_lot
    ORDER BY id
    LIMIT 190
  ) seq
  JOIN (
    SELECT 1 pos, 5 product_id, 32 vendor_item_id UNION ALL
    SELECT 2, 7, 34 UNION ALL SELECT 3, 13, 35 UNION ALL
    SELECT 4, 15, 36 UNION ALL SELECT 5, 20, 37 UNION ALL
    SELECT 6, 21, 38 UNION ALL SELECT 7, 22, 39 UNION ALL
    SELECT 8, 23, 40 UNION ALL SELECT 9, 24, 41 UNION ALL
    SELECT 10, 25, 42 UNION ALL SELECT 11, 26, 43 UNION ALL
    SELECT 12, 27, 44 UNION ALL SELECT 13, 28, 45 UNION ALL
    SELECT 14, 33, 50 UNION ALL SELECT 15, 35, 52 UNION ALL
    SELECT 16, 58, 53 UNION ALL SELECT 17, 59, 54 UNION ALL
    SELECT 18, 60, 55
  ) m ON m.pos = MOD(seq.n - 1, 18) + 1
) e
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.order_number = CONCAT(
    'PLA-DEMO-', DATE_FORMAT(e.event_date, '%Y%m%d'), '-', LPAD(e.n, 6, '0')
  )
);

-- 2) Matching completed outbound lines. Each pair returns stock to its baseline.
INSERT INTO orders
  (user_id, order_number, order_date, recieve_date, `count`, qty_changed,
   lead_time, status, vendor_item_id, product_id, seller_vendor_id, manager_id)
SELECT
  ELT(MOD(e.n - 1, 3) + 1, 12, 17, 21),
  CONCAT('REC-DEMO-', DATE_FORMAT(e.event_date, '%Y%m%d'), '-', LPAD(e.n, 6, '0')),
  e.event_date,
  e.event_date,
  e.qty,
  0,
  NULL,
  'OUTBOUND_COMPLETE',
  NULL,
  e.product_id,
  ELT(MOD(e.n - 1, 15) + 1, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110),
  ELT(MOD(e.n - 1, 3) + 1, 18, 22, 1)
FROM (
  SELECT
    seq.n,
    m.product_id,
    12 + MOD(seq.n * 17, 48) AS qty,
    CASE
      WHEN seq.n <= 70 THEN
        DATE_ADD(
          DATE_ADD('2025-01-01', INTERVAL FLOOR((seq.n - 1) / 10) MONTH),
          INTERVAL (MOD(seq.n - 1, 10) * 2 + 1) DAY
        )
      ELSE
        DATE_ADD(
          DATE_ADD('2026-03-01', INTERVAL FLOOR((seq.n - 71) / 20) MONTH),
          INTERVAL MOD(seq.n - 71, 20) DAY
        )
    END AS event_date
  FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY id) AS n
    FROM history_lot
    ORDER BY id
    LIMIT 190
  ) seq
  JOIN (
    SELECT 1 pos, 5 product_id UNION ALL SELECT 2, 7 UNION ALL
    SELECT 3, 13 UNION ALL SELECT 4, 15 UNION ALL SELECT 5, 20 UNION ALL
    SELECT 6, 21 UNION ALL SELECT 7, 22 UNION ALL SELECT 8, 23 UNION ALL
    SELECT 9, 24 UNION ALL SELECT 10, 25 UNION ALL SELECT 11, 26 UNION ALL
    SELECT 12, 27 UNION ALL SELECT 13, 28 UNION ALL SELECT 14, 33 UNION ALL
    SELECT 15, 35 UNION ALL SELECT 16, 58 UNION ALL SELECT 17, 59 UNION ALL
    SELECT 18, 60
  ) m ON m.pos = MOD(seq.n - 1, 18) + 1
) e
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.order_number = CONCAT(
    'REC-DEMO-', DATE_FORMAT(e.event_date, '%Y%m%d'), '-', LPAD(e.n, 6, '0')
  )
);

-- 3) Audit lots for the completed demo orders.
INSERT INTO history_lot (user_id, order_number, status, memo, created_at)
SELECT o.manager_id, o.order_number, 'INBOUND', 'DEMO 통계 시드 입고',
       TIMESTAMP(o.recieve_date, '10:00:00')
FROM orders o
WHERE o.order_number LIKE 'PLA-DEMO-%'
  AND o.status = 'INBOUND_COMPLETE'
  AND NOT EXISTS (
    SELECT 1 FROM history_lot hl
    WHERE hl.status = 'INBOUND' AND hl.order_number = o.order_number
  );

INSERT INTO history_lot (user_id, order_number, status, memo, created_at)
SELECT o.manager_id, o.order_number, 'OUTBOUND', 'DEMO 통계 시드 출고',
       TIMESTAMP(o.order_date, '15:00:00')
FROM orders o
WHERE o.order_number LIKE 'REC-DEMO-%'
  AND o.status = 'OUTBOUND_COMPLETE'
  AND NOT EXISTS (
    SELECT 1 FROM history_lot hl
    WHERE hl.status = 'OUTBOUND' AND hl.order_number = o.order_number
  );

-- 4) History rows use verified boundary baselines and balanced deltas.
INSERT INTO history
  (lot_id, vendor_item_id, product_id, before_count, after_count, created_at, seller_vendor_id)
SELECT
  hl.id,
  o.vendor_item_id,
  b.product_id,
  CASE WHEN o.recieve_date < '2025-08-01' THEN b.early_base ELSE b.gap_base END,
  CASE WHEN o.recieve_date < '2025-08-01' THEN b.early_base ELSE b.gap_base END + o.`count`,
  hl.created_at,
  NULL
FROM orders o
JOIN history_lot hl ON hl.status = 'INBOUND' AND hl.order_number = o.order_number
JOIN vendor_item vi ON vi.id = o.vendor_item_id
JOIN (
  SELECT 5 product_id, 0 early_base, 76 gap_base UNION ALL
  SELECT 7, 0, 69 UNION ALL SELECT 13, 0, 135 UNION ALL
  SELECT 15, 0, 174 UNION ALL SELECT 20, 0, 14 UNION ALL
  SELECT 21, 0, 215 UNION ALL SELECT 22, 35, 160 UNION ALL
  SELECT 23, 0, 356 UNION ALL SELECT 24, 0, 371 UNION ALL
  SELECT 25, 0, 142 UNION ALL SELECT 26, 0, 170 UNION ALL
  SELECT 27, 0, 209 UNION ALL SELECT 28, 0, 437 UNION ALL
  SELECT 33, 0, 276 UNION ALL SELECT 35, 0, 189 UNION ALL
  SELECT 58, 0, 290 UNION ALL SELECT 59, 23, 1300 UNION ALL
  SELECT 60, 0, 1400
) b ON b.product_id = vi.product_id
WHERE o.order_number LIKE 'PLA-DEMO-%'
  AND NOT EXISTS (SELECT 1 FROM history h WHERE h.lot_id = hl.id);

INSERT INTO history
  (lot_id, vendor_item_id, product_id, before_count, after_count, created_at, seller_vendor_id)
SELECT
  hl.id,
  NULL,
  o.product_id,
  (CASE WHEN o.order_date < '2025-08-01' THEN b.early_base ELSE b.gap_base END) + o.`count`,
  CASE WHEN o.order_date < '2025-08-01' THEN b.early_base ELSE b.gap_base END,
  hl.created_at,
  o.seller_vendor_id
FROM orders o
JOIN history_lot hl ON hl.status = 'OUTBOUND' AND hl.order_number = o.order_number
JOIN (
  SELECT 5 product_id, 0 early_base, 76 gap_base UNION ALL
  SELECT 7, 0, 69 UNION ALL SELECT 13, 0, 135 UNION ALL
  SELECT 15, 0, 174 UNION ALL SELECT 20, 0, 14 UNION ALL
  SELECT 21, 0, 215 UNION ALL SELECT 22, 35, 160 UNION ALL
  SELECT 23, 0, 356 UNION ALL SELECT 24, 0, 371 UNION ALL
  SELECT 25, 0, 142 UNION ALL SELECT 26, 0, 170 UNION ALL
  SELECT 27, 0, 209 UNION ALL SELECT 28, 0, 437 UNION ALL
  SELECT 33, 0, 276 UNION ALL SELECT 35, 0, 189 UNION ALL
  SELECT 58, 0, 290 UNION ALL SELECT 59, 23, 1300 UNION ALL
  SELECT 60, 0, 1400
) b ON b.product_id = o.product_id
WHERE o.order_number LIKE 'REC-DEMO-%'
  AND NOT EXISTS (SELECT 1 FROM history h WHERE h.lot_id = hl.id);

-- 5) Twelve balanced adjustment pairs for history/report coverage.
INSERT INTO history_lot (user_id, order_number, status, memo, created_at)
SELECT 1,
       CONCAT('ADJ-DEMO-20260909-', IF(x.direction = 1, 'P', 'N'), LPAD(x.product_id, 6, '0')),
       'ADJUST',
       IF(x.direction = 1, 'DEMO 통계 시드 증가 조정', 'DEMO 통계 시드 감소 조정'),
       TIMESTAMP('2026-09-09', ADDTIME('09:00:00', SEC_TO_TIME((x.pos * 2 + x.direction) * 60)))
FROM (
  SELECT m.pos, m.product_id, d.direction
  FROM (
    SELECT 1 pos, 5 product_id UNION ALL SELECT 2, 7 UNION ALL
    SELECT 3, 13 UNION ALL SELECT 4, 15 UNION ALL SELECT 5, 20 UNION ALL
    SELECT 6, 21 UNION ALL SELECT 7, 22 UNION ALL SELECT 8, 23 UNION ALL
    SELECT 9, 24 UNION ALL SELECT 10, 25 UNION ALL SELECT 11, 26 UNION ALL
    SELECT 12, 27
  ) m
  CROSS JOIN (SELECT 1 direction UNION ALL SELECT 2) d
) x
WHERE NOT EXISTS (
  SELECT 1 FROM history_lot hl
  WHERE hl.status = 'ADJUST'
    AND hl.order_number = CONCAT(
      'ADJ-DEMO-20260909-', IF(x.direction = 1, 'P', 'N'), LPAD(x.product_id, 6, '0')
    )
);

INSERT INTO history
  (lot_id, vendor_item_id, product_id, before_count, after_count, created_at, seller_vendor_id)
SELECT
  hl.id,
  NULL,
  s.product_id,
  CASE WHEN hl.order_number LIKE 'ADJ-DEMO-20260909-P%' THEN s.`count` ELSE s.`count` + 5 END,
  CASE WHEN hl.order_number LIKE 'ADJ-DEMO-20260909-P%' THEN s.`count` + 5 ELSE s.`count` END,
  hl.created_at,
  NULL
FROM history_lot hl
JOIN stock s ON LPAD(s.product_id, 6, '0') = RIGHT(hl.order_number, 6)
WHERE hl.status = 'ADJUST'
  AND hl.order_number LIKE 'ADJ-DEMO-20260909-%'
  AND NOT EXISTS (SELECT 1 FROM history h WHERE h.lot_id = hl.id);

COMMIT;
