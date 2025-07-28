import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CONTACT_CONFIG } from '@/lib/constants';

// Initialize Resend only if API key is available
let resend: Resend | null = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn('Resend initialization failed during build:', error);
}

// Rate limiting: Store request counts in memory (consider Redis for production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 5; // 5 requests
  const window = 15 * 60 * 1000; // 15 minutes

  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + window });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  subject?: string;
  budget?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, company, phone, message, subject, budget }: ContactFormData = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Message length validation
    if (message.length < 12) {
      return NextResponse.json(
        { error: 'Message must be at least 12 characters long' },
        { status: 400 }
      );
    }

    if (!resend || !process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Contact service not configured. Please email us directly at team@manic.agency' },
        { status: 500 }
      );
    }

    // Email to you (the business)
    const businessEmailSubject = subject 
      ? `New Contact: ${subject} - from ${name}`
      : `New Contact Form Message from ${name}`;

    try {
      await resend.emails.send({
        from: CONTACT_CONFIG.FROM_EMAIL,
        to: CONTACT_CONFIG.ADMIN_EMAIL,
        replyTo: email, // Important! So you can reply directly
        subject: businessEmailSubject,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #3a2f25;">
            <h2 style="color: #b66880; margin-bottom: 20px;">New Contact Form Submission</h2>
            
            <div style="background: #fbf6ef; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #b66880;">${email}</a></p>
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
              ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}" style="color: #b66880;">${phone}</a></p>` : ''}
              ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
              ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
            </div>
            
            <h3 style="color: #7a6d60; margin-bottom: 10px;">Message:</h3>
            <div style="background: #f5ede1; padding: 20px; border-radius: 12px; border-left: 4px solid #b66880;">
              <p style="line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ede4d6;">
            
            <p style="color: #7a6d60; font-size: 14px;">
              <strong>Reply:</strong> You can reply directly to this email to respond to ${name}.<br>
              <strong>Time:</strong> ${new Date().toLocaleString()}<br>
              <strong>IP:</strong> ${ip}
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send business notification email:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again or email us directly at team@manic.agency' },
        { status: 500 }
      );
    }

    // Confirmation email to the user
    try {
      await resend.emails.send({
        from: CONTACT_CONFIG.REPLY_EMAIL,
        to: email,
        subject: 'We received your message - Manic Agency',
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #3a2f25;">
            <h1 style="color: #b66880; font-size: 24px; margin-bottom: 20px;">Thanks for reaching out!</h1>
            
            <p>Hi ${name},</p>
            
            <p>We've received your message and will get back to you within 1-2 business days. Here's what you sent:</p>
            
            <div style="background: #f5ede1; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #7ea196;">
              ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
              ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
              <p><strong>Message:</strong></p>
              <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p>In the meantime, feel free to:</p>
            <ul style="line-height: 1.8;">
              <li>Check out our <a href="https://manic.agency/blog" style="color: #b66880;">latest research</a></li>
              <li>View our <a href="https://manic.agency/projects" style="color: #b66880;">project showcase</a></li>
              <li>Follow us on <a href="https://twitter.com/manicagency" style="color: #b66880;">Twitter</a></li>
            </ul>
            
            <p style="color: #7a6d60; font-size: 14px; margin-top: 30px;">
              — The Manic Team<br>
              <a href="https://manic.agency" style="color: #b66880;">manic.agency</a>
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't fail the contact form if confirmation email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again or email us directly at team@manic.agency' },
      { status: 500 }
    );
  }
}
