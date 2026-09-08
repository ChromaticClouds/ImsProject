import { Logo } from '@/assets/logo.jsx';
import { BackGround } from '@/components/common/background.js';
import { LoadingState } from '@/components/common/loading-state.jsx';

export const AppLoading = () => {
  return (
    <BackGround variant='center'>
      <div className='flex flex-col items-center gap-4'>
        <Logo variant='icon' size={54} />
        <LoadingState
          variant='inline'
          label='앱을 준비하는 중입니다.'
          className='justify-center'
          spinnerClassName='size-5'
        />
      </div>
    </BackGround>
  );
};
