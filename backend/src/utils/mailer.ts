import nodemailer from 'nodemailer';
import { config } from '../config';

// Initialize Nodemailer SMTP Transporter
export const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465, // true for 465, false for 587
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: SendEmailOptions): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: `"Brain Bari Technologies" <${config.smtp.user}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]+>/g, ''),
      html,
    });
    console.log(`✉️ Email successfully dispatched to ${to} (MessageID: ${info.messageId})`);
    return true;
  } catch (error: any) {
    console.error(`❌ Failed to send email to ${to}:`, error?.message || error);
    if (error?.code === 'EAUTH') {
      console.warn(`
=============================================================
⚠️ [GMAIL SMTP AUTHENTICATION ERROR 535-5.7.8]
⚠️ Google rejected the app password: "${config.smtp.pass}".
⚠️ Reason: The Gmail App Password is invalid, expired, or 2FA was modified.
👉 Fix: Generate a fresh 16-character App Password at:
   https://myaccount.google.com/apppasswords
   and update SMTP_PASS in backend/.env
=============================================================
      `);
    }
    return false;
  }
};

export const MailerService = {
  // Send 6-digit OTP for Registration Verification
  sendRegisterOtp: async ({ email, name, otp }: { email: string; name: string; otp: string }) => {
    console.log('\n=============================================================');
    console.log(`🔐 [ADMIN REGISTRATION OTP CODE]: ${otp}`);
    console.log(`📧 Target Email: ${email} | Name: ${name}`);
    console.log('=============================================================\n');

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1e3a8a; font-size: 24px; margin: 0; font-weight: 700;">Brain Bari Technologies</h1>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Admin Portal Registration</p>
        </div>
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 8px 0;">Verify Your Email Address</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
            Hello <strong>${name}</strong>, use the following one-time verification code (OTP) to complete your admin account setup:
          </p>
          <div style="display: inline-block; letter-spacing: 8px; font-size: 32px; font-weight: 800; color: #2563eb; background: #ffffff; padding: 14px 28px; border-radius: 10px; border: 2px dashed #93c5fd; margin: 10px 0;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 12px; margin: 16px 0 0 0;">
            ⏳ This verification code expires in <strong>10 minutes</strong>.
          </p>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-top: 24px; text-align: center;">
          If you did not attempt to register on Brain Bari Admin, please ignore this email.
        </p>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          © ${new Date().getFullYear()} Brain Bari Technologies. All rights reserved.
        </p>
      </div>
    `;
    return await sendEmail({
      to: email,
      subject: `🔐 ${otp} is your Brain Bari Admin Verification Code`,
      html,
    });
  },

  // Send 6-digit OTP for Forgot Password Reset
  sendPasswordResetOtp: async ({ email, name, otp }: { email: string; name: string; otp: string }) => {
    console.log('\n=============================================================');
    console.log(`🔑 [PASSWORD RESET OTP CODE]: ${otp}`);
    console.log(`📧 Target Email: ${email} | Name: ${name}`);
    console.log('=============================================================\n');

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1e3a8a; font-size: 24px; margin: 0; font-weight: 700;">Brain Bari Technologies</h1>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Security & Authentication</p>
        </div>
        <div style="background-color: #fff7ed; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #fed7aa;">
          <h2 style="color: #9a3412; font-size: 18px; margin: 0 0 8px 0;">Password Reset Request</h2>
          <p style="color: #7c2d12; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
            Hello <strong>${name}</strong>, we received a request to reset your Brain Bari administrator password.
          </p>
          <div style="display: inline-block; letter-spacing: 8px; font-size: 32px; font-weight: 800; color: #ea580c; background: #ffffff; padding: 14px 28px; border-radius: 10px; border: 2px dashed #fdba74; margin: 10px 0;">
            ${otp}
          </div>
          <p style="color: #9a3412; font-size: 12px; margin: 16px 0 0 0;">
            ⏳ This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-top: 24px; text-align: center;">
          If you did not request this password reset, please ignore this email or notify your system administrator.
        </p>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          © ${new Date().getFullYear()} Brain Bari Technologies. All rights reserved.
        </p>
      </div>
    `;
    return await sendEmail({
      to: email,
      subject: `🔑 ${otp} - Brain Bari Admin Password Reset Code`,
      html,
    });
  },

  // Send Welcome Email upon User Registration
  sendWelcomeEmail: async (user: { name: string; email: string; role?: string }) => {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #1e3a8a; font-size: 26px; margin: 0;">Brain Bari Technologies</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Enterprise AI & Software Solutions</p>
        </div>
        <div style="padding: 20px; background-color: #f8fafc; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Welcome, ${user.name}! 👋</h2>
          <p style="color: #334155; line-height: 1.6; font-size: 14px;">
            Your account with email <strong>${user.email}</strong> has been successfully registered on the Brain Bari Enterprise Platform.
          </p>
          <p style="color: #334155; line-height: 1.6; font-size: 14px;">
            Role Assigned: <strong style="color: #2563eb;">${user.role || 'Client'}</strong>
          </p>
        </div>
        <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 30px;">
          © ${new Date().getFullYear()} Brain Bari Technologies. All rights reserved.
        </p>
      </div>
    `;
    return await sendEmail({
      to: user.email,
      subject: 'Welcome to Brain Bari – Account Verified',
      html,
    });
  },

  // Notify Admin & Client on Contact / Wish Quote submission
  sendContactNotification: async (contact: { name: string; email: string; phone?: string; message: string; selectedServices?: string[] }) => {
    const isWishQuote = contact.message.toLowerCase().includes('wish quote') || contact.name === 'Wish Quote Requester';
    const serviceName = (contact.selectedServices && contact.selectedServices.length > 0)
      ? contact.selectedServices.join(', ')
      : 'AI & Custom Software Solution';

    // 1. Alert to Admin Mailbox
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #1e3a8a; margin: 0; font-size: 22px;">🔔 ${isWishQuote ? 'New Wish Quote Request' : 'New Contact Inquiry'}</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Received via Brain Bari Website</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Client Name:</strong></td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${contact.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; color: #2563eb;"><a href="mailto:${contact.email}" style="color: #2563eb; text-decoration: none;">${contact.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td>
            <td style="padding: 8px 0; color: #0f172a;">${contact.phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Service / Wish:</strong></td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${serviceName}</td>
          </tr>
        </table>
        <div style="margin-top: 18px; padding: 14px 18px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 6px;">
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Message / Details:</p>
          <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${contact.message}</p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; text-align: center;">
          Brain Bari Technologies Admin Notification System
        </p>
      </div>
    `;

    await sendEmail({
      to: config.smtp.user,
      subject: `[${isWishQuote ? 'Wish Quote' : 'New Lead'}] ${serviceName} - ${contact.name} (${contact.email})`,
      html: adminHtml,
    });

    // 2. Confirmation Receipt to the Client
    if (contact.email && contact.email.includes('@')) {
      const clientHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #1e3a8a; font-size: 24px; margin: 0; font-weight: 700;">Brain Bari Technologies</h1>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Empowering Tomorrow with Intelligent Solutions</p>
          </div>
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); padding: 20px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
            <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 8px 0;">🎉 Your request has been received!</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">
              Thank you for reaching out to us. We have received your ${isWishQuote ? 'custom quote request' : 'inquiry'} regarding <strong>&ldquo;${serviceName}&rdquo;</strong>.
            </p>
          </div>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            Our team of engineers and solution architects is reviewing your requirements. We will prepare an optimized proposal and get back to you within <strong>24 business hours</strong>.
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Request Summary:</p>
            <p style="margin: 4px 0; font-size: 13.5px; color: #1e293b;">• <strong>Subject:</strong> ${serviceName}</p>
            <p style="margin: 4px 0; font-size: 13.5px; color: #1e293b;">• <strong>Contact Email:</strong> ${contact.email}</p>
            ${contact.phone ? `<p style="margin: 4px 0; font-size: 13.5px; color: #1e293b;">• <strong>Phone:</strong> ${contact.phone}</p>` : ''}
          </div>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            If you have any urgent questions, feel free to reply directly to this email or reach us anytime at <a href="mailto:${config.smtp.user}" style="color: #2563eb; text-decoration: none;">${config.smtp.user}</a>.
          </p>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            © ${new Date().getFullYear()} Brain Bari Technologies. All rights reserved.
          </p>
        </div>
      `;

      await sendEmail({
        to: contact.email,
        subject: `We received your request: "${serviceName}" | Brain Bari`,
        html: clientHtml,
      });
    }
  },

  // Notify Admin & Client when a Frontend Order is placed
  sendOrderNotification: async (order: {
    id: string;
    serviceName: string;
    category?: string;
    requirements?: string;
    budget?: string;
    clientName?: string | null;
    clientEmail?: string | null;
    clientPhone?: string | null;
    createdAt?: Date;
  }) => {
    const clientEmail = order.clientEmail;
    const clientName = order.clientName || 'Valued Client';
    const orderRef = order.id ? `#${order.id.slice(-6).toUpperCase()}` : 'NEW-ORDER';

    // 1. Dispatch Notification to Admin
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #065f46; margin: 0; font-size: 22px;">📦 New Client Order Placed (${orderRef})</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Received from Frontend Order Form</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Order ID:</strong></td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${order.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Service:</strong></td>
            <td style="padding: 8px 0; color: #2563eb; font-weight: 600;">${order.serviceName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Budget / Quote:</strong></td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${order.budget || 'Custom Quote'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Client Name:</strong></td>
            <td style="padding: 8px 0; color: #0f172a;">${clientName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Client Email:</strong></td>
            <td style="padding: 8px 0; color: #2563eb;"><a href="mailto:${clientEmail}" style="color: #2563eb; text-decoration: none;">${clientEmail || 'N/A'}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Client Phone:</strong></td>
            <td style="padding: 8px 0; color: #0f172a;">${order.clientPhone || 'N/A'}</td>
          </tr>
        </table>
        <div style="margin-top: 18px; padding: 14px 18px; background-color: #f8fafc; border-left: 4px solid #10b981; border-radius: 6px;">
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Requirements & Notes:</p>
          <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${order.requirements || 'Standard inquiry'}</p>
        </div>
        <div style="margin-top: 24px; text-align: center;">
          <a href="${config.cors.admin_url}/orders" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Open in Admin Dashboard
          </a>
        </div>
      </div>
    `;

    await sendEmail({
      to: config.smtp.user,
      subject: `🚨 New Order: ${order.serviceName} from ${clientName} (${orderRef})`,
      html: adminHtml,
    });

    // 2. Dispatch Confirmation Receipt to the Client
    if (clientEmail && clientEmail.includes('@')) {
      const clientHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #1e3a8a; font-size: 24px; margin: 0; font-weight: 700;">Brain Bari Technologies</h1>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Empowering Tomorrow with Intelligent Solutions</p>
          </div>
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%); padding: 20px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
            <h2 style="color: #065f46; font-size: 19px; margin: 0 0 8px 0;">✅ Order Received Successfully!</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">
              Hello <strong>${clientName}</strong>, thank you for choosing Brain Bari. We have received your order reference <strong>${orderRef}</strong>.
            </p>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 20px 0;">
            <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a; font-weight: 600;">Order Summary:</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Service:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${order.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Budget / Pricing:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${order.budget || 'Custom Quote'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Status:</td>
                <td style="padding: 6px 0; color: #059669; font-weight: 600;">PENDING REVIEW</td>
              </tr>
            </table>
          </div>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            <strong>What happens next?</strong><br/>
            Our team will review your project requirements and get in touch with you via email or phone within <strong>24 business hours</strong> to finalize the milestone roadmap and timeline.
          </p>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-top: 20px;">
            Need immediate assistance? Reply directly to this email or reach us at <a href="mailto:${config.smtp.user}" style="color: #2563eb; text-decoration: none;">${config.smtp.user}</a>.
          </p>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            © ${new Date().getFullYear()} Brain Bari Technologies. All rights reserved.
          </p>
        </div>
      `;

      await sendEmail({
        to: clientEmail,
        subject: `Order Confirmation: ${order.serviceName} (${orderRef}) | Brain Bari`,
        html: clientHtml,
      });
    }
  },

  // Notify Admin & Client on Consultation Booking
  sendBookingNotification: async (booking: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    date: string;
    timeSlot: string;
    topic: string;
    message?: string | null;
  }) => {
    // 1. Admin Alert
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb;">📅 New Consultation Booked</h2>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Phone:</strong> ${booking.phone || 'N/A'}</p>
        <p><strong>Company:</strong> ${booking.company || 'N/A'}</p>
        <p><strong>Topic:</strong> ${booking.topic}</p>
        <p><strong>Schedule:</strong> ${booking.date} at ${booking.timeSlot}</p>
        ${booking.message ? `<p><strong>Notes:</strong> ${booking.message}</p>` : ''}
      </div>
    `;

    await sendEmail({
      to: config.smtp.user,
      subject: `New Consultation Booked: ${booking.topic} by ${booking.name}`,
      html: adminHtml,
    });

    // 2. Client Confirmation
    if (booking.email && booking.email.includes('@')) {
      const clientHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #2563eb;">Consultation Confirmed | Brain Bari</h2>
          <p>Hello ${booking.name},</p>
          <p>Your consultation on <strong>${booking.topic}</strong> is scheduled for <strong>${booking.date} at ${booking.timeSlot}</strong>.</p>
          <p>Our team will connect with you at the scheduled time. If you need to reschedule, feel free to contact us.</p>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">© Brain Bari Technologies</p>
        </div>
      `;

      await sendEmail({
        to: booking.email,
        subject: `Consultation Confirmed: ${booking.topic} | Brain Bari`,
        html: clientHtml,
      });
    }
  },
};

