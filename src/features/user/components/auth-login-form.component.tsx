import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import cx from 'classix';
import toast from 'react-hot-toast';

import { DASHBOARD_PATH } from '#/utils/path.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledPasswordInput } from '#/base/components/base-password-input.component';
import { useAuth } from '../hooks/use-auth.hook';

import gridWhiteSmPng from '#/assets/images/grid-white-sm.png';
import logoOnlySmPng from '#/assets/images/logo-only-sm.png';

import type { ComponentProps } from 'react';
import type { AuthCredentials } from '../models/auth.model';

type Props = ComponentProps<'div'> & {
  onRegister?: () => void;
};

const bgStyle = { backgroundImage: `url(${gridWhiteSmPng})` };

const schema = z.object({
  email: z.string().email('Provide your email address'),
  password: z.string().min(1, 'Provide your password'),
});

const defaultValues = {
  email: '',
  password: '',
};

export const AuthLoginForm = memo(function ({
  className,
  onRegister,
  ...moreProps
}: Props) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isDone, setIsDone] = useState(false);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    getValues,
    reset,
  } = useForm<AuthCredentials>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const submitForm = useCallback(
    async (data: AuthCredentials) => {
      try {
        await login(data);
        setIsDone(true);
        navigate(DASHBOARD_PATH);
      } catch (error: any) {
        reset({ email: getValues('email'), password: '' });
        toast.error(error.message);
      }
    },
    [navigate, login, reset, getValues],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <div className='px-14 pb-14'>
        <div className='mb-9'>
          <h2 className='mb-2'>Welcome Back!</h2>
          <p className='text-lg'>
            Sign in to embark on an exciting adventure. If you are new,
            don&apos;t worry,{' '}
            <button
              className='text-primary hover:text-primary-focus-light'
              onClick={onRegister}
            >
              signing up is quick and easy
            </button>
            .
          </p>
        </div>
        <form onSubmit={handleSubmit(submitForm)}>
          <fieldset
            className='group/field mb-6 flex flex-col items-center gap-6'
            disabled={isSubmitting || isDone}
          >
            <BaseControlledInput
              type='email'
              name='email'
              label='Email'
              control={control}
              fullWidth
            />
            <BaseControlledPasswordInput
              name='password'
              label='Password'
              control={control}
              showPassword={showPassword}
              onShowPassword={setShowPassword}
              fullWidth
            />
          </fieldset>
          <BaseButton
            type='submit'
            className='!h-16 w-full px-8 !text-xl'
            size='base'
            loading={isSubmitting || isDone}
          >
            Sign In
          </BaseButton>
        </form>
      </div>
      <div className='w-full bg-gradient-to-b from-primary to-primary-focus-light'>
        <div
          style={bgStyle}
          className='flex w-full items-center justify-center py-6'
        >
          <img
            src={logoOnlySmPng}
            alt='logo only sm'
            className='drop-shadow-sm'
            width={71}
            height={69}
          />
        </div>
      </div>
    </div>
  );
});
