"use client";
import { FocusModeProvider, useFocusMode } from "@/contexts/FocusModeContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Canvas from "./Canvas";

function Inner() {
  const { focusMode } = useFocusMode();
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary">
      {!focusMode && <Sidebar />}
      <div className="flex flex-col flex-1 min-w-0">
        {!focusMode && <Header />}
        <Canvas />
      </div>
    </div>
  );
}

export default function LayoutClient() {
  return (
    <FocusModeProvider>
      <Inner />
    </FocusModeProvider>
  );
}
