import type { ComponentProps, JSXElementConstructor } from 'react';

export enum SidebarMode {
  Collapsed = 0,
  Expanded,
  Hidden,
}

export type IconName =
  | 'arrow-circle-left'
  | 'arrow-circle-right'
  | 'arrow-counter-clockwise'
  | 'arrow-clockwise'
  | 'arrow-left'
  | 'arrows-in-line-horizontal'
  | 'arrows-out-line-horizontal'
  | 'arrow-u-up-left'
  | 'arrow-u-up-right'
  | 'bell'
  | 'calendar'
  | 'calendar-check'
  | 'caret-circle-left'
  | 'caret-circle-right'
  | 'caret-down'
  | 'chalkboard-teacher'
  | 'chart-donut'
  | 'chat-centered-text'
  | 'check-fat'
  | 'check-circle'
  | 'circle-dashed'
  | 'clock'
  | 'door-open'
  | 'dots-three-vertical'
  | 'exam'
  | 'eye'
  | 'eye-slash'
  | 'file-dashed'
  | 'file-text'
  | 'floppy-disk-back'
  | 'funnel'
  | 'game-controller'
  | 'gender-female'
  | 'gender-male'
  | 'hourglass'
  | 'link-simple'
  | 'list-bullets'
  | 'list-numbers'
  | 'magnifying-glass'
  | 'minus'
  | 'plus'
  | 'radio-button'
  | 'rocket-launch'
  | 'share-fat'
  | 'squares-four'
  | 'text-align-center'
  | 'text-align-justify'
  | 'text-align-left'
  | 'text-align-right'
  | 'text-b'
  | 'text-h-one'
  | 'text-h-two'
  | 'text-h-three'
  | 'text-h-four'
  | 'text-italic'
  | 'text-underline'
  | 'text-strikethrough'
  | 'user'
  | 'users-four'
  | 'x';

export type NavItem = {
  name: string;
  to: string;
  label: string;
  iconName?: IconName;
  end?: boolean;
  size?: number;
};

export type SelectOption = {
  label: string;
  value: string | number;
  iconName?: IconName;
};

export type GroupLink = {
  to: string;
  label: string;
  icons?: {
    name: IconName;
    size?: number;
  }[];
};

export type ButtonVariant = 'primary' | 'solid' | 'border' | 'link';
export type ButtonSize = 'base' | 'sm' | 'xs';
export type ModalSize = 'base' | 'sm' | 'lg' | 'none';
export type SpinnerColor = 'primary' | 'white';
export type SpinnerSize = ButtonSize;

export type SceneRouteHandle = {
  title?: string;
  toolbarHidden?: boolean;
  breadcrumbsHidden?: boolean;
  isClose?: boolean;
  links?: GroupLink[];
  disabledSceneWrapper?: boolean;
};

export type FormProps<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
> = Omit<ComponentProps<T>, 'onSubmit'> & {
  isDone?: boolean;
  onDone?: (isDone: boolean) => void;
};

export type QueryFilterOption = {
  key: string;
  name: string;
  value: string;
  label: string;
};

export type QuerySortOption = {
  value: string;
  label: string;
};

export type QuerySort = {
  field: string;
  order: 'asc' | 'desc';
};
