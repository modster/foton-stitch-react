import type { CameraModeExtension, CameraModeId } from '../types/camera';

const modeRegistry = new Map<CameraModeId, CameraModeExtension>();

export function registerMode(mode: CameraModeExtension): void {
  modeRegistry.set(mode.id, mode);
}

export function getModes(): ReadonlyArray<CameraModeExtension> {
  return Array.from(modeRegistry.values());
}

export function getModeById(id: CameraModeId): CameraModeExtension | undefined {
  return modeRegistry.get(id);
}