import { Link } from 'components';
import { inter } from './fonts';
import './globals.css';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html lang="en" className={inter.className}>
    <head />
    <body className="bg-primary-50">
      {children}
      <div className="mx-4 flex items-center justify-center gap-4 border-t border-primary-200 px-2 py-1 text-sm text-primary-300">
        <Link href="/about">About</Link>
        <Link href="/about">About</Link>
      </div>
    </body>
  </html>
);

export default Layout;
