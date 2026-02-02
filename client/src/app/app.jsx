// @ts-check

/**
 * Components
 */
import { ThemeProvider } from '@/components/common/theme-provider.js';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner.js';
import { Outlet } from 'react-router-dom';

/**
 * Utils
 */
import { queryClient } from '@/app/providers/query-client.js';
import { SidebarProvider } from '@/components/ui/sidebar.js';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ThemeProvider
          defaultTheme='system'
          storageKey='vite=-ui-theme'
        >
          <Toaster
            theme='system'
            position='top-center'
          />
          <Outlet />
        </ThemeProvider>
      </SidebarProvider>
    </QueryClientProvider>
  );
};
