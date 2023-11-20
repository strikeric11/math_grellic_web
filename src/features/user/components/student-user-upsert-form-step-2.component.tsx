import { memo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledPasswordInput } from '#/base/components/base-password-input.component';

import type { ComponentProps } from 'react';
import type { AuthRegisterFormData } from '../models/auth.model';

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
};

export const StudentUserUpsertFormStep2 = memo(function ({
  disabled,
  ...moreProps
}: Props) {
  const { control } = useFormContext<AuthRegisterFormData>();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div {...moreProps}>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <div className='w-full'>
          <BaseControlledInput
            type='email'
            name='email'
            label='Email'
            control={control}
            fullWidth
            asterisk
          />
        </div>
        <div className='flex w-full items-start justify-between gap-5'>
          <BaseControlledPasswordInput
            name='password'
            label='Password'
            control={control}
            showPassword={showPassword}
            onShowPassword={setShowPassword}
            fullWidth
            asterisk
          />
          <BaseControlledInput
            type={showPassword ? 'text' : 'password'}
            name='confirmPassword'
            label='Confirm Password'
            control={control}
            fullWidth
          />
        </div>
      </fieldset>
    </div>
  );
});
