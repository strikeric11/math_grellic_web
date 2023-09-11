[
  {
    name: '',
    to: '/about',
    label: 'About Math Grellic',
  },
  {
    name: 'training',
    to: '/training',
    label: 'Training',
  },
];

export const staticRoutes = {
  about: {
    name: 'about',
    to: 'about',
    label: 'About Math Grellic',
  },
  training: {
    name: 'training',
    to: 'training',
    label: 'Training',
  },
  authRegister: {
    name: 'register',
    to: 'auth/register',
    label: 'Register',
  },
};

export const staticRouteLinks = [staticRoutes.about, staticRoutes.training];
