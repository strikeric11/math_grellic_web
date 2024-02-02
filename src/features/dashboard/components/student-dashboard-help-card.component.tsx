import { memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { BaseSurface } from '#/base/components/base-surface.component';

import helpBg from '#/assets/images/help-bg.png';
import helpTeacher from '#/assets/images/help-teacher.png';

import type { ComponentProps } from 'react';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';

const HELP_PATH = `/${studentBaseRoute}/${studentRoutes.help.to}`;

export const StudentDashboardHelpCard = memo(function ({
  className,
  ...moreProps
}: ComponentProps<typeof BaseSurface>) {
  return (
    <Link to={HELP_PATH} className='group'>
      <BaseSurface
        className={cx(
          'relative overflow-hidden transition-[border] group-hover:!border-primary-focus group-hover:ring-primary-focus group-hover:drop-shadow-primary',
          className,
        )}
        {...moreProps}
      >
        <div className='mb-4 w-64 -2lg:w-56'>
          <h3 className='mb-2.5 text-lg'>Help & Support</h3>
          <span className='inline-block text-sm'>
            Need help? We are here to provide you with the assistance you need
            to make the most of your learning experience.
          </span>
        </div>
        <div>
          <div className='h-[76px] overflow-hidden rounded-b-xl border border-accent'>
            <img
              src={helpBg}
              alt='help background'
              width={395}
              height={74}
              className='h-full w-full object-cover'
            />
          </div>
          <img
            src={helpTeacher}
            alt='help teacher'
            width={106}
            height={214}
            className='absolute bottom-0 right-12 transition-transform duration-300 group-hover:-translate-y-2.5 group-hover:scale-110 -2xs:right-14'
          />
        </div>
      </BaseSurface>
    </Link>
  );
});
