-- Roll back 20260909_add_nonnegative_stock_constraint.sql.
ALTER TABLE stock
DROP CHECK chk_stock_count_nonnegative;
