import { CardSkeleton, Tiles } from '@/ui';

const Loading = () => (
  <Tiles>
    <CardSkeleton lines={[2, 2, 3]} />
    <CardSkeleton lines={[2, 2, 3]} />
    <CardSkeleton lines={[2, 2, 3]} />
    <span className="sr-only">Loading...</span>
  </Tiles>
);

export default Loading;
