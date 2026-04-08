import { useEffect, useState, useCallback } from "react";
import { registry } from "@/core/registry/ModuleRegistry";
import { useModuleStore } from "@/core/store/moduleStore";
import { TopAppBar } from "@/core/shell/TopAppBar";
import { BottomNavBar } from "@/core/shell/BottomNavBar";
import { ModeSelector } from "@/core/shell/ModeSelector";
import { ViewfinderFrame } from "@/core/shell/ViewfinderFrame";
import { HUDChip } from "@/ui/HUDChip";
import { proCameraModule } from "@/modules/pro-camera";
import type { TopBarItem, HUDChipConfig } from "@/core/registry/types";

export default function App() {
  const { activate, refreshInstalled } = useModuleStore();
  const [topBarLeftItems, setTopBarLeftItems] = useState<TopBarItem[]>([]);
  const [topBarRightItems] = useState<TopBarItem[]>([]);
  const [hudChips, setHudChips] = useState<HUDChipConfig[]>([]);

  useEffect(() => {
    registry.register(proCameraModule);
    refreshInstalled();
    activate("com.foton.pro-camera");
  }, []);

  useEffect(() => {
    const unsubscribe = registry.onUIChange(() => {
      setTopBarLeftItems(registry.getTopBarItems());
      setHudChips(registry.getHUDChips());
    });
    return unsubscribe;
  }, []);

  const activeModule = registry.getActiveModule();
  const title = activeModule?.name ?? "Foton";
  const ActiveScreen = activeModule?.screens[0]?.component;

  const handleCapture = useCallback(() => {
    console.log("Capture triggered");
  }, []);

  const leftHUDChips = hudChips.filter((c) => c.position === "left");
  const rightHUDChips = hudChips.filter((c) => c.position === "right");

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopAppBar
        title={title}
        leftItems={topBarLeftItems}
        rightItems={topBarRightItems}
      />

      <ViewfinderFrame>
        {ActiveScreen && <ActiveScreen />}

        {leftHUDChips.length > 0 && (
          <div className="absolute top-20 left-4 z-10 flex flex-col gap-1">
            {leftHUDChips.map((chip) => (
              <HUDChip
                key={chip.id}
                label={chip.label}
                value={chip.value}
                accent={chip.accent}
              />
            ))}
          </div>
        )}

        {rightHUDChips.length > 0 && (
          <div className="absolute top-20 right-4 z-10 flex flex-col gap-1 items-end">
            {rightHUDChips.map((chip) => (
              <HUDChip
                key={chip.id}
                label={chip.label}
                value={chip.value}
                accent={chip.accent}
              />
            ))}
          </div>
        )}
      </ViewfinderFrame>

      <ModeSelector />
      <BottomNavBar onCapture={handleCapture} />
    </div>
  );
}
