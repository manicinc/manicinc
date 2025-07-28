// src/lib/emailjs.ts
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'default_service';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'newsletter_template';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';

// Initialize EmailJS
export const initializeEmailJS = () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);
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
    initializeEmailJS();

    // Send email using EmailJS
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: 'team@manic.agency', // Your email to receive notifications
        subscriber_email: data.email,
        subscriber_name: data.name || 'Anonymous',
        subscriber_company: data.company || 'Not provided',
        subscription_source: data.source || 'unknown',
        reply_to: data.email,
        // Include all data for the email template
        ...data,
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
  message: string;
  subject?: string;
}) => {
  try {
    initializeEmailJS();

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || 'contact_template',
      {
        to_email: 'team@manic.agency',
        from_name: data.name,
        from_email: data.email,
        company: data.company || 'Not provided',
        message: data.message,
        subject: data.subject || 'New Contact Form Submission',
        reply_to: data.email,
        ...data,
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
