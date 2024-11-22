import Image from 'next/image';
import Link from 'next/link';

import { links } from '@/config';

export const SourceCode = () => {
  return (
    <Link href={links.sourceCode} target="_blank" rel="noreferrer noopener" className="hover:opacity-80" title="Source Code">
      <Image src="/github.svg" alt="GitHub" height={30} width={30} />
    </Link>
  );
};
