import Link from 'next/link';
import { Cloud, Github, Twitter } from 'lucide-react';

export default function Header() {
  return (
    <header className='bg-gray-900 px-8 py-6 sm:px-14 lg:px-16'>
      <nav className='flex justify-between'>
        <Link href='/' className='flex items-center gap-2 text-white'>
          <Cloud className='size-6' />
          <span className='font-poppins text-lg'>DropGo</span>
        </Link>
        <div className='flex items-center gap-6 sm:gap-8'>
          <Link href='https://github.com/rajdeep-ghosh/dropgo' target='_blank'>
            <Github className='size-6 text-white' />
            <span className='sr-only'>github</span>
          </Link>
          <Link href='https://x.com/rajdeepghosh__' target='_blank'>
            <Twitter className='size-6 text-white' />
            <span className='sr-only'>x/twitter</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
