import { redirect } from 'next/navigation';
import paths from 'routes/paths';

const Page = () => {
  redirect(paths.projectList);
};

export default Page;
