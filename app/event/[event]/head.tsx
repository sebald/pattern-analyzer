import { HeadTags } from 'components';

export interface HeadProps {
  params: {
    event: string;
  };
}

const Head = ({ params }: HeadProps) => {
  const title = `Pattern Analyzer | Event #${params.event}`;
  return (
    <>
      <title>{title}</title>
      <HeadTags />
    </>
  );
};

export default Head;
