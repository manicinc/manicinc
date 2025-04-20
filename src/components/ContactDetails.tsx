// src/components/ContactDetails.tsx
import Offices from './Offices'; // Assuming this component handles its own theming
import Border from './Border';   // Assuming this component handles its own theming
import Link from 'next/link';
import SocialMedia from './SocialMedia'; // Assuming this component handles its own theming

const ContactDetails = () => {
  return (
    // Added a wrapper class for potential scoping
    <div className="themed-contact-details">
      {/* Email Section - Removed extra border */}
      <div>
         {/* Use theme colors */}
         <h2 className="footer-heading"> {/* Re-using footer heading style for consistency */}
           Email us
         </h2>
         <dl className="mt-6 grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
           {[
             ['Main', 'team@manic.agency'],
             // Add other emails if needed
           ].map(([label, email]) => (
             <div key={email}>
                {/* Use theme colors */}
               <dt className="font-semibold text-[color:var(--text-heading)]">{label}</dt>
               <dd>
                 <Link
                   href={`mailto:${email}`}
                   // Use theme colors and footer link styling
                   className="footer-link email-link text-[color:var(--text-secondary)] hover:text-[color:var(--accent-highlight)]"
                 >
                   {email}
                 </Link>
               </dd>
             </div>
           ))}
         </dl>
       </div>

       {/* Follow Us Section - Removed extra border */}
       <div className="mt-10 pt-10 border-t border-[color:var(--bg-tertiary)]">
         <h2 className="footer-heading"> {/* Re-using footer heading style */}
           Follow us
         </h2>
         {/* Ensure SocialMedia component uses themed icons/links */}
         <SocialMedia className="mt-6 footer-social-icons" />
       </div>
       {/* Removed Offices from here, assuming it's part of the main page layout now */}
       {/* <Offices /> */}
    </div>
  );
};
export default ContactDetails;