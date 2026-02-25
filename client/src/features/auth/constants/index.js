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
