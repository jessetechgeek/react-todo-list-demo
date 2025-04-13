export type TodoItem = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  todoListId: number;
};

export type TodoList = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
};
