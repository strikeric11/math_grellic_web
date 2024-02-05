import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  BaseControlledInput,
  BaseControlledNumberInput,
} from '#/base/components/base-input.component';
import { BaseControlledRichTextEditor } from '#/base/components/base-rich-text-editor.component';
import { LessonControlledPicker } from '#/lesson/components/lesson-picker.component';

import type { ComponentProps } from 'react';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
};

export const ExamUpsertFormStep1 = memo(function ({
  disabled,
  ...moreProps
}: Props) {
  const { control } = useFormContext<ExamUpsertFormData>();

  return (
    <div {...moreProps}>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <div className='flex w-full flex-col items-start justify-between gap-5 sm:flex-row'>
          <BaseControlledInput
            label='Title'
            name='title'
            control={control}
            fullWidth
            asterisk
          />
          <BaseControlledNumberInput
            label='Exam No.'
            name='orderNumber'
            control={control}
            fullWidth
            asterisk
          />
        </div>
        <div className='flex w-full items-start gap-5'>
          <LessonControlledPicker
            name='coveredLessonIds'
            label='Covered Lessons'
            control={control}
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
