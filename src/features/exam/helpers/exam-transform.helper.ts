import dayjs from '#/config/dayjs.config';
import { ExActTextType } from '#/core/models/core.model';
import {
  getQuestionImageUrl,
  transformToBaseModel,
} from '#/base/helpers/base.helper';
import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';
import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';

import type { StudentUserAccount } from '#/user/models/user.model';
import type { Lesson } from '#/lesson/models/lesson.model';
import type {
  Exam,
  ExamCompletion,
  ExamCompletionQuestionAnswer,
  ExamQuestion,
  ExamQuestionChoice,
  ExamSchedule,
} from '../models/exam.model';
import type {
  ExamQuestionChoiceFormData,
  ExamQuestionFormData,
  ExamScheduleUpsertFormData,
  ExamUpsertFormData,
} from '../models/exam-form-data.model';

export function transformToExam(
  {
    id,
    createdAt,
    updatedAt,
    status,
    orderNumber,
    title,
    slug,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    passingPoints,
    description,
    excerpt,
    coveredLessons,
    questions,
    schedules,
    scheduleStatus,
    completions,
    rank,
  }: any,
  withLesson?: boolean,
): Exam {
  const transformedCoveredLessons = withLesson
    ? coveredLessons?.map((lesson: any) => transformToLesson(lesson)) || []
    : coveredLessons?.map((lesson: any) => ({ id: lesson.id })) || [];

  const transformedQuestions =
    questions?.map((question: any) => transformToExamQuestion(question)) || [];

  const transformedSchedules = schedules
    ? schedules.map((schedule: any) => transformToExamSchedule(schedule))
    : undefined;

  const transformedCompletions = completions
    ? completions.map((completion: any) =>
        transformToExamCompletion(completion),
      )
    : undefined;

  return {
    status,
    orderNumber,
    title,
    slug,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    passingPoints,
    description,
    excerpt,
    coveredLessons: transformedCoveredLessons,
    questions: transformedQuestions,
    schedules: transformedSchedules,
    scheduleStatus,
    completions: transformedCompletions,
    rank,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamQuestion({
  id,
  createdAt,
  updatedAt,
  orderNumber,
  text,
  textType,
  choices,
}: any): ExamQuestion {
  const transformedChoices = choices
    ? choices.map((choice: any) => transformToExamQuestionChoice(choice))
    : [];

  return {
    orderNumber,
    text,
    textType,
    choices: transformedChoices,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamQuestionChoice({
  id,
  createdAt,
  updatedAt,
  orderNumber,
  text,
  textType,
  isCorrect,
}: any): ExamQuestionChoice {
  return {
    orderNumber,
    text,
    textType,
    isCorrect,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamSchedule({
  id,
  createdAt,
  updatedAt,
  startDate,
  endDate,
  students,
  exam,
}: any): Partial<ExamSchedule> {
  const transformedStudents = !students?.length
    ? null
    : students.map((student: any) => transformToStudentUserAccount(student));

  const transformedExam = exam ? transformToExam(exam) : undefined;

  return {
    startDate: dayjs(startDate).toDate(),
    endDate: dayjs(endDate).toDate(),
    students: transformedStudents,
    exam: transformedExam,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamCompletion({
  id,
  createdAt,
  updatedAt,
  submittedAt,
  score,
  questionAnswers,
  exam,
  student,
}: any): Partial<ExamCompletion> {
  const transformedStudent = student
    ? ({ id: student.id } as StudentUserAccount)
    : undefined;

  const transformedQuestionAnswers =
    questionAnswers?.map((answer: any) =>
      transformToExamCompletionQuestionAnswer(answer),
    ) || [];

  return {
    submittedAt: dayjs(submittedAt).toDate(),
    score,
    questionAnswers: transformedQuestionAnswers,
    exam,
    student: transformedStudent,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamCompletionQuestionAnswer({
  id,
  createdAt,
  updatedAt,
  question,
  selectedQuestionChoice,
}: any): Partial<ExamCompletionQuestionAnswer> {
  return {
    question: { id: question.id } as ExamQuestion,
    selectedQuestionChoice: {
      id: selectedQuestionChoice.id,
    } as ExamQuestionChoice,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamFormData({
  status,
  orderNumber,
  slug,
  title,
  randomizeQuestions,
  visibleQuestionsCount,
  pointsPerQuestion,
  passingPoints,
  description,
  excerpt,
  coveredLessons,
  questions,
  schedules,
}: any): ExamUpsertFormData {
  let startDate = undefined;
  let startTime = undefined;
  let endDate = undefined;
  let endTime = undefined;
  let studentIds = undefined;

  if (schedules?.length === 1) {
    const dayJsStartDate = dayjs(schedules[0].startDate);
    const dayJsEndDate = dayjs(schedules[0].endDate);

    startDate = dayJsStartDate.toDate();
    startTime = dayJsStartDate.format('hh:mm A');
    endDate = dayJsEndDate.toDate();
    endTime = dayJsEndDate.format('hh:mm A');
    studentIds =
      schedules[0].students?.map((student: StudentUserAccount) => student.id) ||
      [];
  }

  const coveredLessonIds =
    coveredLessons?.map((lesson: Partial<Lesson>) => lesson.id) || [];

  const transformedQuestions =
    questions?.map((question: any) =>
      transformToExamQuestionFormData(question),
    ) || [];

  return {
    status,
    orderNumber,
    slug,
    title,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    passingPoints,
    description: description || undefined,
    excerpt: excerpt || undefined,
    coveredLessonIds,
    questions: transformedQuestions,
    startDate,
    startTime,
    endDate,
    endTime,
    studentIds,
  };
}

export function transformToExamQuestionFormData({
  id,
  orderNumber,
  text,
  textType,
  choices,
}: any): ExamQuestionFormData {
  const transformedChoices =
    choices?.map((choice: any) =>
      transformToExamQuestionChoiceFormData(choice),
    ) || [];

  const imageData =
    textType === ExActTextType.Image ? getQuestionImageUrl(text) : undefined;

  return {
    id,
    orderNumber,
    text,
    textType,
    choices: transformedChoices,
    imageData,
  };
}

export function transformToExamQuestionChoiceFormData({
  id,
  orderNumber,
  text,
  textType,
  isCorrect,
}: any): ExamQuestionChoiceFormData {
  const imageData =
    textType === ExActTextType.Image ? getQuestionImageUrl(text) : undefined;

  return {
    id,
    orderNumber,
    text,
    textType,
    isCorrect,
    imageData,
  };
}

export function transformToExamUpsertDto({
  status,
  orderNumber,
  title,
  randomizeQuestions,
  visibleQuestionsCount,
  pointsPerQuestion,
  passingPoints,
  description,
  excerpt,
  coveredLessonIds,
  questions,
  startDate,
  startTime,
  endDate,
  endTime,
  studentIds,
}: any) {
  const transformedStartDate = startDate
    ? dayjs(`${dayjs(startDate).format('YYYY-MM-DD')} ${startTime}`).toDate()
    : undefined;

  const transformedEndDate = endDate
    ? dayjs(`${dayjs(endDate).format('YYYY-MM-DD')} ${endTime}`).toDate()
    : undefined;

  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  const questionsDto =
    questions?.map((question: any) =>
      transformToExamQuestionUpsertDto(question),
    ) || [];

  return {
    status,
    orderNumber,
    title,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    passingPoints,
    description,
    excerpt,
    coveredLessonIds: coveredLessonIds?.length ? coveredLessonIds : undefined,
    questions: questionsDto,
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    studentIds: transformedStudentsIds,
  };
}

export function transformToExamQuestionUpsertDto({
  id,
  orderNumber,
  text,
  textType,
  choices,
}: any) {
  const choicesDto =
    choices?.map((choice: any) =>
      transformToExamQuestionChoiceUpsertDto(choice),
    ) || [];

  return {
    id,
    orderNumber,
    text,
    textType,
    choices: choicesDto,
  };
}

export function transformToExamQuestionChoiceUpsertDto({
  id,
  orderNumber,
  text,
  textType,
  isCorrect,
}: any) {
  return {
    id,
    orderNumber,
    text,
    textType,
    isCorrect,
  };
}

export function transformToExamScheduleFormData({
  exam,
  startDate,
  endDate,
  students,
}: any): ExamScheduleUpsertFormData {
  const transformedStudentIds = !students?.length
    ? null
    : students.map((student: StudentUserAccount) => student.id);

  return {
    examId: exam?.id || 0,
    studentIds: transformedStudentIds,
    startDate: dayjs(startDate).toDate(),
    startTime: dayjs(startDate).format('hh:mm A'),
    endDate: dayjs(endDate).toDate(),
    endTime: dayjs(endDate).format('hh:mm A'),
  };
}

export function transformToExamScheduleCreateDto({
  examId,
  startDate,
  startTime,
  endDate,
  endTime,
  studentIds,
}: any) {
  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
  const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

  const transformedStartDate = dayjs(
    `${formattedStartDate} ${startTime}`,
  ).toDate();
  const transformedEndDate = dayjs(`${formattedEndDate} ${endTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    examId,
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    studentIds: transformedStudentsIds,
  };
}

export function transformToExamScheduleUpdateDto({
  startDate,
  endDate,
  startTime,
  endTime,
  studentIds,
}: any) {
  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
  const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

  const transformedStartDate = dayjs(
    `${formattedStartDate} ${startTime}`,
  ).toDate();
  const transformedEndDate = dayjs(`${formattedEndDate} ${endTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    studentIds: transformedStudentsIds,
  };
}
