/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useCallback, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import {
  BaseControlledInput,
  BaseControlledNumberInput,
} from '#/base/components/base-input.component';
import { BaseSelect } from '#/base/components/base-select.component';
import { BaseControlledRichTextEditor } from '#/base/components/base-rich-text-editor.component';
import { getActivityGames } from '../api/teacher-activity.api';
import { ActivityGame, activityGameLabel } from '../models/activity.model';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
};

export const ActivityUpsertFormStep1 = memo(function ({
  disabled: formDisabled,
  ...moreProps
}: Props) {
  const { control, setValue } = useFormContext<ActivityUpsertFormData>();

  const {
    data: games,
    isFetching,
    isLoading,
  } = useQuery(
    getActivityGames({
      refetchOnWindowFocus: false,
      initialData: [],
      select: (data: any) => Object.values(data),
    }),
  );

  const game = useWatch({ control, name: 'game' });

  const disabled = useMemo(
    () => formDisabled || isFetching || isLoading,
    [formDisabled, isFetching, isLoading],
  );

  const gameOptions = useMemo(
    () =>
      games?.map((g) => ({
        label: activityGameLabel[g.name as ActivityGame],
        value: g.name,
        iconName: 'game-controller' as IconName,
      })) || [],
    [games],
  );

  const handleChange = useCallback(
    (value: string) => {
      const target = games?.find((g) => g.name === value);

      if (!target) {
        return;
      }

      setValue('game', target);
    },
    [games, setValue],
  );

  return (
    <div {...moreProps}>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <div className='flex w-full items-start gap-5'>
          <Controller
            name='game'
            render={({
              field: { onChange, value, ...moreField },
              fieldState: { error },
            }) => (
              <BaseSelect
                label='Game'
                value={game?.name}
                options={gameOptions}
                fullWidth
                asterisk
                onChange={handleChange}
                errorMessage={error?.message}
                {...moreField}
              />
            )}
          />
        </div>
        <div className='flex w-full flex-col items-start justify-between gap-5 sm:flex-row'>
          <BaseControlledInput
            label='Title'
            name='title'
            control={control}
            fullWidth
            asterisk
          />
          <BaseControlledNumberInput
            label='Activity No.'
            name='orderNumber'
            control={control}
            fullWidth
            asterisk
          />
        </div>
        <div className='flex w-full flex-col gap-5'>
          <BaseControlledRichTextEditor
            className='max-w-[600px]'
            label='Description'
            name='description'
            control={control}
            disabled={disabled}
          />
          <BaseControlledInput
            label='Excerpt'
            name='excerpt'
            control={control}
            fullWidth
          />
        </div>
      </fieldset>
    </div>
  );
});
