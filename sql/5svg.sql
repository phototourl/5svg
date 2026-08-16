-- =============================================================================
-- 5SVG 商店库表（MySQL 8+ / utf8mb4）
-- 参考 EditStamp：payment 访客一次付费 + export_token 解锁下载（一期不做登录）
--
-- 当前范围：
--   - 访客购买 Bundle（邮箱 + order_token → ZIP 下载）
--   - Creem 商品 ID 映射
--   - Webhook 幂等日志
--   - 联系表单留言
--
-- 后期预留：
--   - user / session / account 登录
--   - 订阅
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `5svg`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `5svg`;

-- ----------------------------
-- Table structure for shop_creem_product
-- 本地 Bundle slug（craft-catalog）↔ Creem 商品 ID + 标价
-- Creem 开店建商品后，再回填 creem_product_id
-- ----------------------------
DROP TABLE IF EXISTS `shop_creem_product`;
CREATE TABLE `shop_creem_product` (
  `id` varchar(64) NOT NULL COMMENT '内部ID（uuid 或固定键）',
  `product_slug` varchar(128) NOT NULL COMMENT '商品 slug，对应 craft-catalog，如 craft-halloween-pack',
  `title` varchar(255) NOT NULL COMMENT '展示标题',
  `creem_product_id` varchar(128) NULL DEFAULT NULL COMMENT 'Creem 商品ID（prod_xxx），开店前可为空',
  `amount_cents` int NOT NULL COMMENT '标价（美分，如 450 = $4.50）',
  `currency` varchar(8) NOT NULL DEFAULT 'USD' COMMENT '币种',
  `status` varchar(32) NOT NULL DEFAULT 'live' COMMENT '状态：draft草稿/live上架/archived下架',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_shop_creem_product_slug` (`product_slug`) USING BTREE,
  UNIQUE KEY `uk_shop_creem_product_creem_id` (`creem_product_id`) USING BTREE,
  KEY `idx_shop_creem_product_status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bundle 与 Creem 商品映射表';

-- ----------------------------
-- Records of shop_creem_product（creem_product_id 待 Creem 审批后填写）
-- ----------------------------
INSERT INTO `shop_creem_product` (`id`, `product_slug`, `title`, `creem_product_id`, `amount_cents`, `currency`, `status`) VALUES
('prod_craft_halloween', 'craft-halloween-pack', 'Halloween Craft Pack', NULL, 450, 'USD', 'live'),
('prod_craft_christmas', 'craft-christmas-pack', 'Christmas Craft Pack', NULL, 450, 'USD', 'live'),
('prod_craft_fall', 'craft-fall-pack', 'Fall & Autumn Pack', NULL, 450, 'USD', 'live'),
('prod_craft_patriotic', 'craft-patriotic-pack', 'Patriotic Flag Pack', NULL, 450, 'USD', 'live'),
('prod_craft_family', 'craft-family-labels-pack', 'Family & Labels Pack', NULL, 450, 'USD', 'live'),
('prod_craft_wellness', 'craft-wellness-love-pack', 'Wellness & Love Pack', NULL, 450, 'USD', 'live'),
('prod_craft_shapes', 'craft-shapes-extras-pack', 'Shapes & Extras Pack', NULL, 450, 'USD', 'live'),
('prod_craft_stamp', 'craft-stamp-seals-pack', 'Stamp & Seal Pack', NULL, 450, 'USD', 'live');

-- ----------------------------
-- Table structure for shop_order
-- 访客 Bundle 订单（对齐 EditStamp payment 访客字段 + export_token）
-- order_token：支付成功回跳 / 下载 ZIP 用的公开令牌
-- user_id：后期登录预留，一期为空且无外键
-- ----------------------------
DROP TABLE IF EXISTS `shop_order`;
CREATE TABLE `shop_order` (
  `id` varchar(64) NOT NULL COMMENT '订单ID (UUID)',
  `order_token` varchar(64) NOT NULL COMMENT '下载令牌（类似 EditStamp export_token）',
  `product_slug` varchar(128) NOT NULL COMMENT '下单时的 Bundle slug',
  `creem_product_id` varchar(128) NULL DEFAULT NULL COMMENT '结账使用的 Creem 商品ID (prod_xxx)',
  `guest_email` varchar(255) NOT NULL COMMENT '访客邮箱（收据与再次下载）',
  `user_id` varchar(64) NULL DEFAULT NULL COMMENT '用户ID（访客支付可为空，后期登录用）',
  `amount_cents` int NOT NULL COMMENT '实付金额（美分）',
  `currency` varchar(8) NOT NULL DEFAULT 'USD' COMMENT '币种',
  `status` varchar(32) NOT NULL DEFAULT 'pending' COMMENT '订单状态：pending待付/paid已付/failed失败/refunded已退',
  `paid` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已支付',
  `creem_checkout_id` varchar(128) NULL DEFAULT NULL COMMENT 'Creem Checkout Session ID (ch_xxx)',
  `creem_order_id` varchar(128) NULL DEFAULT NULL COMMENT 'Creem 订单/发票ID (ord_xxx，防重复)',
  `creem_customer_id` varchar(128) NULL DEFAULT NULL COMMENT 'Creem 客户ID (cust_xxx)',
  `download_count` int NOT NULL DEFAULT 0 COMMENT 'ZIP 已下载次数',
  `email_sent` tinyint(1) NOT NULL DEFAULT 0 COMMENT '收据/下载邮件是否已发送',
  `device_type` varchar(32) NULL DEFAULT NULL COMMENT '结账设备：desktop/mobile/tablet/bot',
  `device_os` varchar(64) NULL DEFAULT NULL COMMENT '结账操作系统',
  `device_browser` varchar(64) NULL DEFAULT NULL COMMENT '结账浏览器',
  `device_user_agent` varchar(255) NULL DEFAULT NULL COMMENT '结账 User-Agent',
  `paid_at` timestamp NULL DEFAULT NULL COMMENT '支付完成时间',
  `expires_at` timestamp NULL DEFAULT NULL COMMENT '备用下载链接过期时间（默认支付后30天）',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_shop_order_token` (`order_token`) USING BTREE,
  UNIQUE KEY `uk_shop_order_creem_order` (`creem_order_id`) USING BTREE,
  KEY `idx_shop_order_email` (`guest_email`) USING BTREE,
  KEY `idx_shop_order_status_paid` (`status`, `paid`) USING BTREE,
  KEY `idx_shop_order_checkout` (`creem_checkout_id`) USING BTREE,
  KEY `idx_shop_order_slug` (`product_slug`) USING BTREE,
  KEY `idx_shop_order_user` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='访客 Bundle 订单表（Creem 一次付费）';

-- ----------------------------
-- Table structure for creem_webhook_event
-- Webhook 原始载荷与幂等处理记录
-- ----------------------------
DROP TABLE IF EXISTS `creem_webhook_event`;
CREATE TABLE `creem_webhook_event` (
  `id` varchar(64) NOT NULL COMMENT '内部记录ID',
  `event_id` varchar(128) NULL DEFAULT NULL COMMENT 'Creem 事件ID（若有）',
  `event_type` varchar(128) NOT NULL COMMENT '事件类型，如 checkout.completed',
  `creem_checkout_id` varchar(128) NULL DEFAULT NULL COMMENT '关联 Checkout ID',
  `creem_order_id` varchar(128) NULL DEFAULT NULL COMMENT '关联订单/发票ID',
  `payload_json` mediumtext NOT NULL COMMENT '原始 JSON 正文',
  `processed` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已处理',
  `process_error` varchar(512) NULL DEFAULT NULL COMMENT '处理失败原因',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '接收时间',
  `processed_at` timestamp NULL DEFAULT NULL COMMENT '处理完成时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_creem_webhook_event_id` (`event_id`) USING BTREE,
  KEY `idx_creem_webhook_processed` (`processed`) USING BTREE,
  KEY `idx_creem_webhook_checkout` (`creem_checkout_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Creem Webhook 审计/幂等表';

-- ----------------------------
-- Table structure for contact_messages
-- ----------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '姓名',
  `email` varchar(255) NOT NULL COMMENT '邮箱',
  `message` text NOT NULL COMMENT '留言内容',
  `status` enum('new','read','replied') NOT NULL DEFAULT 'new' COMMENT '状态：new新建/read已读/replied已回复',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_contact_status_created` (`status`, `created_at`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='联系留言表';

-- ----------------------------
-- 后期（暂不建表）：对齐 EditStamp 的 user / session / account / verification
-- 登录开通后：shop_order.user_id → user.id 外键
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
