import Link from 'next/link';
import Image from 'next/image';
import velvetLogo from "../images/velvet-web-logo.png"
import styles from './VelvetHero.module.css'
import bgImage from "@/images/velvet-bg.jpg";

export default function VelvetHero() {
  return (
    <div className="relative isolate pt-14 text-white" style={{backgroundImage: `url(${bgImage.src})`}}>
      <div className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto flex justify-center mb-8">
            <Image
              src={velvetLogo}
              alt="Velvet Web Logo"
              width={120}
              height={120}
              priority
              className={styles.heartbeat}
            />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Velvet Web: AI-Powered Community for Innovators
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Your central hub for tech innovators, builders, and developers. Get AI-powered insights, 
              advanced code analysis, and smart project management tools to accelerate your development workflow.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="https://discord.gg/AqD9Aatdpm"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Join Our Community
              </Link>
              <Link
                href="#features"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
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
            d="M0 120L48 105C96 90 192 60 288 47.5C384 35 480 40 576 50C672 60 768 75 864 77.5C960 80 1056 70 1152 65C1248 60 1344 60 1392 60L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            className="fill-white dark:fill-gray-800"
          />
        </svg>
      </div>
    </div>
  );
}
