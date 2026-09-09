-- Read-only audit queries for inventory/order consistency.

-- 1) Manager assignment gaps by order status.
SELECT
    status,
    COUNT(*) AS row_count,
    COUNT(DISTINCT order_number) AS order_group_count,
    SUM(manager_id IS NULL) AS null_manager_count
FROM `orders`
GROUP BY status
ORDER BY status;

-- 2) History rows whose product differs from the vendor item master.
SELECT COUNT(*) AS mismatched_history_rows
FROM history h
JOIN vendor_item vi ON vi.id = h.vendor_item_id
WHERE h.product_id <> vi.product_id;

-- 3) Empty history lots and missing audit metadata.
SELECT
    hl.status,
    COUNT(*) AS lot_count,
    SUM(h.id IS NULL) AS empty_lot_count,
    SUM(hl.user_id IS NULL) AS null_actor_count,
    SUM(hl.order_number IS NULL) AS null_order_number_count,
    SUM(hl.created_at IS NULL) AS null_created_at_count
FROM history_lot hl
LEFT JOIN history h ON h.lot_id = hl.id
GROUP BY hl.status
ORDER BY hl.status;

-- 4) Inventory history continuity by product.
WITH ordered_history AS (
    SELECT
        h.product_id,
        h.id,
        h.created_at,
        h.before_count,
        h.after_count,
        LAG(h.after_count) OVER (
            PARTITION BY h.product_id
            ORDER BY h.created_at, h.id
        ) AS previous_after_count
    FROM history h
)
SELECT
    product_id,
    COUNT(*) AS broken_chain_count
FROM ordered_history
WHERE previous_after_count IS NOT NULL
  AND before_count <> previous_after_count
GROUP BY product_id
ORDER BY broken_chain_count DESC, product_id;

-- 5) Orphan rows and negative stock.
SELECT COUNT(*) AS orphan_stock_rows
FROM stock s
LEFT JOIN product p ON p.id = s.product_id
WHERE p.id IS NULL;

SELECT
    COUNT(*) AS stock_row_count,
    SUM(`count` < 0) AS negative_stock_rows,
    MIN(`count`) AS minimum_stock_count
FROM stock;
