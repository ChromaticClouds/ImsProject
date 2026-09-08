import { BackGround } from '@/components/common/background.js';

import { EmailFormContainer } from '@/features/user/components/email-form-container.jsx';
import { EmailValidateForm } from '@/features/user/components/email-validate-form.jsx';

export const ForgotPassword = () => {
  return (
    <BackGround variant='center'>
      <EmailFormContainer>
        <EmailValidateForm />
      </EmailFormContainer>
    </BackGround>
  );
};
