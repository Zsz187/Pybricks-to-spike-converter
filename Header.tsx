export function Header() {
  return (
    <header className="border-b border-teal-900/20 bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-200">
            LEGO Robotics Toolkit
          </p>
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Pybricks → SPIKE Prime
          </h1>
          <p className="mt-1 max-w-xl text-sm text-teal-100/90">
            Translate Pybricks drive and gyro code into SPIKE Prime Python with
            straight-line and gyro-turn helpers.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-teal-50 ring-1 ring-white/20">
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          Runs entirely in your browser
        </div>
      </div>
    </header>
  );
}