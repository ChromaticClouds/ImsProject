import { Label } from '@/components/ui/label.js';
import { Link } from 'react-router-dom';

export const AUTH_HEADER_MAP = {
  login: {
    title: '로그인 해주세요',
    description: '아래에 사원번호와 비밀번호를 입력해주세요',
    buttonText: '회원가입하기',
  },
  register: {
    title: '회원가입입니다',
    description: '아래에 성명과 비밀번호를 입력해주세요',
    buttonText: '로그인하기',
  },
};

export const AUTH_FIELD_MAP = /** @type {const} */ ({
  login: [
    {
      name: 'eid',
      type: 'text',
      label: '사원번호',
    },
    {
      name: 'password',
      type: 'password',
      label: '비밀번호',
      renderLabel: ({ label }) => (
        <div className='flex items-center'>
          <Label htmlFor='password'>{label}</Label>
          <Link
            to='/forgot-password'
            className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>
      ),
    },
  ],

  register: [
    {
      name: 'name',
      type: 'text',
      label: '성명',
    },
    {
      name: 'password',
      type: 'password',
      label: '비밀번호',
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: '비밀번호 재확인',
    },
  ],
});
