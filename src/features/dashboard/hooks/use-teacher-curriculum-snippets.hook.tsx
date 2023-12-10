import { useQuery } from '@tanstack/react-query';

import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { getLessonSnippetsByCurrentTeacherUser } from '#/lesson/api/teacher-lesson.api';
import { getExamSnippetsByCurrentTeacherUser } from '#/exam/api/teacher-exam.api';
import { getActivitySnippetsByCurrentTeacherUser } from '#/activity/api/teacher-activity.api';

import type { Lesson } from '#/lesson/models/lesson.model';
import type { Exam } from '#/exam/models/exam.model';
import type { Activity } from '#/activity/models/activity.model';

type Result = {
  loading: boolean;
  lessons: Lesson[];
  exams: Exam[];
  activities: Activity[];
  refreshLessons: () => void;
  refreshExams: () => void;
  refreshActivities: () => void;
};

export function useTeacherCurriculumSnippets(): Result {
  const {
    data: lessonsData,
    isLoading: isLessonsLoading,
    isRefetching: isLessonsRefetching,
    refetch: refreshLessons,
  } = useQuery(
    getLessonSnippetsByCurrentTeacherUser(undefined, {
      refetchOnWindowFocus: false,
      select: (data: any[]) =>
        data.map((item: unknown) => transformToLesson(item)),
    }),
  );

  const {
    data: examsData,
    isLoading: isExamsLoading,
    isRefetching: isExamsRefetching,
    refetch: refreshExams,
  } = useQuery(
    getExamSnippetsByCurrentTeacherUser(undefined, {
      refetchOnWindowFocus: false,
      select: (data: any[]) =>
        data.map((item: unknown) => transformToExam(item)),
    }),
  );

  const {
    data: activitiesData,
    isLoading: isActivitiesLoading,
    isRefetching: isActivitiesRefetching,
    refetch: refreshActivities,
  } = useQuery(
    getActivitySnippetsByCurrentTeacherUser(undefined, {
      refetchOnWindowFocus: false,
      select: (data: any[]) =>
        data.map((item: unknown) => transformToActivity(item)),
    }),
  );

  return {
    loading:
      isLessonsLoading ||
      isExamsLoading ||
      isActivitiesLoading ||
      isLessonsRefetching ||
      isExamsRefetching ||
      isActivitiesRefetching,
    lessons: lessonsData || [],
    exams: examsData || [],
    activities: activitiesData || [],
    refreshLessons,
    refreshExams,
    refreshActivities,
  };
}
