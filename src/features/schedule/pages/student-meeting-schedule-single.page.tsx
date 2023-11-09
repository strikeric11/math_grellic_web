import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { StudentMeetingScheduleSingle } from '../components/student-meeting-schedule-single.component';
import { useStudentMeetingScheduleSingle } from '../hooks/use-student-meeting-schedule-single.hook';

export function StudentMeetingScheduleSinglePage() {
  const { title, meetingSchedule } = useStudentMeetingScheduleSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={title}>
        {meetingSchedule && (
          <StudentMeetingScheduleSingle
            meetingSchedule={meetingSchedule}
            className='mx-auto max-w-compact pt-5'
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
