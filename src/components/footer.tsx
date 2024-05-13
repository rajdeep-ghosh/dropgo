import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='p-4 sm:px-6 lg:px-8'>
      <p className='text-center text-gray-400 sm:text-left'>
        Made by&nbsp;
        <Link
          href='https://rajdeepghosh.vercel.app'
          target='_blank'
          className='hover:underline'
        >
          Rajdeep Ghosh
        </Link>
      </p>
    </footer>
  );
}
