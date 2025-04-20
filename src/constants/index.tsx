import { ReactNode } from "react";
import { SocialMediaProfiles } from "@/components/SocialMedia";

interface NavigationLink {
  title: string | ReactNode;
  href: string;
}

interface NavigationSection {
  title: string;
  links: NavigationLink[];
}

export const navigation: NavigationSection[] = [
  {
    title: "Products",
    links: [
      { title: "Velvet Web", href: "/velvet"},
      { title: "Smart Parser", href: "#"},
      { title: "SynthGPT", href: "#"},
      {
        title: (
          <>
            See all <span aria-hidden="true">&rarr;</span>
          </>
        ),
        href: "/work",
      },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "Mission", href: "/mission" },
      { title: "Work", href: "/work" },
      { title: "Process", href: "/process" },
      { title: "Blog", href: "/blog" },
      { title: "Contact us", href: "/contact" },
      { title: "Team", href: "/team"}
    ],
  },
  {
    title: "Connect",
    links: SocialMediaProfiles,
  },
];
