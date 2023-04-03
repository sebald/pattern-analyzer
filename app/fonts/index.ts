import { Inter, Montserrat } from 'next/font/google';
import LocalFont from 'next/font/local';

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});
export const xwingShips = LocalFont({ src: './xwing-miniatures-ships.ttf' });
