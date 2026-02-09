// @ts-check
import { HistoryProvider } from '@/features/history/providers/history-provider.jsx';
import { HistoryScreen } from '@/features/history/components/history-screen.jsx';
import { AppHeader } from '@/components/common/app-header.jsx';

export function HistoryPage() {
  return (
    <HistoryProvider>
      <AppHeader
              title='히스토리'
              description='거래 내역 이력을 확인하세요'
              />
      <HistoryScreen />
    </HistoryProvider>
  );
}
