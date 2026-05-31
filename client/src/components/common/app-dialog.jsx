// @ts-check

import { Button } from '@/components/ui/button.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.js';
import { Spinner } from '@/components/ui/spinner.js';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @typedef {object} AppDialogProps
 * @property {string} title
 * @property {string} description
 * @property {React.ReactNode} [content]
 * @property {React.ReactNode} [closeMark]
 * @property {React.ReactNode} [actionMark]
 * @property {() => Promise<void>} action
 * @property {"link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null} [variant]
 * @property {boolean} isSubmitting
 * @property {string} [navigateTo]
 */

/**
 * @param {AppDialogProps & React.PropsWithChildren} props
 */
export const AppDialog = ({
  title,
  description,
  content,
  closeMark = '취소',
  actionMark = '확인',
  variant,
  children,
  action,
  isSubmitting,
  navigateTo,
}) => {
  const navigate = useNavigate();
  const submitLockRef = useRef(false);

  const handleSubmit = async () => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;

    try {
      await action();
      navigateTo && navigate(navigateTo);
    } catch {
      submitLockRef.current = false;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => isSubmitting && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>{closeMark}</Button>
          </DialogClose>
          <Button
            variant={variant}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : actionMark}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
