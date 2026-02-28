import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, reason, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Is it in the Bible? <onboarding@resend.dev>",
      to: "kariskabutu@gmail.com",
      replyTo: email,
      subject: `[Contact] ${reason ?? "General question"} — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1A1612;">
          <h2 style="font-size: 20px; margin-bottom: 4px;">New contact form submission</h2>
          <p style="color: #8A7D72; font-size: 13px; margin-bottom: 24px;">Is it in the Bible? — Contact Form</p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 12px; background: #F5F1E8; font-weight: 600; font-size: 13px; width: 100px; border-radius: 6px 0 0 6px;">Name</td>
              <td style="padding: 10px 12px; background: #F5F1E8; font-size: 13px; border-radius: 0 6px 6px 0;">${name}</td>
            </tr>
            <tr><td colspan="2" style="height: 4px;"></td></tr>
            <tr>
              <td style="padding: 10px 12px; background: #F5F1E8; font-weight: 600; font-size: 13px; border-radius: 6px 0 0 6px;">Email</td>
              <td style="padding: 10px 12px; background: #F5F1E8; font-size: 13px; border-radius: 0 6px 6px 0;"><a href="mailto:${email}" style="color: #1A3A6A;">${email}</a></td>
            </tr>
            <tr><td colspan="2" style="height: 4px;"></td></tr>
            <tr>
              <td style="padding: 10px 12px; background: #F5F1E8; font-weight: 600; font-size: 13px; border-radius: 6px 0 0 6px;">Reason</td>
              <td style="padding: 10px 12px; background: #F5F1E8; font-size: 13px; border-radius: 0 6px 6px 0;">${reason ?? "General question"}</td>
            </tr>
          </table>

          <div style="background: #F5F1E8; border-radius: 8px; padding: 16px 18px; margin-bottom: 24px;">
            <p style="font-weight: 600; font-size: 13px; margin-bottom: 8px;">Message</p>
            <p style="font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="font-size: 12px; color: #8A7D72;">
            Reply directly to this email to respond to ${name} at ${email}.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}