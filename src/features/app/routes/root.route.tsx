import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';

import { CorePageNotFound } from '#/core/components/core-page-not-found.component';
import { CoreStaticLayout } from '#/core/components/core-static-layout.component';
import { CoreLayout } from '#/core/components/core-layout.component';

// import { AuthProtectedRoute } from './user/components/auth-protected-route.component';

import { HomePage } from '#/static/pages/home.page';
import { AboutPage } from '#/static/pages/about.page';
import { AuthRegisterPage } from '#/user/pages/auth-register.page';

import { dashboardRouteHandle } from '#/dashboard/dashboard-route-handle';
import { DashboardTeacherPage } from '#/dashboard/pages/dashboard-teacher.page';

import { lessonTeacherRouteHandle } from '#/lesson/lesson-route-handle';
import { LessonCreatePage } from '#/lesson/pages/lesson-create.page';
import {
  LessonTeacherListPage,
  loader as lessonTeacherListLoader,
} from '#/lesson/pages/lesson-teacher-list.page';
import { LessonSchedulePage } from '#/lesson/pages/lesson-schedule.page';
import { LessonPreviewPage } from '#/lesson/pages/lesson-preview.page';

import { teacherBaseRoute, teacherRoutes } from './teacher-routes';
import { staticRoutes } from './static-routes';

const rootRoutes = createRoutesFromElements(
  <>
    <Route path='/' element={<CoreStaticLayout />}>
      <Route index element={<HomePage />} />
      <Route path={staticRoutes.about.to} element={<AboutPage />} />
      <Route path={staticRoutes.training.to} element={<TrainingPage />} />
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
          // TODO auth protected
          <Outlet />
        }
      >
        <Route
          index
          element={<DashboardTeacherPage />}
          handle={dashboardRouteHandle}
        />
        <Route path={teacherRoutes.lesson.to} element={<Outlet />}>
          <Route
            index
            element={<LessonTeacherListPage />}
            handle={lessonTeacherRouteHandle.list}
            loader={lessonTeacherListLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.lesson.createTo}
            element={<LessonCreatePage />}
            handle={lessonTeacherRouteHandle.create}
          />
          <Route
            path={teacherRoutes.lesson.scheduleTo}
            element={<LessonSchedulePage />}
            handle={lessonTeacherRouteHandle.schedule}
          />
          <Route
            path={teacherRoutes.lesson.previewTo}
            element={<LessonPreviewPage />}
            handle={lessonTeacherRouteHandle.preview}
          />
        </Route>
        <Route
          path='*'
          element={<CorePageNotFound to={`/${teacherBaseRoute}`} />}
        />
      </Route>
      {/* TODO Student routes */}
    </Route>
  </>,
);

export const router = createBrowserRouter(rootRoutes);

function TrainingPage() {
  return <div>TRAINING PAGE</div>;
}
