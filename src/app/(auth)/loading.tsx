import { Loader2 } from 'lucide-react';

const AuthLoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
export default AuthLoadingPage;
