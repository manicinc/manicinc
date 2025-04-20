import Link from 'next/link';

export default function VelvetPricing() {
  return (
    <div className="bg-gradient-to-br from-[#11132a] via-[#1a1c3d] to-[#242750] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Simple Pricing</h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Join our community of innovators and accelerate your development journey
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-white">Lifetime Membership</h3>
            <p className="mt-6 text-base leading-7 text-gray-300">
              Limited time offer - Get unlimited access to all premium features forever
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What&apos;s included</h4>
              <div className="h-px flex-auto bg-gray-100"></div>
            </div>
            <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-300 sm:grid-cols-2 sm:gap-6">
              <li className="flex gap-x-3">Advanced AI Assistant Access</li>
              <li className="flex gap-x-3">Enterprise GPT-4 Integration</li>
              <li className="flex gap-x-3">Automated Code Reviews</li>
              <li className="flex gap-x-3">Smart Project Analytics</li>
              <li className="flex gap-x-3">Priority Community Support</li>
              <li className="flex gap-x-3">Exclusive Developer Events</li>
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gradient-to-br from-[#1a1c3d] via-[#242750] to-[#2d3160] py-10 text-center ring-1 ring-inset ring-white/10 lg:flex lg:flex-col lg:justify-center lg:py-16 backdrop-blur-sm">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-300">Limited Time Offer</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-white">$50</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-300">USD</span>
                </p>
                <Link
                  href="https://discord.gg/AqD9Aatdpm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get Lifetime Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
