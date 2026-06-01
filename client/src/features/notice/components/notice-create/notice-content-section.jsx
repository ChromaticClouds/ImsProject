import { Textarea } from '@/components/ui/textarea.js';
import { InlineFieldErrorMessage } from '@/features/notice/components/notice-create/field-error-message.jsx';
import { FieldLabel } from '@/features/notice/components/notice-create/field-label.jsx';

/**
 * @param {{
 *   form: ReturnType<import('@/features/notice/hooks/use-notice-form').useNoticeForm>;
 *   maxLength: number;
 * }} props
 */
export const NoticeContentSection = ({
  form,
  maxLength,
}) => {
  return (
    <form.AppField name='content'>
      {(field) => {
        const errorId = `${field.name}-error`;
        const countId = `${field.name}-count`;
        const contentLeft = maxLength - field.state.value.length;
        const isNearLimit = contentLeft <= 200;
        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
        const error = field.state.meta.errors[0]?.message;

        return (
          <div className='space-y-1.5'>
            <div className='flex items-center gap-2'>
              <FieldLabel
                htmlFor={field.name}
                label='내용'
                required
              />
              <InlineFieldErrorMessage
                id={errorId}
                message={isInvalid ? error : undefined}
              />
            </div>
            <Textarea
              id={field.name}
              value={field.state.value}
              onChange={(e) => {
                if (e.target.value.length > maxLength) return;
                field.handleChange(e.target.value);
              }}
              onBlur={field.handleBlur}
              placeholder='공지 내용을 입력하세요'
              rows={6}
              aria-required='true'
              aria-invalid={isInvalid}
              aria-describedby={
                [isInvalid ? errorId : '', countId].filter(Boolean).join(' ') ||
                undefined
              }
              className={[
                'resize-none',
                isInvalid
                  ? 'border-destructive focus-visible:ring-destructive/30'
                  : '',
              ].join(' ')}
            />
            <div
              id={countId}
              className={[
                'text-right text-xs tabular-nums',
                isNearLimit ? 'text-orange-500' : 'text-muted-foreground',
              ].join(' ')}
              aria-live='polite'
              aria-label={`남은 글자 수 ${contentLeft}자`}
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
