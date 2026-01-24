// @ts-check

import { LoginField } from '@/features/auth/components/login-field.jsx';
import { useAuthContext } from '@/features/auth/components/auth-provider.jsx';
import { RegisterField } from '@/features/auth/components/register-field.jsx';
import { AUTH_FIELD_MAP } from '@/features/auth/constants/index.jsx';

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
            />
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
