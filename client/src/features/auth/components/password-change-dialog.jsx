// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.js';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';

/**
 * Assets
 */
import { LockIcon } from 'lucide-react';
import { usePasswordForm } from '../hooks/use-password-form.js';

export const PasswordChangeDialog = () => {
  const form = usePasswordForm();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='justify-start'
        >
          <LockIcon />
          <span>비밀번호 변경</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='w-sm'>
        <DialogHeader>
          <DialogTitle>비밀번호를 바꿔주세요</DialogTitle>
          <DialogDescription>
            현재 비밀번호와 새 비밀번호를 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <form>
          <FieldGroup>
            <form.Field name='currentPassword'>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>기존 비밀번호</FieldLabel>
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
            <form.Field name='newPassword'>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>새 비밀번호</FieldLabel>
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
            <form.Field name='confirmPassword'>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      새 비밀번호 확인
                    </FieldLabel>
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
          </FieldGroup>
        </form>

        <div className='w-full flex justify-between gap-3'>
          <Button className='flex-1'>완료</Button>
          <DialogClose asChild>
            <Button
              variant='secondary'
              className='flex-1'
            >
              취소
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
