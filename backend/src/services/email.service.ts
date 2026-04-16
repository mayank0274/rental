import nodemailer from "nodemailer";
import { envConfig } from "../envConfig.ts";
import logger from "../config/logger.ts";

const hasSmtpConfig =
    envConfig.SMTP_HOST &&
    envConfig.SMTP_PORT &&
    envConfig.SMTP_USER &&
    envConfig.SMTP_PASS;

const transporter = hasSmtpConfig
    ? nodemailer.createTransport({
          host: envConfig.SMTP_HOST!,
          port: envConfig.SMTP_PORT!,
          secure: envConfig.SMTP_PORT === 465,
          auth: {
              user: envConfig.SMTP_USER!,
              pass: envConfig.SMTP_PASS!,
          },
      })
    : null;

export const sendNewMessageEmail = async (
    toEmail: string,
    senderName: string,
    itemTitle: string,
    messagePreview: string
): Promise<void> => {
    if (!transporter) {
        logger.warn("SMTP not configured — skipping email notification");
        return;
    }

    const fromAddress = envConfig.SMTP_FROM || envConfig.SMTP_USER!;

    try {
        await transporter.sendMail({
            from: `"Rental App" <${fromAddress}>`,
            to: toEmail,
            subject: `New message about "${itemTitle}"`,
            text: `${senderName} sent you a message about "${itemTitle}":\n\n"${messagePreview}"\n\nLog in to reply.`,
            html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                    <h2 style="color: #333;">New message received</h2>
                    <p><strong>${senderName}</strong> sent you a message about <strong>"${itemTitle}"</strong>:</p>
                    <blockquote style="border-left: 3px solid #7c3aed; padding-left: 12px; color: #555;">
                        ${messagePreview}
                    </blockquote>
                    <p style="margin-top: 24px;">
                        <a href="${envConfig.FRONTEND_URL}" style="background: #7c3aed; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
                            Log in to reply
                        </a>
                    </p>
                </div>
            `,
        });

        logger.info(`Email notification sent to ${toEmail}`);
    } catch (err) {
        logger.error(`Failed to send email notification: ${err}`);
    }
};
