/**
 * @param {React.PropsWithChildren} props
 */
export const MainBackground = ({ children }) => {
  return (
    <main className="flex-1 min-w-0 flex flex-col items-center">
      <section
        className="
          w-full
          max-w-6xl
          px-4
          py-4
        "
      >
        {children}
      </section>
    </main>
  );
};
