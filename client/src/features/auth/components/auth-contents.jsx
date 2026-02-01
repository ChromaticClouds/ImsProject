// @ts-check

import { LoginField } from '@/features/auth/components/login-field.jsx';
import { useAuthContext } from '@/features/auth/providers/auth-provider.jsx';
import { RegisterField } from '@/features/auth/components/register-field.jsx';
import { AUTH_FIELD_MAP } from '@/features/auth/constants/index.jsx';
import { Label } from '@/components/ui/label.js';
import { Link } from 'react-router-dom';

export const AuthContents = () => {
  const { mode, form } = useAuthContext();

  return (
    <div className='flex flex-col gap-6'>
      {mode === 'login'
        ? AUTH_FIELD_MAP['login'].map((field) => (
            <LoginField
              key={field.name}
              form={form}
              name={field.name}
              type={field.type}
              label={field.label}
            >
              {field.type === 'password' && (
                <div className='flex items-center'>
                  <Label htmlFor='password'>{field.label}</Label>
                  <Link
                    to='/forgot-password'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>
              )}
            </LoginField>
          ))
        : AUTH_FIELD_MAP['register'].map((field) => (
            <RegisterField
              key={field.name}
              form={form}
              name={field.name}
              type={field.type}
              label={field.label}
            />
          ))}
    </div>
  );
};
