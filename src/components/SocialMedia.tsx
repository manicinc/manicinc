import Link from "next/link";
import clsx from "clsx";
import {
  BsFacebook,
  BsTwitter,
  BsGithub,
  // BsYoutube,
  BsInstagram,
  BsLinkedin,
} from "react-icons/bs";

interface SocialMediaProfile {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SocialMediaProfiles: SocialMediaProfile[] = [
  /* {
    title: "Instagram",
    href: "#",
    icon: BsInstagram,
  }, */
  {
    title: "GitHub",
    href: "https://github.com/manicinc",
    icon: BsGithub,
  },
  /* {
    title: "Facebook",
    href: "#",
    icon: BsFacebook,
  }, */
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/company/manic-agency-llc/",
    icon: BsLinkedin,
  },
  {
    title: "Twitter",
    href: "https://x.com/manicagency",
    icon: BsTwitter,
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
