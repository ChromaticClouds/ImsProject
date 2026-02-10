import { TableCell } from '@/components/ui/table.js';
import { useOrderPostContext } from '../providers/receive-order-post-provider.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.js';
import { Input } from '@/components/ui/input.js';

/**
 * @param {{ product: OrderPostProduct & { amount: number}, index: number }} props
 */
export const AmountFieldCell = ({ product, index }) => {
  const { form } = useOrderPostContext();

  return (
    <form.Field name={`products[${index}].amount`}>
      {(amountField) => {
        const { isTouched, isValid, errors } = amountField.state.meta;

        const showError = isTouched && !isValid;

        return (
          <TableCell className='text-center w-20'>
            <TooltipProvider>
              <Tooltip open={showError}>
                <TooltipTrigger asChild>
                  <Input
                    value={product.amount}
                    onChange={(e) => {
                      amountField.handleChange(Number(e.target.value) || 0);
                    }}
                    aria-invalid={showError}
                    className={[
                      'w-20 text-center',
                      showError
                        ? 'border-destructive focus-visible:ring-destructive'
                        : '',
                    ].join(' ')}
                  />
                </TooltipTrigger>

                {showError && (
                  <TooltipContent side='bottom'>
                    <p className='text-sm text-destructive'>
                      {errors[0]?.message}
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </TableCell>
        );
      }}
    </form.Field>
  );
};
