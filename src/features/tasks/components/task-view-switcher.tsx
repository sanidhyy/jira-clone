'use client';

import { Loader2, PlusIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useCallback } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBulkUpdateTasks } from '@/features/tasks/api/use-bulk-update-tasks';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import type { TaskStatus } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { columns } from './columns';
import { DataCalendar } from './data-calendar';
import { DataFilters } from './data-filters';
import { DataKanban } from './data-kanban';
import { DataSearch } from './data-search';
import { DataTable } from './data-table';

interface TaskViewSwitcherProps {
  projectId?: string;
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({ projectId, hideProjectFilter }: TaskViewSwitcherProps) => {
  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  });
  const [{ status, assigneeId, projectId: filteredProjectId, dueDate, search }] = useTaskFilters();

  const workspaceId = useWorkspaceId();

  const { open } = useCreateTaskModal();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId: projectId ?? filteredProjectId,
    dueDate,
    search,
  });

  const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdateTasks({
        json: { tasks },
      });
    },
    [bulkUpdateTasks],
  );

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="w-full flex-1 rounded-lg border">
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => open()} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />

        <div className="flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
          <DataFilters hideProjectFilter={hideProjectFilter} />

          <DataSearch />
        </div>

        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>

            <TabsContent value="kanban" className="mt-0">
              <DataKanban data={tasks?.documents ?? []} onChange={onKanbanChange} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
