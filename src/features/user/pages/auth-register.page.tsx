import cx from 'classix';

import { useAuthRegisterPage } from '#/user/hooks/use-auth-register-page.hook';
import { BaseStaticScene } from '#/base/components/base-static-scene.component';
import { AuthRegisterDone } from '#/user/components/auth-register-done.component';
import { AuthRegisterForm } from '#/user/components/auth-register-form.component';
import { AuthRegisterRoleTab } from '#/user/components/auth-register-role-tab.component';

export function AuthRegisterPage() {
  const {
    loading,
    isDone,
    setIsDone,
    selectedUserRole,
    handleRoleChange,
    handleLogin,
  } = useAuthRegisterPage();

  return (
    <BaseStaticScene id='auth-register'>
      <section className='mx-auto w-full max-w-[966px] pt-4'>
        {/* // TODO show loading spinner */}
        {!loading && !!selectedUserRole && (
          <div
            className={cx(
              'flex flex-col items-start justify-start rounded-b-20px rounded-t-lg bg-backdrop/50 pb-12',
              isDone && '!rounded-t-20px',
            )}
          >
            {isDone ? (
              <AuthRegisterDone />
            ) : (
              <>
                <AuthRegisterRoleTab
                  className='mb-12 overflow-hidden rounded-t-lg'
                  userRole={selectedUserRole}
                  isDone={isDone}
                  onChange={handleRoleChange}
                  onLogin={handleLogin}
                />
                <AuthRegisterForm
                  className='px-4 lg:px-11'
                  userRole={selectedUserRole}
                  isDone={isDone}
                  onDone={setIsDone}
                />
              </>
            )}
          </div>
        )}
      </section>
    </BaseStaticScene>
  );
}
