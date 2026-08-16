/**
 * Shop orders — MySQL when DATABASE_URL / MYSQL_* set, else local JSON file (mock).
 */
export {
  createPendingOrder,
  getOrderByToken,
  setOrderStatus,
  markOrderPaid,
  claimOrderEmailSend,
  releaseOrderEmailClaim,
  bumpDownloadCount,
  isOrderDownloadExpired,
  isOrderDownloadLimitReached,
  DOWNLOAD_TTL_DAYS,
  MAX_DOWNLOADS_PER_ORDER,
} from "@/lib/db/orders-repo";
