// @ts-check

import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';

/**
 * @param {React.PropsWithChildren} props 
 * @returns {React.JSX.Element}
 */
export const UserGroupContainer = ({ children }) => {
  return (
    <>
      <AppHeader
        title='조직도'
        description='조직도 페이지입니다'
      />
      <Card>{children}</Card>
    </>
  );
};
