type BackGroundProps = {
  variant?: 'default' | 'center';
  direction?: 'row' | 'column';
} & React.PropsWithChildren;

export const BackGround = ({
  variant = 'default',
  direction = 'column',
  children,
}: BackGroundProps) => {
  return (
    <div
      className={`
        bg-background w-screen min-h-screen flex 
        ${direction === 'column' && 'flex-col'} 
        ${variant === 'center' && 'justify-center items-center'}
      `}
    >
      {children}
    </div>
  );
};
