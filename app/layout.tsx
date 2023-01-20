import { inter } from './fonts';
import './globals.css';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html lang="en" className={inter.className}>
    <head />
    <body className="bg-primary-50">{children}</body>
  </html>
);

export default Layout;
