// @ts-check

/**
 * @typedef {object} NoticeMetaProps
 * @property {import('lucide-react').LucideIcon} icon
 * @property {import('react').ReactNode} children
 */

/**
 * @param {NoticeMetaProps} props
 */
export const NoticeMeta = ({ icon: Icon, children }) => (
  <span className='inline-flex items-center gap-1.5 text-xs text-muted-foreground'>
    <Icon
      className='size-3.5'
      aria-hidden='true'
    />
    {children}
  </span>
);
