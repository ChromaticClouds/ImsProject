/**
 * Components
 */
import { BackGround } from '@/components/common/background.js';
import { AuthForm } from '@/features/auth/components/auth-form.jsx';
import { AuthGuardResolver } from '@/features/auth/providers/auth-guard-resolver.jsx';
import { AuthProvider } from '@/features/auth/providers/auth-provider.jsx';

export const Auth = () => {
  return (
    <BackGround variant='center'>
      <AuthGuardResolver>
        {({ mode }) => {
          return (
            <AuthProvider mode={mode}>
              <AuthForm />
            </AuthProvider>
          );
        }}
      </AuthGuardResolver>
    </BackGround>
  );
};
