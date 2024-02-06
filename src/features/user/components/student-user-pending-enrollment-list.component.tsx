import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { formatPhoneNumber, generateFullName } from '../helpers/user.helper';

import type { ComponentProps } from 'react';
import type { StudentUserAccount } from '../models/user.model';

type Props = ComponentProps<'div'> & {
  pendingStudents: StudentUserAccount[];
  loading?: boolean;
  onStudentDetails?: (student: StudentUserAccount) => void;
  onRefresh?: () => void;
};

export const StudentUserPendingEnrollmentList = memo(
  forwardRef<any, Props>(function (
    {
      className,
      loading,
      pendingStudents,
      onStudentDetails,
      onRefresh,
      ...moreProps
    },
    ref,
  ) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentStudent = useMemo(() => {
      if (!pendingStudents.length) {
        null;
      }

      return pendingStudents[currentIndex];
    }, [pendingStudents, currentIndex]);

    const [date, email, phoneNumber] = useMemo(
      () => [
        dayjs(currentStudent?.createdAt).format('DD-MM-YYYY'),
        currentStudent?.email,
        currentStudent ? formatPhoneNumber(currentStudent?.phoneNumber) : '',
      ],
      [currentStudent],
    );

    const fullName = useMemo(
      () =>
        currentStudent
          ? generateFullName(
              currentStudent.firstName,
              currentStudent.lastName,
              currentStudent.middleName,
            )
          : '',
      [currentStudent],
    );

    const pendingCountText = useMemo(() => {
      const count = pendingStudents.length;

      if (count <= 1) {
        return `${!count ? 'No' : count} Pending Enrollment`;
      }

      return `${count} Pending Enrollments`;
    }, [pendingStudents]);

    const handlePrev = useCallback(() => {
      setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
    }, []);

    const handleNext = useCallback(() => {
      setCurrentIndex((prev) =>
        prev >= pendingStudents.length - 1 ? prev : prev + 1,
      );
    }, [pendingStudents]);

    const handleStudentDetails = useCallback(
      () => onStudentDetails && onStudentDetails(currentStudent),
      [currentStudent, onStudentDetails],
    );

    const handleRefresh = useCallback(() => {
      setCurrentIndex(0);
      onRefresh && onRefresh();
    }, [onRefresh]);

    useImperativeHandle(
      ref,
      () => ({
        handleRefresh,
      }),
      [handleRefresh],
    );

    return (
      <div className={cx('w-full', className)} {...moreProps}>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg'>{pendingCountText}</h2>
          <BaseTooltip content='Refresh'>
            <BaseIconButton
              name='arrow-clockwise'
              variant='link'
              size='sm'
              onClick={handleRefresh}
            />
          </BaseTooltip>
        </div>
        {currentStudent && (
          <BaseSurface
            className={cx(
              'flex min-h-[125px] flex-col justify-between gap-4 !p-3 -3xs:gap-0',
              onStudentDetails && 'cursor-pointer hover:!border-primary',
              loading &&
                'pointer-events-none w-full !items-center !justify-center',
            )}
            rounded='sm'
            onClick={handleStudentDetails}
            role={onStudentDetails ? 'button' : 'article'}
          >
            {loading ? (
              <BaseSpinner size='sm' />
            ) : (
              <>
                <div className='flex flex-col items-start gap-2.5 -3xs:flex-row'>
                  <h3 className='order-last flex-1 font-body text-base font-medium !tracking-normal !text-accent -3xs:order-none'>
                    {fullName}
                  </h3>
                  <BaseChip iconName='calendar-check'>{date}</BaseChip>
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-medium'>{email}</span>
                  <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
                </div>
              </>
            )}
          </BaseSurface>
        )}
        <div className='flex w-full items-center justify-between'>
          {!!pendingStudents.length && (
            <div className='flex items-center'>
              <BaseIconButton
                name='caret-circle-left'
                variant='link'
                className='w-9'
                disabled={loading}
                onClick={handlePrev}
              />
              <BaseIconButton
                name='caret-circle-right'
                variant='link'
                className='w-9'
                disabled={loading}
                onClick={handleNext}
              />
            </div>
          )}
          <div className='flex items-center gap-[5px]'>
            {pendingStudents.map((_, index) => (
              <div
                key={index}
                className={cx(
                  'h-2.5 w-2.5 overflow-hidden rounded-full',
                  index === currentIndex ? 'bg-primary' : 'bg-primary/50',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }),
);
