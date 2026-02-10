import { Logo } from '@/assets/logo.jsx';
import { BackGround } from '@/components/common/background.js';
import { Button } from '@/components/ui/button.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';
import { EmailFormContainer } from '@/features/user/components/email-form-container.jsx';
import { EmailValidateForm } from '@/features/user/components/email-validate-form.jsx';
import { MailIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <BackGround variant='center'>
      <EmailFormContainer>
        <EmailValidateForm />
      </EmailFormContainer>
    </BackGround>
  );
};
