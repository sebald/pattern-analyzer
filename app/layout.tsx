import './globals.css';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html lang="en">
    <head />
    <body>{children}</body>
  </html>
);

export default Layout;
