import { CardChartSkeleton } from '@/ui';

const Loading = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
    <div className="md:col-span-5">
      <CardChartSkeleton />
    </div>
    <div className="md:col-span-7">
      <CardChartSkeleton />
    </div>
    <div className="md:col-span-6">
      <CardChartSkeleton />
    </div>
    <div className="md:col-span-6">
      <CardChartSkeleton />
    </div>
  </div>
);

export default Loading;
