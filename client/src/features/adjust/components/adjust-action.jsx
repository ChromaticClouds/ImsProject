import { Button } from '@/components/ui/button.js';
import { Field } from '@/components/ui/field.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group.js';
import { useAdjustFormStore } from '@/features/adjust/stores/use-adjust-form-store.js';
import { FileCodeIcon } from 'lucide-react';

export const AdjustAction = () => {
  const setMemo = useAdjustFormStore((s) => s.setMemo);
  const memo = useAdjustFormStore((s) => s.memo);

  return (
    <Field className='flex flex-col gap-6'>
      <InputGroup className='h-auto rounded-xl'>
        <InputGroupTextarea
          id='block-start-textarea'
          placeholder='조정 사유를 입력해주세요'
          className="min-h-32 resize-none"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
        <InputGroupAddon align='block-start'>
          <FileCodeIcon className='text-muted-foreground' />
          <InputGroupText>조정 사유</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex justify-end">
        <Button>조정 하기</Button>
      </div>
    </Field>
  );
};
