import '@/styles/global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Js Template',
  description:
    'Created using the Next template by Rajdeep Ghosh (https://github.com/rajdeep-ghosh/next-template)'
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
