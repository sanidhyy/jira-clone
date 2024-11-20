import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';

const TasksPage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return (
    <div className="flex h-full flex-col">
      <TaskViewSwitcher />
    </div>
  );
};
export default TasksPage;
