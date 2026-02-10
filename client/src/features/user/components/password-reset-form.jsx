// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { Field, FieldError, FieldGroup } from '@/components/ui/field.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';
import { Label } from '@/components/ui/label.js';
import { Spinner } from '@/components/ui/spinner.js';

/**
 * Assets
*/
import { Logo } from '@/assets/logo.jsx';
import { EyeOffIcon } from 'lucide-react';
import { EyeIcon } from 'lucide-react';
import { KeyRoundIcon } from 'lucide-react';
import { LockIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useReducer } from 'react';
import { usePasswordResetForm } from '../hooks/use-password-reset-form.js';

export const PasswordResetForm = () => {
  const form = usePasswordResetForm();

  const [newClicked, newDispatch] = useReducer((prev) => !prev, false);
  const [confirmClicked, confirmDispatch] = useReducer((prev) => !prev, false);

  return (
    <div className='flex flex-col gap-6 w-full max-w-sm'>
      <div className='w-full flex justify-center'>
        <Logo />
      </div>
      <Card className='w-sm'>
        <CardHeader>
          <CardTitle>비밀번호 재설정</CardTitle>
          <CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name='newPassword'>
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field>
                      <Label htmlFor={field.name}>새 비밀번호</Label>
                      <InputGroup>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          type={newClicked ? 'text' : 'password'}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          autoComplete='off'
                        />
                        <InputGroupAddon>
                          <LockIcon />
                        </InputGroupAddon>
                        <InputGroupAddon align='inline-end'>
                          {newClicked ? (
                            <EyeOffIcon
                              onClick={newDispatch}
                              className='cursor-pointer'
                            />
                          ) : (
                            <EyeIcon
                              onClick={newDispatch}
                              className='cursor-pointer'
                            />
                          )}
                        </InputGroupAddon>
                      </InputGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name='confirmPassword'>
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field>
                      <Label htmlFor={field.name}>새 비밀번호 확인</Label>
                      <InputGroup>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          type={confirmClicked ? 'text' : 'password'}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          autoComplete='off'
                        />
                        <InputGroupAddon>
                          <KeyRoundIcon />
                        </InputGroupAddon>
                        <InputGroupAddon align='inline-end'>
                          {confirmClicked ? (
                            <EyeOffIcon
                              onClick={confirmDispatch}
                              className='cursor-pointer'
                            />
                          ) : (
                            <EyeIcon
                              onClick={confirmDispatch}
                              className='cursor-pointer'
                            />
                          )}
                        </InputGroupAddon>
                      </InputGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Subscribe
                selector={(s) => [s.canSubmit, s.isTouched, s.isSubmitting]}
              >
                {([canSubmit, isTouched, isSubmitting]) => (
                  <Field>
                    <Button
                      type='submit'
                      disabled={!canSubmit || !isTouched || isSubmitting}
                    >
                      {isSubmitting ? <Spinner /> : '확인'}
                    </Button>
                  </Field>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
