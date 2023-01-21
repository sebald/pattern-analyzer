import { Inter, Montserrat } from '@next/font/google';
import LocalFont from '@next/font/local';

export const inter = Inter({ subsets: ['latin'] });
export const montserrat = Montserrat({ subsets: ['latin'] });
export const xwingShips = LocalFont({ src: './xwing-miniatures-ships.ttf' });
