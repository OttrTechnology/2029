import type { DotShape, PresetName } from "@/components/ui/benday"

export type BendaySettings = {
  preset: PresetName
  size: number
  speed: number
  dotScale: number
  shape: DotShape
  color: string
}

export const DEFAULT_BENDAY_SETTINGS: BendaySettings = {
  preset: "orbit",
  size: 280,
  speed: 1,
  dotScale: 0.8,
  shape: "circle",
  color: "currentColor",
}

export const DOT_COLORS = [
  { label: "Ink", value: "currentColor" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Fuchsia", value: "#d946ef" },
  { label: "Scarlet", value: "#ff3c1c" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Emerald", value: "#10b981" },
  { label: "Sky", value: "#0ea5e9" },
] as const
