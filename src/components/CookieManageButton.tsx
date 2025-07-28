'use client';

interface CookieManageButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function CookieManageButton({ className, children }: CookieManageButtonProps) {
  const handleClick = () => {
    window.dispatchEvent(new Event('show-cookie-consent'));
  };

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}
