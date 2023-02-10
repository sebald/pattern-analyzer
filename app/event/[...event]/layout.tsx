import { Link, Logo } from 'components';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <nav className="px-2 py-2 text-center leading-none xl:px-6">
      <Link className="inline-block" href="/">
        <Logo className="h-7 w-7 text-primary-300 hover:text-primary-900 lg:h-9 lg:w-9" />
      </Link>
    </nav>
    <main className="pt-5 lg:pt-5">{children}</main>
  </>
);

export default Layout;
