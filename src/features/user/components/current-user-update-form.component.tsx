import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isMobilePhone from 'validator/lib/isMobilePhone';
import toast from 'react-hot-toast';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import {
  BaseControlledInput,
  BaseControlledPhoneInput,
} from '#/base/components/base-input.component';
import { BaseControlledTextArea } from '#/base/components/base-textarea.component';

import type { FormProps } from '#/base/models/base.model';
import type { User } from '../models/user.model';
import type {
  StudentUserUpdateFormData,
  TeacherUserUpdateFormData,
} from '../models/user-form-data.model';

type Props = Omit<
  FormProps<
    'div',
    TeacherUserUpdateFormData | StudentUserUpdateFormData,
    Promise<User>
  >,
  'formData'
> & {
  formData: TeacherUserUpdateFormData | StudentUserUpdateFormData;
  isStudent?: boolean;
};

const textAreaClassName = '!min-h-[140px]';

const schema = z.object({
  phoneNumber: z
    .string()
    .refine(
      (value) => {
        const targetValue = value?.length === 10 ? `0${value}` : value;
        return isMobilePhone(targetValue.replace(/[^0-9]/g, ''), 'en-PH');
      },
      {
        message: 'Phone number is invalid',
      },
    )
    .optional(),
  aboutMe: z.string().optional(),
  educationalBackground: z.string().optional(),
  teachingExperience: z.string().optional(),
  teachingCertifications: z.string().optional(),
  website: z
    .string()
    .url('Website url is invalid')
    .max(255, 'Url is too long')
    .optional(),
  socialMediaLinks: z
    .array(z.string().url('Url is invalid').max(255, 'Url is too long'))
    .optional(),
  messengerLink: z
    .string()
    .url('Url is invalid')
    .max(255, 'Url is too long')
    .optional(),
  emails: z.array(z.string().email('Email address is invalid')).optional(),
  profileImageUrl: z
    .string()
    .url('Url is invalid')
    .max(255, 'Url is too long')
    .optional(),
});

export const CurrentUserUpdateForm = memo(function ({
  className,
  formData,
  loading: formLoading,
  isStudent,
  isDone,
  onDone,
  onSubmit,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const {
    control,
    formState: { isSubmitting },
    reset,
    handleSubmit,
  } = useForm<TeacherUserUpdateFormData | StudentUserUpdateFormData>({
    shouldFocusError: false,
    defaultValues: formData,
    resolver: zodResolver(schema),
  });

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const accountPath = useMemo(
    () =>
      isStudent
        ? `/${studentBaseRoute}/${studentRoutes.account.to}`
        : `/${teacherBaseRoute}/${teacherRoutes.account.to}`,
    [isStudent],
  );

  const handleReset = useCallback(() => reset(), [reset]);

  const submitForm = useCallback(
    async (data: TeacherUserUpdateFormData | StudentUserUpdateFormData) => {
      try {
        const targetData =
          data.phoneNumber?.length === 10
            ? {
                ...data,
                phoneNumber: `0${data.phoneNumber}`,
              }
            : data;

        await onSubmit(targetData);

        toast.success('Your account was updated'), onDone && onDone(true);
        navigate(accountPath);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [accountPath, onSubmit, onDone, navigate],
  );

  return (
    <div className={cx('w-full pb-8', className)} {...moreProps}>
      <form
        className='flex w-full flex-col'
        onSubmit={handleSubmit(submitForm)}
      >
        <BaseDivider className='mb-2.5 block pt-2.5 xs:hidden' />
        <div className='order-last pt-5 xs:order-none xs:pt-0'>
          <BaseDivider className='mb-2.5 hidden pt-2.5 xs:block' />
          <div className='flex w-full flex-col items-center justify-between gap-2.5 xs:flex-row'>
            <BaseButton
              variant='link'
              size='sm'
              rightIconName='arrow-counter-clockwise'
              onClick={handleReset}
              disabled={loading}
            >
              Reset Fields
            </BaseButton>
            <BaseButton
              className='w-full xs:w-auto'
              type='submit'
              rightIconName='floppy-disk-back'
              loading={loading}
              disabled={isDone}
            >
              Save Changes
            </BaseButton>
          </div>
        </div>
        <div className='mx-auto w-full max-w-[600px] pt-5'>
          <fieldset
            className='group/field flex flex-col gap-5'
            disabled={loading}
          >
            <div className='flex w-full flex-col items-start justify-between gap-5 xs:flex-row'>
              <BaseControlledPhoneInput
                label='Phone Number'
                name='phoneNumber'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInput
                label='Messenger Link'
                name='messengerLink'
                control={control}
                fullWidth
              />
            </div>
            {!isStudent && (
              <BaseControlledInput
                label='Website'
                name='website'
                control={control}
                fullWidth
              />
            )}
            <BaseDivider />
            <BaseControlledTextArea
              label='About Me'
              name='aboutMe'
              control={control}
              className={textAreaClassName}
              fullWidth
            />
            {!isStudent && (
              <>
                <BaseControlledTextArea
                  label='Educational Background'
                  name='educationalBackground'
                  control={control}
                  className={textAreaClassName}
                  fullWidth
                />
                <BaseControlledTextArea
                  label='Teaching Experience'
                  name='teachingExperience'
                  control={control}
                  className={textAreaClassName}
                  fullWidth
                />
                <BaseControlledTextArea
                  label='Teaching Certifications'
                  name='teachingCertifications'
                  control={control}
                  className={textAreaClassName}
                  fullWidth
                />
              </>
            )}
          </fieldset>
        </div>
      </form>
    </div>
  );
});
