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

export const stepperAnimationTransition = {
  x: { type: 'spring', stiffness: 370, damping: 50 },
  opacity: { duration: 0.3 },
};

export const liAnimation = {
  type: 'spring',
  damping: 30,
  stiffness: 200,
};

export const stepperAnimation = {
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

export const performanceDetailsAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scoreShowVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.5,
    },
  },
};

export const scoreShowItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};
