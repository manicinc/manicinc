'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Container from './Container';
import Link from 'next/link';
import Logo from './Logo';
import { HiMenuAlt4 } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import Button from './Button';
import clsx from 'clsx';
import Offices from './Offices';
import SocialMedia from './SocialMedia';
import Footer from './Footer/Footer';

interface HeaderProps {
  panelId: string;
  invert?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  expanded: boolean;
  onToggle: () => void;
  toggleRef: React.RefObject<HTMLButtonElement>;
}

const Header: React.FC<HeaderProps> = ({
  panelId,
  invert = false,
  icon: Icon,
  expanded,
  onToggle,
  toggleRef,
}) => {
  // Container
  return (
    <Container>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href={'/'} aria-label="Home">
          <Logo invert={invert}>Manic Agency</Logo>
        </Link>
        <div className="flex items-center gap-x-8">
          <Button
            href={'/contact'}
            invert={invert}
            className="font-bold py-2 px-4 border-b-4 border-blue-700">
            Work with us
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={panelId}
            className={clsx(
              'group -m-2.5 rounded-full p-2.5 transition',
              invert ? 'hover:bg-white/10' : 'hover:bg-neutral-950/10'
            )}
            aria-label="Toggle navigation">
            <Icon
              className={clsx(
                'h-6 w-6',
                invert
                  ? 'fill-white group-hover:fill-neutral-200'
                  : 'fill-neutral-950 group-hover:fill-neutral-700'
              )}
            />
          </button>
        </div>
      </div>
    </Container>
  );
};
interface NavigationRowProps {
  children: React.ReactNode;
}

const NavigationRow: React.FC<NavigationRowProps> = ({ children }) => {
  return (
    <div className="even:mt-px sm:bg-slate-500">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2">{children}</div>
      </Container>
    </div>
  );
};

interface NavigationItemProps {
  href: string;
  children: React.ReactNode;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ href, children }) => {
  return (
    <Link
      href={href}
      className="group relative isolate -mx-6 bg-slate-500 px-6 py-10 even:mt-px sm:mx-0 sm:px-0 sm:py-16 sm:odd:pr-16 sm:even:mt-0 sm:even:border-l sm:even:border-neutral-800 sm:even:pl-16">
      {children}
      <span className="absolute inset-y-0 -z-10 w-screen bg-slate-500 opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
    </Link>
  );
};

const Navigation = () => {
  return (
    <nav className="mt-px font-display text-5xl font-medium tracking-tight text-white">
      <NavigationRow>
        <NavigationItem href="/mission">Our Mission</NavigationItem>
        <NavigationItem href="/work">Our Work</NavigationItem>
      </NavigationRow>
      <NavigationRow>
        <NavigationItem href="/process">Our Process</NavigationItem>
        <NavigationItem href="/blog">Blog</NavigationItem>
      </NavigationRow>
    </nav>
  );
};

interface RootLayoutInnerProps {
  children: React.ReactNode;
}

const RootLayoutInner: React.FC<RootLayoutInnerProps> = ({ children }) => {
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);
  const openRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        (event.target as HTMLElement).closest('a')?.href ===
        window.location.href
      ) {
        setExpanded(false);
      }
    }
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);
  return (
    // <MotionConfig transition={shouldReduceMotion ? { duration: 0 } : undefined}>
    <>
      <header>
        <div
          className="absolute left-0 right-0 top-2 z-40 pt-14"
          aria-hidden={expanded ? 'true' : undefined}
          ref={(el) => {
            if (el) {
              if (expanded) {
                el.setAttribute('inert', 'true');
              } else {
                el.removeAttribute('inert');
              }
            }
          }}>
          {/* Header */}
          <Header
            panelId={panelId}
            icon={HiMenuAlt4}
            toggleRef={openRef}
            expanded={expanded}
            onToggle={() => {
              setExpanded((expanded) => !expanded);
              window.setTimeout(() =>
                closeRef.current?.focus({ preventScroll: true })
              );
            }}
          />
        </div>
        <div
          // layout
          id={panelId}
          style={{ height: expanded ? 'auto' : '0.5rem' }}
          className="relative z-50 overflow-hidden bg-slate-500 pt-2"
          aria-hidden={expanded ? undefined : 'true'}
          ref={(el) => {
            if (el) {
              if (expanded) {
                el.removeAttribute('inert');
              } else {
                el.setAttribute('inert', 'true');
              }
            }
          }}>
          <div
            // layout
            className="bg-slate-500">
            <div ref={navRef} className="bg-slate-500 pb-16 pt-14">
              <Header
                invert
                panelId={panelId}
                icon={IoMdClose}
                toggleRef={closeRef}
                expanded={expanded}
                onToggle={() => {
                  setExpanded((expanded) => !expanded);
                  window.setTimeout(() =>
                    openRef.current?.focus({ preventScroll: true })
                  );
                }}
              />
            </div>
            {/* Navigation */}
            <Navigation />
            <div className="relative bg-slate-500 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-neutral-800">
              <Container>
                <div className="grid grid-cols-1 gap-y-10 pb-16 pt-10 sm:grid-cols-2 sm:pt-16">
                  <div>
                    <h2 className="font-display text-base font-semibold text-white">
                      Our team locations
                    </h2>
                    <Offices invert />
                  </div>
                  <div className="sm:border-l sm:border-transparent sm:pl-16">
                    <h2 className="font-display text-base font-semibold text-white">
                      Follow us
                    </h2>
                    <SocialMedia className="mt-6 mb-6" invert />
                    <Link
                      href={`mailto:team@manic.agency`}
                      className="text-slate-200 hover:text-slate-400">
                      team@manic.agency
                    </Link>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </header>
      <div
        // layout
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className="relative flex flex-auto overflow-hidden bg-white pt-14">
        <div
          // layout
          className="relative isolate flex w-full flex-col pt-9">
          <main className="w-full flex-auto">{children}</main>
          {/* Footer */}
          <Footer />
        </div>
      </div>
      {/* </MotionConfig> */}
    </>
  );
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathName = usePathname();
  return <RootLayoutInner key={pathName}>{children}</RootLayoutInner>;
};

export default RootLayout;
