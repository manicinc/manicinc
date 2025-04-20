export default function VelvetFeatures() {
  const features = [
    {
      name: 'AI Project Management',
      description: 'Smart project tracking that helps you set milestones and stay accountable to your goals.'
    },
    {
      name: 'Intelligent Code Analysis',
      description: 'Advanced AI-powered code review and quality assessment for teams of all sizes.'
    },
    {
      name: 'Smart Content Curation',
      description: 'Automated tech news filtering and summarization based on your interests.'
    },
    {
      name: 'Developer Community',
      description: 'Interactive AI assistance and peer support to accelerate your development process.'
    }
  ];

  return (
    <div id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Powered by AI</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you&apos;ll need to accelerate development
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          className="relative w-full h-[60px] min-w-[1200px]"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path
            d="M0 120V60C240 20 480 0 720 0C960 0 1200 20 1440 60V120H0Z"
            className="fill-white dark:fill-gray-900"
          />
        </svg>
      </div>
    </div>
  );
}
