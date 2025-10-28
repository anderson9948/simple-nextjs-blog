import Link from 'next/link';
import Image from 'next/image';
import BumsPng from './BUMS.png';
import { GlobalData } from '../../lib/types';

export default function SiteLogo({
  siteData,
}: {
  siteData: GlobalData;
}): JSX.Element {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between px-4 py-4 md:flex-row lg:px-0">
      <h1 className="flex items-center space-x-3">
  <Image src={BumsPng} alt={siteData?.metadata?.site_title ?? 'BUMS ALLIANCE'} width={48} height={48} className="h-12 w-12 object-contain" />
        <Link
          href="/"
          className="bg-gradient-to-r from-cyan-700 to-teal-600 bg-clip-text text-4xl font-bold tracking-tighter text-transparent dark:from-cyan-300 dark:to-teal-200"
        >
          {siteData?.metadata?.site_title ?? 'BUMS ALLIANCE'}
        </Link>
      </h1>
      <span className="relative hidden text-lg tracking-wide text-zinc-500 dark:text-zinc-200 md:flex">
        {siteData?.metadata?.site_tag ?? ''}
      </span>
    </div>
  );
}
