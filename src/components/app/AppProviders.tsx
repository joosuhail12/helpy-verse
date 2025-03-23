
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/components/ui/theme-provider';
import AppInitializer from './AppInitializer';
import AppQueryProvider from './AppQueryProvider';
import CaslProvider from '@/components/CaslProvider';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import AblyProvider from '@/components/providers/AblyProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="pullse-theme-preference">
        <AppQueryProvider>
          <ErrorBoundary>
            <AblyProvider>
              <AppInitializer>
                <CaslProvider>{children}</CaslProvider>
              </AppInitializer>
            </AblyProvider>
          </ErrorBoundary>
        </AppQueryProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default AppProviders;
