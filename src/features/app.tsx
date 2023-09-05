import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { router } from './routes';
import { queryClient } from './core/config/react-query-client.config';
import { AuthSessionSubscriber } from './user/components/auth-session-subscriber.component';
import '#/core/config/dayjs.config';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionSubscriber />
      <RouterProvider router={router} />
      <Toaster position='bottom-center' />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
