// src/lib/emailjs.ts
import emailjs from '@emailjs/browser';

// EmailJS configuration - NEVER commit hardcoded credentials
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_NEWSLETTER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID || 'template_k3v4qm9';
const EMAILJS_CONTACT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || 'template_rq6cbua';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// Validate required environment variables
if (!EMAILJS_SERVICE_ID || !EMAILJS_NEWSLETTER_TEMPLATE_ID || !EMAILJS_CONTACT_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('EmailJS environment variables not configured. Forms will show fallback messages.');
  }
}

// Initialize EmailJS
export const initializeEmailJS = () => {
  if (!EMAILJS_PUBLIC_KEY) {
    // Silent fail in development, only warn in production
    if (process.env.NODE_ENV === 'production') {
      console.warn('EmailJS Public Key not configured');
    }
    return false;
  }
  emailjs.init(EMAILJS_PUBLIC_KEY);
  return true;
};

// Newsletter subscription function
export const subscribeToNewsletter = async (data: {
  email: string;
  name?: string;
  company?: string;
  source?: string;
}) => {
  try {
    // Initialize EmailJS if not already done
    if (!initializeEmailJS()) {
      return {
        success: false,
        error: process.env.NODE_ENV === 'production' 
          ? 'Email service not configured. Please contact team@manic.agency directly.'
          : 'EmailJS not configured (development mode). Add environment variables for production.'
      };
    }

    // Validate required environment variables
    if (!EMAILJS_SERVICE_ID || !EMAILJS_NEWSLETTER_TEMPLATE_ID) {
      return {
        success: false,
        error: process.env.NODE_ENV === 'production'
          ? 'Email service not properly configured. Please contact team@manic.agency directly.'
          : 'EmailJS templates not configured (development mode).'
      };
    }

    // Send email using EmailJS
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_NEWSLETTER_TEMPLATE_ID,
      {
        to_email: 'team@manic.agency', // Your email to receive notifications
        subscriber_email: data.email,
        subscriber_name: data.name || 'Anonymous',
        subscriber_company: data.company || 'Not provided',
        subscription_source: data.source || 'unknown',
        reply_to: data.email,
        // Include additional data for the email template
        email: data.email,
        name: data.name,
        company: data.company,
        source: data.source,
      }
    );

    if (result.status === 200) {
      return {
        success: true,
        message: 'Transmission channel established successfully!'
      };
    } else {
      throw new Error('Email service returned non-200 status');
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      error: 'Failed to subscribe. Please try again or contact team@manic.agency directly.'
    };
  }
};

// Contact form submission function
export const sendContactMessage = async (data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  budget?: string;
  timeline?: string;
  message: string;
  subject?: string;
}) => {
  try {
    if (!initializeEmailJS()) {
      return {
        success: false,
        error: process.env.NODE_ENV === 'production'
          ? 'Email service not configured. Please contact team@manic.agency directly.'
          : 'EmailJS not configured (development mode). Add environment variables for production.'
      };
    }

    // Validate required environment variables
    if (!EMAILJS_SERVICE_ID || !EMAILJS_CONTACT_TEMPLATE_ID) {
      return {
        success: false,
        error: process.env.NODE_ENV === 'production'
          ? 'Email service not properly configured. Please contact team@manic.agency directly.'
          : 'EmailJS templates not configured (development mode).'
      };
    }

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CONTACT_TEMPLATE_ID,
      {
        to_email: 'team@manic.agency',
        from_name: data.name,
        from_email: data.email,
        company: data.company || '',
        phone: data.phone || '',
        budget: data.budget || '',
        timeline: data.timeline || '',
        message: data.message,
        subject: data.subject || 'New Contact Form Submission',
        reply_to: data.email,
        timestamp: new Date().toISOString(),
        // Legacy template variables for compatibility
        name: data.name,
        email: data.email,
        message_content: data.message,
      }
    );

    if (result.status === 200) {
      return {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      };
    } else {
      throw new Error('Email service returned non-200 status');
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      error: 'Failed to send message. Please try again or contact team@manic.agency directly.'
    };
  }
};
