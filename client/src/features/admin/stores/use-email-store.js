import { toast } from 'sonner';
import { create } from 'zustand';

/**
 * @typedef {object} EmailStoreState
 * @property {string} value
 * @property {(email: string) => void} setValue
 * @property {string[]} emails
 * @property {(email: string) => 'OK' | 'DUPLICATE' | 'EMPTY'} addEmail
 * @property {(index: number) => void} deleteEmail
 * @property {() => void} deleteLastEmail
 */

/**
 * @type {import("zustand").UseBoundStore<import("zustand").StoreApi<EmailStoreState>>}
 */
export const useEmailStore = create((set, get) => ({
  value: '',
  emails: [],

  setValue: (value) => set({ value }),

  addEmail: (email) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return 'EMPTY';

    const { emails } = get();
    if (emails.includes(normalized)) return 'DUPLICATE';

    set({ emails: [...emails, normalized] });
    return 'OK';
  },

  deleteEmail: (index) =>
    set((state) => ({
      emails: state.emails.filter((_, i) => i !== index),
    })),
}));
