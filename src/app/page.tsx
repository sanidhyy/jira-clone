import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HomePage = () => {
  return (
    <main className="space-x-2 space-y-2">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button disabled={true}>Disabled</Button>

      <hr />

      <Button>Default</Button>
      <Button size="icon">😊</Button>
      <Button size="lg">Large</Button>
      <Button size="sm">Small</Button>
      <Button size="xs">Extra Small</Button>

      <hr />

      <Input placeholder="Type something here..." className="w-[400px]" />

      <hr />

      <Select>
        <SelectTrigger className="w-[400px]">
          <SelectValue placeholder="Choose a fruit" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="mango">Mango</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
    </main>
  );
};

export default HomePage;
