import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';

import { type Task, TaskStatus } from '@/features/tasks/types';

import { KanbanCard } from './kanban-card';
import { KanbanColumnHeader } from './kanban-column-header';

const boards: TaskStatus[] = [TaskStatus.BACKLOG, TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskStatus.DONE];

type TasksState = {
  [key in TaskStatus]: Task[];
};

interface DataKanbanProps {
  data: Task[];
}

export const DataKanban = ({ data }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />

            <Droppable droppableId={board}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px] py-1.5">
                  {tasks[board].map((task, index) => (
                    <Draggable key={task.$id} draggableId={task.$id} index={index}>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <KanbanCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
