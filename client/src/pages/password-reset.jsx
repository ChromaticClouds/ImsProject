import { BackGround } from '@/components/common/background.js';
import { PasswordResetForm } from '@/features/user/components/password-reset-form.jsx';
import { TokenGuard } from '@/features/user/providers/token-gaurd.jsx';

export const PasswordReset = () => {
  return (
    <TokenGuard>
      <BackGround variant='center'>
        <PasswordResetForm />
      </BackGround>
    </TokenGuard>
  );
};
