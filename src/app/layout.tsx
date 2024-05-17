import '@/styles/global.css';
import { Inter, Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import Footer from '@/components/footer';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'DropGo',
  description: 'Simple, Secure & Temporary File Storage',
  authors: [{ name: 'Rajdeep Ghosh', url: 'https://github.com/rajdeep-ghosh' }]
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang='en'>
      <body
        className={cn(
          inter.className,
          poppins.variable,
          'bg-gray-900 antialiased'
        )}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
