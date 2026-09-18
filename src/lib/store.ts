import { create } from "zustand";
import { persist } from "zustand/middleware";

// Theme Store
interface ThemeState {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
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

// Sidebar Store
interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setSidebarOpen: (open) => set({ isOpen: open }),
}));

// User Store
interface UserState {
  user: {
    name: string;
    email: string;
    avatar: string;
  } | null;
  setUser: (
    user: { name: string; email: string; avatar: string } | null
  ) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);

// Data Store (for fetching data)
interface DataStore {
  data: any; // Store the fetched data
  setData: (data: any[]) => void; // Function to update the data
  clearData: () => void; // Wipe the logged-in user payload (logout)
  loading: boolean; // Store the loading state
  setLoading: (loading: boolean) => void; // Function to update the loading state
}

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      data: [],
      setData: (data: any[]) => set({ data }),
      clearData: () => set({ data: [] }),
      loading: true,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: "data-storage", // 📝 key in localStorage
      // Persist the login payload WITHOUT the bearer token: the session lives
      // in the HttpOnly cookie, and a token in localStorage is readable by any
      // XSS on the page (§1.1).
      partialize: (state) => {
        const data: any = state.data;
        if (data && typeof data === "object" && !Array.isArray(data)) {
          const { token, accessToken, refreshToken, ...rest } = data;
          return { data: rest };
        }
        return { data };
      },
    }
  )
);
