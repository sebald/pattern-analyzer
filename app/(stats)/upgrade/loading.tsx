import { Skeleton, HeadlineSkeleton, CardTableSkeleton } from '@/ui';

export const Loading = () => (
  <Skeleton>
    <HeadlineSkeleton className="mt-8 h-14 w-72" />
    <div className="flex items-center gap-4">
      <HeadlineSkeleton className="mt-2 h-4 w-44" />{' '}
      <HeadlineSkeleton className="mt-2 h-4 w-24" />{' '}
      <HeadlineSkeleton className="mt-2 h-4 w-36" />
    </div>
    <div className="mb-4 mt-8 flex justify-end gap-4">
      <HeadlineSkeleton className="h-8 w-12" />
      <HeadlineSkeleton className="h-8 w-44" />
    </div>
    <CardTableSkeleton />
  </Skeleton>
);

export default Loading;
