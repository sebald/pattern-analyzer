import { HeadlineSkeleton, ContentSkeleton, Skeleton } from '@/ui';

export const Loading = () => (
  <Skeleton className="grid grid-cols-12 gap-y-14 md:gap-y-8">
    <div className="col-span-full md:col-span-4">
      <HeadlineSkeleton className="h-10 w-full" />
    </div>
    <div className="col-span-full px-4 md:col-span-7 md:col-start-6 md:px-0">
      <ContentSkeleton />
    </div>
  </Skeleton>
);

export default Loading;
