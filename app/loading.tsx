import { LogoSkeleton } from '@/ui';

const Loading = () => (
  <div className="grid min-h-screen place-items-center">
    <LogoSkeleton />
    <span className="sr-only">Loading...</span>
  </div>
);
export default Loading;
