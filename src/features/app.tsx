import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useOverlayScrollbars } from 'overlayscrollbars-react';

import { queryClient } from '#/config/react-query-client.config';
import { AuthSessionSubscriber } from './user/components/auth-session-subscriber.component';
import { router } from './app/routes/root.route';
import '#/config/dayjs.config';

export function App() {
  const [initBodyOverlayScrollbars] = useOverlayScrollbars({ defer: true });

  // Inject overlayScrollbars to body
  useEffect(() => {
    initBodyOverlayScrollbars(document.body);
  }, [initBodyOverlayScrollbars]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionSubscriber />
      <RouterProvider router={router} />
      <Toaster containerClassName='mb-12' position='bottom-center' />
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </QueryClientProvider>
  );
}
