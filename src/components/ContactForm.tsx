'use client'; // Add if using hooks for state management

import React, { useState } from 'react'; // Import useState if managing form state here
import Script from 'next/script';
import { Send } from 'lucide-react'; // Icon for submit button

const ContactForm = () => {
  // Basic state example (optional, implement full logic as needed)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Placeholder for submission logic
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Add your EmailJS or backend submission logic here
    console.log("Form submitted (placeholder)");
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMessageSent(true); // Show success message
    setIsSubmitting(false);
    // Optionally reset form: event.currentTarget.reset();
  };

  return (
    <>
      {/* Keep EmailJS scripts if you are using them */}
      {/* <Script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js" /> */}
      {/* <Script src="./email.js" /> */}
      {/* <Script src="./send.js" /> */}

      {/* Success Message Div - Styled via global CSS */}
      <div className={`messageSuccess ${messageSent ? 'visible' : 'hidden'}`}>
          Thank you for your inquiry! We will be in touch soon.
      </div>

      {/* Apply the theme class here */}
      <form
        id="contact-form"
        className={`themed-contact-form space-y-6 ${messageSent ? 'hidden' : ''}`} // Hide form on success
        onSubmit={handleSubmit}
      >
        {/* Work Inquiries Title (Optional - can be removed if redundant) */}
        {/* <h2 className="text-lg font-semibold text-[color:var(--text-heading)]">Work inquiries</h2> */}

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