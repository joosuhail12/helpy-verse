
import { AddContentButton } from './AddContentDialog';

export const ContentHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">Content Center</h1>
      <AddContentButton />
    </div>
  );
};
