-- Defense in depth: no write path may persist negative inventory.
ALTER TABLE stock
ADD CONSTRAINT chk_stock_count_nonnegative
CHECK (`count` >= 0);
