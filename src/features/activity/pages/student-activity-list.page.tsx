import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { useStudentActivityList } from '../hooks/use-student-activity-list.hook';
import { StudentFeaturedActivityList } from '../components/student-featured-activity-list.component';
import { StudentOtherActivityList } from '../components/student-other-activity-list.component';

export function StudentActivityListPage() {
  const { featuredActivities, otherActivities, loading, refetch } =
    useStudentActivityList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <StudentFeaturedActivityList
            className='mb-5'
            featuredActivities={featuredActivities}
            loading={loading}
            onRefresh={refetch}
          />
          <StudentOtherActivityList
            otherActivities={otherActivities}
            loading={loading}
          />
          <div className='bg-gradient sticky bottom-0 h-20 w-full bg-gradient-to-t from-backdrop from-60% to-transparent' />
        </div>
        {/* TODO sidebar components */}
        <BaseRightSidebar />
      </div>
    </BaseDataSuspense>
  );
}
