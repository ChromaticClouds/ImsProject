/**
 * Components
 */
import { BackGround } from '@/components/common/background.js';
import { AuthForm } from '@/features/auth/components/auth-form.jsx';

export const Auth = () => {
  return (
    <BackGround variant='center'>
      <AuthForm />
    </BackGround>
  );
};
