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
  lg: 'h-100',
};

/**
 * @param {GraphContainerProps} props
 */
export const GraphContainer = ({
  title,
  description,
  children,
  width = 'full',
  height = 'lg',
}) => {
  return (
    <div className={WIDTH_CLASS[width]}>
      <Card>
        <CardHeader className='border-b text-nowrap text-ellipsis'>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent
          className={`overflow-hidden overflow-x-auto ${HEIGHT_CLASS[height]}`}
        >
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
