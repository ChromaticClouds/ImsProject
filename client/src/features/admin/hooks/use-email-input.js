// @ts-check

import { emailSchema } from '@/features/admin/schemas/email-schema.js';
import { useEmailStore } from '@/features/admin/stores/use-email-store.js';
import { useCallback } from 'react';
import { toast } from 'sonner';

const MAX_EMAIL_COUNT = 10;

export const useEmailInput = () => {
  const value = useEmailStore((s) => s.value);
  const emails = useEmailStore((s) => s.emails);
  const setValue = useEmailStore((s) => s.setValue);
  const addEmail = useEmailStore((s) => s.addEmail);

  /**
   * @param {string} email
   */
  const checkEmail = (email) => {
    if (emails.length >= MAX_EMAIL_COUNT) {
      toast.error(`이메일 개수는 최대 ${MAX_EMAIL_COUNT}개 이하여야 합니다.`);
      return false;
    }

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return false;
    }

    const result = addEmail(email);
    if (result === 'DUPLICATE') {
      toast.error(`${email}은 이미 추가되어 있습니다.`);
      return false;
    }

    return true;
  };

  const commit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (checkEmail(trimmed)) setValue('');
  }, [value, addEmail, setValue]);

  return {
    /**
     * @param {React.KeyboardEvent<HTMLInputElement>} e
     */
    onKeyDown: (e) => {
      if (e.key === ',' || e.key === 'Enter') {
        e.preventDefault();
        commit();
      }
    },

    /**
     * @param {React.ClipboardEvent<HTMLInputElement>} e
     */
    onPaste: (e) => {
      const pasted = e.clipboardData.getData('text');

      if (pasted.includes(',')) {
        pasted
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
          .forEach(checkEmail);
      }

      setValue(value + pasted);
      e.preventDefault();
    },
  };
};
