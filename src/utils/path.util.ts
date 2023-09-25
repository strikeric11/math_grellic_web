import { staticRoutes } from '#/app/routes/static-routes';
import { studentBaseRoute } from '#/app/routes/student-routes';
import { teacherBaseRoute } from '#/app/routes/teacher-routes';
import { UserRole } from '#/user/models/user.model';

export function interceptGetStarted(pathname: string) {
  // If already on register page, just scroll to top
  if (pathname !== `/${staticRoutes.authRegister.to}`) {
    return;
  }

  !!window && window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function generateDashboardPath(role: UserRole) {
  switch (role) {
    case UserRole.Teacher:
      return `/${teacherBaseRoute}`;
    case UserRole.Student:
      return `/${studentBaseRoute}`;
    case UserRole.Admin:
      // TODO admin path
      return '';
  }
}
