import { memo, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Menu } from '@headlessui/react';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import isTime from 'validator/lib/isTime';
import toast from 'react-hot-toast';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledTimeInput } from '#/base/components/base-time-input.component';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledTextArea } from '#/base/components/base-textarea.component';

import type { FormProps, IconName } from '#/base/models/base.model';
import type { Announcement } from '../models/announcement.model';
import type { AnnouncementUpsertFormData } from '../models/announcement-form-data.model';

type Props = FormProps<
  'div',
  AnnouncementUpsertFormData,
  Promise<Announcement | void>
> & {
  withPreview?: boolean;
};

const calendarSelectorProps = {
  minDate: new Date(`${new Date().getFullYear() - 5}-01-01`),
  maxDate: new Date(`${new Date().getFullYear() + 5}-12-31`),
};

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  startDate: z
    .date({ required_error: 'Date is required' })
    .min(new Date(`${new Date().getFullYear()}-01-01`), 'Date is invalid'),
  startTime: z
    .string({ required_error: 'Time is required' })
    .refine((value) => isTime(value, { hourFormat: 'hour12' }), {
      message: 'Time is invalid',
    }),
  studentIds: z
    .array(z.number(), { required_error: 'Assign students' })
    .nullable()
    .optional(),
});

const defaultValues: Partial<AnnouncementUpsertFormData> = {
  title: '',
  description: '',
  startDate: undefined,
  startTime: undefined,
  studentIds: undefined,
};

export const AnnouncementUpsertForm = memo(function ({
  className,
  formData,
  loading: formLoading,
  withPreview,
  isDone,
  onDone,
  onSubmit,
  onDelete,
  ...moreProps
}: Props) {
  const isEdit = useMemo(() => !!formData, [formData]);

  const {
    formState: { isSubmitting },
    control,
    reset,
    handleSubmit,
  } = useForm<AnnouncementUpsertFormData>({
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const [publishButtonLabel, publishButtonIconName]: [string, IconName] =
    useMemo(() => {
      if (withPreview) {
        return ['Preview Announcement', 'share-fat' as IconName];
      }

      return [
        isEdit ? 'Save Changes' : 'Broadcast Announcement',
        (isEdit ? 'floppy-disk-back' : 'share-fat') as IconName,
      ];
    }, [isEdit, withPreview]);

  const headerAnnouncementText = useMemo(() => {
    if (withPreview || !formData) {
      return 'Create Announcement';
    }

    return 'Edit Announcement';
  }, [withPreview, formData]);

  const handleReset = useCallback(() => {
    reset(isEdit ? formData : defaultValues);
  }, [isEdit, formData, reset]);

  const submitForm = useCallback(
    async (data: AnnouncementUpsertFormData) => {
      try {
        const announcement = await onSubmit(data);

        if (announcement) {
          toast.success(
            `${isEdit ? 'Updated' : 'Created'} ${announcement.title}`,
          );
        }

        onDone && onDone(true);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [isEdit, onSubmit, onDone],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <form onSubmit={handleSubmit(submitForm)}>
        <h3 className='text-lg leading-none'>{headerAnnouncementText}</h3>
        <div className='mx-auto mb-5 w-full pt-5'>
          <fieldset
            className='group/field flex flex-wrap gap-5'
            disabled={loading}
          >
            <BaseControlledInput
              label='Title'
              name='title'
              control={control}
              fullWidth
            />
            <BaseControlledTextArea
              label='Description'
              name='description'
              control={control}
              className='!min-h-[140px]'
              fullWidth
            />
            <div className='flex w-full flex-col items-start justify-between gap-5 -2xs:flex-row'>
              <BaseControlledDatePicker
                name='startDate'
                label='Date'
                control={control}
                iconName='calendar'
                calendarSelectorProps={calendarSelectorProps}
                fullWidth
              />
              <BaseControlledTimeInput
                name='startTime'
                label='Start Time'
                iconName='clock'
                control={control}
                fullWidth
              />
            </div>
            {/* <div className='w-full'>
              <StudentUserControlledPicker
                name='studentIds'
                label='Students'
                control={control}
              />
            </div> */}
          </fieldset>
        </div>
        <div>
          <div className='flex w-full flex-col items-center justify-between gap-2.5 -2xs:flex-row'>
            <BaseButton
              variant='link'
              size='sm'
              rightIconName='arrow-counter-clockwise'
              onClick={handleReset}
              disabled={loading}
            >
              Reset Fields
            </BaseButton>
            <div className='group-button w-full -2xs:w-auto'>
              <BaseButton
                className='w-full'
                type='submit'
                rightIconName={publishButtonIconName}
                loading={loading}
                disabled={isDone}
              >
                {publishButtonLabel}
              </BaseButton>
              {isEdit && (
                <BaseDropdownMenu disabled={loading}>
                  <Menu.Item
                    as={BaseDropdownButton}
                    className='text-red-500'
                    iconName='trash'
                    onClick={onDelete}
                    disabled={loading}
                  >
                    Delete
                  </Menu.Item>
                </BaseDropdownMenu>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});
