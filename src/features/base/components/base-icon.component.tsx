import { memo, useMemo } from 'react';

import {
  ArrowCircleLeft,
  ArrowCircleRight,
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowUUpLeft,
  ArrowUUpRight,
  ArrowsInLineHorizontal,
  ArrowsOutLineHorizontal,
  Bell,
  Calendar,
  CaretCircleLeft,
  CaretCircleRight,
  CaretDown,
  ChalkboardTeacher,
  ChartDonut,
  ChatCenteredText,
  CheckCircle,
  CheckFat,
  Clock,
  DoorOpen,
  Exam,
  Eye,
  EyeSlash,
  FileText,
  FloppyDiskBack,
  GameController,
  GenderFemale,
  GenderMale,
  Hourglass,
  LinkSimple,
  ListBullets,
  ListNumbers,
  Minus,
  Plus,
  RadioButton,
  RocketLaunch,
  ShareFat,
  SquaresFour,
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
  TextUnderline,
  User,
  UsersFour,
  X,
  type Icon,
  type IconProps,
} from '@phosphor-icons/react';
import type { IconName } from '../models/base.model';

type Props = IconProps & {
  name: IconName;
};

export const BaseIcon = memo(function ({ name, ...moreProps }: Props) {
  const PIcon: Icon | null = useMemo(() => {
    switch (name) {
      case 'arrow-circle-left':
        return ArrowCircleLeft;
      case 'arrow-circle-right':
        return ArrowCircleRight;
      case 'arrow-counter-clockwise':
        return ArrowCounterClockwise;
      case 'arrow-left':
        return ArrowLeft;
      case 'arrows-in-line-horizontal':
        return ArrowsInLineHorizontal;
      case 'arrows-out-line-horizontal':
        return ArrowsOutLineHorizontal;
      case 'arrow-u-up-left':
        return ArrowUUpLeft;
      case 'arrow-u-up-right':
        return ArrowUUpRight;
      case 'bell':
        return Bell;
      case 'calendar':
        return Calendar;
      case 'caret-circle-left':
        return CaretCircleLeft;
      case 'caret-circle-right':
        return CaretCircleRight;
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
      case 'clock':
        return Clock;
      case 'door-open':
        return DoorOpen;
      case 'exam':
        return Exam;
      case 'eye':
        return Eye;
      case 'eye-slash':
        return EyeSlash;
      case 'file-text':
        return FileText;
      case 'floppy-disk-back':
        return FloppyDiskBack;
      case 'game-controller':
        return GameController;
      case 'gender-female':
        return GenderFemale;
      case 'gender-male':
        return GenderMale;
      case 'hourglass':
        return Hourglass;
      case 'link-simple':
        return LinkSimple;
      case 'list-bullets':
        return ListBullets;
      case 'list-numbers':
        return ListNumbers;
      case 'minus':
        return Minus;
      case 'plus':
        return Plus;
      case 'radio-button':
        return RadioButton;
      case 'rocket-launch':
        return RocketLaunch;
      case 'share-fat':
        return ShareFat;
      case 'squares-four':
        return SquaresFour;
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
      case 'user':
        return User;
      case 'users-four':
        return UsersFour;
      case 'x':
        return X;
    }
  }, [name]);

  if (!PIcon) {
    return null;
  }

  return <PIcon {...moreProps} />;
});
