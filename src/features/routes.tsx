import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { CoreStaticLayout } from './core/components/core-static-layout.component';
import { CoreLayout } from './core/components/core-layout.component';
import { CorePageNotFound } from './core/components/core-page-not-found.component';

import { HomePage } from './static/pages/home.page';
import { AboutPage } from './static/pages/about.page';
import { AuthRegisterPage } from './user/pages/auth-register.page';

import { dashboardRouteHandle } from './dashboard/dashboard-route-handle';
import { DashboardPage } from './dashboard/pages/dashboard.page';

import { lessonRouteHandle } from './lesson/lesson-route-handle';
import { LessonCreatePage } from './lesson/pages/lesson-create.page';
import { LessonListPage } from './lesson/pages/lesson-list.page';
import { LessonSchedulePage } from './lesson/pages/lesson-schedule.page';

const rootRoutes = createRoutesFromElements(
  <>
    <Route path='/' element={<CoreStaticLayout />}>
      <Route index element={<HomePage />} />
      <Route path='about' element={<AboutPage />} />
      <Route path='training' element={<TrainingPage />} />
      <Route path='auth/register' element={<AuthRegisterPage />} />
      <Route path='*' element={<CorePageNotFound />} />
    </Route>
    {/* // TODO dashboard layout */}
    <Route path='/dashboard' element={<CoreLayout />}>
      <Route index element={<DashboardPage />} handle={dashboardRouteHandle} />
      <Route path='lessons' element={<Outlet />}>
        <Route
          index
          element={<LessonListPage />}
          handle={lessonRouteHandle.list}
        />
        <Route
          path='create'
          element={<LessonCreatePage />}
          handle={lessonRouteHandle.create}
        />
        <Route
          path='schedule'
          element={<LessonSchedulePage />}
          handle={lessonRouteHandle.schedule}
        />
      </Route>
      <Route path='*' element={<CorePageNotFound />} />
    </Route>
  </>,
);

export const router = createBrowserRouter(rootRoutes);

function TrainingPage() {
  return <div>TRAINING PAGE</div>;
}
