import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <main>
      <h1 className="text-3xl text-emerald-500">Hello, World!</h1>

      <Button size="lg" variant="destructive">
        Click me
      </Button>
    </main>
  );
};

export default HomePage;
