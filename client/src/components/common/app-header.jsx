// @ts-check

import { Separator } from '@/components/ui/separator.js';

/**
 * @param {{ title: string, description?: string }} props
 */
export const AppHeader = ({ title, description }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <Separator className="mt-4" />
    </div>
  );
};
