import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  BaseControlledInput,
  BaseControlledNumberInput,
} from '#/base/components/base-input.component';
import { BaseControlledRichTextEditor } from '#/base/components/base-rich-text-editor.component';

import type { LessonUpsertFormData } from '#/lesson/models/lesson.model';

export const LessonUpsertFormStep1 = memo(function () {
  const { control } = useFormContext<LessonUpsertFormData>();

  return (
    <div>
      <fieldset className='flex flex-wrap gap-5'>
        <div className='flex w-full items-start justify-between gap-5'>
          <BaseControlledInput
            label='Title'
            name='title'
            control={control}
            fullWidth
            asterisk
          />
          <BaseControlledNumberInput
            label='Lesson No.'
            name='orderNumber'
            control={control}
            fullWidth
            asterisk
          />
        </div>
        <div className='flex w-full items-start justify-between gap-5'>
          <BaseControlledInput
            label='Video Url'
            name='videoUrl'
            control={control}
            fullWidth
            asterisk
          />
          <BaseControlledNumberInput
            label='Duration (in mins)'
            name='durationSeconds'
            control={control}
            fullWidth
          />
        </div>
        <BaseControlledRichTextEditor
          label='Lesson Description'
          name='description'
          control={control}
        />
      </fieldset>
    </div>
  );
});
