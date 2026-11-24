/* Presentational components. Relies on globals from converter.jsx. */

const { useState, useEffect } = React;

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefers = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefers);
    document.documentElement.classList.toggle("dark", prefers);
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }
  return (
    <button onClick={toggle} aria-label="Toggle dark mode"
      className="rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20">
      {dark ? "Light" : "Dark"}
    </button>
  );
}

function StatChip({ label, value, tone }) {
  const tones = {
    teal: "bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:ring-teal-900",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900",
    slate: "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  };
  return (
    <div className={"rounded-xl px-4 py-3 ring-1 " + tones[tone]}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</p>
    </div>
  );
}

function ConverterPanel({ attachments, onConvert }) {
  const [input, setInput] = useState(SAMPLE);
  const [warnings, setWarnings] = useState([]);
  const [stats, setStats] = useState({ straight: 0, turns: 0, other: 0 });

  function handleConvert() {
    const result = convert(input);
    const merged = {
      straight: result.stats.straight,
      turns: result.stats.turns,
      other: result.stats.other + attachments.length,
    };
    onConvert(result.code);
    setWarnings(result.warnings);
    setStats(merged);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <h2 className="font-serif text-xl text-slate-800 dark:text-slate-100">Pybricks / FLL Path Studio Input</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Paste any Pybricks script. The full API is mapped to SPIKE Prime Python.</p>
      </div>
      <div className="space-y-4 px-6 py-6">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false}
          className="min-h-72 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleConvert}
            className="rounded-xl bg-teal-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500">
            Convert to SPIKE
          </button>
          <button onClick={() => setInput(SAMPLE)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            Load Sample
          </button>
          <button onClick={() => setInput("")}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            Clear
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatChip label="Straights" value={stats.straight} tone="teal" />
          <StatChip label="Turns" value={stats.turns} tone="emerald" />
          <StatChip label="Other" value={stats.other} tone="slate" />
        </div>
        {warnings.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">Warnings</p>
            <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-200">
              {warnings.map((w, i) => <li key={i}>- {w}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function AttachmentPanel({ attachments, onChange }) {
  const PORTS = ["A", "B", "C", "D", "E", "F"];
  function add() {
    onChange([...attachments, { id: Math.random().toString(36).slice(2), port: "D", speed: 500, angle: 360 }]);
  }
  function update(id, patch) {
    onChange(attachments.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }
  function remove(id) {
    onChange(attachments.filter((a) => a.id !== id));
  }
  const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <div>
          <h2 className="font-serif text-xl text-slate-800 dark:text-slate-100">Attachment Motors</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Add, edit, and remove attachment moves.</p>
        </div>
        <button onClick={add}
          className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500">
          + Add
        </button>
      </div>
      <div className="space-y-3 px-6 py-6">
        {attachments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No attachment moves yet</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Click Add to create a motor move (e.g. port D, 500 speed, 360 deg).</p>
          </div>
        ) : (
          attachments.map((a) => (
            <div key={a.id} className="grid grid-cols-12 items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div className="col-span-3 space-y-1">
                <label className="text-xs text-slate-500 dark:text-slate-400">Port</label>
                <select value={a.port} onChange={(e) => update(a.id, { port: e.target.value })} className={inputCls}>
                  {PORTS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-xs text-slate-500 dark:text-slate-400">Speed</label>
                <input type="number" value={a.speed} onChange={(e) => update(a.id, { speed: Number(e.target.value) || 0 })} className={inputCls} />
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-xs text-slate-500 dark:text-slate-400">Angle (deg)</label>
                <input type="number" value={a.angle} onChange={(e) => update(a.id, { angle: Number(e.target.value) || 0 })} className={inputCls} />
              </div>
              <div className="col-span-3 flex justify-end">
                <button onClick={() => remove(a.id)} aria-label="Remove attachment"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50 dark:border-slate-700 dark:text-rose-400 dark:hover:bg-rose-950/40">
                  x
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SettingsPanel({ settings, onChange }) {
  const PORTS = ["A", "B", "C", "D", "E", "F"];
  function set(key, value) { onChange({ ...settings, [key]: value }); }
  const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <h2 className="font-serif text-xl text-slate-800 dark:text-slate-100">Calibration</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Tune constants baked into the generated header.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 px-6 py-6">
        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400">Wheel diameter (mm)</label>
          <input type="number" value={settings.wheelDiameter} onChange={(e) => set("wheelDiameter", Number(e.target.value) || 0)} className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400">Axle track (mm)</label>
          <input type="number" value={settings.axleTrack} onChange={(e) => set("axleTrack", Number(e.target.value) || 0)} className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400">Drive Kp</label>
          <input type="number" step="0.1" value={settings.driveKp} onChange={(e) => set("driveKp", Number(e.target.value) || 0)} className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400">Turn Kp</label>
          <input type="number" step="0.1" value={settings.turnKp} onChange={(e) => set("turnKp", Number(e.target.value) || 0)} className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400">Turn tolerance (deg)</label>
          <input type="number" step="0.1" value={settings.turnTolerance} onChange={(e) => set("turnTolerance", Number(e.target.value) || 0)} className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400">Drive ports</label>
          <div className="flex gap-2">
            <select value={settings.drivePorts[0]} onChange={(e) => set("drivePorts", [e.target.value, settings.drivePorts[1]])} className={inputCls}>
              {PORTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={settings.drivePorts[1]} onChange={(e) => set("drivePorts", [settings.drivePorts[0], e.target.value])} className={inputCls}>
              {PORTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApiMapPanel() {
  const rows = [
    ["PrimeHub / InventorHub", "PrimeHub"],
    ["DriveBase", "MotorPair"],
    ["Motor / DCMotor", "Motor"],
    ["ColorSensor", "ColorSensor"],
    ["UltrasonicSensor", "DistanceSensor"],
    ["ForceSensor / TouchSensor", "ForceSensor"],
    ["hub.imu", "hub.motion_sensor"],
    ["hub.imu.heading()", "gyro.get_yaw_angle()"],
    ["hub.imu.reset_heading()", "gyro.reset_yaw_angle()"],
    ["hub.battery", "hub.battery"],
    ["hub.speaker", "hub.sound"],
    ["hub.light", "hub.status_light"],
    ["hub.display", "hub.display"],
    ["wait()", "wait_for_seconds()"],
    ["StopWatch / Timer", "Timer"],
    ["motor.run_angle()", "motor.run_for_degrees()"],
    ["motor.run_time()", "motor.run_for_seconds()"],
    ["motor.run()", "motor.start()"],
    ["motor.angle()", "motor.get_position()"],
    ["motor.speed()", "motor.get_speed()"],
    ["drive_base.drive()", "drive.start()"],
    ["drive_base.straight()", "gyro drive_gyro()"],
    ["drive_base.turn()", "gyro turn_gyro()"],
    ["drive_scurve()", "gyro drive_scurve()"],
    ["drive_tank_curve()", "gyro drive_tank_curve()"],
    ["sensor.color()", "sensor.get_color()"],
    ["sensor.reflection()", "sensor.get_reflected_light_intensity()"],
    ["sensor.distance()", "sensor.get_distance_cm()"],
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <h2 className="font-serif text-xl text-slate-800 dark:text-slate-100">API Map</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Full Pybricks to SPIKE Prime symbol reference.</p>
      </div>
      <div className="max-h-80 overflow-auto px-6 py-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-slate-400 dark:text-slate-500">
              <th className="pb-2 font-medium uppercase tracking-wide">Pybricks</th>
              <th className="pb-2 font-medium uppercase tracking-wide">SPIKE Prime</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {rows.map(([a, b], i) => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-2 pr-3 text-rose-600 dark:text-rose-400">{a}</td>
                <td className="py-2 text-teal-700 dark:text-teal-300">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReferencePanel({ output }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) { setCopied(false); }
  }
  function download() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spike_mission.py";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <h2 className="font-serif text-xl text-slate-800 dark:text-slate-100">SPIKE Prime Output</h2>
        <div className="flex gap-2">
          <button onClick={copy} disabled={!output}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            {copied ? "Copied!" : "Copy"}
          </button>
          <button onClick={download} disabled={!output}
            className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:opacity-40 dark:bg-teal-600 dark:hover:bg-teal-500">
            Download
          </button>
        </div>
      </div>
      <div className="flex-1 px-6 py-6">
        {output ? (
          <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-teal-100 ring-1 ring-slate-800 dark:bg-slate-950">
            <code>{output}</code>
          </pre>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No output yet</p>
            <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">Paste a script and hit Convert to generate SPIKE Prime Python.</p>
          </div>
        )}
      </div>
    </div>
  );
}