import { useCallback } from 'react';
import cx from 'classix';

import { BaseDivider } from './base-divider.component';
import { BaseIconButton } from './base-icon-button.component';
import { BaseTooltip } from './base-tooltip.component';

import type { ComponentProps } from 'react';
import type { Editor } from '@tiptap/react';
import type { Level } from '@tiptap/extension-heading';

type Props = ComponentProps<'div'> & {
  editor: Editor;
  disabled?: boolean;
};

const MENU_WRAPPER_CLASSNAME = 'p-1 flex items-center gap-0.5';
const MENU_CLASSNAME = '!w-8 !h-8';
const MENU_ACTIVE_CLASSNAME =
  'bg-backdrop-light text-primary-focus !border-primary-border-light';

const menuIconProps: ComponentProps<typeof BaseIconButton>['iconProps'] = {
  size: 18,
  weight: 'bold',
};

export const BaseRichTextEditorMenubar = function ({
  className,
  editor,
  disabled,
  ...moreProps
}: Props) {
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
      <div
        className={cx('flex w-full flex-wrap items-center', className)}
        {...moreProps}
      >
        <div className={MENU_WRAPPER_CLASSNAME}>
          <BaseTooltip content='Heading 1'>
            <BaseIconButton
              name='text-h-one'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('heading', { level: 1 }) &&
                  MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              onClick={handleToggleHeading(1)}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
          <BaseTooltip content='Heading 2'>
            <BaseIconButton
              name='text-h-two'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('heading', { level: 2 }) &&
                  MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              onClick={handleToggleHeading(2)}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
          <BaseTooltip content='Heading 3'>
            <BaseIconButton
              name='text-h-three'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('heading', { level: 3 }) &&
                  MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              onClick={handleToggleHeading(3)}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
          <BaseTooltip content='Heading 4'>
            <BaseIconButton
              name='text-h-four'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('heading', { level: 4 }) &&
                  MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              onClick={handleToggleHeading(4)}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
        </div>
        <BaseDivider className='!h-10' vertical />
        <div className={MENU_WRAPPER_CLASSNAME}>
          <BaseTooltip content='Bold'>
            <BaseIconButton
              name='text-b'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('bold') && MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              disabled={
                !editor.can().chain().focus().toggleBold().run() || disabled
              }
              onClick={handleToggleBold}
              iconProps={menuIconProps}
            />
          </BaseTooltip>
          <BaseTooltip content='Italic'>
            <BaseIconButton
              name='text-italic'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('italic') && MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              disabled={
                !editor.can().chain().focus().toggleItalic().run() || disabled
              }
              onClick={handleToggleItalic}
              iconProps={menuIconProps}
            />
          </BaseTooltip>
          <BaseTooltip content='Underline'>
            <BaseIconButton
              name='text-underline'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('underline') && MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              disabled={
                !editor.can().chain().focus().toggleUnderline().run() ||
                disabled
              }
              onClick={handleToggleUnderline}
              iconProps={menuIconProps}
            />
          </BaseTooltip>
          <BaseTooltip content='Strikethrough'>
            <BaseIconButton
              name='text-strikethrough'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('strike') && MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              disabled={
                !editor.can().chain().focus().toggleStrike().run() || disabled
              }
              onClick={handleToggleStrike}
              iconProps={menuIconProps}
            />
          </BaseTooltip>
        </div>
        <BaseDivider className='!h-10' vertical />
        <div className={MENU_WRAPPER_CLASSNAME}>
          <BaseTooltip content='Align left'>
            <BaseIconButton
              name='text-align-left'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive({ textAlign: 'left' }) && MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              onClick={handleSetTextAlign('left')}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
          <BaseTooltip content='Align center'>
            <BaseIconButton
              name='text-align-center'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive({ textAlign: 'center' }) &&
                  MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              onClick={handleSetTextAlign('center')}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
          <BaseTooltip content='Align right'>
            <BaseIconButton
              name='text-align-right'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive({ textAlign: 'right' }) &&
                  MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              onClick={handleSetTextAlign('right')}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
          <BaseTooltip content='Align justify'>
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
              disabled={disabled}
            />
          </BaseTooltip>
        </div>
        <BaseDivider className='!h-10' vertical />
        <div className={MENU_WRAPPER_CLASSNAME}>
          <BaseTooltip content='Bullets'>
            <BaseIconButton
              name='list-bullets'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('bulletList') && MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              onClick={handleToggleBulletList}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
          <BaseTooltip content='Numbering'>
            <BaseIconButton
              name='list-numbers'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('orderedList') && MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              onClick={handleToggleOrderedList}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
        </div>
        <BaseDivider className='!h-10' vertical />
        <div className={MENU_WRAPPER_CLASSNAME}>
          <BaseTooltip content='Insert link'>
            <BaseIconButton
              name='link-simple'
              className={cx(
                MENU_CLASSNAME,
                editor.isActive('link') && MENU_ACTIVE_CLASSNAME,
              )}
              variant='link'
              onClick={handleToggleLink}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
          <BaseTooltip content='Horizontal rule'>
            <BaseIconButton
              name='minus'
              className={MENU_CLASSNAME}
              variant='link'
              onClick={handleSetHorizontalRule}
              iconProps={menuIconProps}
              disabled={disabled}
            />
          </BaseTooltip>
        </div>
      </div>
      <BaseDivider />
    </div>
  );
};
