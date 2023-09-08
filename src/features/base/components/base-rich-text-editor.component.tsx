import { memo, useCallback, useEffect } from 'react';
import { useController } from 'react-hook-form';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TiptapLink from '@tiptap/extension-link';
import cx from 'classix';

import { BaseDivider } from './base-divider.component';
import { BaseIconButton } from './base-icon-button.component';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { Content, Editor } from '@tiptap/react';
import type { Level } from '@tiptap/extension-heading';

type Props = Omit<ComponentProps<'div'>, 'onChange'> & {
  label?: string;
  initialValue?: Content;
  value?: string;
  errorMessage?: string;
  onChange?: (value: string) => void;
};

const MENU_WRAPPER_CLASSNAME = 'p-1 flex items-center gap-0.5';
const MENU_CLASSNAME = '!w-8 !h-8';
const MENU_ACTIVE_CLASSNAME =
  'bg-backdrop-light text-primary-focus !border-primary-border-light';

const menuIconProps: ComponentProps<typeof BaseIconButton>['iconProps'] = {
  size: 18,
  weight: 'bold',
};

function Menubar({ editor }: { editor: Editor }) {
  const handleToggleHeading = useCallback(
    (level: Level) => () =>
      editor.chain().focus().toggleHeading({ level }).run(),
    [editor],
  );

  const handleToggleBold = useCallback(
    () => editor.chain().focus().toggleBold().run(),
    [editor],
  );

  const handleToggleItalic = useCallback(
    () => editor.chain().focus().toggleItalic().run(),
    [editor],
  );

  const handleToggleUnderline = useCallback(
    () => editor.chain().focus().toggleUnderline().run(),
    [editor],
  );

  const handleToggleStrike = useCallback(
    () => editor.chain().focus().toggleStrike().run(),
    [editor],
  );

  const handleSetTextAlign = useCallback(
    (alignment: string) => () =>
      editor.chain().focus().setTextAlign(alignment).run(),
    [editor],
  );

  const handleToggleBulletList = useCallback(
    () => editor.chain().focus().toggleBulletList().run(),
    [editor],
  );

  const handleToggleOrderedList = useCallback(
    () => editor.chain().focus().toggleOrderedList().run(),
    [editor],
  );

  const handleSetHorizontalRule = useCallback(
    () => editor.chain().focus().setHorizontalRule().run(),
    [editor],
  );

  const handleToggleLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className='w-full'>
      <div className='flex w-full items-center'>
        <div className={MENU_WRAPPER_CLASSNAME}>
          <BaseIconButton
            name='text-h-one'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('heading', { level: 1 }) && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleToggleHeading(1)}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='text-h-two'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('heading', { level: 2 }) && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleToggleHeading(2)}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='text-h-three'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('heading', { level: 3 }) && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleToggleHeading(3)}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='text-h-four'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('heading', { level: 4 }) && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleToggleHeading(4)}
            iconProps={menuIconProps}
          />
        </div>
        <BaseDivider className='!h-10' vertical />
        <div className={MENU_WRAPPER_CLASSNAME}>
          <BaseIconButton
            name='text-b'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('bold') && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            disabled={!editor.can().chain().focus().toggleBold().run()}
            onClick={handleToggleBold}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='text-italic'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('italic') && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            onClick={handleToggleItalic}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='text-underline'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('underline') && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            onClick={handleToggleUnderline}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='text-strikethrough'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('strike') && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            onClick={handleToggleStrike}
            iconProps={menuIconProps}
          />
        </div>
        <BaseDivider className='!h-10' vertical />
        <div className={MENU_WRAPPER_CLASSNAME}>
          <BaseIconButton
            name='text-align-left'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive({ textAlign: 'left' }) && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleSetTextAlign('left')}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='text-align-center'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive({ textAlign: 'center' }) && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleSetTextAlign('center')}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='text-align-right'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive({ textAlign: 'right' }) && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleSetTextAlign('right')}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='text-align-justify'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive({ textAlign: 'justify' }) &&
                MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleSetTextAlign('justify')}
            iconProps={menuIconProps}
          />
        </div>
        <BaseDivider className='!h-10' vertical />
        <div className={MENU_WRAPPER_CLASSNAME}>
          <BaseIconButton
            name='list-bullets'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('bulletList') && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleToggleBulletList}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='list-numbers'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('orderedList') && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleToggleOrderedList}
            iconProps={menuIconProps}
          />
        </div>
        <BaseDivider className='!h-10' vertical />
        <div className={MENU_WRAPPER_CLASSNAME}>
          <BaseIconButton
            name='link-simple'
            className={cx(
              MENU_CLASSNAME,
              editor.isActive('link') && MENU_ACTIVE_CLASSNAME,
            )}
            variant='link'
            onClick={handleToggleLink}
            iconProps={menuIconProps}
          />
          <BaseIconButton
            name='minus'
            className={MENU_CLASSNAME}
            variant='link'
            onClick={handleSetHorizontalRule}
            iconProps={menuIconProps}
          />
        </div>
      </div>
      <BaseDivider />
    </div>
  );
}

export const BaseRichTextEditor = memo(function ({
  className,
  initialValue,
  value,
  label,
  errorMessage,
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
        class: 'base-rich-text w-full h-full outline-0',
      },
    },
    content: initialValue,
    onUpdate: ({ editor }) => {
      !!onChange && onChange(editor.getHTML());
    },
  });

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
          className,
        )}
        {...moreProps}
      >
        {!!editor && <Menubar editor={editor} />}
        <OverlayScrollbarsComponent className='h-96 w-full p-18px' defer>
          <EditorContent editor={editor} className='h-full w-full' />
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
