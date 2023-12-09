import { useMemo } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { TeacherDashboardUserSummary } from '../components/teacher-dashboard-user-summary.component';

import type { TeacherUserAccount } from '#/user/models/user.model';

export function TeacherDashboardPage() {
  const user = useBoundStore((state) => state.user);

  const userAccount = useMemo(
    () => user?.userAccount as TeacherUserAccount | undefined,
    [user],
  );

  return (
    <div>
      <TeacherDashboardUserSummary
        userAccount={userAccount}
        loading={!userAccount}
      />
    </div>
  );
}
