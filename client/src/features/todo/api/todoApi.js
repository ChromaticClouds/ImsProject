// import { todos as seed } from '@/features/todo/mocks/todo-mock';

// let store = [...seed];

// export const fetchTodos = async () => store;

//  // 🔄 나중에 Spring으로 교체
//   // const res = await api.get('todo');
//   // return res.json();

// export const fetchTodoById = async (id) => {
//   const num = Number(id);
//   return store.find((t) => t.id === num) ?? null;
// };

// export const deleteTodo = async (id) => {
//   const num = Number(id);
//   const exists = store.some((t) => t.id === num);
//   if (!exists) return { ok: false, message: '업무가 없습니다.' };

//   store = store.filter((t) => t.id !== num);
//   return { ok: true, message: '삭제 완료' };
// };

// export const completeTodo = async (id) => {
//   const num = Number(id);
//   const idx = store.findIndex((t) => t.id === num);
//   if (idx === -1) return { ok: false, message: '업무가 없습니다.' };

//   store = store.map((t) => (t.id === num ? { ...t, status: 'DONE' } : t));
//   return { ok: true, message: '완료 처리되었습니다' };
// };

// export const updateTodo = async (id, payload) => {
//   const num = Number(id);
//   const idx = store.findIndex((t) => t.id === num);
//   if (idx === -1) return { ok: false, message: '업무가 없습니다.' };

//   const title = (payload?.title ?? '').trim();
//   const category = (payload?.category ?? '').trim();
//   const startDate = payload?.startDate ?? '';
//   const endDate = payload?.endDate ?? '';

//   if (!title || !startDate || !endDate) {
//     return { ok: false, message: '필수 항목이 누락되었습니다.' };
//   }

//   store = store.map((t) =>
//     t.id === num
//       ? {
//           ...t,
//           title,
//           description: payload?.description ?? '',
//           category,
//           startDate,
//           endDate,
//           tages: Array.isArray(payload?.tages) ? payload.tages : [],
//         }
//       : t
//   );

//   return { ok: true, message: '수정되었습니다' };
// };

// export const toggleTodoStatus = async (id) => {
//   const num = Number(id);
//   const idx = store.findIndex((t) => t.id === num);
//   if (idx === -1) return { ok: false };

//   const current = store[idx];
//   const isDone = current.status === 'DONE';

//   const updated = {
//     ...current,
//     status: isDone ? 'IN_PROGRESS' : 'DONE',
//     completedAt: isDone ? null : new Date().toISOString().slice(0, 10),
//   };

//   store = store.map((t) => (t.id === num ? updated : t));
//   return { ok: true, todo: updated };
// };

// @ts-check

/**
 * Node modules
 */
import { api, hooks } from '@/services/api.js';

/**
 * @typedef {Omit<TodoResponse, 'tags'> & {tags: string | null}} TodoApiResponse
 */

/**
 * @param {TodoApiResponse} todo
 * @returns {TodoResponse}
 */
const normalizeTodo = (todo) => {
  /** @type {string[]} */
  let tags = [];

  if (todo.tags) {
    try {
      const parsed = JSON.parse(todo.tags);
      if (Array.isArray(parsed)) {
        tags = parsed.filter((tag) => typeof tag === 'string');
      }
    } catch {
      tags = [];
    }
  }

  return { ...todo, tags };
};

/**
 * @returns {Promise<TodoResponse[]>}
 */
export const fetchTodos = async () => {
  const todos = /** @type {TodoApiResponse[]} */ (
    await api.get('todo/list', { hooks }).json()
  );
  return todos.map(normalizeTodo);
};

/**
 * @param {number | string} id
 * @returns {Promise<TodoResponse>}
 */
export const fetchTodoById = async (id) => {
  const todo = /** @type {TodoApiResponse} */ (
    await api.get(`todo/${id}`, { hooks }).json()
  );
  return normalizeTodo(todo);
};

/**
 * @param {number | string} id
 * @returns {Promise<ActionResponse>}
 */
export const deleteTodo = (id) => 
    api.delete(`todo/${id}`, { hooks }).json();

/**
 * @param {number | string} id
 * @returns {Promise<ActionResponse>}
 */
export const toggleTodoStatus = (id) => 
    api.patch(`todo/${id}/toggle`, { hooks }).json();

/**
 * @param {number | string} id
 * @param {TodoUpdatePayload} payload
 * @returns {Promise<ActionResponse>}
 */
export const updateTodo = (id, payload) => 
    api.put(`todo/${id}`, { json: payload, hooks }).json();
