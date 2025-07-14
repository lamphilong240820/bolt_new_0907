// Email utilities for the application
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  // Only import nodemailer on server side
  if (typeof window !== 'undefined') {
    throw new Error('Email can only be sent from server side');
  }

  try {
    const nodemailer = await import('nodemailer');
    
    // Create transporter using Docker MailHog
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1025'),
      secure: false, // MailHog doesn't use SSL
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      } : undefined,
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@shopflow.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to ShopFlow!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to ShopFlow!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining ShopFlow. We're excited to have you as part of our community!</p>
        <p>Start exploring our amazing products and enjoy shopping with us.</p>
        <p>Best regards,<br>The ShopFlow Team</p>
      </div>
    `,
  }),

  orderConfirmation: (name: string, orderNumber: string, total: number) => ({
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Order Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your order! We've received your order and it's being processed.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        </div>
        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br>The ShopFlow Team</p>
      </div>
    `,
  }),

  passwordReset: (name: string, resetLink: string) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Reset Your Password</h1>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The ShopFlow Team</p>
      </div>
    `,
  }),
};