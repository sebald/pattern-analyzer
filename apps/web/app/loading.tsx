import { LogoSkeleton } from '@/ui';

const Loading = () => (
  <div className="grid flex-1 place-items-center">
    <LogoSkeleton className="text-primary-900" />
    <span className="sr-only">Loading...</span>
  </div>
);
export default Loading;
