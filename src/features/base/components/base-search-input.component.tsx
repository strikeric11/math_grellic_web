import { forwardRef, memo, useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

import { BaseInput } from './base-input.component';

import type { ComponentProps, FormEvent } from 'react';

type Props = Omit<ComponentProps<typeof BaseInput>, 'onChange'> & {
  onChange?: (value: string | null) => void;
};

export const BaseSearchInput = memo(
  forwardRef<HTMLInputElement, Props>(function (
    { placeholder = 'Find an item', onChange, ...moreProps },
    ref,
  ) {
    const [value, setValue] = useState<string | null>(null);
    const debouncedValue = useDebounce(value, 300);

    const handleChange = useCallback((event: FormEvent<HTMLInputElement>) => {
      setValue(event.currentTarget.value);
    }, []);

    useEffect(() => {
      onChange && onChange(debouncedValue);
    }, [debouncedValue, onChange]);

    return (
      <BaseInput
        ref={ref}
        type='search'
        placeholder={placeholder}
        iconName='magnifying-glass'
        onChange={handleChange}
        {...moreProps}
      />
    );
  }),
);
