// @ts-check

import { Button } from '@/components/ui/button.js';
import { CardContent, CardFooter } from '@/components/ui/card.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';
import { MailIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmailForm } from '../hooks/use-email-form.js';
import { Field, FieldError, FieldGroup } from '@/components/ui/field.js';

export const EmailValidateForm = () => {
  const form = useEmailForm();
  const navigate = useNavigate();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      <form.Field name='email'>
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <FieldGroup>
              <CardContent>
                <Field>
                  <InputGroup>
                    <InputGroupInput
                      placeholder='m@example.com'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <InputGroupAddon>
                      <MailIcon />
                    </InputGroupAddon>
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              </CardContent>
              <CardFooter>
                <div className='w-full flex flex-col gap-3'>
                  <form.Subscribe
                    selector={(s) => [s.canSubmit, s.isTouched, s.isSubmitting]}
                  >
                    {([canSubmit, isTouched, isSubmitting]) => (
                      <Button
                        type='submit'
                        disabled={!canSubmit || !isTouched || isSubmitting}
                      >
                        이메일 제출
                      </Button>
                    )}
                  </form.Subscribe>
                  <Button
                    variant='outline'
                    type='button'
                    onClick={() => navigate('/login')}
                  >
                    돌아가기
                  </Button>
                </div>
              </CardFooter>
            </FieldGroup>
          );
        }}
      </form.Field>
    </form>
  );
};
