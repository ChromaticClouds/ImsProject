/**
 * Components
 */
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
} from '@/components/ui/input-group.js';
import { EmailInput } from '@/features/admin/components/user-setting/email-input.jsx';
import { useEmailSubmit } from '@/features/admin/hooks/use-email-submit.js';

export const EmailForm = () => {
  const { emails, handleEmailSubmit } = useEmailSubmit();

  return (
    <div className='max-w-sm w-sm flex flex-col gap-3'>
      <Field>
        <FieldLabel htmlFor='block-end-textarea'>이메일 전송</FieldLabel>
        <InputGroup>
          <EmailInput />
          <InputGroupAddon align='block-end'>
            <InputGroupText>{emails.length}/10</InputGroupText>
            <InputGroupButton
              variant='default'
              size='sm'
              className='ml-auto'
              onClick={handleEmailSubmit}
            >
              전송
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          전송 버튼을 누를 시 이메일이 바로 전송됩니다.
        </FieldDescription>
      </Field>
    </div>
  );
};
