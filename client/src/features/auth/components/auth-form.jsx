// @ts-check

/**
 * Hooks
 */
import { useNavigate } from 'react-router-dom';
import { useAuthForm } from '@/features/auth/hooks/use-auth-form.js';

/**
 * Components
 */
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.js';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { Field, FieldError, FieldGroup } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';

export const AuthForm = () => {
  const { login: form } = useAuthForm();
  
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-6 w-full max-w-sm'>
      <p className='text-center text-3xl font-bold'></p>
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-6'>
            <h2 className='text-3xl'>로그인</h2>
            <div className='flex flex-col gap-2'>
              <CardTitle>로그인 해주세요</CardTitle>
              <CardDescription>
                아래에 사원번호와 비밀번호를 입력해주세요
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <Button
              variant='link'
              className='cursor-pointer'
              onClick={() => navigate('/register')}
            >
              회원가입 하기
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            id='login'
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <div className='flex flex-col gap-6'>
                <form.Field name='eid'>
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <Label htmlFor={field.name}>사원번호</Label>
                        <Input
                          name={field.name}
                          type='text'
                          placeholder='Ex) 1997001'
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name='password'>
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <div className='flex items-center'>
                          <Label htmlFor={field.name}>비밀번호</Label>
                          <Link
                            to='/forgot-password'
                            className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                          >
                            비밀번호를 잊으셨나요?
                          </Link>
                        </div>
                        <Input
                          name={field.name}
                          type='password'
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className='flex-col gap-2'>
          <Button
            type='submit'
            className='w-full cursor-pointer'
            form='login'
          >
            로그인
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
