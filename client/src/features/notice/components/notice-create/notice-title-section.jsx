import { Input } from '@/components/ui/input.js';
import { InlineFieldErrorMessage } from '@/features/notice/components/notice-create/field-error-message.jsx';
import { FieldLabel } from '@/features/notice/components/notice-create/field-label.jsx';

/**
 * @param {{
 *   form: ReturnType<import('@/features/notice/hooks/use-notice-form').useNoticeForm>;
 *   maxLength: number;
 * }} props
 */
export const NoticeTitleSection = ({ form, maxLength }) => {
  return (
    <form.AppField name='title'>
      {(field) => {
        const errorId = `${field.name}-error`;
        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
        const error = field.state.meta.errors[0]?.message;
        const isNearLimit = maxLength - field.state.value.length <= 10;

        return (
          <div className='space-y-1.5'>
            <div className='flex items-center gap-2'>
              <FieldLabel
                htmlFor={field.name}
                label='제목'
                required
              />
              <InlineFieldErrorMessage
                id={errorId}
                message={isInvalid ? error : undefined}
              />
            </div>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(e) => {
                if (e.target.value.length > maxLength) return;
                field.handleChange(e.target.value);
              }}
              onBlur={field.handleBlur}
              placeholder='공지사항 제목을 입력하세요'
              aria-required='true'
              aria-invalid={isInvalid}
              aria-describedby={isInvalid ? errorId : undefined}
              className={
                isInvalid
                  ? 'border-destructive focus-visible:ring-destructive/30'
                  : ''
              }
            />
            <div
              className={[
                'text-right text-xs tabular-nums',
                isNearLimit ? 'text-orange-500' : 'text-muted-foreground',
              ].join(' ')}
              aria-live='polite'
            >
              {field.state.value.length.toLocaleString()} /{' '}
              {maxLength.toLocaleString()}
            </div>
          </div>
        );
      }}
    </form.AppField>
  );
};
