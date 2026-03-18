import {
  Skeleton,
  HeadlineSkeleton,
  LineSkeleton,
  Tiles,
  CardSkeleton,
} from '@/ui';

export const Loading = () => (
  <Skeleton>
    <HeadlineSkeleton className="mt-8 h-12" />
    <div className="flex gap-2">
      <LineSkeleton className="w-36" />
      <LineSkeleton className="w-28" />
      <LineSkeleton className="w-28" />
    </div>
    <div className="grid grid-cols-3 gap-3 py-14">
      <HeadlineSkeleton className="col-span-1 h-10 w-full" />
      <HeadlineSkeleton className="col-span-1 h-10 w-full" />
      <HeadlineSkeleton className="col-span-1 h-10 w-full" />
    </div>
    <Tiles>
      <CardSkeleton lines={[2, 2, 3]} />
      <CardSkeleton lines={[2, 2, 3]} />
      <CardSkeleton lines={[2, 2, 3]} />
      <CardSkeleton lines={[2, 2, 3]} />
    </Tiles>
  </Skeleton>
);

export default Loading;
