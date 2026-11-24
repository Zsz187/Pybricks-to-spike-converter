import { useState } from "react";
import { ConverterPanel } from "@/components/ConverterPanel";
import { AttachmentPanel, type Attachment } from "@/components/AttachmentPanel";
import { ReferencePanel } from "@/components/ReferencePanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/convert";

export default function App() {
  const [output, setOutput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-teal-900/20 bg-gradient-to-r from-teal-800 to-emerald-700 dark:from-teal-950 dark:to-emerald-900">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-100/80">
              FLL Path Studio → SPIKE Prime
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-white sm:text-4xl">
              Pybricks to SPIKE Converter
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-teal-50/90">
              Translate gyro-corrected straights, gyro turns, and attachment
              motor moves into ready-to-run SPIKE Prime Python.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <ConverterPanel
            attachments={attachments}
            onConvert={(code) => setOutput(code)}
          />
          <AttachmentPanel
            attachments={attachments}
            onChange={setAttachments}
          />
          <SettingsPanel settings={settings} onChange={setSettings} />
        </div>
        <div className="lg:col-span-2">
          <ReferencePanel output={output} />
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-slate-500 dark:text-slate-400">
          Runs entirely in your browser. Tune gains and ports in the generated
          code before running on hardware.
        </div>
      </footer>
    </div>
  );
}