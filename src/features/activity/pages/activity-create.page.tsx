import { useActivityCreate } from '../hooks/use-activity-create.hook';
import { ActivityUpsertForm } from '../components/activity-upsert-form.component';

export function ActivityCreatePage() {
  const { isDone, setIsDone, createActivity } = useActivityCreate();

  return (
    <ActivityUpsertForm
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={createActivity}
    />
  );
}
