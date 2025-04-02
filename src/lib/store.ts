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
}

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

// Data Store (for fetching data)
interface DataStore {
  data: any[]; // Store the fetched data
  setData: (data: any[]) => void; // Function to update the data
  loading: boolean; // Store the loading state
  setLoading: (loading: boolean) => void; // Function to update the loading state
}

export const useDataStore = create<DataStore>((set) => ({
  data: [], // Initialize with an empty array
  setData: (data: any[]) => set({ data }), // Update data in the store
  loading: true, // Initial loading state
  setLoading: (loading: boolean) => set({ loading }), // Update loading state
}));
