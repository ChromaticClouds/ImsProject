/**
 * Components
 */
import { AppHeader } from '@/components/common/app-header.jsx';
import { EmailDialog } from '@/features/admin/components/email-dialog.jsx';

export const UserSetting = () => {
  return (
    <div className='flex flex-col w-full h-full'>
      <AppHeader
        title='사용자 설정'
        description='사용자들을 관리하고 권한을 설정할 수 있습니다.'
      />
      <EmailDialog />
    </div>
  );
};
