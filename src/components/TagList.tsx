import clsx from "clsx";

export const TagList: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  return (
    <ul role="list" className={clsx(className, "flex flex-wrap gap-4")}>
      {children}
    </ul>
  );
}

export const TagListItem: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  return (
    <li
      className={clsx(
        "rounded-full bg-neutral-100 px-4 py-1.5 text-base text-neutral-600",
        className
      )}
    >
      {children}
    </li>
  );
}
