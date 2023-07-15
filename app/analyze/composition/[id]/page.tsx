// Props
// ---------------
interface PageParams {
  params: {
    id: string;
  };
}

// Page
// ---------------
const Page = ({ params }: PageParams) => {
  return <div>{params.id}</div>;
};

export default Page;
