import clsx from 'clsx';

interface OfficeProps {
  name: string;
  children: React.ReactNode;
  invert?: boolean;
}

function Office({ name, children, invert = false }: OfficeProps) {
  return (
    <address
      className={clsx(
        'text-sm not-italic',
        invert ? 'text-neutral-300' : 'text-neutral-600'
      )}>
      <strong className={invert ? 'text-white' : 'text-neutral-950'}>
        {name}
      </strong>
      <br />
      {children}
    </address>
  );
}

const Offices: React.FC<React.PropsWithChildren<{ invert?: boolean }>> = ({
  invert = false,
  ...props
}) => {
  return (
    <ul role="list" {...props}>
      <li>
        <Office name="U.S.A" invert={invert}>
          Los Angeles
          <br />
          California
          <br/>
          Lagos Nigeria
        </Office>
      </li>
    </ul>
  );
};

export default Offices;
