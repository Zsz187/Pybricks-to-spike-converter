import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  output: string;
}

export function ReferencePanel({ output }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
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
    <Card className="flex h-full flex-col rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="font-serif text-xl text-slate-800 dark:text-slate-100">
            SPIKE Prime Output
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={copy}
              disabled={!output}
              className="rounded-lg border-slate-300 dark:border-slate-700"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              size="sm"
              onClick={download}
              disabled={!output}
              className="rounded-lg bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        {output ? (
          <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-teal-100 ring-1 ring-slate-800 dark:bg-slate-950 dark:ring-slate-800">
            <code>{output}</code>
          </pre>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No output yet
            </p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Paste a script and hit Convert to generate SPIKE Prime Python.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}