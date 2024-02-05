import { forwardRef, memo, useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useController } from 'react-hook-form';
import cx from 'classix';

import { queryUserKey } from '#/config/react-query-keys.config';
import { BaseSelect } from '#/base/components/base-select.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { transformToStudentUserAccount } from '../helpers/user-transform.helper';
import { getStudentsByCurrentTeacherUser } from '../api/teacher-user.api';
import {
  StudentUserItem,
  StudentUserPickerList,
} from './student-user-picker-list.component';

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

const options: SelectOption[] = [
  {
    label: 'Everyone',
    value: '1',
  },
  {
    label: 'Select students...',
    value: '2',
  },
];

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
    const [keyword, setKeyword] = useState<string | undefined>(undefined);

    const {
      data: students,
      isFetching,
      isLoading,
    } = useQuery(
      getStudentsByCurrentTeacherUser(
        { q: keyword },
        {
          refetchOnWindowFocus: false,
          initialData: [],
          select: (data: unknown) =>
            Array.isArray(data)
              ? data.map((item: any) => transformToStudentUserAccount(item))
              : [],
        },
      ),
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

    const {
      data: selectedStudents,
      isLoading: isSelectStudentsLoading,
      isFetching: isSelectStudentsFetching,
      refetch: selectedStudentsRefetch,
    } = useQuery(
      getStudentsByCurrentTeacherUser(
        { ids: value || selectedStudentIds || [] },
        {
          queryKey: queryUserKey.selectedStudentList,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
          enabled: false,
          initialData: [],
          select: (data: unknown) =>
            Array.isArray(data)
              ? data.map((item: any) => transformToStudentUserAccount(item))
              : [],
        },
      ),
    );

    useEffect(() => {
      if (value == null) {
        return;
      }

      (async () => {
        await selectedStudentsRefetch();
      })();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, selectedStudentIds]);

    useEffect(() => {
      if (value === undefined) {
        setSelectValue(undefined);
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
          onChange && onChange([]);
          return;
        }

        setModalSelectedStudentIds(selectedStudentIds);
        setOpenModal(true);
      },
      [selectedStudentIds, onChange],
    );

    // Add or remove id from modalSelectedStudentIds
    const handleStudentSelect = useCallback(
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
      setKeyword(value || undefined);
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
        {isSelectStudentsFetching || isSelectStudentsLoading ? (
          <div className='mt-5 flex w-full justify-center'>
            <BaseSpinner />
          </div>
        ) : (
          <ul
            className={cx('w-full', (isLoading || isFetching) && 'opacity-50')}
          >
            {value != null &&
              (selectedStudents as StudentUserAccount[]).map((student) => (
                <li
                  key={student.id}
                  className='w-full border-b border-primary-border-light py-2 last:border-b-0'
                >
                  <StudentUserItem student={student} />
                </li>
              ))}
          </ul>
        )}
        <BaseModal
          className='!min-h-0 !border-0 !px-0 !pb-8 xs:!px-10'
          size='sm'
          open={openModal}
          onClose={handleCancel}
        >
          <StudentUserPickerList
            students={students as StudentUserAccount[]}
            selectedStudentIds={modalSelectedStudentIds}
            loading={isLoading || isFetching}
            onSearchChange={handleSearchChange}
            onStudentSelect={handleStudentSelect}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
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
