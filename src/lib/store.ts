import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

interface UserState {
  user: {
    name: string;
    email: string;
    avatar: string;
  } | null;
  setUser: (
    user: { name: string; email: string; avatar: string } | null
  ) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  )
);

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setSidebarOpen: (open) => set({ isOpen: open }),
}));

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage",
    }
  )
);
