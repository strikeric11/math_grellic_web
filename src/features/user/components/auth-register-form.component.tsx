import { memo, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isMobilePhone from 'validator/lib/isMobilePhone';
import toast from 'react-hot-toast';
import cx from 'classix';

import { capitalize } from '#/utils/string.util';
import {
  BaseControlledInput,
  BaseControlledPhoneInput,
} from '#/base/components/base-input.component';
import { BaseControlledPasswordInput } from '#/base/components/base-password-input.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseControlledSelect } from '#/base/components/base-select.component';
import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledCheckbox } from '#/base/components/base-checkbox.component';
import { UserApprovalStatus, UserGender, UserRole } from '../models/user.model';

import type { FormProps, SelectOption } from '#/base/models/base.model';
import type { User } from '../models/user.model';
import type { AuthRegisterFormData } from '../models/auth.model';

type Props = Omit<
  FormProps<'div', AuthRegisterFormData, Promise<User | null>>,
  'onSubmit'
> & {
  userRole: UserRole;
  onSubmit: (
    data: AuthRegisterFormData,
    role: UserRole,
  ) => Promise<User | null>;
};

const INPUT_CLASSNAME = '!max-w-input md:max-lg:!max-w-full';

const inputWrapperProps = { className: INPUT_CLASSNAME };

const genders: SelectOption[] = [
  {
    label: capitalize(UserGender.Male),
    value: UserGender.Male,
  },
  {
    label: capitalize(UserGender.Female),
    value: UserGender.Female,
  },
];

const schema = z
  .object({
    email: z.string().email('Provide your email address'),
    password: z
      .string()
      .min(8, 'Password should be minimum of 8 characters')
      .max(100, 'Password is too long'),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(2, 'Name is too short')
      .max(50, 'Name is too long'),
    lastName: z
      .string()
      .min(2, 'Name is too short')
      .max(50, 'Name is too long'),
    middleName: z
      .string()
      .min(1, 'Name is too short')
      .max(50, 'Name is too long')
      .optional(),
    birthDate: z
      .date({ required_error: 'Provide your date of birth' })
      .min(new Date('1900-01-01'), 'Date of birth is too old')
      .max(new Date(), 'Date of birth is too young'),
    phoneNumber: z
      .string()
      .refine((value) => isMobilePhone(value.replace(/[^0-9]/g, ''), 'en-PH'), {
        message: 'Phone number is invalid',
      }),
    teacherId: z.string().length(11, 'ID must be 11 characters long'),
    gender: z.nativeEnum(UserGender, {
      required_error: 'Provide your gender',
    }),
    agreeTerms: z.boolean(),
    approvalStatus: z.nativeEnum(UserApprovalStatus).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });

const defaultValues: Partial<AuthRegisterFormData> = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: undefined,
  phoneNumber: '',
  gender: undefined,
  teacherId: '',
  approvalStatus: UserApprovalStatus.Pending,
};

export const AuthRegisterForm = memo(function ({
  className,
  userRole,
  isDone,
  onDone,
  onSubmit,
  ...moreProps
}: Props) {
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<AuthRegisterFormData>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Set default teacher's id if teacher role is selected
    reset({ teacherId: userRole === UserRole.Teacher ? 'xxxxxxxxxxx' : '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const handleReset = useCallback(() => reset(), [reset]);

  const submitForm = useCallback(
    async (data: AuthRegisterFormData) => {
      try {
        await onSubmit(data, userRole);
        onDone && onDone(true);
        // TODO show done component
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [userRole, onSubmit, onDone],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <form onSubmit={handleSubmit(submitForm)}>
        <fieldset
          className='group/field flex flex-col items-center justify-center gap-5 md:grid md:grid-cols-3 md:items-start'
          disabled={isSubmitting || isDone}
        >
          <BaseControlledInput
            label='First Name'
            name='firstName'
            control={control}
            wrapperProps={inputWrapperProps}
            asterisk
          />
          <BaseControlledInput
            label='Last Name'
            name='lastName'
            control={control}
            wrapperProps={inputWrapperProps}
            asterisk
          />
          <BaseControlledInput
            label='Middle Name'
            name='middleName'
            control={control}
            wrapperProps={inputWrapperProps}
            asterisk
          />
          <BaseControlledSelect
            name='gender'
            label='Gender'
            options={genders}
            control={control}
            className={INPUT_CLASSNAME}
            asterisk
          />
          <BaseControlledDatePicker
            name='birthDate'
            label='Date of Birth'
            control={control}
            iconName='calendar'
            className={INPUT_CLASSNAME}
            asterisk
          />
          <BaseControlledPhoneInput
            label='Phone Number'
            name='phoneNumber'
            control={control}
            wrapperProps={inputWrapperProps}
            asterisk
          />
        </fieldset>
        <BaseDivider className='my-4' />
        <fieldset
          className='group/field flex flex-col place-items-start items-center justify-center gap-5 md:grid md:grid-cols-3 md:items-start'
          disabled={isSubmitting || isDone}
        >
          <BaseControlledInput
            type='email'
            name='email'
            label='Email'
            control={control}
            wrapperProps={inputWrapperProps}
            asterisk
          />
          <BaseControlledPasswordInput
            name='password'
            label='Password'
            control={control}
            showPassword={showPassword}
            onShowPassword={setShowPassword}
            wrapperProps={inputWrapperProps}
            asterisk
          />
          <BaseControlledInput
            type={showPassword ? 'text' : 'password'}
            name='confirmPassword'
            label='Confirm Password'
            wrapperProps={inputWrapperProps}
            control={control}
          />
        </fieldset>
        <fieldset
          className={cx(
            'group/field mt-6',
            userRole === UserRole.Student &&
              'flex flex-col items-center gap-5 md:flex-row',
          )}
          disabled={isSubmitting || isDone}
        >
          {userRole === UserRole.Student && (
            <BaseControlledInput
              label="Teacher's ID"
              name='teacherId'
              control={control}
              asterisk
            />
          )}
          <div className='w-full rounded-md border border-accent/40 px-4 pb-2.5 pt-2'>
            <BaseControlledCheckbox
              name='agreeTerms'
              label='By checking this box, I agree to the terms and conditions.
            These guidelines cover app usage, content, and privacy. Please review
            them before enjoying the edutainment experience.'
              control={control}
            />
          </div>
        </fieldset>
        <div className='xs:flex-row mt-8 flex flex-col items-center justify-between gap-5'>
          <BaseButton
            variant='link'
            rightIconName='arrow-counter-clockwise'
            onClick={handleReset}
            disabled={isSubmitting || isDone}
          >
            Reset Fields
          </BaseButton>
          <BaseButton
            type='submit'
            className='xs:w-auto !h-16 w-full px-8 !text-xl'
            size='base'
            loading={isSubmitting || isDone}
          >
            Complete Sign Up
          </BaseButton>
        </div>
      </form>
    </div>
  );
});
