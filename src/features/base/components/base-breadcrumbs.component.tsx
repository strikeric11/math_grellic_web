import { Fragment, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'ol'> & {
  pathname: string;
  basePath: string;
};

export const BaseBreadcrumbs = memo(function ({
  className,
  pathname,
  basePath,
  ...moreProps
}: Props) {
  const breadcrumbs = useMemo(() => {
    const labels = pathname
      .split('/')
      .filter((path, index) => index !== 1 && path.trim());

    const link: string[] = [basePath];
    return labels.map((label, index) => {
      link.push('/' + labels[index]);
      const itemLink = `/${link.join('')}`;

      if (index === labels.length - 1) {
        return <li>{label}</li>;
      }

      return (
        <li className='flex items-center leading-none after:mx-1.5 after:content-["/"] hover:text-primary'>
          <Link to={itemLink}>{label}</Link>
        </li>
      );
    });
  }, [basePath, pathname]);

  return (
    <ol
      className={cx('flex items-center text-sm text-accent/80', className)}
      {...moreProps}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <Fragment key={`bc-${index}`}>{breadcrumb}</Fragment>
      ))}
    </ol>
  );
});
