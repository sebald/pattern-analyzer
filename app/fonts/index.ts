import { Inter, Montserrat } from 'next/font/google';
import LocalFont from 'next/font/local';

export const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
export const headline = Montserrat({
  subsets: ['latin'],
  variable: '--font-headline',
});
export const xwingShips = LocalFont({ src: './xwing-miniatures-ships.ttf' });
