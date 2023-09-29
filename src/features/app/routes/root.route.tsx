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
import { studentLessonRouteHandle } from '#/lesson/route/student-lesson-handle.route';
import { LessonCreatePage } from '#/lesson/pages/lesson-create.page';
import {
  getPaginatedLessonsLoader as getTeacherPaginatedLessonsLoader,
  getLessonBySlugLoader as getTeacherLessonBySlugLoader,
} from '#/lesson/route/teacher-lesson-loader.route';
import {
  getLessonsLoader as getStudentLessonsLoader,
  getLessonBySlugLoader as getStudentLessonBySlugLoader,
} from '#/lesson/route/student-lesson-loader.route';
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
import { ExamCreatePage } from '#/exam/pages/exam-create.page';
import { ExamPreviewPage } from '#/exam/pages/exam-preview.page';

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
        element={<CorePageNotFound linkLabel='Return to home' />}
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
        <Route path={teacherRoutes.lesson.previewTo} element={<Outlet />}>
          <Route
            index
            element={<LessonPreviewPage />}
            handle={teacherLessonRouteHandle.preview}
          />
        </Route>
      </Route>
      {/* TEACHER EXAMS */}
      <Route path={teacherRoutes.exam.to} element={<Outlet />}>
        {/* TODO list */}
        <Route
          index
          element={<TeacherExamListPage />}
          handle={teacherExamRouteHandle.list}
          // loader={getTeacherPaginatedExamsLoader(queryClient)}
        />
        {/* TODO slug */}
        <Route
          path={teacherRoutes.exam.createTo}
          element={<ExamCreatePage />}
          handle={teacherExamRouteHandle.create}
        />
        <Route path={teacherRoutes.exam.previewTo} element={<Outlet />}>
          <Route
            index
            element={<ExamPreviewPage />}
            handle={teacherExamRouteHandle.preview}
          />
        </Route>
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
    </Route>
  </>,
);

export const router = createBrowserRouter(rootRoutes);
