import FadeIn, { FadeInStagger } from './FadeIn';
import clsx from 'clsx';
import Border from './Border';

interface GridListProps {
  className?: string;
  children: React.ReactNode;
}

interface GridListItemProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  invert?: boolean;
}

export const GridList: React.FC<GridListProps> = ({ className, children }) => {
  return (
    <FadeInStagger>
      <ul
        role="list"
        className={clsx(
          'grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3',
          className
        )}>
        {children}
      </ul>
    </FadeInStagger>
  );
};

export const GridListItem: React.FC<GridListItemProps> = ({
  title,
  children,
  className,
  invert = false,
}) => {
  return (
    <li
      className={clsx(
        'text-base',
        invert
          ? 'text-neutral-300 before:bg-white after:bg-white/10'
          : 'text-neutral-600 before:bg-neutral-950 after:bg-neutral-100',
        className
      )}>
      <FadeIn>
        <Border position="left" className="pl-8" invert={invert}>
          <strong
            className={clsx(
              'font-semibold',
              invert ? 'text-white' : 'text-neutral-950'
            )}>
            {title}.
          </strong>{' '}
          {children}
        </Border>
      </FadeIn>
    </li>
  );
};
