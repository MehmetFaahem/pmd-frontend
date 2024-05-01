"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  createCounterStore,
  initCounterStore,
} from "@/management/stores/counter-store";

export const CounterStoreContext = createContext(null);

export const CounterStoreProvider = ({ children }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createCounterStore(initCounterStore());
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  );
};

export const useCounterStore = (selector) => {
  const counterStoreContext = useContext(CounterStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
