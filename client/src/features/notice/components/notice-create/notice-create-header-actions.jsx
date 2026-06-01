import { Button } from '@/components/ui/button.js';

/**
 * @typedef {object} NoticeCreateHeaderActionsProps
 * @property {() => void} onCancel
 * @property {boolean} isSubmitting
 * @property {React.Node} [submitLabel]
 * @property {React.Node} [submittingLabel]
 */

/**
 * @param {NoticeCreateHeaderActionsProps} props
 */
export const NoticeCreateHeaderActions = ({
  onCancel,
  isSubmitting = false,
  submitLabel = '등록',
  submittingLabel = '등록 중…',
}) => {
  return (
    <div className='flex items-center gap-2'>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isSubmitting}
      >
        취소
      </Button>
      <Button
        type='submit'
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </div>
  );
};
