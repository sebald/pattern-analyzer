import { montserrat } from 'app/fonts';

export interface TitleProps {
  children: React.ReactNode;
}

export const Title = ({ children }: TitleProps) => (
  <h1
    className={`${montserrat.className} text-2xl font-extrabold uppercase text-primary-800 sm:text-3xl`}
  >
    {children}
  </h1>
);
