import { HeadTags } from 'components';

export interface HeadProps {
  params: {
    event: [id: string] | [vendor: string, id: string] | string[];
  };
}

const Head = ({ params }: HeadProps) => {
  const id = params.event.length === 1 ? params.event[0] : params.event[1];

  const title = `Pattern Analyzer | Event #${id}`;
  return (
    <>
      <title>{title}</title>
      <HeadTags />
    </>
  );
};

export default Head;
