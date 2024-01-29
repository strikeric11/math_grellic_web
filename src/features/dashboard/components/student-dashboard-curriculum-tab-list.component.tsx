import { memo, useCallback, useMemo } from 'react';
import { Tab } from '@headlessui/react';
import cx from 'classix';

import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { StudentDashboardLessonList } from './student-dashboard-lesson-list.component';
import { StudentDashboardExamList } from './student-dashboard-exam-list.component';
import { StudentDashboardActivityList } from './student-dashboard-activity-list.component';

import type { ComponentProps } from 'react';
import type { Lesson, LessonWithDuration } from '#/lesson/models/lesson.model';
import type { Exam, ExamWithDuration } from '#/exam/models/exam.model';
import type { Activity } from '#/activity/models/activity.model';

type Props = ComponentProps<typeof BaseSurface> & {
  latestLesson: Lesson | null;
  upcomingLessonWithDuration: LessonWithDuration;
  previousLessons: Lesson[];
  latestExam: Exam | null;
  previousExams: Exam[];
  upcomingExamWithDuration: ExamWithDuration;
  ongoingExamsWithDurations: ExamWithDuration[];
  activities: Activity[];
  refresh: () => void;
  loading?: boolean;
};

const tabCategories = {
  lesson: {
    name: 'lesson',
    label: 'Lessons',
  },
  exam: {
    name: 'exam',
    label: 'Exams',
  },
  activity: {
    name: 'activity',
    label: 'Activities',
  },
};

export const StudentDashboardCurriculumTabList = memo(function ({
  className,
  loading,
  latestLesson,
  upcomingLessonWithDuration,
  previousLessons,
  latestExam,
  previousExams,
  upcomingExamWithDuration,
  ongoingExamsWithDurations,
  activities,
  refresh,
  ...moreProps
}: Props) {
  const setClassName = useCallback(
    ({ selected }: { selected: boolean }) =>
      cx(
        'relative border-b-2 p-2.5 font-display font-bold leading-none tracking-tighter outline-0 transition-all hover:text-primary',
        selected
          ? 'border-b-primary text-primary'
          : 'border-b-transparent text-primary/60',
      ),
    [],
  );

  const tabPanels = useMemo(
    () => [
      {
        key: 'lesson',
        component: (
          <StudentDashboardLessonList
            className='w-full sm:w-auto sm:min-w-[550px]'
            latestLesson={latestLesson}
            upcomingLessonWithDuration={upcomingLessonWithDuration}
            previousLessons={previousLessons}
            loading={loading}
          />
        ),
      },
      {
        key: 'exam',
        component: (
          <StudentDashboardExamList
            latestExam={latestExam}
            upcomingExamWithDuration={upcomingExamWithDuration}
            ongoingExamsWithDurations={ongoingExamsWithDurations}
            previousExams={previousExams}
            loading={loading}
          />
        ),
      },
      {
        key: 'activity',
        component: (
          <StudentDashboardActivityList
            activities={activities}
            loading={loading}
          />
        ),
      },
    ],
    [
      latestLesson,
      upcomingLessonWithDuration,
      previousLessons,
      latestExam,
      upcomingExamWithDuration,
      ongoingExamsWithDurations,
      previousExams,
      activities,
      loading,
    ],
  );

  return (
    <BaseSurface
      className={cx('flex flex-col justify-between !pb-5 !pt-2.5', className)}
      {...moreProps}
    >
      <Tab.Group>
        <div className='relative flex w-full items-baseline justify-between'>
          <div className='absolute bottom-0 left-0 h-0.5 w-full bg-primary/20' />
          <Tab.List className='relative z-10 flex'>
            {Object.values(tabCategories).map(({ name, label }) => (
              <Tab key={name} className={setClassName}>
                {name === 'exam' && !!ongoingExamsWithDurations.length && (
                  <div className='absolute left-1 top-2 h-2.5 w-2.5 overflow-hidden rounded-full bg-red-500' />
                )}
                {label}
              </Tab>
            ))}
          </Tab.List>
          <BaseTooltip content='Refresh'>
            <BaseIconButton
              name='arrow-clockwise'
              className='absolute right-0 top-0'
              variant='link'
              size='xs'
              onClick={refresh}
            />
          </BaseTooltip>
        </div>
        <Tab.Panels className='pt-4'>
          {tabPanels.map(({ key, component }) => (
            <Tab.Panel
              key={key}
              className='flex w-full flex-1 animate-fastFadeIn flex-col gap-2.5 self-stretch'
            >
              {component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </BaseSurface>
  );
});
