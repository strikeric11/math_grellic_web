import { useMeetingScheduleCreate } from '../hooks/use-meeting-schedule-create.hook';
import { MeetingScheduleUpsertForm } from '../components/meeting-schedule-upsert-form.component';

export function MeetingScheduleCreatePage() {
  const { isDone, setIsDone, createMeetingSchedule } =
    useMeetingScheduleCreate();

  return (
    <MeetingScheduleUpsertForm
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={createMeetingSchedule}
    />
  );
}
