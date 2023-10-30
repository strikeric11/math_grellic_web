import { Suspense, memo } from 'react';
import { Await } from 'react-router-dom';

import { BaseSpinner } from './base-spinner.component';

import type { ReactNode } from 'react';
import type { AwaitProps } from 'react-router-dom';

type Props = {
  resolve: AwaitProps['resolve'];
  errorMessage?: string;
  fallback?: ReactNode;
  children?: ReactNode;
};

const SuspenseFallback = memo(function () {
  return (
    <div className='flex w-full items-center justify-center px-4 py-20'>
      <BaseSpinner />
    </div>
  );
});

const AwaitError = memo(function ({ message }: { message?: string }) {
  return (
    <div className='flex w-full items-center justify-center px-4 py-20'>
      <span className='text-lg font-medium'>
        {message || "We've encountered an error. Please reload page."}
      </span>
    </div>
  );
});

export function BaseDataSuspense({
  resolve,
  errorMessage,
  fallback = <SuspenseFallback />,
  children,
}: Props) {
  return (
    <Suspense fallback={fallback}>
      <Await
        resolve={resolve}
        errorElement={<AwaitError message={errorMessage} />}
      >
        {children}
      </Await>
    </Suspense>
  );
}
