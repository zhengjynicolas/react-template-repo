import { create } from "zustand";

type AutomationStore = {
  projectReady: boolean;
  runCount: number;
  increaseRunCount: () => void;
  setProjectReady: (ready: boolean) => void;
};

export const useAutomationStore = create<AutomationStore>()((set) => ({
  projectReady: false,
  runCount: 0,
  increaseRunCount: () =>
    set((state) => ({
      runCount: state.runCount + 1,
    })),
  setProjectReady: (ready) => set({ projectReady: ready }),
}));
