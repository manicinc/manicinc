// src/lib/emailjs.ts
import emailjs from '@emailjs/browser';

// EmailJS configuration - NEVER commit hardcoded credentials
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_NEWSLETTER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID || 'template_k3v4qm9';
const EMAILJS_CONTACT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || 'template_rq6cbua';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// Validate required environment variables
const missingVars = [];
if (!EMAILJS_SERVICE_ID) missingVars.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
if (!EMAILJS_NEWSLETTER_TEMPLATE_ID) missingVars.push('NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID');
if (!EMAILJS_CONTACT_TEMPLATE_ID) missingVars.push('NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID');
if (!EMAILJS_PUBLIC_KEY) missingVars.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');

if (missingVars.length > 0) {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔧 EmailJS Configuration Status (Development)');
    console.info('Environment variables are stored in GitHub Secrets for production deployment');
    console.info('The following variables are missing locally (this is expected):');
    missingVars.forEach(varName => {
      console.info(`  • ${varName}`);
    });
    console.info('📖 Forms will show fallback messages in development');
    console.info('🚀 In production, these will be loaded from GitHub Secrets');
    console.groupEnd();
  } else {
    console.group('🔧 EmailJS Configuration Status (Production)');
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    console.info('Required GitHub Secrets:');
    missingVars.forEach(varName => {
      console.info(`  • ${varName}`);
    });
    console.info('📖 See README.md for complete setup instructions');
    console.groupEnd();
  }
} else {
  console.log('✅ All EmailJS environment variables configured');
}

// Debug function to check configuration
export const debugEmailJSConfig = () => {
  console.group('🔍 EmailJS Configuration Debug');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Service ID:', EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing');
  console.log('Newsletter Template:', EMAILJS_NEWSLETTER_TEMPLATE_ID ? '✅ Set' : '❌ Missing');
  console.log('Contact Template:', EMAILJS_CONTACT_TEMPLATE_ID ? '✅ Set' : '❌ Missing');
  console.log('Public Key:', EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
  
  if (process.env.NODE_ENV === 'development') {
    console.info('💡 Missing variables in development is expected - they are in GitHub Secrets');
  }
  console.groupEnd();
};

// Initialize EmailJS
export const initializeEmailJS = () => {
  if (!EMAILJS_PUBLIC_KEY) {
    // Enhanced debugging for missing public key
    console.error('❌ EmailJS Public Key not configured');
    console.info('💡 Add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY to GitHub Secrets');
    console.info('📖 See README.md for setup instructions');
    return false;
  }
  
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('✅ EmailJS initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ EmailJS initialization failed:', error);
    return false;
  }
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
          ? 'Email service temporarily unavailable. Please contact team@manic.agency directly.'
          : 'EmailJS not configured. Check environment variables: NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'
      };
    }

    // Validate required environment variables
    if (!EMAILJS_SERVICE_ID || !EMAILJS_NEWSLETTER_TEMPLATE_ID) {
      const missing = [];
      if (!EMAILJS_SERVICE_ID) missing.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
      if (!EMAILJS_NEWSLETTER_TEMPLATE_ID) missing.push('NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID');
      
      return {
        success: false,
        error: process.env.NODE_ENV === 'production'
          ? 'Email service temporarily unavailable. Please contact team@manic.agency directly.'
          : `EmailJS missing: ${missing.join(', ')}. Check GitHub Secrets configuration.`
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
          ? 'Email service temporarily unavailable. Please contact team@manic.agency directly.'
          : 'EmailJS not configured. Check environment variables: NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'
      };
    }

    // Validate required environment variables
    if (!EMAILJS_SERVICE_ID || !EMAILJS_CONTACT_TEMPLATE_ID) {
      const missing = [];
      if (!EMAILJS_SERVICE_ID) missing.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
      if (!EMAILJS_CONTACT_TEMPLATE_ID) missing.push('NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID');
      
      return {
        success: false,
        error: process.env.NODE_ENV === 'production'
          ? 'Email service temporarily unavailable. Please contact team@manic.agency directly.'
          : `EmailJS missing: ${missing.join(', ')}. Check GitHub Secrets configuration.`
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
