import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Settings } from "@/lib/convert";

interface Props {
  settings: Settings;
  onChange: (next: Settings) => void;
}

const PORTS = ["A", "B", "C", "D", "E", "F"];

export function SettingsPanel({ settings, onChange }: Props) {
  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="font-serif text-xl text-slate-800 dark:text-slate-100">
          Calibration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tune constants baked into the generated header.
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 pt-6">
        <Field label="Wheel Ø (mm)">
          <Input
            type="number"
            value={settings.wheelDiameter}
            onChange={(e) => set("wheelDiameter", Number(e.target.value) || 0)}
            className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
          />
        </Field>
        <Field label="Axle track (mm)">
          <Input
            type="number"
            value={settings.axleTrack}
            onChange={(e) => set("axleTrack", Number(e.target.value) || 0)}
            className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
          />
        </Field>
        <Field label="Drive Kp">
          <Input
            type="number"
            step="0.1"
            value={settings.driveKp}
            onChange={(e) => set("driveKp", Number(e.target.value) || 0)}
            className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
          />
        </Field>
        <Field label="Turn Kp">
          <Input
            type="number"
            step="0.1"
            value={settings.turnKp}
            onChange={(e) => set("turnKp", Number(e.target.value) || 0)}
            className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
          />
        </Field>
        <Field label="Turn tolerance (°)">
          <Input
            type="number"
            step="0.1"
            value={settings.turnTolerance}
            onChange={(e) => set("turnTolerance", Number(e.target.value) || 0)}
            className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
          />
        </Field>
        <Field label="Drive ports">
          <div className="flex gap-2">
            <Select
              value={settings.drivePorts[0]}
              onValueChange={(v) =>
                set("drivePorts", [v, settings.drivePorts[1]])
              }
            >
              <SelectTrigger className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PORTS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={settings.drivePorts[1]}
              onValueChange={(v) =>
                set("drivePorts", [settings.drivePorts[0], v])
              }
            >
              <SelectTrigger className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PORTS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Field>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </Label>
      {children}
    </div>
  );
}