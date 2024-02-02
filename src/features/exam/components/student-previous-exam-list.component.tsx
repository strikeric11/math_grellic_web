import { memo, useCallback, useMemo } from 'react';
import { Tab } from '@headlessui/react';
import cx from 'classix';

import {
  StudentExamSingleCard,
  StudentExamSingleCardSkeleton,
} from './student-exam-single-card.component';

import type { ComponentProps } from 'react';
import type { Exam } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  previousExams: Exam[];
  title?: string;
  loading?: boolean;
};

type ExamListProps = {
  exams: Exam[];
  category: string;
  loading?: boolean;
};

const tabCategories = {
  all: {
    name: 'all',
    label: 'All',
  },
  complete: {
    name: 'complete',
    label: 'Completed',
  },
  expired: {
    name: 'expired',
    label: 'Expired',
  },
};

const ExamList = memo(function ({ exams, category, loading }: ExamListProps) {
  const filteredExams = useMemo(() => {
    if (category === tabCategories.expired.name) {
      return exams.filter((exams) => !exams.completions?.length);
    } else if (category === tabCategories.complete.name) {
      return exams.filter((exams) => exams.completions?.length);
    }

    return exams;
  }, [exams, category]);

  if (loading) {
    return [...Array(4)].map((_, index) => (
      <StudentExamSingleCardSkeleton key={index} />
    ));
  }

  if (!filteredExams.length) {
    return <div className='w-full py-4 text-center'>No exams to show</div>;
  }

  return filteredExams.map((exam) => (
    <StudentExamSingleCard key={`${category}-${exam.id}`} exam={exam} />
  ));
});

export const StudentPreviousExamList = memo(function ({
  className,
  title = 'Previous Exams',
  loading,
  previousExams,
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
              <ExamList
                exams={previousExams}
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
