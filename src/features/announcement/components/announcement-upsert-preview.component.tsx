import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';

import type { ComponentProps } from 'react';
import type { AnnouncementUpsertFormData } from '../models/announcement-form-data.model';
import { BaseSpinner } from '#/base/components/base-spinner.component';

type Props = ComponentProps<'div'> & {
  formData: AnnouncementUpsertFormData | null;
  onSubmit: () => void;
  fullSize?: boolean;
  hasError?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

export const AnnouncementUpsertPreview = memo(function ({
  className,
  loading,
  formData,
  fullSize,
  hasError,
  onClick,
  onSubmit,
  ...moreProps
}: Props) {
  const [title, description, dateText] = useMemo(
    () => [
      formData?.title,
      formData?.description,
      formData?.startDate &&
        `${dayjs(formData?.startDate)
          .format('MMM DD, YYYY')
          .toUpperCase()} / ${formData?.startTime}`,
    ],
    [formData],
  );

  return (
    <div className={cx('w-full bg-inherit', className)} {...moreProps}>
      <div
        className={cx(
          'group/ann-preview relative mb-[22px] flex cursor-pointer rounded-xl border-[3px]  bg-inherit transition-colors',
          fullSize ? 'w-full' : 'h-[154px] w-full -2lg:w-[396px]',
          hasError
            ? 'border-red-500 hover:border-red-400'
            : 'border-primary hover:border-primary-focus-light',
          loading && '!pointer-events-none hover:!border-primary',
        )}
        onClick={onClick}
      >
        <div className='absolute -right-[3px] -top-[3px] h-10 w-[52px] overflow-hidden bg-inherit'>
          <BaseIcon
            name='quotes'
            weight='fill'
            size={50}
            className={cx(
              'absolute -right-[5px] -top-[11px] transition-colors',
              hasError
                ? 'text-red-500 group-hover/ann-preview:text-red-400'
                : 'text-primary group-hover/ann-preview:text-primary-focus-light',
            )}
          />
        </div>
        <div
          className={cx(
            'flex w-full flex-col justify-between gap-2.5 px-4 py-3',
            !formData && 'opacity-60',
            loading && 'items-center !justify-center',
          )}
        >
          {loading ? (
            <BaseSpinner />
          ) : (
            <>
              <h4 className='w-full pr-8 font-body text-base font-medium normal-case leading-5 tracking-normal text-accent'>
                {title}
              </h4>
              <p
                className={cx(
                  'flex-1 font-medium leading-5',
                  !fullSize ? 'line-clamp-3 max-h-16' : 'min-h-[64px]',
                )}
              >
                {description ||
                  'Share any news or important updates to your students.'}
              </p>
              <div
                className={cx(
                  'w-full text-center',
                  formData ? 'text-sm uppercase' : 'font-medium',
                )}
              >
                {formData ? dateText : 'Tap to create an announcement'}
              </div>
            </>
          )}
        </div>
      </div>
      <BaseButton
        className='w-full'
        rightIconName='broadcast'
        loading={loading}
        onClick={onSubmit}
      >
        Broadcast
      </BaseButton>
    </div>
  );
});
