import { montserrat } from 'app/fonts';

export interface TitleProps {
  children: React.ReactNode;
}

export const Title = ({ children }: TitleProps) => (
  <h1
    className={`${montserrat.className} text-3xl font-extrabold uppercase text-primary-800 md:text-5xl md:tracking-wide`}
  >
    {children}
  </h1>
);
