import nodemailer from 'nodemailer';

interface SendContactEmailParams {
  name: string;
  email: string;
  objective?: string;
  details: string;
  recipientEmail?: string;
}

export async function sendContactEmail(params: SendContactEmailParams): Promise<{ success: boolean; error?: string }> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const recipient = params.recipientEmail || process.env.RECIPIENT_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'dhruv.dobariya0641@gmail.com';

  if (!user || !pass) {
    console.warn('[Email Notice] SMTP_USER or SMTP_PASS is missing in environment variables. Email notification skipped (message still saved in Supabase database).');
    return { success: false, error: 'SMTP credentials not configured.' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d10; color: #f5f5f5; padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="color: #60a5fa; margin-top: 0; font-size: 20px; font-weight: 400; letter-spacing: -0.02em;">📩 New Portfolio Contact Inquiry</h2>
        <p style="color: #a0a0a5; font-size: 14px;">You have received a new message from your portfolio contact form:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #888; font-size: 12px; text-transform: uppercase; width: 120px;">Sender Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #fff; font-size: 14px; font-weight: 600;">${params.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #888; font-size: 12px; text-transform: uppercase;">Sender Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #60a5fa; font-size: 14px;"><a href="mailto:${params.email}" style="color: #60a5fa; text-decoration: none;">${params.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #888; font-size: 12px; text-transform: uppercase;">Objective / Topic:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #fff; font-size: 14px;">${params.objective || 'General Inquiry'}</td>
          </tr>
        </table>

        <div style="background-color: #16161b; padding: 20px; border-radius: 8px; border-left: 3px solid #60a5fa; margin-top: 15px;">
          <p style="margin: 0 0 8px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Message Details:</p>
          <p style="margin: 0; color: #f5f5f5; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${params.details}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; color: #666; font-size: 11px;">
          Sent automatically from your portfolio website contact system. Reply directly to <a href="mailto:${params.email}" style="color: #a0a0a5;">${params.email}</a> to respond.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${params.name} via Portfolio" <${user}>`,
      to: recipient,
      replyTo: params.email,
      subject: `New Portfolio Inquiry from ${params.name} [${params.objective || 'Contact Form'}]`,
      text: `New Portfolio Contact Inquiry\n\nFrom: ${params.name} (${params.email})\nObjective: ${params.objective}\n\nDetails:\n${params.details}`,
      html: htmlContent,
    });

    return { success: true };
  } catch (err: any) {
    console.error('Nodemailer SMTP Error:', err);
    return { success: false, error: err.message || 'Email delivery failed.' };
  }
}
