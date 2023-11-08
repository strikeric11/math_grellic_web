import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useTeacherMeetingScheduleSingle } from '../hooks/use-teacher-meeting-schedule-single.hook';
import { TeacherMeetingScheduleSingle } from '../components/teacher-meeting-schedule-single.component';

export function TeacherMeetingScheduleSinglePage() {
  const { meetingSchedule, loading } = useTeacherMeetingScheduleSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {meetingSchedule && (
        <TeacherMeetingScheduleSingle
          className='mx-auto max-w-compact py-5'
          meetingSchedule={meetingSchedule}
        />
      )}
    </BaseDataSuspense>
  );
}
