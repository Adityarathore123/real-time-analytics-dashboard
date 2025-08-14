import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { useUserStore } from './userStore';

export const useTodoStore = create(
  persist(
    (set, get) => ({
      allTodos: [],

      setAllTodos: (newTodos) => set({ allTodos: Array.isArray(newTodos) ? newTodos : [] }),

      addTodo: (title) => {
        const user = useUserStore.getState().currentUser;
        if (!user) return;

        const newTodo = {
          id: nanoid(),
          title,
          completed: false,
          userId: user.email,
          createdAt: Date.now(), // ✅ for charts
          timer: {
            minutes: 0,
            seconds: 0,
            isRunning: false,
          }
        };

        set((state) => ({
          allTodos: [...(Array.isArray(state.allTodos) ? state.allTodos : []), newTodo],
        }));
      },

      deleteTodo: (id) => {
        set((state) => ({
          allTodos: Array.isArray(state.allTodos)
            ? state.allTodos.filter((todo) => todo.id !== id)
            : [],
        }));
      },

      toggleTodo: (id) => {
        set((state) => ({
          allTodos: Array.isArray(state.allTodos)
            ? state.allTodos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
              )
            : [],
        }));
      },

      toggleTimerState: (id) => {
        set((state) => ({
          allTodos: state.allTodos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  timer: {
                    ...todo.timer,
                    isRunning: !todo.timer.isRunning,
                  },
                }
              : todo
          ),
        }));
      },

      decrementTimer: (id) => {
        set((state) => ({
          allTodos: state.allTodos.map((todo) => {
            if (todo.id === id && todo.timer?.isRunning && todo.timer.seconds > 0) {
              return {
                ...todo,
                timer: {
                  ...todo.timer,
                  seconds: todo.timer.seconds - 1,
                },
              };
            }
            return todo;
          }),
        }));
      },

      getUserTodos: () => {
        const user = useUserStore.getState().currentUser;
        if (!user) return [];

        const todos = get().allTodos;
        return Array.isArray(todos)
          ? todos.filter((todo) => todo.userId === user.email)
          : [];
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);




