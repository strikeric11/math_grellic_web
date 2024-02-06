import { useLoaderData } from 'react-router-dom';

import { useStudentPerformanceSingle } from '#/performance/hooks/use-student-performance-single.hook';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { StudentExamPerformanceOverview } from '#/performance/components/student-exam-performance-overview.component';
import { useStudentExamList } from '../hooks/use-student-exam-list.hook';
import { StudentLatestExamList } from '../components/student-latest-exam-list.component';
import { StudentPreviousExamList } from '../components/student-previous-exam-list.component';

export function StudentExamListPage() {
  const {
    latestExam,
    previousExams,
    upcomingExamWithDuration,
    ongoingExamsWithDurations,
    loading,
    refetch,
  } = useStudentExamList();

  const { loading: performanceLoading, student: studentPerformance } =
    useStudentPerformanceSingle();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <StudentLatestExamList
            className='mb-5'
            latestExam={latestExam}
            upcomingExamWithDuration={upcomingExamWithDuration}
            ongoingExamsWithDurations={ongoingExamsWithDurations}
            loading={loading}
            onRefresh={refetch}
          />
          <StudentPreviousExamList
            previousExams={previousExams}
            loading={loading}
          />
          <div className='bg-gradient sticky bottom-0 h-20 w-full bg-gradient-to-t from-backdrop from-60% to-transparent' />
        </div>
        <BaseRightSidebar>
          <StudentExamPerformanceOverview
            studentPerformance={studentPerformance}
            loading={performanceLoading}
          />
        </BaseRightSidebar>
      </div>
    </BaseDataSuspense>
  );
}
