import { create } from 'zustand';

/**
 * @typedef {object} EmailStoreState
 * @property {string} value
 * @property {(email: string) => void} setValue
 * @property {string[]} emails
 * @property {(email: string) => void} addEmail
 * @property {(index: number) => void} deleteEmail
 * @property {() => void} deleteLastEmail
 */

/**
 * @type {import("zustand").UseBoundStore<import("zustand").StoreApi<EmailStoreState>>}
 */
export const useEmailStore = create((set) => ({
  value: '',
  setValue: (email) => set({ email }),
  emails: [],
  addEmail: (email) => set((prev) => prev.emails.push(email)),
  deleteEmail: (index) =>
    set((prev) => prev.emails.filter((_, i) => i !== index)),
  deleteLastEmail: () => set((prev) => prev.emails.slice(0, -1)),
}));
