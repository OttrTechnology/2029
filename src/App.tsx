import { useMemo, useState } from "react"

import { BendayControls } from "@/components/benday-controls"
import { useTheme } from "@/components/theme-provider"
import { Benday, useDotMap } from "@/components/ui/benday"
import { InnerMoon } from "@/components/ui/inner-moon"
import {
  DEFAULT_BENDAY_SETTINGS,
  type BendaySettings,
} from "@/lib/benday-settings"

export function App() {
  const { resolvedTheme, setTheme } = useTheme()
  const [settings, setSettings] = useState<BendaySettings>(
    DEFAULT_BENDAY_SETTINGS
  )
  const isDark = resolvedTheme === "dark"
  const logoSrc = useMemo(
    () => (isDark ? "/logo-dark-mode.png" : "/logo-light-mode.png"),
    [isDark]
  )
  const bake = useMemo(
    () => ({ invert: isDark, grid: 48, trim: true }),
    [isDark]
  )
  const { dotMap } = useDotMap(logoSrc, bake)

  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="flex h-svh w-full items-center justify-center">
        <Benday
          src={logoSrc}
          dotMap={dotMap ?? undefined}
          preset={settings.preset}
          size={settings.size}
          speed={settings.speed}
          dotScale={settings.dotScale}
          shape={settings.shape}
          color={settings.color}
          state="thinking"
          bake={bake}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
        <p className="pointer-events-none text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Ottr
        </p>
        <InnerMoon
          toggled={isDark}
          className="pointer-events-auto inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background text-base text-foreground transition-colors hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-end p-4">
        <div className="pointer-events-auto">
          <BendayControls
            logoSrc={logoSrc}
            invert={isDark}
            dotMap={dotMap}
            value={settings}
            onChange={setSettings}
            onReset={() => setSettings(DEFAULT_BENDAY_SETTINGS)}
          />
        </div>
      </div>
    </div>
  )
}

export default App
