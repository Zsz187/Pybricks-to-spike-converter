import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export interface Attachment {
  id: string;
  port: string;
  speed: number;
  angle: number;
}

interface Props {
  attachments: Attachment[];
  onChange: (next: Attachment[]) => void;
}

const PORTS = ["A", "B", "C", "D", "E", "F"];

export function AttachmentPanel({ attachments, onChange }: Props) {
  function add() {
    onChange([
      ...attachments,
      {
        id: Math.random().toString(36).slice(2),
        port: "D",
        speed: 500,
        angle: 360,
      },
    ]);
  }

  function update(id: string, patch: Partial<Attachment>) {
    onChange(attachments.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function remove(id: string) {
    onChange(attachments.filter((a) => a.id !== id));
  }

  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="font-serif text-xl text-slate-800 dark:text-slate-100">
              Attachment Motors
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Add, edit, and remove attachment moves injected at mission start.
            </p>
          </div>
          <Button
            size="sm"
            onClick={add}
            className="rounded-lg bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-6">
        {attachments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No attachment moves yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Click Add to create a motor move (e.g. port D, 500 speed, 360°).
            </p>
          </div>
        ) : (
          attachments.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-12 items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="col-span-3 space-y-1">
                <Label className="text-xs text-slate-500 dark:text-slate-400">
                  Port
                </Label>
                <Select
                  value={a.port}
                  onValueChange={(v) => update(a.id, { port: v })}
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
              <div className="col-span-3 space-y-1">
                <Label className="text-xs text-slate-500 dark:text-slate-400">
                  Speed
                </Label>
                <Input
                  type="number"
                  value={a.speed}
                  onChange={(e) =>
                    update(a.id, { speed: Number(e.target.value) || 0 })
                  }
                  className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div className="col-span-3 space-y-1">
                <Label className="text-xs text-slate-500 dark:text-slate-400">
                  Angle (°)
                </Label>
                <Input
                  type="number"
                  value={a.angle}
                  onChange={(e) =>
                    update(a.id, { angle: Number(e.target.value) || 0 })
                  }
                  className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div className="col-span-3 flex justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => remove(a.id)}
                  aria-label="Remove attachment"
                  className="rounded-lg border-slate-300 text-rose-600 hover:bg-rose-50 dark:border-slate-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}