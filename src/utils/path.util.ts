export const ABSOLUTE_REGISTER_PATH = '/auth/register';

export const DASHBOARD_PATH = '/dashboard';

export const LESSONS_PATH = `${DASHBOARD_PATH}/lessons`;

export const interceptGetStarted = (pathname: string) => {
  // If already on register page, just scroll to top
  if (pathname !== ABSOLUTE_REGISTER_PATH) {
    return;
  }

  !!window && window.scrollTo({ top: 0, behavior: 'smooth' });
};
