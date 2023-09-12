import { BaseScene } from '#/base/components/base-scene.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { getLessonBySlugAndCurrentTeacherUser } from '../api/lesson-teacher.api';
import { useLessonPreviewSlugPage } from '../hooks/use-lesson-preview-slug-page.hook';
import { LessonSingle } from '../components/lesson-single.component';

import type { LoaderFunctionArgs } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';

export function LessonPreviewSlugPage(props: any) {
  console.log(props);
  const { titlePreview, lesson } = useLessonPreviewSlugPage('asd');

  return lesson === undefined ? (
    <BasePageSpinner />
  ) : !lesson ? (
    <div className='w-full pt-8 text-center'>Lesson preview has expired.</div>
  ) : (
    <BaseScene title={titlePreview} breadcrumbsHidden isClose>
      <LessonSingle lesson={lesson} preview />
    </BaseScene>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params?.slug) {
      return;
    }

    const query = getLessonBySlugAndCurrentTeacherUser(params.slug);
    return (
      queryClient.getQueryData(query.queryKey as string[]) ??
      (await queryClient.fetchQuery(query))
    );
  };
