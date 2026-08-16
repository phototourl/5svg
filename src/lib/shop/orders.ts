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
  DOWNLOAD_TTL_DAYS,
} from "@/lib/db/orders-repo";
