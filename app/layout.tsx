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
      <div className="mx-4 flex flex-row items-center border-t border-primary-200 px-5 py-2 text-sm text-primary-400">
        <Link href="/about">About</Link>
      </div>
    </body>
  </html>
);

export default Layout;
