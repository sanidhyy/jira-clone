import { DragDropContext, Draggable, type DropResult, Droppable } from '@hello-pangea/dnd';
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
  onChange: (tasks: { $id: string; status: TaskStatus; position: number }[]) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
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

  useEffect(() => {
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destStatus = destination.droppableId as TaskStatus;

      let updatesPayload: { $id: string; status: TaskStatus; position: number }[] = [];

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        // Safely remove the task from the source column
        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        // If there is no moved task, return the previous state
        if (!movedTask) {
          console.error('No task found at the source index.');
          return prevTasks;
        }

        // Create a new task object with updated status
        const updatedMovedTask = sourceStatus !== destStatus ? { ...movedTask, status: destStatus } : movedTask;

        // Update the source column
        newTasks[sourceStatus] = sourceColumn;

        // Add the task to the destination column
        const destColumn = [...newTasks[destStatus]];
        destColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destStatus] = destColumn;

        // Prepare minimal update payloads
        updatesPayload = [];

        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: destStatus,
          position: Math.min((destination.index + 1) * 1000, 1_00_000),
        });

        // Update affected tasks positions in the destination column
        newTasks[destStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_00_000);

            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: destStatus,
                position: newPosition,
              });
            }
          }
        });

        // If the task moved between columns, update positions in the source column
        if (sourceStatus !== destStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            const newPosition = Math.min((index + 1) * 1000, 1_00_000);

            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          });
        }

        return newTasks;
      });

      onChange(updatesPayload);
    },
    [onChange],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="custom-scrollbar flex overflow-x-auto">
        {boards.map((board) => (
          <div key={board} className="mx-2 min-w-[200px] flex-1 rounded-md bg-muted p-1.5">
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
