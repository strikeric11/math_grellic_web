import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  memo,
  useMemo,
  useState,
} from 'react';
import {
  useFloating,
  shift,
  flip,
  offset,
  useHover,
  useInteractions,
  useMergeRefs,
} from '@floating-ui/react';

import { BaseSurface } from './base-surface.component';

import type { ReactNode } from 'react';
import type { Placement, UseHoverProps } from '@floating-ui/react';
import { useClickAway } from '@uidotdev/usehooks';

type Props = UseHoverProps & {
  children: ReactNode;
  content?: ReactNode;
  placement?: Placement;
};

export const BaseTooltip = memo(
  forwardRef<HTMLElement, Props>(function (
    {
      content,
      delay = { open: 800, close: 200 },
      placement = 'bottom',
      children,
      ...moreProps
    },
    ref,
  ) {
    // For floating ui tooltip
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement,
      middleware: [shift(), flip(), offset(10)],
    });

    const awayRef = useClickAway(() => {
      setIsOpen(false);
    });

    const hover = useHover(context, { delay, ...moreProps });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
    const mergedRef = useMergeRefs([refs.setReference, ref, awayRef]);
    // ------------------------

    const transformedChildren = useMemo(
      () =>
        Children.map(children, (child) =>
          isValidElement(child)
            ? cloneElement(child, {
                ref: mergedRef,
                ...getReferenceProps(),
              } as any)
            : child,
        ),
      [children, mergedRef, getReferenceProps],
    );

    return (
      <>
        {transformedChildren}
        {content && isOpen && (
          <BaseSurface
            ref={refs.setFloating}
            style={floatingStyles}
            className='z-max animate-fastFadeIn !rounded !bg-accent !p-0 text-white'
            {...getFloatingProps()}
          >
            <small className='block px-2 py-1'>{content}</small>
          </BaseSurface>
        )}
      </>
    );
  }),
);
