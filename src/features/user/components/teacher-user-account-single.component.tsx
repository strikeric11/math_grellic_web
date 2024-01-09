import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { TeacherUserAccount } from '../models/user.model';

type Props = ComponentProps<typeof BaseSurface> & {
  userAccount: TeacherUserAccount;
};

const FIELD_TITLE_CLASSNAME = 'mb-2.5 text-base';

const FIELD_VALUE_CLASSNAME = 'pl-2';

export const TeacherUserAccountSingle = memo(function ({
  className,
  userAccount,
  ...moreProps
}: Props) {
  const [
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
  ] = useMemo(
    () => [
      userAccount.aboutMe,
      userAccount.educationalBackground,
      userAccount.teachingExperience,
      userAccount.teachingCertifications,
      userAccount.website,
    ],
    [userAccount],
  );

  return (
    <BaseSurface
      className={cx('flex flex-col gap-4', className)}
      rounded='sm'
      {...moreProps}
    >
      <div>
        <h3 className={FIELD_TITLE_CLASSNAME}>About Me</h3>
        <p className={cx(!aboutMe && FIELD_VALUE_CLASSNAME)}>
          {aboutMe || '—'}
        </p>
      </div>
      <BaseDivider />
      <div>
        <h3 className={FIELD_TITLE_CLASSNAME}>Educational Background</h3>
        <p className={cx(!educationalBackground && FIELD_VALUE_CLASSNAME)}>
          {educationalBackground || '—'}
        </p>
      </div>
      <BaseDivider />
      <div>
        <h3 className={FIELD_TITLE_CLASSNAME}>Teaching Experience</h3>
        <p className={cx(!teachingExperience && FIELD_VALUE_CLASSNAME)}>
          {teachingExperience || '—'}
        </p>
      </div>
      <BaseDivider />
      <div>
        <h3 className={FIELD_TITLE_CLASSNAME}>Teaching Certifications</h3>
        <p className={cx(!teachingCertifications && FIELD_VALUE_CLASSNAME)}>
          {teachingCertifications || '—'}
        </p>
      </div>
      <BaseDivider />
      <div>
        <h3 className={FIELD_TITLE_CLASSNAME}>Website</h3>
        {website ? (
          <a
            href={website}
            className='text-primary-focus hover:underline'
            target='_blank'
          >
            {website}
          </a>
        ) : (
          <p className={FIELD_VALUE_CLASSNAME}>{website || '—'}</p>
        )}
      </div>
      {/* <BaseDivider />
      <div>
        <h3 className={FIELD_TITLE_CLASSNAME}>Social Media</h3>
        <p
          className={cx(
            !socialMediaLinks.length ? FIELD_VALUE_CLASSNAME : 'flex flex-col',
          )}
        >
          {socialMediaLinks.length
            ? socialMediaLinks.map((sml) => (
                <a
                  href={sml}
                  className='text-primary-focus hover:underline'
                  target='_blank'
                >
                  {sml}
                </a>
              ))
            : '—'}
        </p>
      </div>
      <BaseDivider />
      <div>
        <h3 className={FIELD_TITLE_CLASSNAME}>Additional Emails</h3>
        <p
          className={cx(
            !emails.length ? FIELD_VALUE_CLASSNAME : 'flex flex-col',
          )}
        >
          {emails.length ? emails.map((email) => <span>{email}</span>) : '—'}
        </p>
      </div> */}
    </BaseSurface>
  );
});
