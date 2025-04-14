import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DataStore {
  data: any[];
  setData: (data: any[]) => void;
  liveSetData: (newItem: any) => void; // ✅ This line is required
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      data: [],
      setData: (data: any[]) => set({ data }),

      // Append a new item to the current data array
      liveSetData: (newItem: any) => {
        const currentData = get().data;
        set({ data: [...currentData, newItem] });
      },

      loading: true,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: "data-storage",
      partialize: (state) => ({ data: state.data }), // Only persist `data`
    }
  )
);
