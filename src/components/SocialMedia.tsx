import Link from "next/link";
import clsx from "clsx";
import { Github, Linkedin, Twitter, type LucideIcon } from "lucide-react";

interface SocialMediaProfile {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const SocialMediaProfiles: SocialMediaProfile[] = [
  {
    title: "GitHub",
    href: "https://github.com/manicinc",
    icon: Github,
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/company/manic-agency-llc/",
    icon: Linkedin,
  },
  {
    title: "Twitter",
    href: "https://x.com/manicagency",
    icon: Twitter,
  },
];

interface SocialMediaProps {
  className?: string;
  invert?: boolean;
}

const SocialMedia = ({ className, invert = false }: SocialMediaProps) => {
  return (
    <ul
      role="list"
      className={clsx(
        "flex gap-x-10",
        invert ? "text-white" : "text-neutral-950",
        className
      )}
    >
      {SocialMediaProfiles.map((item) => (
        <li key={item.title}>
          <Link
            href={item.href}
            aria-label={item.title}
            className={clsx(
              "transition",
              invert ? "hover:text-neutral-200" : "hover:text-neutral-700"
            )}
          >
            <item.icon className="h-6 w-6 fill-current" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SocialMedia;
