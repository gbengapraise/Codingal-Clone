import { Router, type IRouter } from "express";
import { db, bookingsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { Resend } from "resend";

const router: IRouter = Router();

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "ilesanmipraise16@gmail.com";
const FROM_EMAIL = "onboarding@resend.dev";

function parentConfirmationHtml(childName: string, grade: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#e63946,#f4a261);padding:36px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">Praise Coding Academy</h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">🎉 Free Trial Class Confirmed!</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px;">
                <h2 style="margin:0 0 16px;color:#111827;font-size:22px;font-weight:700;">You're all set!</h2>
                <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.6;">
                  Thank you for booking a free trial class for <strong>${childName}</strong> (${grade}). Our team will be in touch within 24 hours to confirm your class time and share the Zoom link.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3f2;border-radius:12px;padding:20px;margin-bottom:24px;">
                  <tr>
                    <td>
                      <p style="margin:0 0 6px;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Student</p>
                      <p style="margin:0;font-size:16px;color:#111827;font-weight:700;">${childName} · ${grade}</p>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 20px;color:#4b5563;font-size:14px;line-height:1.6;">
                  In the meantime, feel free to browse our courses and see what ${childName} can learn!
                </p>
                <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="background:linear-gradient(135deg,#e63946,#f4a261);border-radius:10px;padding:14px 28px;">
                      <a href="#" style="color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;">Browse Courses →</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;color:#9ca3af;font-size:13px;">Questions? Reply to this email — we're happy to help.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} Praise Coding Academy · Empowering the next generation of coders</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

function ownerNotificationHtml(childName: string, parentEmail: string, phone: string, grade: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:#111827;padding:28px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">🔔 New Booking — Praise Coding Academy</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px;">
                <h2 style="margin:0 0 20px;color:#111827;font-size:20px;font-weight:700;">A new free class was just booked!</h2>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                  ${[
                    ["Student Name", childName],
                    ["Grade", grade],
                    ["Parent Email", parentEmail],
                    ["Phone", phone],
                    ["Booked At", new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })],
                  ].map(([label, value], i) => `
                    <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"}">
                      <td style="padding:12px 16px;font-size:13px;color:#6b7280;font-weight:600;width:140px;">${label}</td>
                      <td style="padding:12px 16px;font-size:14px;color:#111827;font-weight:500;">${value}</td>
                    </tr>
                  `).join("")}
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">Praise Coding Academy Admin Notification</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await db
      .select()
      .from(bookingsTable)
      .orderBy(desc(bookingsTable.createdAt));
    res.json(bookings);
  } catch (err) {
    req.log.error({ err }, "Failed to list bookings");
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.post("/bookings", async (req, res) => {
  const { childName, parentEmail, phone, grade } = req.body as {
    childName: string; parentEmail: string; phone: string; grade: string;
  };

  if (!childName || !parentEmail || !phone || !grade) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [booking] = await db
      .insert(bookingsTable)
      .values({ childName, parentEmail, phone, grade })
      .returning();

    try {
      const resend = getResend();

      // Always send owner notification to OWNER_EMAIL
      const ownerResult = await resend.emails.send({
        from: `Praise Coding Academy <${FROM_EMAIL}>`,
        to: [OWNER_EMAIL],
        subject: `📚 New Booking: ${childName} (${grade})`,
        html: ownerNotificationHtml(childName, parentEmail, phone, grade),
      });

      if (ownerResult.error) {
        req.log.error({ error: ownerResult.error, to: OWNER_EMAIL }, "Owner notification email failed");
      } else {
        req.log.info({ id: ownerResult.data?.id, to: OWNER_EMAIL }, "Owner notification email sent");
      }

      // Try to send parent confirmation; if domain not verified, send copy to owner instead
      const parentResult = await resend.emails.send({
        from: `Praise Coding Academy <${FROM_EMAIL}>`,
        to: [parentEmail],
        subject: `🎉 Free Trial Class Booked for ${childName}!`,
        html: parentConfirmationHtml(childName, grade),
      });

      if (parentResult.error) {
        req.log.warn({ error: parentResult.error, to: parentEmail }, "Parent email blocked (no verified domain) — sending copy to owner");
        await resend.emails.send({
          from: `Praise Coding Academy <${FROM_EMAIL}>`,
          to: [OWNER_EMAIL],
          subject: `[COPY for parent] 🎉 Free Trial Class Booked for ${childName}!`,
          html: parentConfirmationHtml(childName, grade),
        });
      } else {
        req.log.info({ id: parentResult.data?.id, to: parentEmail }, "Parent confirmation email sent");
      }
    } catch (emailErr) {
      req.log.error({ emailErr }, "Email sending threw an exception");
    }

    res.status(201).json({ success: true, bookingId: booking.id });
  } catch (err) {
    req.log.error({ err }, "Failed to create booking");
    res.status(500).json({ error: "Failed to create booking" });
  }
});

export default router;
