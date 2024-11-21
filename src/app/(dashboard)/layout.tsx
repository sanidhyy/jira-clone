import type { PropsWithChildren } from 'react';

import { ModalProvider } from '@/components/modal-provider';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen">
      <ModalProvider />

      <div className="flex size-full">
        <div className="fixed left-0 top-0 hidden h-full overflow-auto lg:block lg:w-[264px]">
          <Sidebar />
        </div>

        <div className="w-full lg:pl-[264px]">
          <div className="mx-auto h-full max-w-screen-xl">
            <Navbar />

            <main className="flex h-full flex-col px-6 py-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardLayout;
