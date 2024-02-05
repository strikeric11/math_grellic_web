import { memo, useCallback, useMemo } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSearchInput } from '#/base/components/base-search-input.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { generateFullName } from '../helpers/user.helper';

import type { ComponentProps } from 'react';
import type { StudentUserAccount } from '../models/user.model';

type Props = ComponentProps<'div'> & {
  students: StudentUserAccount[];
  selectedStudentIds?: number[];
  onSearchChange: (value: string | null) => void;
  onStudentSelect: (id: number) => () => void;
  onCancel: () => void;
  onSubmit: () => void;
  loading?: boolean;
};

type StudentUserItemProps = {
  student: StudentUserAccount;
  onClick?: () => void;
  selected?: boolean;
};

export const StudentUserItem = memo(function ({
  student,
  selected,
  onClick,
}: StudentUserItemProps) {
  const fullName = useMemo(
    () =>
      generateFullName(student.firstName, student.lastName, student.middleName),
    [student],
  );
  const publicId = useMemo(() => student.publicId, [student]);

  return (
    <button
      className={cx(
        'group/usrpicker flex w-full items-center justify-between overflow-hidden rounded-md px-4 py-2',
        onClick ? 'hover:bg-primary' : 'pointer-events-none',
      )}
      onClick={onClick}
    >
      <div className='flex items-center gap-4'>
        <div className='flex h-11 w-11 items-center justify-center rounded bg-slate-200'>
          <BaseIcon name='user' className='opacity-60' size={36} />
        </div>
        <div
          className={cx(
            'flex flex-col items-start',
            onClick && 'group-hover/usrpicker:text-white',
          )}
        >
          <span className='text font-medium'>{fullName}</span>
          <small>{publicId}</small>
        </div>
      </div>
      <div className='flex h-9 w-9 items-center justify-center'>
        {selected && (
          <BaseIcon
            name='check-fat'
            className='text-green-500'
            size={28}
            weight='fill'
          />
        )}
      </div>
    </button>
  );
});

export const StudentUserPickerList = memo(function ({
  className,
  loading,
  students,
  selectedStudentIds,
  onSearchChange,
  onStudentSelect,
  onCancel,
  onSubmit,
  ...moreProps
}: Props) {
  // Set active props for each student item
  const setItemSelected = useCallback(
    (targetId: number) => !!selectedStudentIds?.find((id) => id === targetId),
    [selectedStudentIds],
  );

  return (
    <div
      className={cx('flex flex-col items-center justify-between', className)}
      {...moreProps}
    >
      <div className='w-full overflow-hidden'>
        <div className='px-4'>
          <BaseSearchInput
            placeholder='Find a student'
            onChange={onSearchChange}
            fullWidth
          />
        </div>
        <div className='relative h-[450px] w-full'>
          {loading && (
            <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
              <BaseSpinner />
            </div>
          )}
          <OverlayScrollbarsComponent
            className='my-2 h-[450px] w-full px-4'
            defer
          >
            <ul className={cx('w-full', loading && 'opacity-50')}>
              {(students as StudentUserAccount[]).map((student) => (
                <li
                  key={student.id}
                  className='w-full border-b border-primary-border-light py-2 last:border-b-0'
                >
                  <StudentUserItem
                    student={student}
                    selected={setItemSelected(student.id)}
                    onClick={onStudentSelect(student.id)}
                  />
                </li>
              ))}
            </ul>
          </OverlayScrollbarsComponent>
        </div>
      </div>
      <div className='flex w-full items-center justify-between gap-4 px-5 pt-2.5 xs:px-0'>
        <BaseButton variant='link' onClick={onCancel}>
          Cancel
        </BaseButton>
        <BaseButton onClick={onSubmit}>Select Students</BaseButton>
      </div>
    </div>
  );
});
