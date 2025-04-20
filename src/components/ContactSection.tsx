import Button from './Button';
import Offices from './Offices';
import Link from 'next/link';

const ContactSection = () => {
  return (
    <div className="mt-24 rounded-4xl bg-slate-950 py-20 sm:mt-32 sm:py-32 lg:mt-56">
      {/* <div className=""> */}
      <div className="max-w-4xl mx-auto px-4 sm:ml-20">
        <h2 className="font-display text-3xl font-medium text-white [text-wrap:balance] sm:text-4xl">
          Tell us about your project
        </h2>
        <div className="mt-6 flex">
          <Button href={'/contact'} invert>
            Say Hello
          </Button>
        </div>
        <div className="mt-10 border-t border-white/10 pt-10">
          <h3 className="font-display text-base font-semibold text-white">
            Our team locations
          </h3>
          <Offices invert />
        </div>
        <Link
          href={`mailto:team@manic.agency`}
          className="text-neutral-600 hover:text-slate-500">
          team@manic.agency
        </Link>
      </div>
      {/* </div> */}
    </div>
  );
};
export default ContactSection;
