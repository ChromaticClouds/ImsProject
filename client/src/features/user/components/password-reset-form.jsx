import { Button } from '@/components/ui/button.js';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { Field, FieldGroup } from '@/components/ui/field.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';
import { Label } from '@/components/ui/label.js';
import { EyeIcon } from 'lucide-react';
import { LockIcon } from 'lucide-react';
import { VaultIcon } from 'lucide-react';

export const PasswordResetForm = () => {
  return (
    <Card className='w-sm'>
      <CardHeader>
        <CardTitle>비밀번호 재설정</CardTitle>
        <CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <Label htmlFor='password'>새 비밀번호</Label>
              <InputGroup>
                <InputGroupInput
                  id='password'
                  type='password'
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <Label htmlFor='confirm-password'>새 비밀번호 확인</Label>
              <InputGroup>
                <InputGroupInput
                  id='confirm-password'
                  type='confirm-password'
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <EyeIcon />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
