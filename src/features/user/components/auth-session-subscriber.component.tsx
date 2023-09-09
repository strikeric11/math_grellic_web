import { memo, useEffect } from 'react';

import { supabase } from '#/config/supabase-client.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useAuth } from '../hooks/use-auth.hook';

export const AuthSessionSubscriber = memo(function () {
  const { getUser } = useAuth();
  const setUser = useBoundStore((state) => state.setUser);
  const user = useBoundStore((state) => state.user);

  useEffect(() => {
    // Check auth session
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== 'INITIAL_SESSION') {
        return;
      }

      if (!session) {
        setUser();
        return;
      } else if (user) {
        return;
      }

      getUser();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
});
