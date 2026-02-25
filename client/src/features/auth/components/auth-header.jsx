// @ts-check

/**
 * Components
 */
import { Logo } from '@/assets/logo.jsx';
import { Button } from '@/components/ui/button.js';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { useAuthContext } from '@/features/auth/providers/auth-provider.jsx';
import { AUTH_HEADER_MAP } from '@/features/auth/constants/index.js';

/**
 * Hooks
 */
import { useNavigate } from 'react-router-dom';

/**
 * @param {React.PropsWithChildren} props
 */
export const AuthHeader = ({ children }) => {
  const { mode } = useAuthContext();
  const navigate = useNavigate();

  const { title, description, buttonText } = AUTH_HEADER_MAP[mode];

  return (
    <div className='flex flex-col gap-6 w-full max-w-sm'>
      <div className='w-full flex justify-center'>
        <Logo />
      </div>
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-6'>
            <h2 className='text-3xl font-bold'>{mode.toUpperCase()}</h2>
            <div className='flex flex-col gap-2'>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <CardAction>
            {mode === 'register' && (
              <Button
                variant='link'
                className='cursor-pointer'
                onClick={() => navigate('/login')}
              >
                {buttonText}
              </Button>
            )}
          </CardAction>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};
