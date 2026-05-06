"use client";
import { createContext, useContext, useState } from "react";

interface FocusModeContextValue {
  focusMode: boolean;
  toggle: () => void;
}

const FocusModeContext = createContext<FocusModeContextValue>({
  focusMode: false,
  toggle: () => {},
});

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [focusMode, setFocusMode] = useState(false);
  return (
    <FocusModeContext.Provider value={{ focusMode, toggle: () => setFocusMode((v) => !v) }}>
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode() {
  return useContext(FocusModeContext);
}
