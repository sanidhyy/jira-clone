import { UserButton } from '@/features/auth/components/user-button';

import { MobileSidebar } from './mobile-sidebar';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-2xl font-semibold">Home</h1>

        <p className="text-muted-foreground">Monitor all of your projects and tasks here.</p>
      </div>

      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
