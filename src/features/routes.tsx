import {
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
      <Route index element={<DashboardPage />} />
    </Route>
  </>,
);

export const router = createBrowserRouter(rootRoutes);

function TrainingPage() {
  return <div>TRAINING PAGE</div>;
}

function DashboardPage() {
  return <div>DASHBOARD PAGE</div>;
}
