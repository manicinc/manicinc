import Link from 'next/link';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  invert?: boolean;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  invert,
  href,
  className,
  children,
  ...props
}) => {
  const buttonClassName = clsx(
    className,
    'inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition',
    invert
      ? 'bg-white text-neutral-950 hover:bg-neutral-200'
      : 'bg-pink-600 text-white hover:bg-pink-800'
  );

  let inner = <span>{children}</span>;

  if (href) {
    return (
      <Link href={href} className={buttonClassName}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={buttonClassName} {...props}>
      {inner}
    </button>
  );
};

export default Button;
