import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';

/**
 * @typedef {'third' | 'wide' | 'full'} GraphWidth
 * @typedef {'sm' | 'md' | 'lg'} GraphHeight
 *
 * @typedef {object} GraphContainerProps
 * @property {string} title
 * @property {string} [description]
 * @property {React.ReactNode} children
 * @property {React.ReactNode} [headerAction]
 * @property {GraphWidth} [width]
 * @property {GraphHeight} [height]
 */

const WIDTH_CLASS = {
  third: 'col-span-10 lg:col-span-3 overflow-hidden overflow-x-auto',
  wide: 'col-span-10 lg:col-span-7 overflow-hidden overflow-x-auto',
  full: 'col-span-10 overflow-hidden overflow-x-auto',
};

const HEIGHT_CLASS = {
  sm: 'h-40',
  md: 'h-60',
  lg: 'h-80',
};

/**
 * @param {GraphContainerProps} props
 */
export const GraphContainer = ({
  title,
  description,
  headerAction,
  children,
  width = 'full',
  height = 'lg',
}) => {
  return (
    <div className={WIDTH_CLASS[width]}>
      <Card>
        <CardHeader className='w-full border-b gap-0 overflow-hidden'>
          <div className='p-0 flex justify-between items-center'>
            <div className='min-w-0 flex flex-col gap-3'>
              <CardTitle className='truncate'>{title}</CardTitle>
              {description && (
                <CardDescription className='truncate'>
                  {description}
                </CardDescription>
              )}
            </div>

            {headerAction && (
              <div className='shrink-0'>{headerAction}</div>
            )}
          </div>
        </CardHeader>

        <CardContent
          className={`h-full flex flex-col justify-center overflow-hidden ${HEIGHT_CLASS[height]}`}
        >
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
