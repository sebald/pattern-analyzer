import { Link, Logo } from 'components';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <nav className="border-b border-b-primary-100 py-1 px-2 xl:px-6 xl:py-2">
      <Link className="opacity-50 hover:opacity-100" href="/">
        <Logo className="h-7 w-7 lg:h-9 lg:w-9" />
      </Link>
    </nav>
    <main className="pt-5 lg:pt-7 xl:pt-10">{children}</main>
  </>
);

export default Layout;
