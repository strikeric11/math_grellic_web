import { Outlet, useLoaderData } from 'react-router-dom';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseGroupLink } from '#/base/components/base-group-link.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useTeacherLessonSingle } from '../hooks/use-teacher-lesson-single.hook';

import type { Lesson } from '../models/lesson.model';
import type { GroupLink } from '#/base/models/base.model';

export type OutletContextType = { lesson?: Lesson | null };

const sceneTitle = 'Lesson Schedule';
const sceneLinks = [
  {
    to: `${teacherBaseRoute}/${teacherRoutes.lesson.to}`,
    label: 'Lesson List',
    icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
  },
  {
    to: `${teacherBaseRoute}/${teacherRoutes.calendar.to}`,
    label: 'Calendar',
    icons: [{ name: 'calendar' }],
  },
] as GroupLink[];

export function TeacherLessonScheduleListPage() {
  const { lesson } = useTeacherLessonSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        title={sceneTitle}
        headerRightContent={<BaseGroupLink links={sceneLinks} />}
        withtrailingSlash
      >
        LESSON
        <Outlet context={{ lesson } satisfies OutletContextType} />
      </BaseScene>
    </BaseDataSuspense>
  );
}
