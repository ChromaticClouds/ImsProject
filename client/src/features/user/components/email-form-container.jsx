// @ts-check

import { Logo } from "@/assets/logo.jsx";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js";

/**
 * @param {React.PropsWithChildren} props 
 * @returns {React.JSX.Element}
 */
export const EmailFormContainer = ({ children }) => {
  return (
    <div className='max-w-sm w-full flex flex-col gap-6'>
      <div className='w-full flex justify-center'>
        <Logo />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>이메일 입력</CardTitle>
          <CardDescription>
            비밀번호 변경을 위해 기존에 입력한 이메일을 입력해주세요
          </CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};
