import emailjs from "@emailjs/browser";

export const TARGET_EMAIL = "codekinetixstudio@gmail.com";

export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_codekinetix",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_codekinetix",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
  recipientEmail: TARGET_EMAIL,
};

export interface SendInquiryParams {
  name: string;
  email: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
}

export async function sendInquiry(
  params: SendInquiryParams
): Promise<{ success: boolean; message?: string }> {
  const templateParams = {
    to_email: TARGET_EMAIL,
    from_name: params.name,
    from_email: params.email,
    service: params.service || "Not Specified",
    budget: params.budget || "Not Specified",
    timeline: params.timeline || "Flexible",
    message: params.message,
    reply_to: params.email,
    submission_date: new Date().toLocaleString(),
  };

  // 1. Try direct EmailJS SDK if public key is configured
  if (
    EMAILJS_CONFIG.publicKey &&
    EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY" &&
    EMAILJS_CONFIG.publicKey.trim().length > 0
  ) {
    try {
      const res = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );
      if (res.status === 200 || res.text === "OK") {
        return { success: true };
      }
    } catch (sdkError) {
      console.warn("Direct EmailJS SDK failed:", sdkError);
    }
  }

  // 2. Client-side fallback message for static export deployment
  return {
    success: false,
    message: "Direct message transmission unavailable. Please email codekinetixstudio@gmail.com directly.",
  };
}
