import cx from 'classix';

import { BaseStaticScene } from '#/base/components/base-static-scene.component';
import { useAuthRegister } from '../hooks/use-auth-register.hook';
import { useAuth } from '../hooks/use-auth.hook';
import { AuthRegisterDone } from '../components/auth-register-done.component';
import { AuthRegisterForm } from '../components/auth-register-form.component';
import { AuthRegisterRoleTab } from '../components/auth-register-role-tab.component';

export function AuthRegisterPage() {
  const {
    loading,
    isDone,
    setIsDone,
    selectedUserRole,
    handleRoleChange,
    handleLogin,
  } = useAuthRegister();

  const { register } = useAuth();

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
                  onSubmit={register}
                />
              </>
            )}
          </div>
        )}
      </section>
    </BaseStaticScene>
  );
}
