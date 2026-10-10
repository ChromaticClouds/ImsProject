-- Apply once per database before deploying the matching application version.
-- The production profile runs with ddl-auto=validate, so the application will not start without this table.
--
-- One row per purchase order number. The unique key decides which request sends the order,
-- and status records whether the mail has gone out independently of orders.status.
CREATE TABLE IF NOT EXISTS `purchase_order_dispatch` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attempts` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `idempotency_key` varchar(255) NOT NULL,
  `last_error` varchar(500) DEFAULT NULL,
  `order_number` varchar(255) NOT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `status` enum('FAILED','SENDING','SENT') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_purchase_order_dispatch_order_number` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
