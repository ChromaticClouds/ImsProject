import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/components/common/theme-provider';

import '../src/index.css';

initialize();

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  loaders: [mswLoader],

  decorators: [
    (Story) => {
      const queryClient = createQueryClient();

      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ThemeProvider
              defaultTheme='system'
              storageKey='vite-ui-theme'
            >
              <Story />
            </ThemeProvider>
          </MemoryRouter>
        </QueryClientProvider>
      );
    },
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
