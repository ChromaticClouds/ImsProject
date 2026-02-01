import { Logo } from '@/assets/logo.jsx';
import { BackGround } from '@/components/common/background.js';
import { Spinner } from '@/components/ui/spinner.js';

export const AppLoading = () => {
  return (
    <BackGround variant='center'>
      <div className='flex flex-col gap-6 items-center'>
        <Logo variant='icon' size={54} />
        <Spinner />
        <p>잠시만 기다려주세요</p>
      </div>
    </BackGround>
  );
};
