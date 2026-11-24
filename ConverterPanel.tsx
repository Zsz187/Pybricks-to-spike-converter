import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convert } from "@/lib/convert";
import type { Attachment } from "@/components/AttachmentPanel";

const SAMPLE = `# Created with FLL Path Studio by FTC Team 27003
# Pybricks Python Path Script with Gyro Heading Correction
# Gyro gains: drive_kp=2.0, turn_kp=1.8, turn_tolerance=1.0°
from pybricks.hubs import PrimeHub
from pybricks.pupdevices import Motor
from pybricks.parameters import Port, Direction
from pybricks.robotics import DriveBase
from pybricks.tools import wait

hub = PrimeHub()
hub.imu.reset_heading(0)

left_motor = Motor(Port.A, Direction.COUNTERCLOCKWISE)
right_motor = Motor(Port.B, Direction.CLOCKWISE)
attach_D = Motor(Port.D)

drive_base = DriveBase(
    left_motor=left_motor,
    right_motor=right_motor,
    wheel_diameter=56.0,
    axle_track=140.0
)
drive_base.reset(0, 0)
drive_base.settings(
    straight_speed=500,
    straight_acceleration=1000,
    turn_rate=150,
    turn_acceleration=300
)

def run_fll_mission():
    print("Starting Gyro-Corrected Mission Routine...")
    # Step 1: Attachment motor D: 360 deg
    attach_D.run_angle(500, 360)
    # Step 2: Gyro Turn to -35.9°
    turn_gyro(-35.9)
    # Step 3: Gyro Straight 1144.5 mm at heading -35.9°
    drive_gyro(1144.5, target_heading=-35.9)
    # Step 4: Gyro Turn to -31.0°
    turn_gyro(-31.0)
    # Step 5: Gyro Turn to 106.4°
    turn_gyro(106.4)
    # Step 6: Gyro Straight 708.2 mm at heading 106.4°
    drive_gyro(708.2, target_heading=106.4)
    # Step 7: Gyro Turn to -76.0°
    turn_gyro(-76.0)
    # Step 8: Gyro Turn to 15.7°
    turn_gyro(15.7)
    # Step 9: Gyro Straight 1174.4 mm at heading 15.7°
    drive_gyro(1174.4, target_heading=15.7)
    # Step 10: Gyro Turn to 14.0°
    turn_gyro(14.0)
    print("Mission Complete!")

run_fll_mission()`;

interface Props {
  attachments: Attachment[];
  onConvert: (
    code: string,
    warnings: string[],
    stats: { straight: number; turns: number; other: number }
  ) => void;
}

export function ConverterPanel({ attachments, onConvert }: Props) {
  const [input, setInput] = useState(SAMPLE);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [stats, setStats] = useState({ straight: 0, turns: 0, other: 0 });

  function handleConvert() {
    const result = convert(input);
    const attachCount = attachments.length;
    const merged = {
      ...result.stats,
      other: result.stats.other + attachCount,
    };
    onConvert(result.code, result.warnings, merged);
    setWarnings(result.warnings);
    setStats(merged);
  }

  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="font-serif text-xl text-slate-800 dark:text-slate-100">
          Pybricks / FLL Path Studio Input
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Paste a full FLL Path Studio script. Setup and boilerplate are stripped
          automatically.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          className="min-h-72 rounded-xl border-slate-200 bg-slate-50 font-mono text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleConvert}
            className="rounded-xl bg-teal-700 px-6 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
          >
            Convert to SPIKE
          </Button>
          <Button
            variant="outline"
            onClick={() => setInput(SAMPLE)}
            className="rounded-xl border-slate-300 dark:border-slate-700"
          >
            Load Sample
          </Button>
          <Button
            variant="outline"
            onClick={() => setInput("")}
            className="rounded-xl border-slate-300 dark:border-slate-700"
          >
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatChip label="Straights" value={stats.straight} tone="teal" />
          <StatChip label="Turns" value={stats.turns} tone="emerald" />
          <StatChip label="Other" value={stats.other} tone="slate" />
        </div>

        {warnings.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Warnings
            </p>
            <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-200">
              {warnings.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "teal" | "emerald" | "slate";
}) {
  const tones: Record<string, string> = {
    teal: "bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:ring-teal-900",
    emerald:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900",
    slate:
      "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  };
  return (
    <div className={`rounded-xl px-4 py-3 ring-1 ${tones[tone]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">
        {label}
      </p>
    </div>
  );
}