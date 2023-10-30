import { forwardRef, memo, useMemo } from 'react';

import {
  ArrowCircleDown,
  ArrowCircleLeft,
  ArrowCircleRight,
  ArrowCircleUp,
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowFatUp,
  ArrowLeft,
  ArrowSquareUp,
  ArrowUUpLeft,
  ArrowUUpRight,
  ArrowsInLineHorizontal,
  ArrowsOutLineHorizontal,
  Article,
  At,
  Bell,
  Calendar,
  CalendarCheck,
  CaretCircleLeft,
  CaretCircleRight,
  CaretDown,
  CaretRight,
  ChalkboardTeacher,
  ChartDonut,
  ChatCenteredText,
  CheckCircle,
  CheckFat,
  CheckSquare,
  Circle,
  CircleDashed,
  Clock,
  ClockCountdown,
  DeviceMobile,
  DiceThree,
  DoorOpen,
  DotsThreeVertical,
  Equals,
  Exam,
  Eye,
  EyeSlash,
  Feather,
  FileDashed,
  FileText,
  FloppyDiskBack,
  Function,
  Funnel,
  GameController,
  GenderFemale,
  GenderMale,
  Hourglass,
  IdentificationBadge,
  LinkSimple,
  ListBullets,
  ListChecks,
  ListNumbers,
  MagnifyingGlass,
  Minus,
  NumberSquareOne,
  NumberSquareThree,
  NumberSquareTwo,
  Pencil,
  Play,
  Plus,
  PlusCircle,
  Question,
  RadioButton,
  RocketLaunch,
  ShareFat,
  SortAscending,
  SortDescending,
  SquaresFour,
  SubtractSquare,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  TextB,
  TextHFour,
  TextHOne,
  TextHThree,
  TextHTwo,
  TextItalic,
  TextStrikethrough,
  TextT,
  TextUnderline,
  Trash,
  User,
  UsersFour,
  X,
  XCircle,
  XSquare,
} from '@phosphor-icons/react';

import type { Icon, IconProps } from '@phosphor-icons/react';
import type { IconName } from '../models/base.model';

type Props = IconProps & {
  name: IconName;
};

export const BaseIcon = memo(
  forwardRef<SVGSVGElement, Props>(function ({ name, ...moreProps }, ref) {
    const PIcon: Icon | null = useMemo(() => {
      switch (name) {
        case 'arrow-circle-down':
          return ArrowCircleDown;
        case 'arrow-circle-left':
          return ArrowCircleLeft;
        case 'arrow-circle-right':
          return ArrowCircleRight;
        case 'arrow-circle-up':
          return ArrowCircleUp;
        case 'arrow-clockwise':
          return ArrowClockwise;
        case 'arrow-counter-clockwise':
          return ArrowCounterClockwise;
        case 'arrow-fat-up':
          return ArrowFatUp;
        case 'arrow-left':
          return ArrowLeft;
        case 'arrows-in-line-horizontal':
          return ArrowsInLineHorizontal;
        case 'arrows-out-line-horizontal':
          return ArrowsOutLineHorizontal;
        case 'arrows-square-up':
          return ArrowSquareUp;
        case 'arrow-u-up-left':
          return ArrowUUpLeft;
        case 'arrow-u-up-right':
          return ArrowUUpRight;
        case 'article':
          return Article;
        case 'at':
          return At;
        case 'bell':
          return Bell;
        case 'calendar':
          return Calendar;
        case 'calendar-check':
          return CalendarCheck;
        case 'caret-circle-left':
          return CaretCircleLeft;
        case 'caret-circle-right':
          return CaretCircleRight;
        case 'caret-right':
          return CaretRight;
        case 'caret-down':
          return CaretDown;
        case 'chalkboard-teacher':
          return ChalkboardTeacher;
        case 'chart-donut':
          return ChartDonut;
        case 'chat-centered-text':
          return ChatCenteredText;
        case 'check-fat':
          return CheckFat;
        case 'check-circle':
          return CheckCircle;
        case 'check-square':
          return CheckSquare;
        case 'circle':
          return Circle;
        case 'circle-dashed':
          return CircleDashed;
        case 'clock':
          return Clock;
        case 'clock-countdown':
          return ClockCountdown;
        case 'device-mobile':
          return DeviceMobile;
        case 'dice-three':
          return DiceThree;
        case 'door-open':
          return DoorOpen;
        case 'dots-three-vertical':
          return DotsThreeVertical;
        case 'equals':
          return Equals;
        case 'exam':
          return Exam;
        case 'eye':
          return Eye;
        case 'eye-slash':
          return EyeSlash;
        case 'feather':
          return Feather;
        case 'file-dashed':
          return FileDashed;
        case 'file-text':
          return FileText;
        case 'floppy-disk-back':
          return FloppyDiskBack;
        case 'function':
          return Function;
        case 'funnel':
          return Funnel;
        case 'game-controller':
          return GameController;
        case 'gender-female':
          return GenderFemale;
        case 'gender-male':
          return GenderMale;
        case 'hourglass':
          return Hourglass;
        case 'identification-badge':
          return IdentificationBadge;
        case 'link-simple':
          return LinkSimple;
        case 'list-bullets':
          return ListBullets;
        case 'list-checks':
          return ListChecks;
        case 'list-numbers':
          return ListNumbers;
        case 'magnifying-glass':
          return MagnifyingGlass;
        case 'minus':
          return Minus;
        case 'number-square-one':
          return NumberSquareOne;
        case 'number-square-two':
          return NumberSquareTwo;
        case 'number-square-three':
          return NumberSquareThree;
        case 'pencil':
          return Pencil;
        case 'play':
          return Play;
        case 'plus':
          return Plus;
        case 'plus-circle':
          return PlusCircle;
        case 'question':
          return Question;
        case 'radio-button':
          return RadioButton;
        case 'rocket-launch':
          return RocketLaunch;
        case 'share-fat':
          return ShareFat;
        case 'sort-ascending':
          return SortAscending;
        case 'sort-descending':
          return SortDescending;
        case 'squares-four':
          return SquaresFour;
        case 'subtract-square':
          return SubtractSquare;
        case 'text-align-center':
          return TextAlignCenter;
        case 'text-align-justify':
          return TextAlignJustify;
        case 'text-align-left':
          return TextAlignLeft;
        case 'text-align-right':
          return TextAlignRight;
        case 'text-b':
          return TextB;
        case 'text-italic':
          return TextItalic;
        case 'text-h-one':
          return TextHOne;
        case 'text-h-two':
          return TextHTwo;
        case 'text-h-three':
          return TextHThree;
        case 'text-h-four':
          return TextHFour;
        case 'text-underline':
          return TextUnderline;
        case 'text-strikethrough':
          return TextStrikethrough;
        case 'text-t':
          return TextT;
        case 'trash':
          return Trash;
        case 'user':
          return User;
        case 'users-four':
          return UsersFour;
        case 'x':
          return X;
        case 'x-circle':
          return XCircle;
        case 'x-square':
          return XSquare;
      }
    }, [name]);

    if (!PIcon) {
      return null;
    }

    return <PIcon ref={ref} {...moreProps} />;
  }),
);
