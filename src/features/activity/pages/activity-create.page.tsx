import { useActivityCreate } from '../hooks/use-activity-create.hook';
import { ActivityUpsertForm } from '../components/activity-upsert-form.component';

export function ActivityCreatePage() {
  const { loading, isDone, setIsDone, createActivity } = useActivityCreate();

  return (
    <ActivityUpsertForm
      loading={loading}
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={createActivity}
    />
  );
}
