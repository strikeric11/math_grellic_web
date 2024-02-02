import { memo, useCallback, useMemo } from 'react';
import { Tab } from '@headlessui/react';
import cx from 'classix';

import {
  StudentLessonSingleCard,
  StudentLessonSingleCardSkeleton,
} from './student-lesson-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<'div'> & {
  previousLessons: Lesson[];
  title?: string;
  loading?: boolean;
};

type LessonListProps = {
  lessons: Lesson[];
  category: string;
  loading?: boolean;
};

const tabCategories = {
  incomplete: {
    name: 'incomplete',
    label: 'Not Completed',
  },
  complete: {
    name: 'complete',
    label: 'Completed',
  },
  all: {
    name: 'all',
    label: 'All',
  },
};

const LessonList = memo(function ({
  lessons,
  category,
  loading,
}: LessonListProps) {
  const filteredLessons = useMemo(() => {
    if (category === tabCategories.incomplete.name) {
      return lessons.filter((lesson) => !lesson.completions?.length);
    } else if (category === tabCategories.complete.name) {
      return lessons.filter((lesson) => lesson.completions?.length);
    }

    return lessons;
  }, [lessons, category]);

  if (loading) {
    return [...Array(2)].map((_, index) => (
      <StudentLessonSingleCardSkeleton key={index} />
    ));
  }

  if (!filteredLessons.length) {
    return <div className='w-full py-4 text-center'>No lessons to show</div>;
  }

  return filteredLessons.map((lesson) => (
    <StudentLessonSingleCard key={`${category}-${lesson.id}`} lesson={lesson} />
  ));
});

export const StudentPreviousLessonList = memo(function ({
  className,
  title = 'Previous Lessons',
  loading,
  previousLessons,
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

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <Tab.Group>
        <div className='relative flex w-full flex-col items-baseline justify-between xs:flex-row'>
          <div className='absolute bottom-0 left-0 h-0.5 w-full bg-primary/20' />
          <h2 className='mb-2.5 text-lg xs:mb-0'>{title}</h2>
          <Tab.List className='relative z-10 mx-auto flex xs:mx-0'>
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
              <LessonList
                lessons={previousLessons}
                category={category}
                loading={loading}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
});
