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
  ArrowSquareOut,
  ArrowSquareUp,
  ArrowSquareUpRight,
  ArrowUUpLeft,
  ArrowUUpRight,
  ArrowsInLineHorizontal,
  ArrowsOutLineHorizontal,
  Article,
  At,
  Bell,
  Broadcast,
  Calendar,
  CalendarCheck,
  Cards,
  CaretCircleDown,
  CaretCircleLeft,
  CaretCircleRight,
  CaretCircleUp,
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
  Crop,
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
  FrameCorners,
  Function,
  Funnel,
  GameController,
  GenderFemale,
  GenderMale,
  Hourglass,
  House,
  IdentificationBadge,
  ImageSquare,
  LinkSimple,
  List,
  ListBullets,
  ListChecks,
  ListNumbers,
  MagnifyingGlass,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  MessengerLogo,
  Minus,
  MinusSquare,
  NumberSquareOne,
  NumberSquareThree,
  NumberSquareTwo,
  Pencil,
  Play,
  Plus,
  PlusCircle,
  Presentation,
  Question,
  Quotes,
  RadioButton,
  RocketLaunch,
  ShareFat,
  SignOut,
  SortAscending,
  SortDescending,
  SquaresFour,
  Stack,
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
        case 'arrow-square-out':
          return ArrowSquareOut;
        case 'arrow-square-up-right':
          return ArrowSquareUpRight;
        case 'arrow-u-up-left':
          return ArrowUUpLeft;
        case 'arrow-u-up-right':
          return ArrowUUpRight;
        case 'arrows-in-line-horizontal':
          return ArrowsInLineHorizontal;
        case 'arrows-out-line-horizontal':
          return ArrowsOutLineHorizontal;
        case 'arrows-square-up':
          return ArrowSquareUp;
        case 'article':
          return Article;
        case 'at':
          return At;
        case 'bell':
          return Bell;
        case 'broadcast':
          return Broadcast;
        case 'calendar':
          return Calendar;
        case 'calendar-check':
          return CalendarCheck;
        case 'cards':
          return Cards;
        case 'caret-circle-down':
          return CaretCircleDown;
        case 'caret-circle-left':
          return CaretCircleLeft;
        case 'caret-circle-right':
          return CaretCircleRight;
        case 'caret-circle-up':
          return CaretCircleUp;
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
        case 'crop':
          return Crop;
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
        case 'frame-corners':
          return FrameCorners;
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
        case 'house':
          return House;
        case 'identification-badge':
          return IdentificationBadge;
        case 'image-square':
          return ImageSquare;
        case 'link-simple':
          return LinkSimple;
        case 'list':
          return List;
        case 'list-bullets':
          return ListBullets;
        case 'list-checks':
          return ListChecks;
        case 'list-numbers':
          return ListNumbers;
        case 'magnifying-glass':
          return MagnifyingGlass;
        case 'magnifying-glass-minus':
          return MagnifyingGlassMinus;
        case 'magnifying-glass-plus':
          return MagnifyingGlassPlus;
        case 'messenger-logo':
          return MessengerLogo;
        case 'minus':
          return Minus;
        case 'minus-square':
          return MinusSquare;
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
        case 'presentation':
          return Presentation;
        case 'question':
          return Question;
        case 'quotes':
          return Quotes;
        case 'radio-button':
          return RadioButton;
        case 'rocket-launch':
          return RocketLaunch;
        case 'share-fat':
          return ShareFat;
        case 'sign-out':
          return SignOut;
        case 'sort-ascending':
          return SortAscending;
        case 'sort-descending':
          return SortDescending;
        case 'squares-four':
          return SquaresFour;
        case 'stack':
          return Stack;
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
