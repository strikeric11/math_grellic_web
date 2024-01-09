import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useStudentUserSingle } from '../hooks/use-student-user-single.hook';
import { StudentUserSingle } from '../components/student-user-single.component';

export function StudentUserSinglePage() {
  const { loading, student } = useStudentUserSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {student && (
        <StudentUserSingle
          className='mx-auto max-w-compact py-5 pb-16'
          student={student}
        />
      )}
    </BaseDataSuspense>
  );
}
