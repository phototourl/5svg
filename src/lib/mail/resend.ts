import { Resend } from "resend";
import { env } from "$env/dynamic/private";
import { brand } from "@/brand";

function getResend(): Resend | null {
  const key = env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export function getMailFrom(): string {
  return (
    env.RESEND_FROM_EMAIL?.trim() ||
    `5SVG <${brand.supportEmail}>`
  );
}

export async function sendRawEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[mail] RESEND_API_KEY missing — skip send");
    return false;
  }

  const { error } = await resend.emails.send({
    from: getMailFrom(),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    // No attachments — link-only (EditStamp style)
  });

  if (error) {
    console.error("[mail] send failed:", error);
    return false;
  }
  return true;
}
