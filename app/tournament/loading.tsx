import { Skeleton, CardTableSkeleton, HeadlineSkeleton } from '@/ui';

export const Loading = () => (
  <Skeleton>
    <div className="pb-6">
      <HeadlineSkeleton className="h-12 w-80 bg-primary-900" />
      <HeadlineSkeleton className="h-3 w-60 bg-primary-400" />
    </div>
    <CardTableSkeleton />
  </Skeleton>
);

export default Loading;
