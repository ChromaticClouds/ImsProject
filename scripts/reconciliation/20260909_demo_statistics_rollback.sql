-- Removes only the synthetic statistics/report seed rows.
-- Current stock is unchanged by the balanced seed, so no stock rollback is needed.

START TRANSACTION;

DELETE h
FROM history h
JOIN history_lot hl ON hl.id = h.lot_id
WHERE hl.order_number LIKE 'PLA-DEMO-%'
   OR hl.order_number LIKE 'REC-DEMO-%'
   OR hl.order_number LIKE 'ADJ-DEMO-%';

DELETE FROM history_lot
WHERE order_number LIKE 'PLA-DEMO-%'
   OR order_number LIKE 'REC-DEMO-%'
   OR order_number LIKE 'ADJ-DEMO-%';

DELETE FROM orders
WHERE order_number LIKE 'PLA-DEMO-%'
   OR order_number LIKE 'REC-DEMO-%';

COMMIT;
