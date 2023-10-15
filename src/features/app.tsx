import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import t, { Toaster, useToasterStore } from 'react-hot-toast';
import { useOverlayScrollbars } from 'overlayscrollbars-react';

import { queryClient } from '#/config/react-query-client.config';
import { AuthSessionSubscriber } from './user/components/auth-session-subscriber.component';
import { router } from './app/routes/root.route';
import '#/config/dayjs.config';

const TOAST_LIMIT = 3;

export function App() {
  const [initBodyOverlayScrollbars] = useOverlayScrollbars({ defer: true });
  const { toasts } = useToasterStore();

  // Inject overlayScrollbars to body
  useEffect(() => {
    initBodyOverlayScrollbars(document.body);
  }, [initBodyOverlayScrollbars]);

  // Limit max visible toast
  useEffect(() => {
    toasts
      .filter((toast) => toast.visible)
      .filter((_, index) => index >= TOAST_LIMIT)
      .forEach((toast) => t.dismiss(toast.id));
  }, [toasts]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionSubscriber />
      <RouterProvider router={router} />
      <Toaster containerClassName='mb-12' position='bottom-center' />
    </QueryClientProvider>
  );
}
