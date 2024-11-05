import { Loader2 } from 'lucide-react';

const StandaloneLoadingPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
export default StandaloneLoadingPage;
