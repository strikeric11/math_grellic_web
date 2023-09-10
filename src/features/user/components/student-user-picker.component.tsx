import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useController } from 'react-hook-form';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { BaseSelect } from '#/base/components/base-select.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSearchInput } from '#/base/components/base-search-input.component';
import { transformToStudentUserAccount } from '../helpers/user-transform.helper';
import { generateFullName } from '../helpers/user.helper';
import { getStudentsByCurrentTeacherUser } from '../api/user.api';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { SelectOption } from '#/base/models/base.model';
import type { StudentUserAccount } from '../models/user.model';

type Props = Omit<ComponentProps<'div'>, 'onChange'> & {
  name?: string;
  value?: number[] | null;
  label?: string;
  description?: string;
  errorMessage?: string;
  asterisk?: boolean;
  required?: boolean;
  selectProps?: Omit<ComponentProps<typeof BaseSelect>, 'options'>;
  onChange?: (value: number[] | null) => void;
};

type StudentUserItemProps = {
  student: StudentUserAccount;
  onClick: () => void;
  selected?: boolean;
};

const options: SelectOption[] = [
  {
    label: 'Everyone',
    value: '1',
  },
  {
    label: 'Specify students...',
    value: '2',
  },
];

const StudentUserItem = memo(function ({
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
      className='group/usrpicker flex w-full items-center justify-between overflow-hidden rounded-md px-4 py-2 hover:bg-primary'
      onClick={onClick}
    >
      <div className='flex items-center gap-x-4'>
        <div className='flex h-11 w-11 items-center justify-center rounded bg-slate-200'>
          <BaseIcon name='user' className='opacity-60' size={36} />
        </div>
        <div className='flex flex-col items-start group-hover/usrpicker:text-white'>
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

export const StudentUserPicker = memo(
  forwardRef<HTMLDivElement, Props>(function (
    {
      name,
      value,
      label,
      className,
      description,
      errorMessage,
      asterisk,
      required,
      selectProps,
      onChange,
      ...moreProps
    },
    ref,
  ) {
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

    const {
      data: students,
      isFetching,
      isLoading,
    } = useQuery(
      getStudentsByCurrentTeacherUser(searchTerm, {
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToStudentUserAccount(item))
            : [],
      }),
    );

    const [openModal, setOpenModal] = useState(false);

    const [selectValue, setSelectValue] = useState<string | undefined>(
      undefined,
    );

    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>(
      value || [],
    );

    const [modalSelectedStudentIds, setModalSelectedStudentIds] =
      useState<number[]>(selectedStudentIds);

    useEffect(() => {
      if (value === undefined) {
        return;
      }

      // Set current BaseSelect value, set to "Everyone" if value is null or empty array.
      // Else set to second option - "Specify"
      if (!value?.length) {
        setSelectValue(options[0].value.toString());
      } else {
        setSelectValue(options[1].value.toString());
      }
    }, [value]);

    const handleCloseModal = useCallback(() => setOpenModal(false), []);

    // Handle BaseSelect change selected option, open modal if "specify" option is selected.
    // And sync modalSelectedIds to main selectedStudentIds value
    const handleSelectChange = useCallback(
      (val: string) => {
        setSelectValue(val);

        if (val !== '2') {
          setModalSelectedStudentIds([]);
          setSelectedStudentIds([]);
          onChange && onChange(null);
          return;
        }

        setModalSelectedStudentIds(selectedStudentIds);
        setOpenModal(true);
      },
      [selectedStudentIds, onChange],
    );

    // Set active props for each student item
    const setItemSelected = useCallback(
      (targetId: number) =>
        !!modalSelectedStudentIds.find((id) => id === targetId),
      [modalSelectedStudentIds],
    );

    // Add or remove id from modalSelectedStudentIds
    const handleStudentClick = useCallback(
      (id: number) => () =>
        setModalSelectedStudentIds((prev) => {
          const isExisting = prev.some((item) => item === id);

          if (isExisting) {
            return prev.filter((item) => item !== id);
          }

          return [...prev, id];
        }),
      [],
    );

    const handleSearchChange = useCallback((value: string | null) => {
      setSearchTerm(value || undefined);
    }, []);

    // Cancel by syncing modalSelectedStudentIds back to selectedStudentIds,
    // then close modal
    const handleCancel = useCallback(() => {
      setModalSelectedStudentIds(selectedStudentIds);

      if (!selectedStudentIds || !selectedStudentIds.length) {
        setSelectValue('1');
      }

      handleCloseModal();
    }, [selectedStudentIds, handleCloseModal]);

    // Apply modalSelectedStudentIds to main selectedStudentIds, then close modal
    const handleSubmit = useCallback(() => {
      setSelectedStudentIds(modalSelectedStudentIds);
      onChange && onChange(modalSelectedStudentIds);

      if (!modalSelectedStudentIds?.length) {
        setSelectValue('1');
      }

      handleCloseModal();
    }, [modalSelectedStudentIds, handleCloseModal, onChange]);

    return (
      <div className={cx('w-full', className)} {...moreProps}>
        <BaseSelect
          ref={ref}
          className='!min-w-full'
          name={name}
          label={label}
          value={selectValue}
          options={options}
          onChange={handleSelectChange}
          description={description}
          errorMessage={errorMessage}
          asterisk={asterisk}
          required={required}
          {...selectProps}
        />
        <BaseModal
          className='!min-h-0 !border-0 !px-10 !pb-8'
          size='sm'
          open={openModal}
          onClose={handleCancel}
        >
          <div className='flex flex-col items-center justify-between'>
            <div className='w-full overflow-hidden'>
              <div className='flex w-full flex-col items-center'>
                <BaseSearchInput onChange={handleSearchChange} />
              </div>
              <div className='relative h-[450px] w-full'>
                {(isLoading || isFetching) && (
                  <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
                    <BaseSpinner />
                  </div>
                )}
                <OverlayScrollbarsComponent
                  className='my-2 h-[450px] w-full px-4'
                  defer
                >
                  <ul
                    className={cx(
                      'w-full',
                      (isLoading || isFetching) && 'opacity-50',
                    )}
                  >
                    {(students as StudentUserAccount[]).map((student) => (
                      <li
                        key={student.id}
                        className='w-full border-b border-primary-border-light py-2 last:border-b-0'
                      >
                        <StudentUserItem
                          student={student}
                          selected={setItemSelected(student.id)}
                          onClick={handleStudentClick(student.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </OverlayScrollbarsComponent>
              </div>
            </div>
            <div className='flex w-full items-center justify-between gap-x-4'>
              <BaseButton variant='link' onClick={handleCancel}>
                Cancel
              </BaseButton>
              <BaseButton onClick={handleSubmit}>Select Students</BaseButton>
            </div>
          </div>
        </BaseModal>
      </div>
    );
  }),
);

export function StudentUserControlledPicker(
  props: Props & UseControllerProps<any>,
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <StudentUserPicker {...props} {...field} errorMessage={error?.message} />
  );
}
