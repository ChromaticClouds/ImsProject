import { Field, FieldError } from '@/components/ui/field.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group.js';
import { FileCodeIcon } from 'lucide-react';
import { useAdjustContext } from '../providers/adjust-provider.jsx';
import { AdjustStatementDialog } from './adjust-statement-dialog.jsx';

export const AdjustBottomSection = () => {
  const { form } = useAdjustContext();

  return (
    <Field className='flex flex-col gap-6'>
      <form.Field name='memo'>
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <>
              <InputGroup className='h-auto rounded-xl'>
                <InputGroupTextarea
                  id='block-start-textarea'
                  placeholder='조정 사유를 입력해주세요'
                  className='min-h-32 resize-none'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <InputGroupAddon align='block-start'>
                  <FileCodeIcon className='text-muted-foreground' />
                  <InputGroupText>조정 사유</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </>
          );
        }}
      </form.Field>
      
      <AdjustStatementDialog />
    </Field>
  );
};
