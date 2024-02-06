import { memo, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import { TeacherLessonSingleCard } from '#/lesson/components/teacher-lesson-single-card.component';
import { TeacherExamSingleCard } from '#/exam/components/teacher-exam-single-card.component';
import { TeacherActivitySingleCard } from '#/activity/components/teacher-activity-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';
import type { Exam } from '#/exam/models/exam.model';
import type { Activity } from '#/activity/models/activity.model';

type Props = ComponentProps<typeof BaseSurface> & {
  lessons: Lesson[];
  exams: Exam[];
  activities: Activity[];
  loading?: boolean;
  onLessonDetails?: (slug: string) => void;
  onExamDetails?: (slug: string) => void;
  onActivityDetails?: (slug: string) => void;
};

type CurriculumListProps = {
  lessons: Lesson[];
  exams: Exam[];
  activities: Activity[];
  category: string;
  loading?: boolean;
  onLessonDetails?: (slug: string) => void;
  onExamDetails?: (slug: string) => void;
  onActivityDetails?: (slug: string) => void;
};

const LESSON_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`;
const EXAM_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.exam.to}`;
const ACTIVITY_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.activity.to}`;
const CREATE_LESSON_PATH = `${LESSON_LIST_PATH}/${teacherRoutes.lesson.createTo}`;
const CREATE_EXAM_PATH = `${EXAM_LIST_PATH}/${teacherRoutes.exam.createTo}`;
const CREATE_ACTIVITY_PATH = `${ACTIVITY_LIST_PATH}/${teacherRoutes.activity.createTo}`;

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

const CurriculumList = memo(function ({
  loading,
  category,
  lessons,
  exams,
  activities,
  onLessonDetails,
  onExamDetails,
  onActivityDetails,
}: CurriculumListProps) {
  const handleLessonDetails = useCallback(
    (slug: string) => () => {
      onLessonDetails && onLessonDetails(slug);
    },
    [onLessonDetails],
  );

  const handleExamDetails = useCallback(
    (slug: string) => () => {
      onExamDetails && onExamDetails(slug);
    },
    [onExamDetails],
  );

  const handleActivityDetails = useCallback(
    (slug: string) => () => {
      onActivityDetails && onActivityDetails(slug);
    },
    [onActivityDetails],
  );

  if (loading) {
    return (
      <div className='flex w-full items-center justify-center'>
        <BaseSpinner />
      </div>
    );
  }

  if (category === 'exam') {
    return (
      <>
        {exams.length ? (
          exams.map((exam) => (
            <TeacherExamSingleCard
              key={`item-${exam.id}`}
              exam={exam}
              onDetails={handleExamDetails(exam.slug)}
              role='row'
              isDashboard
            />
          ))
        ) : (
          <BaseDataEmptyMessage
            message='No exams available'
            linkTo={CREATE_EXAM_PATH}
          />
        )}
      </>
    );
  } else if (category === 'activity') {
    return (
      <>
        {activities.length ? (
          activities.map((activity) => (
            <TeacherActivitySingleCard
              key={`item-${activity.id}`}
              activity={activity}
              onDetails={handleActivityDetails(activity.slug)}
              role='row'
              isDashboard
            />
          ))
        ) : (
          <BaseDataEmptyMessage
            message='No activities available'
            linkTo={CREATE_ACTIVITY_PATH}
          />
        )}
      </>
    );
  }

  return (
    <>
      {lessons.length ? (
        lessons.map((lesson) => (
          <TeacherLessonSingleCard
            key={`item-${lesson.id}`}
            lesson={lesson}
            role='row'
            onDetails={handleLessonDetails(lesson.slug)}
            isDashboard
          />
        ))
      ) : (
        <BaseDataEmptyMessage
          message='No lessons available'
          linkTo={CREATE_LESSON_PATH}
        />
      )}
    </>
  );
});

export const TeacherDashboardCurriculumTabList = memo(function ({
  className,
  loading,
  lessons,
  exams,
  activities,
  onLessonDetails,
  onExamDetails,
  onActivityDetails,
  ...moreProps
}: Props) {
  const setClassName = useCallback(
    ({ selected }: { selected: boolean }) =>
      cx(
        'border-b-2 p-2.5 font-display font-bold leading-none tracking-tighter outline-0 transition-all hover:text-primary',
        selected
          ? 'border-b-primary text-primary'
          : 'border-b-transparent text-primary/60',
      ),
    [],
  );

  const createLink = useCallback((category: string) => {
    const getLabel = () => {
      if (category === 'exam') {
        return 'View All Exams';
      } else if (category === 'activity') {
        return 'View All Activities';
      } else {
        return 'View All Lessons';
      }
    };

    const getLink = () => {
      if (category === 'exam') {
        return EXAM_LIST_PATH;
      } else if (category === 'activity') {
        return ACTIVITY_LIST_PATH;
      } else {
        return LESSON_LIST_PATH;
      }
    };

    return (
      <BaseLink to={getLink()} rightIconName='arrow-circle-right' size='xs'>
        {getLabel()}
      </BaseLink>
    );
  }, []);

  return (
    <BaseSurface
      className={cx('flex flex-col justify-between !py-2.5', className)}
      {...moreProps}
    >
      <Tab.Group>
        <div className='relative flex w-full items-baseline justify-between'>
          <div className='absolute bottom-0 left-0 h-0.5 w-full bg-primary/20' />
          <Tab.List className='relative z-10 flex'>
            {Object.values(tabCategories).map(({ name, label }) => (
              <Tab key={name} className={setClassName}>
                {label}
              </Tab>
            ))}
          </Tab.List>
        </div>
        <Tab.Panels className='pt-4'>
          {Object.keys(tabCategories).map((category) => (
            <Tab.Panel
              key={category}
              className='flex w-full flex-1 animate-fastFadeIn flex-col gap-2.5 self-stretch'
            >
              <CurriculumList
                lessons={lessons}
                exams={exams}
                activities={activities}
                category={category}
                loading={loading}
                onLessonDetails={onLessonDetails}
                onExamDetails={onExamDetails}
                onActivityDetails={onActivityDetails}
              />
              <div className='w-full text-right'>{createLink(category)}</div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </BaseSurface>
  );
});
