import { forwardRef, memo, useCallback, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import cx from 'classix';

import { queryClient } from '#/config/react-query-client.config';
import { queryLessonKey } from '#/config/react-query-keys.config';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSelect } from '#/base/components/base-select.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { transformToLesson } from '../helpers/lesson-transform.helper';
import { getLessonsByCurrentTeacherUser } from '../api/teacher-lesson.api';
import { LessonItem, LessonPickerList } from './lesson-picker-list.component';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { SelectOption } from '#/base/models/base.model';
import type { Lesson } from '../models/lesson.model';

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
    label: 'Select lessons...',
    value: '1',
  },
];

export const LessonPicker = memo(
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
      data: lessons,
      isFetching,
      isLoading,
    } = useQuery(
      getLessonsByCurrentTeacherUser(
        { q: keyword },
        {
          refetchOnWindowFocus: false,
          initialData: [],
          select: (data: unknown) =>
            Array.isArray(data)
              ? data.map((item: any) => transformToLesson(item))
              : [],
        },
      ),
    );

    const [openModal, setOpenModal] = useState(false);

    const [selectValue, setSelectValue] = useState<string | undefined>(
      undefined,
    );

    const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>(
      value || [],
    );

    const [modalSelectedLessonIds, setModalSelectedLessonIds] =
      useState<number[]>(selectedLessonIds);

    const {
      data: selectedLessons,
      isLoading: isSelectLessonsLoading,
      isFetching: isSelectLessonsFetching,
      refetch: selectedLessonsRefetch,
    } = useQuery(
      getLessonsByCurrentTeacherUser(
        { ids: value || selectedLessonIds || [] },
        {
          queryKey: queryLessonKey.selectedLessonList,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
          enabled: false,
          initialData: [],
          select: (data: unknown) =>
            Array.isArray(data)
              ? data.map((item: any) => transformToLesson(item))
              : [],
        },
      ),
    );

    useEffect(() => {
      if ((value && !value?.length) || !selectedLessonIds.length) {
        queryClient.invalidateQueries(queryLessonKey.selectedLessonList);
        return;
      }

      selectedLessonsRefetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, selectedLessonIds]);

    useEffect(() => {
      if (value == null || !value?.length) {
        setSelectValue(undefined);
        setSelectedLessonIds([]);
        return;
      }

      // Set current BaseSelect option if value is not null or not empty
      setSelectValue(options[0].value.toString());
    }, [value]);

    const handleCloseModal = useCallback(() => setOpenModal(false), []);

    // Handle BaseSelect change selected option, open modal if "specify" option is selected.
    // And sync modalSelectedIds to main selectedLessonIds value
    const handleSelectChange = useCallback(
      (val: string) => {
        setSelectValue(val);

        if (val !== '1') {
          setModalSelectedLessonIds([]);
          setSelectedLessonIds([]);
          onChange && onChange(null);
          return;
        }

        setModalSelectedLessonIds(selectedLessonIds);
        setOpenModal(true);
      },
      [selectedLessonIds, onChange],
    );

    // Add or remove id from modalSelectedLessonIds
    const handleLessonSelect = useCallback(
      (id: number) => () =>
        setModalSelectedLessonIds((prev) => {
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

    // Cancel by syncing modalSelectedLessonIds back to selectedLessonIds,
    // then close modal
    const handleCancel = useCallback(() => {
      setModalSelectedLessonIds(selectedLessonIds);

      if (!selectedLessonIds?.length) {
        setSelectValue(undefined);
      }

      handleCloseModal();
    }, [selectedLessonIds, handleCloseModal]);

    // Apply modalSelectedLessonIds to main selectedLessonIds, then close modal
    const handleSubmit = useCallback(() => {
      setSelectedLessonIds(modalSelectedLessonIds);
      onChange && onChange(modalSelectedLessonIds);

      if (!modalSelectedLessonIds?.length) {
        setSelectValue(undefined);
      }

      handleCloseModal();
    }, [modalSelectedLessonIds, handleCloseModal, onChange]);

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
        {isSelectLessonsFetching || isSelectLessonsLoading ? (
          <div className='mt-5 flex w-full justify-center'>
            <BaseSpinner />
          </div>
        ) : (
          <ul
            className={cx('w-full', (isLoading || isFetching) && 'opacity-50')}
          >
            {(selectedLessons as Lesson[]).map((lesson) => (
              <li
                key={lesson.id}
                className='w-full border-b border-primary-border-light py-2 last:border-b-0'
              >
                <LessonItem lesson={lesson} />
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
          <LessonPickerList
            lessons={lessons as Lesson[]}
            selectedLessonIds={modalSelectedLessonIds}
            loading={isLoading || isFetching}
            onSearchChange={handleSearchChange}
            onLessonSelect={handleLessonSelect}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </BaseModal>
      </div>
    );
  }),
);

export function LessonControlledPicker(props: Props & UseControllerProps<any>) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return <LessonPicker {...props} {...field} errorMessage={error?.message} />;
}
