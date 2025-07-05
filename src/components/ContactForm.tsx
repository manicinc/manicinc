'use client'; // Add if using hooks for state management

import React, { useState } from 'react'; // Import useState if managing form state here
import { Send } from 'lucide-react'; // Icon for submit button

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState('');

  // Formspree submission logic
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xldnkngd', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setMessageSent(true);
        form.reset(); // Reset the form
      } else {
        const data = await response.json();
        if (data.errors) {
          setError(data.errors.map((error: any) => error.message).join(', '));
        } else {
          setError('There was a problem submitting your form. Please try again.');
        }
      }
    } catch (error) {
      setError('There was a problem submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Message Div - Styled via global CSS */}
      <div className={`messageSuccess ${messageSent ? 'visible' : 'hidden'}`}>
        Thank you for your inquiry! We will be in touch soon.
      </div>

      {/* Error Message */}
      {error && (
        <div className="messageError text-red-600 p-4 mb-4 border border-red-200 rounded">
          {error}
        </div>
      )}

      {/* Apply the theme class here */}
      <form
        id="contact-form"
        className={`themed-contact-form space-y-6 ${messageSent ? 'hidden' : ''}`} // Hide form on success
        onSubmit={handleSubmit} // Connect the submit handler
      >
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" type="text" name="name" required placeholder="Your full name" />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" type="email" name="email" required placeholder="you@example.com" />
          </div>

          {/* Company Input */}
          <div>
            <label htmlFor="contact-company">Company</label>
            <input id="contact-company" type="text" name="company" placeholder="Your company name" />
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="contact-phone">Phone <span className='text-[color:var(--text-muted)] font-normal'>(Optional)</span></label>
            <input id="contact-phone" type="tel" name="phone" placeholder="+1 (555) 123-4567" />
          </div>

          {/* Message Textarea */}
          <div>
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" required minLength={12} placeholder="Tell us about your project or inquiry..."></textarea>
          </div>
        </div>

        {/* Budget Fieldset */}
        <fieldset>
          <legend>Budget Estimation</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4">
            {["$5K – $10K", "$10K – $25K", "$25K – $100K", "More than $100K"].map((label) => (
              <label key={label} className="radio-label">
                <input type="radio" name="budget" value={label} />
                <span className="radio-custom"></span> {/* Themed circle */}
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Note */}
        <p className="text-xs text-[color:var(--text-muted)] font-body-blog italic">
          Note: For certain proposals, we may consider equity as partial compensation.
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? 'Sending...' : "Send Inquiry"}
          {!isSubmitting && <Send size={18} className="ml-2"/>}
        </button>
      </form>
    </>
  );
};

export default ContactForm;