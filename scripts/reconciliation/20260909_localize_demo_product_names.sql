-- Replace the two runtime English sample labels with real domestic product names.
-- IDs, product codes, quantities, prices, stock, and history relationships are unchanged.

START TRANSACTION;

UPDATE product
SET
  name = CASE id
    WHEN 100 THEN '화요25 500ml'
    WHEN 101 THEN '대선 360ml'
  END,
  brand = CASE id
    WHEN 100 THEN '화요'
    WHEN 101 THEN '대선주조'
  END
WHERE (id = 100 AND product_code = 'RUNTIME-20260909-001'
       AND name = 'Traditional Rice Wine 500ml')
   OR (id = 101 AND product_code = 'RUNTIME-20260909-002'
       AND name = 'Soju Classic 360ml');

COMMIT;
