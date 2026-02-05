import { todos } from '@/features/todo/mocks/todo-mock';

export const fetchTodos = async () => {
  return todos;

  // 🔄 나중에 Spring으로 교체
  // const res = await fetch('http://localhost:8080/api/todos');
  // return res.json();
};
