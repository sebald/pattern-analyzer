import { Link } from 'components';
import { inter } from './fonts';
import './globals.css';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html lang="en" className={inter.className}>
    <head />
    <body className="flex min-h-screen flex-col bg-primary-50">
      {children}
      <footer className="mx-auto mt-auto w-[min(100%_-_3rem,_75rem)] pt-8">
        <div className="flex items-center justify-center gap-6 border-t border-primary-100 px-2 pt-2 pb-4 text-sm text-primary-200">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </div>
      </footer>
    </body>
  </html>
);

export default Layout;
