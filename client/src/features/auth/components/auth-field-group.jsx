// @ts-check

import { CardContent } from '@/components/ui/card.js';
import { FieldGroup } from '@/components/ui/field.js';
import { useAuthContext } from '@/features/auth/providers/auth-provider.jsx';

/**
 * @param {React.PropsWithChildren} props
 */
export const AuthFieldGroup = ({ children }) => {
  const { form, mode } = useAuthContext();

  return (
    <CardContent>
      <form
        id={mode}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>{children}</FieldGroup>
      </form>
    </CardContent>
  );
};
