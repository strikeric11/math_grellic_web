import { generateApiError } from '#/utils/api.util';
import { kyInstance } from '#/config/ky.config';
import { queryCoreKey } from '#/config/react-query-keys.config';

import type { UseQueryOptions } from '@tanstack/react-query';

const BASE_URL = 'core';

export function getDateTimeNow(
  options?: Omit<
    UseQueryOptions<Date | null, Error, Date | null, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/now`;

    try {
      const dateTime = await kyInstance.get(url).json();
      return dateTime;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: queryCoreKey.time,
    queryFn,
    ...options,
  };
}
