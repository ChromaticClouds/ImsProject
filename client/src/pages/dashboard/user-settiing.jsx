/**
 * Components
 */
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
} from '@/components/ui/input-group.js';
import { EmailInput } from '@/features/admin/components/email-input.jsx';

export const UserSetting = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <div className='max-w-sm w-sm flex flex-col gap-3'>
        <Field>
          <FieldLabel htmlFor='block-end-textarea'>이메일 전송</FieldLabel>
          <InputGroup>
            <EmailInput />
            <InputGroupAddon align='block-end'>
              <InputGroupText>0/10</InputGroupText>
              <InputGroupButton
                variant='default'
                size='sm'
                className='ml-auto'
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
    </div>
  );
};
