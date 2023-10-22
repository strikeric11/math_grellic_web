import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';

import { RecordStatus } from '#/core/models/core.model';
import { coreRouteHandle } from '#/core/core-route-handle';
import { CorePageNotFound } from '#/core/components/core-page-not-found.component';
import { CoreStaticLayout } from '#/core/components/core-static-layout.component';
import { CoreLayout } from '#/core/components/core-layout.component';

import { UserRole } from '#/user/models/user.model';
import { AuthProtectedRoute } from '#/user/components/auth-protected-route.component';

import { HomePage } from '#/static/pages/home.page';
import { AboutPage } from '#/static/pages/about.page';
import { AuthRegisterPage } from '#/user/pages/auth-register.page';

import { dashboardRouteHandle } from '#/dashboard/route/dashboard-handle.route';
import { TeacherDashboardPage } from '#/dashboard/pages/teacher-dashboard.page';
import { StudentDashboardPage } from '#/dashboard/pages/student-dashboard.page';

import { teacherLessonRouteHandle } from '#/lesson/route/teacher-lesson-handle.route';
import { teacherExamRouteHandle } from '#/exam/route/teacher-exam-handle.route';
import { teacherActivityRouteHandle } from '#/activity/route/teacher-activity-handle.route';
import { studentLessonRouteHandle } from '#/lesson/route/student-lesson-handle.route';
import { studentExamRouteHandle } from '#/exam/route/student-exam-handle.route';
import { LessonCreatePage } from '#/lesson/pages/lesson-create.page';
import {
  getPaginatedLessonsLoader as getTeacherPaginatedLessonsLoader,
  getLessonBySlugLoader as getTeacherLessonBySlugLoader,
} from '#/lesson/route/teacher-lesson-loader.route';
import {
  getPaginatedExamsLoader as getTeacherPaginatedExamsLoader,
  getExamBySlugLoader as getTeacherExamBySlugLoader,
} from '#/exam/route/teacher-exam-loader.route';
import {
  getPaginatedActivitiesLoader as getTeacherPaginatedActivitiesLoader,
  getActivityBySlugLoader as getTeacherActivityBySlugLoader,
} from '#/activity/route/teacher-activity-loader.route';
import {
  getLessonsLoader as getStudentLessonsLoader,
  getLessonBySlugLoader as getStudentLessonBySlugLoader,
} from '#/lesson/route/student-lesson-loader.route';
import {
  getExamsLoader as getStudentExamsLoader,
  getExamBySlugLoader as getStudentExamBySlugLoader,
} from '#/exam/route/student-exam-loader.route';
import { TeacherLessonListPage } from '#/lesson/pages/teacher-lesson-list.page';
import { TeacherLessonSinglePage } from '#/lesson/pages/teacher-lesson-single.page';
import { TeacherLessonScheduleListPage } from '#/lesson/pages/teacher-lesson-schedule-list.page';
import { TeacherLessonScheduleCreatePage } from '#/lesson/pages/teacher-lesson-schedule-create.page';
import { TeacherLessonScheduleEditPage } from '#/lesson/pages/teacher-lesson-schedule-edit.page';
import { TeacherExamListPage } from '#/exam/pages/teacher-exam-list.page';
import { StudentLessonListPage } from '#/lesson/pages/student-lesson-list.page';
import { StudentLessonSinglePage } from '#/lesson/pages/student-lesson-single.page';
import { LessonPreviewSlugPage } from '#/lesson/pages/lesson-preview-slug.page';
import { LessonPreviewPage } from '#/lesson/pages/lesson-preview.page';
import { LessonEditPage } from '#/lesson/pages/lesson-edit.page';
import { TeacherExamSinglePage } from '#/exam/pages/teacher-exam-single.page';
import { ExamCreatePage } from '#/exam/pages/exam-create.page';
import { ExamEditPage } from '#/exam/pages/exam-edit.page';
import { ExamPreviewPage } from '#/exam/pages/exam-preview.page';
import { ExamPreviewSlugPage } from '#/exam/pages/exam-preview-slug.page';
import { TeacherExamScheduleListPage } from '#/exam/pages/teacher-exam-schedule-list.page';
import { TeacherExamScheduleCreatePage } from '#/exam/pages/teacher-exam-schedule-create.page';
import { TeacherExamScheduleEditPage } from '#/exam/pages/teacher-exam-schedule-edit.page';
import { StudentExamListPage } from '#/exam/pages/student-exam-list.page';
import { StudentExamSinglePage } from '#/exam/pages/student-exam-single.page';
import { TeacherActivityListPage } from '#/activity/pages/teacher-activity-list.page';
import { ActivityCreatePage } from '#/activity/pages/activity-create.page';
import { ActivityEditPage } from '#/activity/pages/activity-edit.page';
import { ActivityPreviewSlugPage } from '#/activity/pages/activity-preview-slug.page';
import { TeacherActivitySinglePage } from '#/activity/pages/teacher-activity-single.page';

import { staticRoutes } from './static-routes';
import { teacherBaseRoute, teacherRoutes } from './teacher-routes';
import { studentBaseRoute, studentRoutes } from './student-routes';

const rootRoutes = createRoutesFromElements(
  <>
    <Route path='/' element={<CoreStaticLayout />}>
      <Route index element={<HomePage />} />
      <Route path={staticRoutes.about.to} element={<AboutPage />} />
      <Route
        path={staticRoutes.training.to}
        element={
          // TODO training page
          <div>TRAINING PAGE</div>
        }
      />
      <Route
        path={staticRoutes.authRegister.to}
        element={<AuthRegisterPage />}
      />
      <Route
        path='*'
        element={
          <CorePageNotFound className='!h-screen' linkLabel='Return to home' />
        }
      />
    </Route>
    {/* TEACHER */}
    <Route
      path={teacherBaseRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Teacher]}>
          <CoreLayout />
        </AuthProtectedRoute>
      }
    >
      <Route
        index
        element={<TeacherDashboardPage />}
        handle={dashboardRouteHandle}
      />
      {/* TEACHER LESSONS */}
      <Route path={teacherRoutes.lesson.to} element={<Outlet />}>
        <Route
          index
          element={<TeacherLessonListPage />}
          handle={teacherLessonRouteHandle.list}
          loader={getTeacherPaginatedLessonsLoader(queryClient)}
        />
        <Route path=':slug' element={<Outlet />}>
          <Route
            index
            element={<TeacherLessonSinglePage />}
            handle={teacherLessonRouteHandle.single}
            loader={getTeacherLessonBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.lesson.editTo}
            element={<LessonEditPage />}
            handle={teacherLessonRouteHandle.edit}
            loader={getTeacherLessonBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.lesson.previewTo}
            element={<LessonPreviewSlugPage />}
            handle={teacherLessonRouteHandle.preview}
            loader={getTeacherLessonBySlugLoader(queryClient, {
              exclude: 'schedules',
            })}
          />
          <Route
            path={`${teacherRoutes.lesson.schedule.to}`}
            element={<TeacherLessonScheduleListPage />}
            handle={teacherLessonRouteHandle.schedule}
            loader={getTeacherLessonBySlugLoader(queryClient, {
              status: RecordStatus.Published,
            })}
          >
            <Route
              path={`${teacherRoutes.lesson.schedule.createTo}`}
              element={<TeacherLessonScheduleCreatePage />}
              handle={teacherLessonRouteHandle.schedule}
            />
            <Route
              path={`${teacherRoutes.lesson.schedule.editTo}`}
              element={<TeacherLessonScheduleEditPage />}
              handle={teacherLessonRouteHandle.schedule}
            />
          </Route>
        </Route>
        <Route
          path={teacherRoutes.lesson.createTo}
          element={<LessonCreatePage />}
          handle={teacherLessonRouteHandle.create}
        />
        <Route
          path={teacherRoutes.lesson.previewTo}
          element={<LessonPreviewPage />}
          handle={teacherLessonRouteHandle.preview}
        />
      </Route>
      {/* TEACHER EXAMS */}
      <Route path={teacherRoutes.exam.to} element={<Outlet />}>
        <Route
          index
          element={<TeacherExamListPage />}
          handle={teacherExamRouteHandle.list}
          loader={getTeacherPaginatedExamsLoader(queryClient)}
        />
        <Route path=':slug' element={<Outlet />}>
          <Route
            index
            element={<TeacherExamSinglePage />}
            handle={teacherExamRouteHandle.single}
            loader={getTeacherExamBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.exam.editTo}
            element={<ExamEditPage />}
            handle={teacherExamRouteHandle.edit}
            loader={getTeacherExamBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.exam.previewTo}
            element={<ExamPreviewSlugPage />}
            handle={teacherExamRouteHandle.preview}
            loader={getTeacherExamBySlugLoader(queryClient, {
              exclude: 'schedules',
            })}
          />
          <Route
            path={`${teacherRoutes.exam.schedule.to}`}
            element={<TeacherExamScheduleListPage />}
            handle={teacherExamRouteHandle.schedule}
            loader={getTeacherExamBySlugLoader(queryClient, {
              status: RecordStatus.Published,
            })}
          >
            <Route
              path={`${teacherRoutes.exam.schedule.createTo}`}
              element={<TeacherExamScheduleCreatePage />}
              handle={teacherLessonRouteHandle.schedule}
            />
            <Route
              path={`${teacherRoutes.exam.schedule.editTo}`}
              element={<TeacherExamScheduleEditPage />}
              handle={teacherExamRouteHandle.schedule}
            />
          </Route>
        </Route>
        <Route
          path={teacherRoutes.exam.createTo}
          element={<ExamCreatePage />}
          handle={teacherExamRouteHandle.create}
        />
        <Route
          path={teacherRoutes.exam.previewTo}
          element={<ExamPreviewPage />}
          handle={teacherExamRouteHandle.preview}
        />
      </Route>
      {/* TEACHER ACTIVITIES */}
      <Route path={teacherRoutes.activity.to} element={<Outlet />}>
        <Route
          index
          element={<TeacherActivityListPage />}
          handle={teacherActivityRouteHandle.list}
          loader={getTeacherPaginatedActivitiesLoader(queryClient)}
        />
        <Route path=':slug' element={<Outlet />}>
          <Route
            index
            element={<TeacherActivitySinglePage />}
            handle={teacherActivityRouteHandle.single}
            loader={getTeacherActivityBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.activity.editTo}
            element={<ActivityEditPage />}
            handle={teacherActivityRouteHandle.edit}
            loader={getTeacherActivityBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.activity.previewTo}
            element={<ActivityPreviewSlugPage />}
            handle={teacherActivityRouteHandle.preview}
            loader={getTeacherActivityBySlugLoader(queryClient)}
          />
        </Route>
        <Route
          path={teacherRoutes.activity.createTo}
          element={<ActivityCreatePage />}
          handle={teacherActivityRouteHandle.create}
        />
        {/* <Route
          path={teacherRoutes.activity.previewTo}
          element={<ActivityPreviewPage />}
          handle={teacherActivityRouteHandle.preview}
        /> */}
      </Route>
      <Route
        path='*'
        element={<CorePageNotFound to={`/${teacherBaseRoute}`} />}
        handle={coreRouteHandle.notFound}
      />
    </Route>
    {/* STUDENT */}
    <Route
      path={studentBaseRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Student]}>
          <CoreLayout />
        </AuthProtectedRoute>
      }
    >
      <Route
        index
        element={<StudentDashboardPage />}
        handle={dashboardRouteHandle}
      />
      {/* STUDENT LESSONS */}
      <Route path={studentRoutes.lesson.to} element={<Outlet />}>
        <Route
          index
          element={<StudentLessonListPage />}
          handle={studentLessonRouteHandle.list}
          loader={getStudentLessonsLoader(queryClient)}
        />
        <Route
          path=':slug'
          element={<StudentLessonSinglePage />}
          handle={studentLessonRouteHandle.single}
          loader={getStudentLessonBySlugLoader(queryClient)}
        />
      </Route>
      {/* STUDENT EXAMS */}
      <Route path={studentRoutes.exam.to} element={<Outlet />}>
        <Route
          index
          element={<StudentExamListPage />}
          handle={studentExamRouteHandle.list}
          loader={getStudentExamsLoader(queryClient)}
        />
        <Route
          path=':slug'
          element={<StudentExamSinglePage />}
          handle={studentExamRouteHandle.single}
          loader={getStudentExamBySlugLoader(queryClient)}
        />
      </Route>
      {/* STUDENT EXAMS */}
      <Route path={studentRoutes.activity.to} element={<Outlet />}>
        {/* <Route
          index
          element={<StudentActivityListPage />}
          handle={studentActivityRouteHandle.list}
          loader={getStudentActivitiesLoader(queryClient)}
        /> */}
      </Route>
    </Route>
  </>,
);

export const router = createBrowserRouter(rootRoutes);
