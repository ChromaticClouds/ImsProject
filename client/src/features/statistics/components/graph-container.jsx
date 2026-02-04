import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';

/**
 * @typedef {'third' | 'wide' | 'full'} GraphWidth
 *
 * @typedef {object} GraphContainerProps
 * @property {string} title
 * @property {string} [description]
 * @property {React.ReactNode} children
 * @property {GraphWidth} [width]
 */

const WIDTH_CLASS = {
  third: 'col-span-10 lg:col-span-3',
  wide: 'col-span-10 lg:col-span-7',
  full: 'col-span-10',
};

/**
 * @param {GraphContainerProps} props
 */
export const GraphContainer = ({
  title,
  description,
  children,
  width = 'full',
}) => {
  return (
    <div className={WIDTH_CLASS[width]}>
      <Card>
        <CardHeader className='border-b'>
          <CardTitle>{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};
