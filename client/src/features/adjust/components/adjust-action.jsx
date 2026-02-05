import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.js";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group.js";

export const AdjustAction = () => {
  return (
    <Field>
      <InputGroup className='h-auto'>
        <InputGroupInput
          id='block-start-input'
          placeholder='조정 사유를 입력해주세요'
        />
        <InputGroupAddon align='block-start'>
          <InputGroupText>조정 사유</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Header positioned above the input.</FieldDescription>
    </Field>
  );
};
