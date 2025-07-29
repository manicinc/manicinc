// src/lib/sender.ts
interface NewsletterData {
  email: string;
  name?: string;
  company?: string;
  source?: string;
}

const SENDER_FORM_ID = process.env.NEXT_PUBLIC_SENDER_FORM_ID;

export const subscribeToNewsletter = async (data: NewsletterData) => {
  try {
    // Check if Sender.net is configured
    if (!SENDER_FORM_ID) {
      console.warn('Sender.net form ID not configured');
      return {
        success: false,
        error: 'Newsletter signup temporarily unavailable. Please email team@manic.agency to subscribe.'
      };
    }

    // Check if Sender.net script is loaded
    if (typeof window !== 'undefined' && (window as any).sender) {
      // Use Sender.net API if available
      try {
        await new Promise((resolve, reject) => {
          (window as any).sender('form:submit', SENDER_FORM_ID, {
            email: data.email,
            name: data.name || '',
            company: data.company || '',
            source: data.source || 'website'
          }, (response: any) => {
            if (response.success) {
              resolve(response);
            } else {
              reject(new Error(response.error || 'Subscription failed'));
            }
          });
        });

        return {
          success: true,
          message: 'Successfully subscribed! Check your email to confirm.'
        };
      } catch (error) {
        console.error('Sender.net API error:', error);
        // Fall through to fallback method
      }
    }

    // Fallback: Direct form submission to Sender.net
    const formData = new FormData();
    formData.append('email', data.email);
    if (data.name) formData.append('name', data.name);
    if (data.company) formData.append('company', data.company);
    formData.append('source', data.source || 'website');

    // Try the direct form submission endpoint first
    try {
      const response = await fetch(`https://app.sender.net/forms/${SENDER_FORM_ID}/subscribe`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Successfully subscribed! Check your email to confirm.'
        };
      }
    } catch (error) {
      console.log('Primary endpoint failed, trying alternative...');
    }

    // Alternative endpoint
    const response = await fetch(`https://api.sender.net/v2/forms/${SENDER_FORM_ID}/submit`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Successfully subscribed! Check your email to confirm.'
      };
    } else {
      throw new Error('Sender.net API request failed');
    }

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
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
      error: 'Failed to subscribe. Please try again or email team@manic.agency to subscribe manually.'
    };
  }
};

// Debug function to check configuration
export const debugSenderConfig = () => {
  console.group('🔍 Sender.net Configuration Debug');
  console.log('Form ID:', SENDER_FORM_ID ? `✅ Set (${SENDER_FORM_ID})` : '❌ Missing');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Form URL:', SENDER_FORM_ID ? `https://stats.sender.net/forms/${SENDER_FORM_ID}/view` : 'N/A');
  
  if (typeof window !== 'undefined') {
    console.log('Sender.net Script:', !!(window as any).sender ? '✅ Loaded' : '❌ Not loaded');
  }
  
  if (!SENDER_FORM_ID) {
    console.info('💡 Add NEXT_PUBLIC_SENDER_FORM_ID= to GitHub Secrets');
    console.info('📖 Your form: https://stats.sender.net/forms//view');
  }
  console.groupEnd();
};
