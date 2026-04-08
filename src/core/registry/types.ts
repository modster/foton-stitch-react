import type { ComponentType } from "react";

export interface FotonModule {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  icon: string;
  price?: number;

  screens: ModuleScreen[];
  settings?: ComponentType;
  submodules?: FotonModule[];
  shaders?: ShaderDefinition[];
  cameraPresets?: CameraPreset[];

  onActivate?(ctx: ModuleContext): void;
  onDeactivate?(): void;
  onDestroy?(): void;
}

export interface ModuleScreen {
  id: string;
  label: string;
  component: ComponentType;
}

export interface ShaderDefinition {
  id: string;
  fragmentSource: string;
  vertexSource?: string;
  uniforms?: Record<string, UniformValue>;
  priority?: number;
}

export type UniformValue =
  | number
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

export interface CameraPreset {
  iso?: number;
  shutter?: string;
  ev?: number;
  wb?: number;
  aperture?: string;
  zoom?: number;
}

export interface TopBarItem {
  id: string;
  icon: string;
  label?: string;
  onClick: () => void;
  variant?: "icon" | "badge";
  badgeText?: string;
  badgeColor?: string;
}

export interface BottomBarItem {
  id: string;
  icon: string;
  label?: string;
  onClick: () => void;
}

export interface HUDChipConfig {
  id: string;
  label: string;
  value: string;
  accent?: boolean;
  position: "left" | "right";
}

export interface ModuleContext {
  cameraStream: MediaStream | null;
  requestCameraStream(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  releaseCameraStream(): void;
  settings: ModuleSettings;
  events: EventBus;
  ui: ModuleUI;
}

export interface ModuleSettings {
  get<T = string>(key: string): T | undefined;
  set<T = string>(key: string, value: T): void;
  onChange(key: string, callback: (value: unknown) => void): () => void;
}

export interface EventBus {
  emit(event: string, data?: unknown): void;
  on(event: string, callback: (data?: unknown) => void): () => void;
}

export interface ModuleUI {
  setTopBarItems(items: TopBarItem[]): void;
  setBottomBarItems(items: BottomBarItem[]): void;
  showHUDChip(chip: HUDChipConfig): void;
  hideHUDChip(id: string): void;
  clearAll(): void;
}

export interface RegisteredModule {
  module: FotonModule;
  context: ModuleContext | null;
  active: boolean;
}
