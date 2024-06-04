import Link from 'next/link';
import { Cloud, Github, Twitter } from 'lucide-react';
import { Button } from './ui/button';
import ThemeToggle from './theme-toggle';

export default function Header() {
  return (
    <header className='px-8 py-6 sm:px-14 lg:px-16'>
      <nav className='flex justify-between'>
        <Link href='/' className='flex items-center gap-2'>
          <Cloud className='size-6' />
          <span className='font-poppins text-lg font-medium'>DropGo</span>
        </Link>
        <div className='flex items-center gap-2 sm:gap-3'>
          <Button variant='outline' size='icon' asChild>
            <Link
              href='https://github.com/rajdeep-ghosh/dropgo'
              target='_blank'
            >
              <Github className='size-5' />
              <span className='sr-only'>github</span>
            </Link>
          </Button>
          <Button variant='outline' size='icon' asChild>
            <Link href='https://x.com/rajdeepghosh__' target='_blank'>
              <Twitter className='size-5' />
              <span className='sr-only'>x/twitter</span>
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
