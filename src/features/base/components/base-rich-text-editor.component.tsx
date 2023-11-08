import { memo, useEffect } from 'react';
import { useController } from 'react-hook-form';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TiptapLink from '@tiptap/extension-link';
import cx from 'classix';

import { BaseRichTextEditorMenubar } from './base-rich-text-editor-menubar.component';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { Content } from '@tiptap/react';

type Props = Omit<ComponentProps<'div'>, 'onChange'> & {
  label?: string;
  initialValue?: Content;
  value?: string;
  errorMessage?: string;
  scrollbarsClassName?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export const BaseRichTextEditor = memo(function ({
  className,
  initialValue,
  value,
  label,
  errorMessage,
  scrollbarsClassName,
  disabled,
  onChange,
  ...moreProps
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Placeholder.configure({ placeholder: label }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TiptapLink.configure({
        HTMLAttributes: {
          class: 'rich-link',
        },
        openOnClick: false,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'base-rich-text h-full w-full outline-0',
      },
    },
    content: initialValue,
    onUpdate: ({ editor }) => {
      !!onChange && onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  // If using a controlled field, clear content if current value is empty
  useEffect(() => {
    if (value?.trim().length) {
      return;
    }

    editor?.commands.clearContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className='w-full'>
      <div
        className={cx(
          'w-full rounded-md border-2 border-accent/40 bg-white',
          !!errorMessage && '!border-red-500/60',
          disabled && '!bg-backdrop-gray',
          className,
        )}
        {...moreProps}
      >
        {!!editor && (
          <BaseRichTextEditorMenubar editor={editor} disabled={disabled} />
        )}
        <OverlayScrollbarsComponent
          className={cx('h-96 w-full p-18px', scrollbarsClassName)}
          defer
        >
          <EditorContent
            editor={editor}
            className={cx('h-full w-full', disabled && 'pointer-events-none')}
          />
        </OverlayScrollbarsComponent>
      </div>
      {!!errorMessage && (
        <small className='inline-block px-1 text-red-500'>{errorMessage}</small>
      )}
    </div>
  );
});

export function BaseControlledRichTextEditor(
  props: Props & UseControllerProps<any>,
) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseRichTextEditor
      {...props}
      initialValue={value}
      value={value}
      errorMessage={error?.message}
      onChange={onChange}
    />
  );
}
