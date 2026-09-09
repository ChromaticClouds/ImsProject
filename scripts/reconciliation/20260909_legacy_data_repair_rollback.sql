-- Roll back 20260909_legacy_data_repair.sql.

DELETE h
FROM history h
JOIN history_lot hl ON hl.id = h.lot_id
WHERE hl.order_number LIKE 'ADJ-LEGACY-GAP-%'
   OR hl.order_number = 'ADJ-LEGACY-STOCK-20260909';

DELETE FROM history_lot
WHERE order_number LIKE 'ADJ-LEGACY-GAP-%'
   OR order_number = 'ADJ-LEGACY-STOCK-20260909';

INSERT INTO orders (
  id,
  user_id,
  order_number,
  order_date,
  recieve_date,
  count,
  qty_changed,
  lead_time,
  status,
  vendor_item_id,
  product_id,
  seller_vendor_id,
  manager_id
)
SELECT id,
       user_id,
       order_number,
       order_date,
       recieve_date,
       count,
       qty_changed,
       lead_time,
       status,
       vendor_item_id,
       product_id,
       seller_vendor_id,
       manager_id
FROM reconciliation_backup_20260909_orders
WHERE 1 = 1
ON DUPLICATE KEY UPDATE
  user_id = VALUES(user_id),
  order_number = VALUES(order_number),
  order_date = VALUES(order_date),
  recieve_date = VALUES(recieve_date),
  count = VALUES(count),
  qty_changed = VALUES(qty_changed),
  lead_time = VALUES(lead_time),
  status = VALUES(status),
  vendor_item_id = VALUES(vendor_item_id),
  product_id = VALUES(product_id),
  seller_vendor_id = VALUES(seller_vendor_id),
  manager_id = VALUES(manager_id);

INSERT INTO history_lot (id, user_id, order_number, status, memo, created_at)
SELECT id, user_id, order_number, status, memo, created_at
FROM reconciliation_backup_20260909_history_lot
WHERE 1 = 1
ON DUPLICATE KEY UPDATE
  user_id = VALUES(user_id),
  order_number = VALUES(order_number),
  status = VALUES(status),
  memo = VALUES(memo),
  created_at = VALUES(created_at);

DROP TABLE reconciliation_backup_20260909_orders;

DROP TABLE reconciliation_backup_20260909_history_lot;
