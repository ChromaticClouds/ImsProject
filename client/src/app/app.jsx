import { ThemeProvider } from "@/components/theme-provider.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { queryClient } from "@/app/providers/query-client.js";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite=-ui-theme">
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
