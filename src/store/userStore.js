import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      currentUser: null,
      login: (email, password) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const found = users.find((u) => u.email === email && u.password === password);
        if (found) set({ currentUser: found });
      },
      signup: (email, password) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const newUser = { email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        set({ currentUser: newUser });
      },
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);





