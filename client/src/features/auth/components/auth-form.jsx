/**
 * Components
*/
import { AuthProvider } from '@/features/auth/components/auth-provider.jsx';
import { AuthActionButton } from '@/features/auth/components/auth-action-button.jsx';
import { AuthFieldGroup } from '@/features/auth/components/auth-field-group.jsx';
import { AuthHeader } from '@/features/auth/components/auth-header.jsx';
import { AuthContents } from '@/features/auth/components/auth-contents.jsx';

export const AuthForm = () => {
  return (
    <AuthProvider>
      <AuthHeader>
        <AuthFieldGroup>
          <AuthContents />
        </AuthFieldGroup>
        <AuthActionButton />
      </AuthHeader>
    </AuthProvider>
  );
};
