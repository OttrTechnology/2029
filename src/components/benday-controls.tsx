import { RotateCcw } from "lucide-react"

import { PresetPicker } from "@/components/preset-picker"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DotMap, DotShape } from "@/components/ui/benday"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  DOT_COLORS,
  type BendaySettings,
} from "@/lib/benday-settings"
import { cn } from "@/lib/utils"

type BendayControlsProps = {
  value: BendaySettings
  onChange: (next: BendaySettings) => void
  onReset: () => void
  logoSrc: string
  invert: boolean
  dotMap: DotMap | null
}

const SHAPES: { value: DotShape; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "diamond", label: "Diamond" },
]

function NumberSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  format = (n) => n.toString(),
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  format?: (value: number) => string
  onChange: (value: number) => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="text-xs font-normal text-muted-foreground">
          {label}
        </Label>
        <span className="font-mono text-[11px] tabular-nums">{format(value)}</span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(next) => {
          const parsed = Array.isArray(next) ? next[0] : next
          if (typeof parsed === "number") onChange(parsed)
        }}
      />
    </div>
  )
}

export function BendayControls({
  value,
  onChange,
  onReset,
  logoSrc,
  invert,
  dotMap,
}: BendayControlsProps) {
  const patch = (partial: Partial<BendaySettings>) =>
    onChange({ ...value, ...partial })

  return (
    <Card
      size="sm"
      className="max-h-[min(70svh,560px)] w-[min(calc(100vw-1.5rem),300px)] overflow-y-auto bg-card/85 backdrop-blur-md"
    >
      <CardHeader className="border-b">
        <CardTitle>Benday</CardTitle>
        <CardAction>
          <Button variant="ghost" size="xs" onClick={onReset}>
            <RotateCcw />
            Reset
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 py-3">
        <PresetPicker
          preset={value.preset}
          onPresetChange={(preset) => patch({ preset })}
          logoSrc={logoSrc}
          invert={invert}
          color={value.color}
          shape={value.shape}
          dotMap={dotMap}
        />
        <NumberSlider
          id="size"
          label="Size"
          value={value.size}
          min={96}
          max={420}
          step={2}
          format={(n) => `${n}px`}
          onChange={(size) => patch({ size })}
        />
        <NumberSlider
          id="speed"
          label="Speed"
          value={value.speed}
          min={0.1}
          max={3}
          step={0.05}
          format={(n) => `${n.toFixed(2)}×`}
          onChange={(speed) => patch({ speed })}
        />
        <NumberSlider
          id="dotScale"
          label="Dot scale"
          value={value.dotScale}
          min={0.4}
          max={2.2}
          step={0.01}
          format={(n) => n.toFixed(2)}
          onChange={(dotScale) => patch({ dotScale })}
        />
        <div className="space-y-1.5">
          <Label className="text-xs font-normal text-muted-foreground">
            Shape
          </Label>
          <ToggleGroup
            value={[value.shape]}
            onValueChange={(next) => {
              const picked = next[0] as DotShape | undefined
              if (picked) patch({ shape: picked })
            }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {SHAPES.map((shape) => (
              <ToggleGroupItem
                key={shape.value}
                value={shape.value}
                className="flex-1"
              >
                {shape.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-normal text-muted-foreground">
            Color
          </Label>
          <div className="flex flex-wrap gap-2">
            {DOT_COLORS.map((color) => {
              const active = value.color === color.value
              return (
                <button
                  key={color.value}
                  type="button"
                  title={color.label}
                  aria-label={color.label}
                  aria-pressed={active}
                  onClick={() => patch({ color: color.value })}
                  className={cn(
                    "size-7 rounded-full border border-border transition-shadow",
                    color.value === "currentColor" && "bg-foreground",
                    active && "ring-2 ring-ring ring-offset-2 ring-offset-card"
                  )}
                  style={
                    color.value === "currentColor"
                      ? undefined
                      : { backgroundColor: color.value }
                  }
                />
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
