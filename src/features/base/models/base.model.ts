import type { ComponentProps, JSXElementConstructor } from 'react';

export enum SidebarMode {
  Collapsed = 0,
  Expanded,
  Hidden,
}

export type IconName =
  | 'arrow-circle-down'
  | 'arrow-circle-left'
  | 'arrow-circle-right'
  | 'arrow-circle-up'
  | 'arrow-counter-clockwise'
  | 'arrow-clockwise'
  | 'arrow-fat-up'
  | 'arrow-left'
  | 'arrows-in-line-horizontal'
  | 'arrows-out-line-horizontal'
  | 'arrow-u-up-left'
  | 'arrow-u-up-right'
  | 'article'
  | 'bell'
  | 'calendar'
  | 'calendar-check'
  | 'caret-circle-left'
  | 'caret-circle-right'
  | 'caret-right'
  | 'caret-down'
  | 'chalkboard-teacher'
  | 'chart-donut'
  | 'chat-centered-text'
  | 'check-fat'
  | 'check-circle'
  | 'circle'
  | 'circle-dashed'
  | 'clock'
  | 'door-open'
  | 'dots-three-vertical'
  | 'equals'
  | 'exam'
  | 'eye'
  | 'eye-slash'
  | 'feather'
  | 'file-dashed'
  | 'file-text'
  | 'floppy-disk-back'
  | 'function'
  | 'funnel'
  | 'game-controller'
  | 'gender-female'
  | 'gender-male'
  | 'hourglass'
  | 'link-simple'
  | 'list-bullets'
  | 'list-checks'
  | 'list-numbers'
  | 'magnifying-glass'
  | 'minus'
  | 'plus'
  | 'plus-circle'
  | 'pencil'
  | 'radio-button'
  | 'rocket-launch'
  | 'share-fat'
  | 'squares-four'
  | 'sort-ascending'
  | 'sort-descending'
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
  | 'text-t'
  | 'trash'
  | 'user'
  | 'users-four'
  | 'x'
  | 'x-square';

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
export type ModalSize = 'base' | 'xs' | 'sm' | 'lg' | 'none';
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
  TProps extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  TData,
  TDataReturn,
> = Omit<ComponentProps<TProps>, 'onSubmit'> & {
  onSubmit: (data: TData) => TDataReturn;
  formData?: TData;
  loading?: boolean;
  isDone?: boolean;
  onDone?: (isDone: boolean) => void;
  onDelete?: () => void;
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

export type QueryPagination = {
  take: number;
  skip: number;
};
