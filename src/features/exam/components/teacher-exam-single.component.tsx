import { memo, useMemo } from 'react';
import DOMPurify from 'dompurify';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { teacherRoutes } from '#/app/routes/teacher-routes';
import { RecordStatus } from '#/core/models/core.model';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { LessonItem } from '#/lesson/components/lesson-picker-list.component';
import { TeacherExamSingleQuestion } from './teacher-exam-single-question.component';

import type { ComponentProps } from 'react';
import type { Exam } from '../models/exam.model';
import type { Lesson } from '#/lesson/models/lesson.model';

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
    const isEmpty = !DOMPurify.sanitize(exam.description || '', {
      ALLOWED_TAGS: [],
    }).trim();

    return !isEmpty
      ? {
          __html: DOMPurify.sanitize(exam.description || ''),
        }
      : null;
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
      <div className='flex w-full flex-col flex-wrap items-start justify-between gap-2.5 -3xs:flex-row -2lg:flex-nowrap -2lg:items-center'>
        <div>
          <h2 className='pb-1 text-xl'>{title}</h2>
          <div className='flex flex-col items-start gap-1 -2lg:flex-row -2lg:gap-2.5'>
            <BaseChip iconName='chalkboard-teacher'>
              Exam {orderNumber}
            </BaseChip>
            <BaseDivider className='hidden !h-6 -2lg:block' vertical />
            <BaseChip iconName='list-numbers'>{totalPointsText}</BaseChip>
            <BaseDivider className='hidden !h-6 -2lg:block' vertical />
            <BaseChip iconName='list-checks'>{passingPointsText}</BaseChip>
            {randomizeQuestions && (
              <>
                <BaseDivider className='hidden !h-6 -2lg:block' vertical />
                <BaseChip iconName='check-square'>Randomized</BaseChip>
              </>
            )}
            {isDraft && (
              <>
                <BaseDivider className='hidden !h-6 -2lg:block' vertical />
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
      <div className='mt-2.5 flex flex-col gap-y-2.5'>
        <BaseDivider />
        <BaseSurface className='flex w-full flex-col gap-y-4' rounded='sm'>
          <div className='flex w-full items-center justify-between'>
            <h3 className='mr-2 text-base'>Schedules</h3>
            {!isDraft && (
              <BaseLink to={teacherRoutes.exam.schedule.to} size='sm' bodyFont>
                Set Schedule
              </BaseLink>
            )}
          </div>
          {schedules.length ? (
            <div className='flex w-full flex-col gap-2.5 sm:gap-y-4'>
              {schedules.map(({ date, time, duration }, index) => (
                <>
                  <div
                    key={`sched-${index}`}
                    className='flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2.5'
                  >
                    <BaseChip iconName='calendar-check'>{date}</BaseChip>
                    <BaseDivider className='hidden !h-6 sm:block' vertical />
                    <BaseChip iconName='clock'>{time}</BaseChip>
                    <BaseDivider className='hidden !h-6 sm:block' vertical />
                    <BaseChip iconName='hourglass'>{duration}</BaseChip>
                  </div>
                  {index < schedules.length - 1 && <BaseDivider />}
                </>
              ))}
            </div>
          ) : (
            <h3 className='text-base'>Exam has no schedule</h3>
          )}
        </BaseSurface>
        <BaseSurface className='flex flex-col gap-y-2.5' rounded='sm'>
          <h3 className='text-base'>
            {coveredLessons?.length
              ? 'Covered Lessons'
              : 'Exam has no covered lessons'}
          </h3>
          <div className='flex flex-col'>
            {coveredLessons?.map((lesson) => (
              <LessonItem key={`li-${lesson.id}`} lesson={lesson as Lesson} />
            ))}
          </div>
          <BaseDivider />
          <div className='flex flex-col items-start gap-2.5 md:flex-row md:gap-0'>
            <div className='mr-4 flex-1 border-0 border-accent/20 md:border-r'>
              <h3 className='text-base'>
                {descriptionHtml ? 'Description' : 'Exam has no description'}
              </h3>
              {descriptionHtml && (
                <div
                  className='base-rich-text rt-output pr-2.5'
                  dangerouslySetInnerHTML={descriptionHtml}
                />
              )}
            </div>
            <BaseDivider className='block md:hidden' />
            <div className='flex-1'>
              <h3 className='text-base'>
                {excerpt ? 'Excerpt' : 'Exam has no excerpt'}
              </h3>
              {excerpt && <p className='my-2'>{excerpt}</p>}
            </div>
          </div>
          <BaseDivider />
          <div>
            <h3 className='mb-2.5 text-base'>
              Questions ({questionCountText})
            </h3>
            <div className='flex w-full flex-col gap-y-4'>
              {questions.map((question) => (
                <TeacherExamSingleQuestion
                  key={`eq-${question.id}`}
                  question={question}
                />
              ))}
            </div>
          </div>
        </BaseSurface>
      </div>
    </div>
  );
});
