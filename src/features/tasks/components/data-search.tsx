import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { useDebounce } from '@/hooks/use-debounce';

export const DataSearch = () => {
  const [value, setValue] = useState('');

  const debouncedValue = useDebounce(value);
  const [_filters, setFilters] = useTaskFilters();

  useEffect(() => {
    setFilters({ search: debouncedValue.trim().length > 0 ? debouncedValue : null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-[20%] size-4 text-muted-foreground" />

      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for a task"
        className="h-8 w-full px-8 lg:w-[320px]"
      />
    </div>
  );
};
