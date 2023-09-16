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

import { dashboardRouteHandle } from '#/dashboard/dashboard-route-handle';
import { TeacherDashboardPage } from '#/dashboard/pages/teacher-dashboard.page';

import { teacherLessonRouteHandle } from '#/lesson/lesson-route-handle';
import { LessonCreatePage } from '#/lesson/pages/lesson-create.page';
import {
  getPaginatedLessonsLoader,
  getLessonBySlugLoader,
} from '#/lesson/lesson-route-loader';
import { TeacherLessonListPage } from '#/lesson/pages/teacher-lesson-list.page';
import { TeacherLessonSinglePage } from '#/lesson/pages/teacher-lesson-single.page';
import { TeacherLessonScheduleListPage } from '#/lesson/pages/teacher-lesson-schedule-list.page';
import { TeacherLessonScheduleCreatePage } from '#/lesson/pages/teacher-lesson-schedule-create.page';
import { TeacherLessonScheduleEditPage } from '#/lesson/pages/teacher-lesson-schedule-edit.page';
import { LessonPreviewSlugPage } from '#/lesson/pages/lesson-preview-slug.page';
import { LessonPreviewPage } from '#/lesson/pages/lesson-preview.page';
import { LessonEditPage } from '#/lesson/pages/lesson-edit.page';

import { staticRoutes } from './static-routes';
import { teacherBaseRoute, teacherRoutes } from './teacher-routes';
import { studentBaseRoute } from './student-routes';

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
    <Route element={<CoreLayout />}>
      {/* Teacher routes */}
      <Route
        path={teacherBaseRoute}
        element={
          <AuthProtectedRoute roles={[UserRole.Teacher]}>
            <Outlet />
          </AuthProtectedRoute>
        }
      >
        <Route
          index
          element={<TeacherDashboardPage />}
          handle={dashboardRouteHandle}
        />
        <Route path={teacherRoutes.lesson.to} element={<Outlet />}>
          <Route
            index
            element={<TeacherLessonListPage />}
            handle={teacherLessonRouteHandle.list}
            loader={getPaginatedLessonsLoader(queryClient)}
          />
          <Route path=':slug' element={<Outlet />}>
            <Route
              index
              element={<TeacherLessonSinglePage />}
              handle={teacherLessonRouteHandle.single}
              loader={getLessonBySlugLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.lesson.editTo}
              element={<LessonEditPage />}
              handle={teacherLessonRouteHandle.edit}
              loader={getLessonBySlugLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.lesson.previewTo}
              element={<LessonPreviewSlugPage />}
              handle={teacherLessonRouteHandle.preview}
              loader={getLessonBySlugLoader(queryClient, {
                exclude: 'schedules',
              })}
            />
            <Route
              path={`${teacherRoutes.lesson.schedule.to}`}
              element={<TeacherLessonScheduleListPage />}
              handle={teacherLessonRouteHandle.schedule}
              loader={getLessonBySlugLoader(queryClient, {
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
        <Route
          path='*'
          element={<CorePageNotFound to={`/${teacherBaseRoute}`} />}
          handle={coreRouteHandle.notFound}
        />
      </Route>
      {/* TODO Student routes */}
      <Route
        path={studentBaseRoute}
        element={
          <AuthProtectedRoute roles={[UserRole.Student]}>
            <Outlet />
          </AuthProtectedRoute>
        }
      ></Route>
    </Route>
  </>,
);

export const router = createBrowserRouter(rootRoutes);
