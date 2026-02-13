/**
 * @param {React.PropsWithChildren} props
 */
export const MainBackground = ({ children }) => {
  return (
    <main className="flex-1 min-w-0 flex flex-col items-center">
      <section
        className="
          w-full
          h-full
          max-w-7xl
          p-6
        "
      >
        {children}
      </section>
    </main>
  );
};
