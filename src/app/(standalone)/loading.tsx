import { Loader2 } from 'lucide-react';

const StandaloneLoadingPage = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
export default StandaloneLoadingPage;
