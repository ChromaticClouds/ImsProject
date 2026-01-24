type BackGroundProps = {
  variant: "default" | "center";
} & React.PropsWithChildren;

export const BackGround = ({ variant, children }: BackGroundProps) => {
  return (
    <div
      className={`bg-background w-screen min-h-screen flex flex-col ${variant === "center" && "justify-center items-center"}`}
    >
      {children}
    </div>
  );
};
