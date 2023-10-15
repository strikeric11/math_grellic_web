import { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import cx from 'classix';

import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { teacherRoutes } from '#/app/routes/teacher-routes';
import { RecordStatus } from '#/core/models/core.model';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { LessonItem } from '#/lesson/components/lesson-picker-list.component';
import { TeacherExamSingleQuestion } from './teacher-exam-single-question.component';

import type { ComponentProps } from 'react';
import type { Exam } from '../models/exam.model';
import type { Lesson } from '#/lesson/models/lesson.model';
import { BaseSurface } from '#/base/components/base-surface.component';

type Props = ComponentProps<'div'> & {
  exam: Exam;
};

export const TeacherExamSingle = memo(function ({
  className,
  exam,
  ...moreProps
}: Props) {
  const [
    title,
    orderNumber,
    questionCount,
    passingPoints,
    totalPoints,
    questions,
    randomizeQuestions,
    isDraft,
    excerpt,
    coveredLessons,
  ] = useMemo(
    () => [
      exam.title,
      exam.orderNumber,
      exam.visibleQuestionsCount,
      exam.passingPoints,
      exam.visibleQuestionsCount * exam.pointsPerQuestion,
      exam.questions,
      exam.randomizeQuestions,
      exam.status === RecordStatus.Draft,
      exam.excerpt,
      exam.coveredLessons,
    ],
    [exam],
  );

  const questionCountText = useMemo(
    () =>
      questionCount > 1 ? `${questionCount} Items` : `${questionCount} Item`,
    [questionCount],
  );

  const passingPointsText = useMemo(
    () =>
      passingPoints > 1
        ? `${passingPoints} Passing Points`
        : `${passingPoints} Passing Point`,
    [passingPoints],
  );

  const totalPointsText = useMemo(
    () =>
      totalPoints > 1
        ? `${totalPoints} Total Points`
        : `${totalPoints} Total Point`,
    [totalPoints],
  );

  const descriptionHtml = useMemo(() => {
    if (!exam.description) {
      return null;
    }

    return {
      __html: DOMPurify.sanitize(exam.description || ''),
    };
  }, [exam]);

  const schedules = useMemo(() => {
    if (!exam.schedules?.length) {
      return [];
    }

    return exam.schedules
      .filter((s) => dayjs(s.startDate).isSame(s.endDate, 'day'))
      .map((schedule) => {
        const { startDate, endDate } = schedule;

        const date = dayjs(startDate).format('MMM DD, YYYY');
        const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
          endDate,
        ).format('hh:mm A')}`;
        const duration = getDayJsDuration(endDate, startDate).asSeconds();

        return { date, time, duration: convertSecondsToDuration(duration) };
      });
  }, [exam]);

  return (
    <div className={cx('w-full pb-16', className)} {...moreProps}>
      <div className='mb-4 flex w-full items-center justify-between'>
        <div>
          <h2 className='pb-1 text-xl'>{title}</h2>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='chalkboard-teacher'>
              Exam {orderNumber}
            </BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='list-numbers'>{totalPointsText}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='list-checks'>{passingPointsText}</BaseChip>
            {randomizeQuestions && (
              <>
                <BaseDivider className='!h-6' vertical />
                <BaseChip iconName='check-square'>Randomized</BaseChip>
              </>
            )}
            {isDraft && (
              <>
                <BaseDivider className='!h-6' vertical />
                <BaseChip iconName='file-dashed'>Draft</BaseChip>
              </>
            )}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <BaseLink
            to={teacherRoutes.exam.previewTo}
            className='!px-3'
            variant='solid'
            target='_blank'
          >
            <BaseIcon name='file-text' size={24} />
          </BaseLink>
          <BaseLink
            to={teacherRoutes.exam.editTo}
            className='!px-3'
            variant='solid'
          >
            <BaseIcon name='pencil' size={24} />
          </BaseLink>
        </div>
      </div>
      <BaseDivider />
      <div className='my-4 flex w-full flex-col gap-y-3'>
        <div className='flex w-full flex-col gap-y-4 px-4'>
          <div className='flex w-full items-center justify-between'>
            <span className='mr-2 font-bold'>Schedules</span>
            {!isDraft && (
              <BaseLink to={teacherRoutes.exam.schedule.to} size='sm' bodyFont>
                Set Schedule
              </BaseLink>
            )}
          </div>
          {schedules.length ? (
            <div className='flex w-full flex-col gap-y-4 px-4'>
              {schedules.map(({ date, time, duration }) => (
                <div className='flex items-center gap-2.5'>
                  <BaseChip iconName='calendar-check'>{date}</BaseChip>
                  <BaseDivider className='!h-6' vertical />
                  <BaseChip iconName='clock'>{time}</BaseChip>
                  <BaseDivider className='!h-6' vertical />
                  <BaseChip iconName='hourglass'>{duration}</BaseChip>
                </div>
              ))}
            </div>
          ) : (
            <span>Exam has no schedule</span>
          )}
        </div>
        <BaseDivider />
        <BaseSurface
          className='mx-auto w-full max-w-screen-sm !px-4 !pb-5'
          rounded='sm'
        >
          <span className='mb-4 block font-bold'>
            Questions {questionCountText}
          </span>
          <div className='flex w-full flex-col gap-y-4'>
            {questions.map((question) => (
              <TeacherExamSingleQuestion
                key={question.id}
                question={question}
              ></TeacherExamSingleQuestion>
            ))}
          </div>
        </BaseSurface>
        <BaseSurface
          className='mx-auto w-full max-w-screen-sm px-4'
          rounded='sm'
        >
          <span className='mb-4 block font-bold'>
            {coveredLessons?.length
              ? 'Covered Lessons'
              : 'Exam has no covered lessons'}
          </span>
          <div className='flex flex-col'>
            {coveredLessons?.map((lesson) => (
              <LessonItem key={`li-${lesson.id}`} lesson={lesson as Lesson} />
            ))}
          </div>
        </BaseSurface>
        <BaseSurface
          className='mx-auto w-full max-w-screen-sm px-4'
          rounded='sm'
        >
          <span className='block font-bold'>
            {descriptionHtml ? 'Description' : 'Exam has no description'}
          </span>
          {descriptionHtml && (
            <div
              className='base-rich-text rt-output'
              dangerouslySetInnerHTML={descriptionHtml}
            />
          )}
        </BaseSurface>
        <BaseSurface
          className='mx-auto w-full max-w-screen-sm px-4'
          rounded='sm'
        >
          <span className='block font-bold'>
            {excerpt ? 'Excerpt' : 'Exam has no excerpt'}
          </span>
          {excerpt}
        </BaseSurface>
      </div>
    </div>
  );
});
