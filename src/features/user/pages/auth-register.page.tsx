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
      <section className='mx-auto w-full max-w-full pt-4 lg:max-w-[966px]'>
        {/* // TODO show loading spinner */}
        {!loading && !!selectedUserRole && (
          <div
            className={cx(
              'flex flex-col items-start justify-start rounded-none bg-backdrop/50 pb-12 lg:rounded-b-20px',
              isDone ? 'lg:rounded-t-20px' : 'lg:rounded-t-lg',
            )}
          >
            {isDone ? (
              <AuthRegisterDone />
            ) : (
              <>
                <AuthRegisterRoleTab
                  className='lg-rounded-t-lg mb-12 overflow-hidden rounded-t-none'
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
