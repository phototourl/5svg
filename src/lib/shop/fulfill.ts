import { markOrderPaid } from "./orders";
import { trySendOrderDownloadEmailOnce } from "@/lib/mail/order-download-email";

export type FulfillPaidOrderInput = {
  orderToken: string;
  /** Skip markOrderPaid when already paid (still try email). */
  alreadyPaid?: boolean;
  creemCheckoutId?: string;
  creemOrderId?: string;
  creemCustomerId?: string;
  localePathPrefix?: string;
  locale?: string | null;
};

/**
 * Mark order paid (unless already) and send download email once.
 * Shared by webhook + syncShopCheckout.
 */
export async function fulfillPaidOrder(
  input: FulfillPaidOrderInput,
): Promise<{ emailSent: boolean }> {
  if (!input.alreadyPaid) {
    await markOrderPaid(input.orderToken, input.creemCheckoutId, {
      creemOrderId: input.creemOrderId,
      creemCustomerId: input.creemCustomerId,
    });
  }

  const emailSent = await trySendOrderDownloadEmailOnce({
    orderToken: input.orderToken,
    localePathPrefix: input.localePathPrefix,
    locale: input.locale,
  });

  return { emailSent };
}
