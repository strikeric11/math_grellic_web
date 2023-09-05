export const dropdownAnimation = {
  initial: { scale: 0.7 },
  animate: { scale: 1 },
  exit: { scale: 0.7 },
  transition: { duration: 0.16, ease: 'linear' },
};

export const dialogBackdropTransition = {
  enter: 'transition ease-out duration-300',
  enterFrom: 'opacity-0',
  enterTo: 'opacity-100',
  leave: 'transition ease-in duration-200',
  leaveFrom: 'opacity-100',
  leaveTo: 'opacity-0',
};

export const dialogPanelTransition = {
  enter: 'transition ease-out duration-300',
  enterFrom: 'opacity-0 scale-95',
  enterTo: 'opacity-100 scale-100',
  leave: 'transition ease-in duration-200',
  leaveFrom: 'opacity-100 scale-100',
  leaveTo: 'opacity-0 scale-95',
};

export const menuTransition = {
  enter: 'transition ease-out duration-100',
  enterFrom: 'transform opacity-0 scale-95',
  enterTo: 'transform opacity-100 scale-100',
  leave: 'transition ease-in duration-75',
  leaveFrom: 'transform opacity-100 scale-100',
  leaveTo: 'transform opacity-0 scale-95',
};

export const stepperAnimationVariants = {
  initial: (isForward: boolean) => ({
    x: isForward ? '100%' : '-100%',
    opacity: 0,
  }),
  animate: {
    x: '0%',
    opacity: 1,
  },
  exit: (isForward: boolean) => ({
    x: !isForward ? '100%' : '-100%',
    opacity: 0,
  }),
};

export const stepperAnimationTransition = {
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.3 },
};
