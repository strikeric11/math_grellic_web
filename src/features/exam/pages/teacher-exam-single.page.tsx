import { useLoaderData } from 'react-router-dom';

import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useTeacherExamSingle } from '../hooks/use-teacher-exam-single.hook';
import { TeacherExamSingle } from '../components/teacher-exam-single.component';

export function TeacherExamSinglePage() {
  const { exam, loading } = useTeacherExamSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {exam && (
        <TeacherExamSingle className='mx-auto max-w-compact py-5' exam={exam} />
      )}
    </BaseDataSuspense>
  );
}
