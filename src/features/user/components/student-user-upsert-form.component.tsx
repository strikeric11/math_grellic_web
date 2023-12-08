import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { Menu } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isMobilePhone from 'validator/lib/isMobilePhone';
import toast from 'react-hot-toast';
import cx from 'classix';

import { getErrorMessage } from '#/utils/string.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseStepper } from '#/base/components/base-stepper.component';
import { BaseStepperStep } from '#/base/components/base-stepper-step.component';
import { UserApprovalStatus, UserGender } from '../models/user.model';
import { StudentUserUpsertFormStep1 } from './student-user-upsert-form-step-1.component';

import type { FieldErrors } from 'react-hook-form';
import type { FormProps, IconName } from '#/base/models/base.model';
import type { User } from '../models/user.model';
import type { AuthRegisterFormData } from '../models/auth.model';

type Props = Omit<
  FormProps<'div', AuthRegisterFormData, Promise<User | null>>,
  'onSubmit'
> & {
  onSubmit: (data: AuthRegisterFormData) => Promise<User | null>;
};

const STUDENT_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.student.to}`;

const stepWrapperProps = {
  className: '!overflow-visible',
};

const schema = z.object({
  email: z.string().email('Provide your email address'),
  firstName: z.string().min(2, 'Name is too short').max(50, 'Name is too long'),
  lastName: z.string().min(2, 'Name is too short').max(50, 'Name is too long'),
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
  teacherId: z.string().optional(),
  gender: z.nativeEnum(UserGender, {
    required_error: 'Provide your gender',
  }),
  approvalStatus: z.nativeEnum(UserApprovalStatus).optional(),
});

const defaultValues: Partial<AuthRegisterFormData> = {
  email: '',
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: undefined,
  phoneNumber: '',
  gender: undefined,
  teacherId: undefined,
  approvalStatus: UserApprovalStatus.Pending,
};

export const StudentUserUpsertForm = memo(function ({
  className,
  formData,
  loading: formLoading,
  isDone,
  onDone,
  onSubmit,
  onDelete,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const methods = useForm<AuthRegisterFormData>({
    shouldFocusError: false,
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  const {
    formState: { isSubmitting },
    reset,
    handleSubmit,
  } = methods;

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const [isEdit, editApprovalStatus] = useMemo(
    () => [!!formData, formData?.approvalStatus || undefined],
    [formData],
  );

  const [publishButtonLabel, publishButtonIconName]: [string, IconName] =
    useMemo(() => {
      if (!isEdit) {
        return ['Enroll', 'share-fat'];
      }

      if (editApprovalStatus === UserApprovalStatus.Pending) {
        return ['Approve', 'share-fat'];
      }

      return ['Save Changes', 'floppy-disk-back'];
    }, [isEdit, editApprovalStatus]);

  const handleReset = useCallback(() => {
    reset(isEdit ? formData : defaultValues);
  }, [isEdit, formData, reset]);

  const handleSubmitError = useCallback(
    (errors: FieldErrors<AuthRegisterFormData>) => {
      const errorMessage = getErrorMessage(errors);
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: AuthRegisterFormData, approvalStatus?: UserApprovalStatus) => {
      // TODO check if edit, delete, back to pending or rejecting if student has completions

      try {
        const targetData = approvalStatus ? { ...data, approvalStatus } : data;
        await onSubmit(targetData);

        toast.success(`Student ${isEdit ? 'Updated' : 'Enrolled'}`);

        onDone && onDone(true);
        navigate(STUDENT_LIST_PATH);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [isEdit, onSubmit, onDone, navigate],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            (data) =>
              submitForm(
                data,
                editApprovalStatus === UserApprovalStatus.Rejected
                  ? UserApprovalStatus.Rejected
                  : UserApprovalStatus.Approved,
              ),
            handleSubmitError,
          )}
        >
          <BaseStepper
            disabled={loading}
            onReset={handleReset}
            stepWrapperProps={stepWrapperProps}
            controlsRightContent={
              <div className='group-button'>
                <BaseButton
                  type='submit'
                  className='min-w-[180px]'
                  rightIconName={publishButtonIconName}
                  loading={loading}
                  disabled={isDone}
                >
                  {publishButtonLabel}
                </BaseButton>
                <BaseDropdownMenu disabled={loading}>
                  {isEdit ? (
                    <>
                      {editApprovalStatus !== UserApprovalStatus.Rejected && (
                        <>
                          <Menu.Item
                            as={BaseDropdownButton}
                            iconName='trash'
                            onClick={handleSubmit(
                              (data) =>
                                submitForm(data, UserApprovalStatus.Pending),
                              handleSubmitError,
                            )}
                            disabled={loading}
                          >
                            Save as Pending
                          </Menu.Item>
                          <Menu.Item
                            as={BaseDropdownButton}
                            iconName='trash'
                            onClick={handleSubmit(
                              (data) =>
                                submitForm(data, UserApprovalStatus.Rejected),
                              handleSubmitError,
                            )}
                            disabled={loading}
                          >
                            Save as Rejected
                          </Menu.Item>
                          <BaseDivider />
                        </>
                      )}
                      <Menu.Item
                        as={BaseDropdownButton}
                        className='text-red-500'
                        iconName='trash'
                        onClick={onDelete}
                        disabled={loading}
                      >
                        Delete
                      </Menu.Item>
                    </>
                  ) : (
                    <Menu.Item
                      as={BaseDropdownButton}
                      iconName='share-fat'
                      onClick={handleSubmit((data) =>
                        submitForm(data, UserApprovalStatus.Pending),
                      )}
                      disabled={loading}
                    >
                      Register as Pending
                    </Menu.Item>
                  )}
                </BaseDropdownMenu>
              </div>
            }
          >
            <BaseStepperStep label='Student Info'>
              <StudentUserUpsertFormStep1 disabled={loading} />
            </BaseStepperStep>
            {/* {!isEdit && (
              <BaseStepperStep label='Student Credentials'>
                <StudentUserUpsertFormStep2 disabled={loading} />
              </BaseStepperStep>
            )} */}
          </BaseStepper>
        </form>
      </FormProvider>
    </div>
  );
});
