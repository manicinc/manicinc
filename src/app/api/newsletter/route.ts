// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import emailjs from '@emailjs/browser';

// Initialize EmailJS on the server side (if needed)
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_NEWSLETTER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID || 'template_k3v4qm9';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, company, source } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_NEWSLETTER_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS not configured:', {
        serviceId: !!EMAILJS_SERVICE_ID,
        templateId: !!EMAILJS_NEWSLETTER_TEMPLATE_ID,
        publicKey: !!EMAILJS_PUBLIC_KEY,
      });
      return NextResponse.json(
        { success: false, error: 'Email service temporarily unavailable. Please contact team@manic.agency directly.' },
        { status: 500 }
      );
    }

    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Send email using EmailJS
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_NEWSLETTER_TEMPLATE_ID,
      {
        to_email: 'team@manic.agency',
        subscriber_email: email,
        subscriber_name: name || 'Anonymous',
        subscriber_company: company || 'Not provided',
        subscription_source: source || 'unknown',
        reply_to: email,
        timestamp: new Date().toISOString(),
        // Legacy template variables for compatibility
        email: email,
        name: name,
        company: company,
        source: source,
      }
    );

    if (result.status === 200) {
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter!'
      });
    } else {
      throw new Error(`EmailJS returned status: ${result.status}`);
    }

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to subscribe. Please try again or contact team@manic.agency directly.' 
      },
      { status: 500 }
    );
  }
}
