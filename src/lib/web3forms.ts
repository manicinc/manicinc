// src/lib/web3forms.ts
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  budget?: string;
  timeline?: string;
  message: string;
  subject?: string;
}

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export const sendContactForm = async (data: ContactFormData) => {
  try {
    // Check if Web3Forms is configured
    if (!WEB3FORMS_ACCESS_KEY) {
      console.warn('Web3Forms access key not configured');
      return {
        success: false,
        error: 'Contact form temporarily unavailable. Please email team@manic.agency directly.'
      };
    }

    // Prepare form data for Web3Forms
    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('subject', data.subject || 'New Contact Form Submission');
    formData.append('message', data.message);
    
    // Optional fields
    if (data.company) formData.append('company', data.company);
    if (data.phone) formData.append('phone', data.phone);
    if (data.budget) formData.append('budget', data.budget);
    if (data.timeline) formData.append('timeline', data.timeline);
    
    // Add metadata
    formData.append('from_name', data.name);
    formData.append('reply_to', data.email);
    formData.append('to_email', 'team@manic.agency');
    
    // Honeypot spam protection
    formData.append('botcheck', '');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      };
    } else {
      throw new Error(result.message || 'Form submission failed');
    }

  } catch (error) {
    console.error('Web3Forms submission error:', error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        return {
          success: false,
          error: 'Network error. Please check your connection and try again.'
        };
      }
    }
    
    return {
      success: false,
      error: 'Failed to send message. Please try again or contact team@manic.agency directly.'
    };
  }
};

// Debug function to check configuration
export const debugWeb3FormsConfig = () => {
  console.group('🔍 Web3Forms Configuration Debug');
  console.log('Access Key:', WEB3FORMS_ACCESS_KEY ? '✅ Set' : '❌ Missing');
  console.log('Environment:', process.env.NODE_ENV);
  if (!WEB3FORMS_ACCESS_KEY) {
    console.info('💡 Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to GitHub Secrets');
    console.info('📖 Get free access key from https://web3forms.com');
  }
  console.groupEnd();
};
