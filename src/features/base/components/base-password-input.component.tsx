import { forwardRef, memo, useMemo } from 'react';
import { useController } from 'react-hook-form';

import { BaseInput } from './base-input.component';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { IconName } from '../models/base.model';

type Props = ComponentProps<typeof BaseInput> & {
  showPassword: boolean;
  onShowPassword: (show: boolean) => void;
};

export const BasePasswordInput = memo(
  forwardRef<HTMLInputElement, Props>(function (
    { showPassword, onShowPassword, ...moreProps },
    ref,
  ) {
    const passwordIconButtonProps = useMemo(
      () => ({
        name: (!showPassword ? 'eye-slash' : 'eye') as IconName,
        isInput: true,
        tooltip: !showPassword ? 'Show password' : 'Hide password',
        onClick: () => onShowPassword(!showPassword),
      }),
      [showPassword, onShowPassword],
    );

    return (
      <BaseInput
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightButtonProps={passwordIconButtonProps}
        {...moreProps}
      />
    );
  }),
);

export function BaseControlledPasswordInput(
  props: Props & UseControllerProps<any>,
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <BasePasswordInput {...props} {...field} errorMessage={error?.message} />
  );
}
