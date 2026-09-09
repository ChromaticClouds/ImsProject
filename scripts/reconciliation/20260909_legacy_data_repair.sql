-- Synthetic legacy data reconciliation (2026-09-09)
--
-- Goals:
--   1. Preserve every changed/deleted source row in backup tables.
--   2. Repair deterministic metadata only (timestamps, actors, order links).
--   3. Represent historical discontinuities as explicit ADJUST events instead of
--      rewriting the original movement history.
--   4. Reconcile the latest history balance to stock without changing stock.
--
-- The script is idempotent. Run the companion rollback script to restore the
-- pre-reconciliation rows and remove generated adjustment history.

CREATE TABLE IF NOT EXISTS reconciliation_backup_20260909_history_lot LIKE history_lot;

CREATE TABLE IF NOT EXISTS reconciliation_backup_20260909_orders LIKE orders;

INSERT IGNORE INTO reconciliation_backup_20260909_history_lot
SELECT hl.*
FROM history_lot hl
WHERE NOT EXISTS (
        SELECT 1
        FROM history h
        WHERE h.lot_id = hl.id
      )
   OR (
        EXISTS (
          SELECT 1
          FROM history h
          WHERE h.lot_id = hl.id
        )
        AND (
          hl.created_at IS NULL
          OR hl.user_id IS NULL
          OR hl.order_number IS NULL
        )
      );

INSERT IGNORE INTO reconciliation_backup_20260909_orders
SELECT o.*
FROM orders o
WHERE o.id IN (379, 381, 389, 411, 434, 436, 437, 453, 486, 487, 491);

-- The two zero-quantity lines below have exact inbound-history counterparts.
UPDATE orders
SET count = CASE id WHEN 379 THEN 30 WHEN 381 THEN 20 END,
    qty_changed = 1
WHERE id IN (379, 381)
  AND status = 'INBOUND_COMPLETE'
  AND count = 0;

-- This completed zero-quantity row has no corresponding movement history.
DELETE FROM orders
WHERE id = 389
  AND order_number = 'PLA-20260214-000013'
  AND status = 'INBOUND_COMPLETE'
  AND count = 0;

-- For completed synthetic inbound orders, the creator is the only known actor.
UPDATE orders
SET manager_id = user_id
WHERE id IN (434, 436, 437)
  AND status = 'INBOUND_COMPLETE'
  AND manager_id IS NULL;

-- Correct impossible pending outbound dates with the smallest valid offset.
UPDATE orders
SET recieve_date = DATE_ADD(order_date, INTERVAL 1 DAY)
WHERE id IN (411, 453, 486, 487, 491)
  AND status = 'OUTBOUND_PENDING'
  AND recieve_date < order_date;

-- A lot timestamp is deterministically derived from its first movement.
UPDATE history_lot hl
JOIN (
  SELECT h.lot_id, MIN(h.created_at) AS first_created_at
  FROM history h
  WHERE h.lot_id IS NOT NULL
  GROUP BY h.lot_id
) first_history ON first_history.lot_id = hl.id
SET hl.created_at = first_history.first_created_at
WHERE hl.created_at IS NULL;

-- Backfill inbound order numbers only for one-to-one date/item/quantity matches.
UPDATE history_lot hl
JOIN (
  WITH lot_signature AS (
    SELECT source_lot.id AS lot_id,
           DATE(MIN(h.created_at)) AS event_date,
           GROUP_CONCAT(
             CONCAT(h.vendor_item_id, ':', h.after_count - h.before_count)
             ORDER BY h.vendor_item_id, h.id SEPARATOR '|'
           ) AS signature
    FROM history_lot source_lot
    JOIN history h ON h.lot_id = source_lot.id
    WHERE source_lot.status = 'INBOUND'
      AND source_lot.order_number IS NULL
    GROUP BY source_lot.id
  ),
  order_signature AS (
    SELECT o.order_number,
           o.recieve_date,
           GROUP_CONCAT(
             CONCAT(o.vendor_item_id, ':', o.count)
             ORDER BY o.vendor_item_id, o.id SEPARATOR '|'
           ) AS signature
    FROM orders o
    WHERE o.status = 'INBOUND_COMPLETE'
    GROUP BY o.order_number, o.recieve_date
  ),
  candidates AS (
    SELECT lot_signature.lot_id, order_signature.order_number
    FROM lot_signature
    JOIN order_signature
      ON order_signature.recieve_date = lot_signature.event_date
     AND order_signature.signature = lot_signature.signature
  ),
  unique_lots AS (
    SELECT lot_id, MIN(order_number) AS order_number, COUNT(*) AS candidate_count
    FROM candidates
    GROUP BY lot_id
  ),
  unique_orders AS (
    SELECT order_number, MIN(lot_id) AS lot_id, COUNT(*) AS candidate_count
    FROM candidates
    GROUP BY order_number
  )
  SELECT unique_lots.lot_id, unique_lots.order_number
  FROM unique_lots
  JOIN unique_orders
    ON unique_orders.order_number = unique_lots.order_number
   AND unique_orders.lot_id = unique_lots.lot_id
  WHERE unique_lots.candidate_count = 1
    AND unique_orders.candidate_count = 1
) matched ON matched.lot_id = hl.id
SET hl.order_number = matched.order_number
WHERE hl.order_number IS NULL;

-- Backfill outbound order numbers under the same one-to-one rule.
UPDATE history_lot hl
JOIN (
  WITH lot_signature AS (
    SELECT source_lot.id AS lot_id,
           DATE(MIN(h.created_at)) AS event_date,
           GROUP_CONCAT(
             CONCAT(h.product_id, ':', h.seller_vendor_id, ':', h.before_count - h.after_count)
             ORDER BY h.product_id, h.seller_vendor_id, h.id SEPARATOR '|'
           ) AS signature
    FROM history_lot source_lot
    JOIN history h ON h.lot_id = source_lot.id
    WHERE source_lot.status = 'OUTBOUND'
      AND source_lot.order_number IS NULL
    GROUP BY source_lot.id
  ),
  order_signature AS (
    SELECT o.order_number,
           o.order_date,
           GROUP_CONCAT(
             CONCAT(o.product_id, ':', o.seller_vendor_id, ':', o.count)
             ORDER BY o.product_id, o.seller_vendor_id, o.id SEPARATOR '|'
           ) AS signature
    FROM orders o
    WHERE o.status = 'OUTBOUND_COMPLETE'
    GROUP BY o.order_number, o.order_date
  ),
  candidates AS (
    SELECT lot_signature.lot_id, order_signature.order_number
    FROM lot_signature
    JOIN order_signature
      ON order_signature.order_date = lot_signature.event_date
     AND order_signature.signature = lot_signature.signature
  ),
  unique_lots AS (
    SELECT lot_id, MIN(order_number) AS order_number, COUNT(*) AS candidate_count
    FROM candidates
    GROUP BY lot_id
  ),
  unique_orders AS (
    SELECT order_number, MIN(lot_id) AS lot_id, COUNT(*) AS candidate_count
    FROM candidates
    GROUP BY order_number
  )
  SELECT unique_lots.lot_id, unique_lots.order_number
  FROM unique_lots
  JOIN unique_orders
    ON unique_orders.order_number = unique_lots.order_number
   AND unique_orders.lot_id = unique_lots.lot_id
  WHERE unique_lots.candidate_count = 1
    AND unique_orders.candidate_count = 1
) matched ON matched.lot_id = hl.id
SET hl.order_number = matched.order_number
WHERE hl.order_number IS NULL;

-- Lot 1953 is one day earlier than the planned receipt date, but its two-line
-- item/quantity signature is unique and exactly matches this completed order.
UPDATE history_lot
SET order_number = 'PLA-20260216-000009',
    user_id = 1
WHERE id = 1953
  AND status = 'INBOUND'
  AND order_number IS NULL
  AND user_id IS NULL;

-- Infer a missing lot actor from the now-linked completed order.
UPDATE history_lot hl
JOIN (
  SELECT order_number, MIN(user_id) AS creator_id
  FROM orders
  WHERE status = 'INBOUND_COMPLETE'
  GROUP BY order_number
) completed_order ON completed_order.order_number = hl.order_number
SET hl.user_id = completed_order.creator_id
WHERE hl.status = 'INBOUND'
  AND hl.user_id IS NULL;

-- Remove empty legacy lot shells only after their rows have been backed up.
DELETE hl
FROM history_lot hl
WHERE NOT EXISTS (
  SELECT 1
  FROM history h
  WHERE h.lot_id = hl.id
);

-- Create one auditable adjustment lot for every historical continuity gap.
INSERT INTO history_lot (user_id, order_number, status, memo, created_at)
WITH movement_sequence AS (
  SELECT h.id,
         h.product_id,
         h.before_count,
         h.created_at,
         LAG(h.after_count) OVER (
           PARTITION BY h.product_id
           ORDER BY h.created_at, h.id
         ) AS previous_after
  FROM history h
)
SELECT 1,
       CONCAT('ADJ-LEGACY-GAP-', movement_sequence.id),
       'ADJUST',
       '합성 레거시 이력 단절 보정',
       DATE_SUB(movement_sequence.created_at, INTERVAL 1 SECOND)
FROM movement_sequence
WHERE movement_sequence.previous_after IS NOT NULL
  AND movement_sequence.before_count <> movement_sequence.previous_after
  AND NOT EXISTS (
    SELECT 1
    FROM history_lot existing_lot
    WHERE existing_lot.status = 'ADJUST'
      AND existing_lot.order_number = CONCAT('ADJ-LEGACY-GAP-', movement_sequence.id)
  );

INSERT INTO history (
  lot_id,
  vendor_item_id,
  product_id,
  before_count,
  after_count,
  created_at,
  seller_vendor_id
)
WITH movement_sequence AS (
  SELECT h.id,
         h.product_id,
         h.before_count,
         h.created_at,
         LAG(h.after_count) OVER (
           PARTITION BY h.product_id
           ORDER BY h.created_at, h.id
         ) AS previous_after
  FROM history h
  WHERE NOT EXISTS (
    SELECT 1
    FROM history_lot generated_lot
    WHERE generated_lot.id = h.lot_id
      AND generated_lot.order_number LIKE 'ADJ-LEGACY-GAP-%'
  )
)
SELECT adjustment_lot.id,
       NULL,
       movement_sequence.product_id,
       movement_sequence.previous_after,
       movement_sequence.before_count,
       DATE_SUB(movement_sequence.created_at, INTERVAL 1 SECOND),
       NULL
FROM movement_sequence
JOIN history_lot adjustment_lot
  ON adjustment_lot.status = 'ADJUST'
 AND adjustment_lot.order_number = CONCAT('ADJ-LEGACY-GAP-', movement_sequence.id)
WHERE movement_sequence.previous_after IS NOT NULL
  AND movement_sequence.before_count <> movement_sequence.previous_after
  AND NOT EXISTS (
    SELECT 1
    FROM history existing_history
    WHERE existing_history.lot_id = adjustment_lot.id
  );

-- Reconcile the current balance to stock as a final, explicit adjustment.
INSERT INTO history_lot (user_id, order_number, status, memo, created_at)
SELECT 1,
       'ADJ-LEGACY-STOCK-20260909',
       'ADJUST',
       '합성 레거시 최종 재고 정합성 보정',
       NOW()
WHERE NOT EXISTS (
  SELECT 1
  FROM history_lot
  WHERE status = 'ADJUST'
    AND order_number = 'ADJ-LEGACY-STOCK-20260909'
);

INSERT INTO history (
  lot_id,
  vendor_item_id,
  product_id,
  before_count,
  after_count,
  created_at,
  seller_vendor_id
)
WITH latest_history AS (
  SELECT h.product_id,
         h.after_count,
         ROW_NUMBER() OVER (
           PARTITION BY h.product_id
           ORDER BY h.created_at DESC, h.id DESC
         ) AS row_num
  FROM history h
)
SELECT adjustment_lot.id,
       NULL,
       stock.product_id,
       latest_history.after_count,
       stock.count,
       adjustment_lot.created_at,
       NULL
FROM stock
JOIN latest_history
  ON latest_history.product_id = stock.product_id
 AND latest_history.row_num = 1
JOIN history_lot adjustment_lot
  ON adjustment_lot.status = 'ADJUST'
 AND adjustment_lot.order_number = 'ADJ-LEGACY-STOCK-20260909'
WHERE stock.count <> latest_history.after_count
  AND NOT EXISTS (
    SELECT 1
    FROM history existing_history
    WHERE existing_history.lot_id = adjustment_lot.id
      AND existing_history.product_id = stock.product_id
  );

-- Post-run assertions. Every query should return zero.
SELECT COUNT(*) AS invalid_completed_quantity
FROM orders
WHERE status IN ('INBOUND_COMPLETE', 'OUTBOUND_COMPLETE')
  AND count <= 0;

SELECT COUNT(*) AS completed_without_manager
FROM orders
WHERE status IN ('INBOUND_COMPLETE', 'OUTBOUND_COMPLETE')
  AND manager_id IS NULL;

SELECT COUNT(*) AS invalid_pending_outbound_date
FROM orders
WHERE status = 'OUTBOUND_PENDING'
  AND recieve_date < order_date;

SELECT COUNT(*) AS nonempty_lot_without_timestamp
FROM history_lot hl
WHERE hl.created_at IS NULL
  AND EXISTS (SELECT 1 FROM history h WHERE h.lot_id = hl.id);

SELECT COUNT(*) AS empty_history_lot
FROM history_lot hl
WHERE NOT EXISTS (SELECT 1 FROM history h WHERE h.lot_id = hl.id);

WITH movement_sequence AS (
  SELECT h.product_id,
         h.before_count,
         LAG(h.after_count) OVER (
           PARTITION BY h.product_id
           ORDER BY h.created_at, h.id
         ) AS previous_after
  FROM history h
)
SELECT COUNT(*) AS history_continuity_breaks
FROM movement_sequence
WHERE previous_after IS NOT NULL
  AND before_count <> previous_after;

WITH latest_history AS (
  SELECT h.product_id,
         h.after_count,
         ROW_NUMBER() OVER (
           PARTITION BY h.product_id
           ORDER BY h.created_at DESC, h.id DESC
         ) AS row_num
  FROM history h
)
SELECT COUNT(*) AS stock_latest_history_mismatches
FROM stock
JOIN latest_history
  ON latest_history.product_id = stock.product_id
 AND latest_history.row_num = 1
WHERE stock.count <> latest_history.after_count;

-- Informational residuals: NULL is valid for unassigned pending work and for
-- legacy lots that cannot be linked to an order without guessing.
SELECT status, COUNT(*) AS pending_without_manager
FROM orders
WHERE status IN ('INBOUND_PENDING', 'OUTBOUND_PENDING')
  AND manager_id IS NULL
GROUP BY status
ORDER BY status;

SELECT status, COUNT(*) AS unlinked_legacy_lot
FROM history_lot
WHERE order_number IS NULL
GROUP BY status
ORDER BY status;
