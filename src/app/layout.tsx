import '@/styles/global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DropGo',
  description: 'Simple, Secure & Temporary File Storage',
  authors: [{ name: 'Rajdeep Ghosh', url: 'https://github.com/rajdeep-ghosh' }]
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
