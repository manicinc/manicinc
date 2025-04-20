import Border from "./Border";
import clsx from "clsx";

import FadeIn from './FadeIn';
import FadeInStagger from './FadeIn';

const List: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  return (
    <FadeInStagger>
      <ul role="list" className={clsx("text-base text-neutral-600", className)}>
        {children}
      </ul>
    </FadeInStagger>
  );
};

export const ListItem: React.FC<React.PropsWithChildren<{ title?: string }>> = ({ title, children }) => {
  return (
    <li className="group mt-10 first:mt-0">
      <FadeIn>
        <Border className="pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden">
          {title && (
            <strong className="font-semibold text-neutral-950">{`${title}. `}</strong>
          )}
          {children}
        </Border>
      </FadeIn>
    </li>
  );
};

export default List;
