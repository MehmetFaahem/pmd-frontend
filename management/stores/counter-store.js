import { createStore } from "zustand/vanilla";

export const defaultInitState = {
  count: 1,
};

export const initCounterStore = () => {
  return { count: 1 };
};

export const createCounterStore = (defaultInitState) => {
  return createStore()((set) => ({
    ...defaultInitState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
  }));
};
