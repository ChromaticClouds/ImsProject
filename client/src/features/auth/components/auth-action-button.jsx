// @ts-check

import { Button } from '@/components/ui/button.js';
import { CardFooter } from '@/components/ui/card.js';
import { Spinner } from '@/components/ui/spinner.js';
import { useAuthContext } from '@/features/auth/providers/auth-provider.jsx';

export const AuthActionButton = () => {
  const { form, mode } = useAuthContext();

  const buttonText = mode === 'login' ? '로그인' : '회원가입';

  return mode === 'register' ? (
    <form.Subscribe
      selector={(state) => [
        state.canSubmit,
        state.isSubmitting,
        state.isTouched,
      ]}
    >
      {([canSubmit, isSubmitting, isTouched]) => (
        <CardFooter className='flex-col gap-2'>
          <Button
            type='submit'
            form='register'
            disabled={!canSubmit || isSubmitting || !isTouched}
            className='w-full'
          >
            {isSubmitting ? <Spinner /> : buttonText}
          </Button>
        </CardFooter>
      )}
    </form.Subscribe>
  ) : (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <CardFooter className='flex-col gap-2'>
          <Button
            type='submit'
            form='login'
            className='w-full'
          >
            {isSubmitting ? <Spinner /> : buttonText}
          </Button>
        </CardFooter>
      )}
    </form.Subscribe>
  );
};
