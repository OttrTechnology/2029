import {
  Benday,
  PRESET_FAMILIES,
  PRESET_NAMES,
  PRESETS,
  type DotMap,
  type PresetName,
} from "@/components/ui/benday"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"
import { useMemo, useState } from "react"

type PresetPickerProps = {
  preset: PresetName
  onPresetChange: (preset: PresetName) => void
  logoSrc: string
  invert: boolean
  color: string
  shape: "circle" | "square" | "diamond"
  dotMap: DotMap | null
}

export function PresetPicker({
  preset,
  onPresetChange,
  logoSrc,
  invert,
  color,
  shape,
  dotMap,
}: PresetPickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const groups = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    return PRESET_FAMILIES.map((family) => ({
      family,
      presets: PRESET_NAMES.filter((name) => {
        const definition = PRESETS[name]
        if (definition.family !== family) {
          return false
        }
        if (!search) {
          return true
        }
        return `${definition.label} ${definition.description} ${family}`
          .toLocaleLowerCase()
          .includes(search)
      }),
    })).filter((group) => group.presets.length > 0)
  }, [query])

  const preview = (name: PresetName, size: number) => (
    <Benday
      color={color}
      dotMap={dotMap ?? undefined}
      src={dotMap ? undefined : logoSrc}
      bake={dotMap ? undefined : { invert, grid: 48, trim: true }}
      preset={name}
      shape={shape}
      size={size}
      speed={1}
      state="thinking"
      aria-hidden
    />
  )

  const selected = PRESETS[preset]
  const matchCount = groups.reduce(
    (count, group) => count + group.presets.length,
    0
  )

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-normal text-muted-foreground">Preset</Label>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            setQuery("")
          }
        }}
      >
        <DialogTrigger
          render={
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-background px-2.5 py-2 text-left transition-colors hover:bg-muted/60 dark:border-input dark:bg-input/30"
            />
          }
        >
          <span className="shrink-0 text-foreground">{preview(preset, 32)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              {selected.label}
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {selected.family}
            </span>
          </span>
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </DialogTrigger>
        <DialogContent
          className="flex max-h-[min(80svh,560px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Select a preset</DialogTitle>
          <div className="flex items-center gap-2 border-b px-3 py-2.5">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search presets…"
              type="search"
              value={query}
            />
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
              {matchCount}
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {groups.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No presets found.
              </p>
            ) : (
              groups.map((group) => (
                <div key={group.family}>
                  <div className="sticky top-0 z-10 bg-popover/95 px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase backdrop-blur-sm">
                    {group.family}
                  </div>
                  <div className="flex flex-col gap-0.5 px-1.5 pb-2">
                    {group.presets.map((name) => {
                      const definition = PRESETS[name]
                      const active = name === preset
                      return (
                        <button
                          key={name}
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted/70",
                            active && "bg-muted"
                          )}
                          onClick={() => {
                            onPresetChange(name)
                            setOpen(false)
                            setQuery("")
                          }}
                        >
                          <span className="shrink-0 text-foreground">
                            {preview(name, 48)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {definition.label}
                            </span>
                            <span className="block truncate text-[11px] text-muted-foreground">
                              {definition.description}
                            </span>
                          </span>
                          {active ? (
                            <CheckIcon className="size-4 shrink-0 text-foreground" />
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
      <p className="text-[11px] leading-snug text-muted-foreground">
        {selected.description}
      </p>
    </div>
  )
}
