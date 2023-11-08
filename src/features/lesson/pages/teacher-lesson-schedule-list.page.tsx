import { useMemo } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseGroupLink } from '#/base/components/base-group-link.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useTeacherLessonSingle } from '../hooks/use-teacher-lesson-single.hook';
import { TeacherLessonScheduleListOverview } from '../components/teacher-lesson-schedule-list-overview.component';

import type { Lesson, LessonSchedule } from '../models/lesson.model';
import type { GroupLink } from '#/base/models/base.model';

export type OutletContextType = {
  lesson?: Lesson | null;
  lessonSchedule?: LessonSchedule;
};

const sceneTitle = 'Lesson Schedule';
const sceneLinks = [
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`,
    label: 'Lesson List',
    icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.schedule.to}`,
    label: 'Calendar',
    icons: [{ name: 'calendar' }],
  },
] as GroupLink[];

export function TeacherLessonScheduleListPage() {
  const { lesson } = useTeacherLessonSingle();
  const data: any = useLoaderData();

  const lessonSchedule = useMemo(
    () =>
      (lesson?.schedules?.length
        ? lesson.schedules[0]
        : undefined) as LessonSchedule,
    [lesson],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        title={sceneTitle}
        headerRightContent={<BaseGroupLink links={sceneLinks} />}
      >
        {lesson && (
          <div className='w-full py-5'>
            <TeacherLessonScheduleListOverview
              lesson={lesson}
              className='mx-auto max-w-compact'
            />
            <Outlet
              context={{ lesson, lessonSchedule } satisfies OutletContextType}
            />
          </div>
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
