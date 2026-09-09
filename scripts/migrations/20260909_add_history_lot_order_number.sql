-- Apply once per database before deploying the matching application version.
-- Existing rows intentionally remain NULL because their order/time cannot be inferred safely.
ALTER TABLE history_lot
    ADD COLUMN order_number VARCHAR(255) NULL AFTER user_id,
    ADD COLUMN created_at TIMESTAMP NULL DEFAULT NULL AFTER memo,
    ADD UNIQUE KEY uk_history_lot_status_order_number (status, order_number),
    ADD KEY idx_history_lot_created_at (created_at);
