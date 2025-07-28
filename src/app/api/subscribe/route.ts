import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
let resend: Resend | null = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn('Resend initialization failed during build:', error);
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, company, source = 'unknown' } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    if (!resend || !process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Newsletter service not configured. Please contact team@manic.agency directly.' },
        { status: 500 }
      );
    }

    // For now, just send a welcome email since we don't have an audience set up
    // TODO: Set up RESEND_AUDIENCE_ID in environment variables
    console.log('Newsletter signup:', { email, name, company, source });

    // Send welcome email based on source
    const welcomeSubject = source === 'blog' 
      ? "Welcome to The Looking Glass Chronicles" 
      : "Welcome to Manic Agency Updates";
    
    const welcomeContent = source === 'blog'
      ? `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #3a2f25;">
          <h1 style="color: #b66880; font-size: 24px; margin-bottom: 20px;">Welcome to The Looking Glass Chronicles</h1>
          <p>Thanks for subscribing to our research publication! You'll receive:</p>
          <ul>
            <li>Deep-dive analyses on Web3, AI, and emerging tech</li>
            <li>Behind-the-scenes research insights</li>
            <li>Early access to our latest findings</li>
          </ul>
          <p>We respect your inbox and only send quality content worth your time.</p>
          <p style="color: #7a6d60; font-size: 14px; margin-top: 30px;">
            — The Manic Research Team<br>
            <a href="https://manic.agency/blog" style="color: #b66880;">manic.agency/blog</a>
          </p>
        </div>
      `
      : `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #3a2f25;">
          <h1 style="color: #b66880; font-size: 24px; margin-bottom: 20px;">Welcome to Manic Agency</h1>
          <p>Thanks for subscribing! You'll receive updates on:</p>
          <ul>
            <li>New projects and case studies</li>
            <li>Industry insights and trends</li>
            <li>Agency news and opportunities</li>
          </ul>
          <p>Ready to build something extraordinary together?</p>
          <p style="color: #7a6d60; font-size: 14px; margin-top: 30px;">
            — The Manic Team<br>
            <a href="https://manic.agency" style="color: #b66880;">manic.agency</a>
          </p>
        </div>
      `;

    try {
      await resend.emails.send({
        from: 'Manic Agency <team@manic.agency>',
        to: email,
        subject: welcomeSubject,
        html: welcomeContent,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed!' 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
