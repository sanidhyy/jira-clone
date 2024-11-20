import type { PropsWithChildren } from 'react';
import { useMedia } from 'react-use';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({ children, open, onOpenChange }: PropsWithChildren<ResponsiveModalProps>) => {
  const isDesktop = useMedia('(min-width: 1024px)', true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="hide-scrollbar max-h-[85vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">{children}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="hide-scrollbar max-h-[85vh] overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};
