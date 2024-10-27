import Image from 'next/image';
import Link from 'next/link';

import { DottedSeparator } from './dotted-separator';
import { Navigation } from './navigation';

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image src="/logo.svg" alt="Logo" width={164} height={48} />
      </Link>

      <DottedSeparator className="my-4" />

      <Navigation />
    </aside>
  );
};
