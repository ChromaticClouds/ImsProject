import { Button } from '@/components/ui/button.js';
import { CardFooter } from '@/components/ui/card.js';
import { useAuthContext } from '@/features/auth/components/auth-provider.jsx';

/**
 * @typedef {'login' | 'register'} AuthActionType
 */

/**
 * @param {{ type: AuthActionType }} props
 */
export const AuthActionButton = () => {
  const { mode } = useAuthContext();

  return (
    <CardFooter className='flex-col gap-2'>
      <Button
        type='submit'
        className='w-full cursor-pointer'
        form={mode === 'login' ? 'login' : 'register'}
      >
        로그인
      </Button>
    </CardFooter>
  );
};
