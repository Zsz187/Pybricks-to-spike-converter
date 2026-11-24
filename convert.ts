export interface ConvertResult {
  code: string;
  warnings: string[];
  stats: { straight: number; turns: number; other: number };
}

export interface Settings {
  wheelDiameter: number;
  axleTrack: number;
  driveKp: number;
  turnKp: number;
  turnTolerance: number;
  drivePorts: [string, string];
}

export const DEFAULT_SETTINGS: Settings = {
  wheelDiameter: 56.0,
  axleTrack: 140.0,
  driveKp: 2.0,
  turnKp: 1.8,
  turnTolerance: 1.0,
  drivePorts: ["A", "B"],
};

function buildHeader(s: Settings): string {
  return `# Auto-generated SPIKE Prime Python from Pybricks (FLL Path Studio)
# Requires: SPIKE Prime hub, drive motors on ${s.drivePorts[0]} & ${s.drivePorts[1]}, attachments on C-F, gyro via hub IMU
from spike import PrimeHub, MotorPair, Motor
from spike.control import wait_for_seconds, wait_until, Timer
import math

hub = PrimeHub()
drive = MotorPair('${s.drivePorts[0]}', '${s.drivePorts[1]}')
gyro = hub.motion_sensor

# --- Attachment motors (edit ports here) ---
ATTACH_PORTS = ['D', 'C', 'E', 'F']
attach_motors = {p: Motor(p) for p in ATTACH_PORTS}

# --- Calibration constants (tune for your robot) ---
WHEEL_DIAMETER_MM = ${s.wheelDiameter}
AXLE_TRACK_MM = ${s.axleTrack}
DEG_PER_MM = 360 / (math.pi * WHEEL_DIAMETER_MM)
DRIVE_KP = ${s.driveKp}
TURN_KP = ${s.turnKp}
TURN_TOLERANCE = ${s.turnTolerance}

def angle_diff(a, b):
    return (a - b + 180) % 360 - 180

def reset_heading():
    gyro.reset_yaw_angle()

def drive_gyro(distance_mm, speed=500, target_heading=0, kp=DRIVE_KP, timeout_ms=None):
    """Drive straight with proportional gyro correction (with timeout)."""
    reset_heading()
    sign = 1 if distance_mm >= 0 else -1
    target_dist = abs(distance_mm)
    if timeout_ms is None:
        timeout_ms = int(target_dist / max(1, abs(speed)) * 2000) + 1500
    timer = Timer()
    traveled = 0
    while traveled < target_dist and timer.time() * 1000 < timeout_ms:
        error = angle_diff(gyro.get_yaw_angle(), target_heading)
        correction = -kp * error
        drive.start(sign * speed, sign * speed + correction)
        wait_for_seconds(0.01)
        traveled += abs(speed) * 0.01 * 0.9
    drive.stop()

def turn_gyro(target_angle, turn_speed=150, kp=TURN_KP, tolerance=TURN_TOLERANCE, timeout_ms=5000):
    """Pivot to an absolute heading by the shortest way (with timeout)."""
    timer = Timer()
    while timer.time() * 1000 < timeout_ms:
        error = angle_diff(target_angle, gyro.get_yaw_angle())
        if abs(error) <= tolerance:
            break
        rate = max(-turn_speed, min(turn_speed, error * kp))
        drive.start(rate, -rate)
        wait_for_seconds(0.01)
    drive.stop()

def run_angle(port, speed, angle):
    """Rotate an attachment motor by a number of degrees."""
    attach_motors[port].run_for_degrees(int(speed), int(angle))

def run_attach(port, speed, seconds):
    """Run an attachment motor for a number of seconds."""
    attach_motors[port].start(int(speed))
    wait_for_seconds(seconds)
    attach_motors[port].stop()

`;
}

function normalize(line: string): string {
  return line.replace(/\s+/g, " ").trim();
}

function parseArgs(argStr: string): Record<string, string> {
  const args: Record<string, string> = {};
  const parts = argStr.split(",");
  let positional = 0;
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    if (eq > -1) {
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      args[key] = val;
    } else {
      args[`_${positional++}`] = trimmed;
    }
  }
  return args;
}

// Matches both free calls (name(...)) and method calls (obj.name(...)).
function extractCall(line: string, name: string): string | null {
  const re = new RegExp(`(?:^|[^\\w])${name}\\s*\\(([^)]*)\\)`, "i");
  const m = line.match(re);
  return m ? m[1] : null;
}

// Lines that are pure boilerplate / setup and should be silently ignored.
const IGNORE_PATTERNS: RegExp[] = [
  /^(from|import)\s/i,
  /^hub\s*=/i,
  /^left_motor\s*=/i,
  /^right_motor\s*=/i,
  /^attach_\w+\s*=/i,
  /^drive_base\s*=/i,
  /^def\s/i,
  /^return\b/i,
  /^print\s*\(/i,
  /^run_fll_mission\s*\(\s*\)/i,
  /^[a-z_]\w*\s*\(\s*\)$/i,
  /^\)\s*[,;]?\s*$/,
  /^\w+\s*=\s*[\w.]+\(/i,
  /^(wheel_diameter|axle_track|straight_speed|straight_acceleration|turn_rate|turn_acceleration)\s*=/i,
  /^\w+\s*=\s*-?\d+(?:\.\d+)?\s*,?$/i,
  /^\w+\s*=\s*[\w.]+\([^)]*\)\s*,?$/i,
  /reset_heading|\.settings\s*\(|\.reset\s*\(|\.imu\.|Port\.|Direction\./i,
];

function isIgnorable(line: string): boolean {
  return IGNORE_PATTERNS.some((re) => re.test(line));
}

export function convert(
  input: string,
  settings: Settings = DEFAULT_SETTINGS
): ConvertResult {
  const warnings: string[] = [];
  const stats = { straight: 0, turns: 0, other: 0 };
  const body: string[] = [];

  const lines = input.split("\n");
  for (const raw of lines) {
    const line = normalize(raw);
    if (!line || line.startsWith("#")) continue;

    // drive_gyro(distance, target_heading=.., speed=..)
    const dg = extractCall(line, "drive_gyro");
    if (dg !== null) {
      const a = parseArgs(dg);
      const dist = a["_0"] ?? "0";
      const heading = a["target_heading"] ?? "0";
      const speed = a["speed"] ?? "500";
      body.push(`drive_gyro(${dist}, speed=${speed}, target_heading=${heading})`);
      stats.straight++;
      continue;
    }

    // turn_gyro(angle, ...)
    const tg = extractCall(line, "turn_gyro");
    if (tg !== null) {
      const a = parseArgs(tg);
      const angle = a["_0"] ?? "0";
      const speed = a["turn_speed"] ?? "150";
      body.push(`turn_gyro(${angle}, turn_speed=${speed})`);
      stats.turns++;
      continue;
    }

    // run_angle(speed, angle) on a named attachment motor: attach_D.run_angle(500, 360)
    const ra = extractCall(line, "run_angle");
    if (ra !== null) {
      const a = parseArgs(ra);
      const speed = a["_0"] ?? "500";
      const angle = a["_1"] ?? "0";
      const motorMatch = line.match(/([A-Za-z_]\w*)\s*\.\s*run_angle/i);
      const varName = motorMatch ? motorMatch[1] : "attach_D";
      const port = varName.match(/_([A-F])$/i)?.[1]?.toUpperCase() ?? "D";
      body.push(`run_angle('${port}', ${speed}, ${angle})`);
      stats.other++;
      continue;
    }

    // run_time / run(speed) on a named attachment motor
    const rt = extractCall(line, "run_time");
    if (rt !== null) {
      const a = parseArgs(rt);
      const speed = a["_0"] ?? "500";
      const seconds = a["_1"] ?? "1";
      const motorMatch = line.match(/([A-Za-z_]\w*)\s*\.\s*run_time/i);
      const varName = motorMatch ? motorMatch[1] : "attach_D";
      const port = varName.match(/_([A-F])$/i)?.[1]?.toUpperCase() ?? "D";
      body.push(`run_attach('${port}', ${speed}, ${seconds})`);
      stats.other++;
      continue;
    }

    // simple straight / drive / move
    const straightMatch = line.match(
      /(?:straight|drive|move)\s*\(\s*(-?\d+(?:\.\d+)?)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)/i
    );
    if (straightMatch) {
      const dist = straightMatch[1];
      const speed = straightMatch[2] ?? "500";
      body.push(`drive_gyro(${dist}, speed=${speed})`);
      stats.straight++;
      continue;
    }

    // simple turn / rotate
    const turnMatch = line.match(
      /(?:turn|rotate)\s*\(\s*(-?\d+(?:\.\d+)?)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)/i
    );
    if (turnMatch) {
      const angle = turnMatch[1];
      const speed = turnMatch[2] ?? "150";
      body.push(`turn_gyro(${angle}, turn_speed=${speed})`);
      stats.turns++;
      continue;
    }

    // wait
    const waitMatch = line.match(/wait\s*\(\s*(\d+(?:\.\d+)?)\s*\)/i);
    if (waitMatch) {
      body.push(`wait_for_seconds(${waitMatch[1]})`);
      stats.other++;
      continue;
    }

    // stop
    if (/stop\s*\(\s*\)/i.test(line)) {
      body.push("drive.stop()");
      stats.other++;
      continue;
    }

    // silently ignore setup / boilerplate / continuation lines
    if (isIgnorable(line)) {
      continue;
    }

    warnings.push(`Unrecognized line skipped: "${line}"`);
  }

  if (body.length === 0) {
    return {
      code: "",
      warnings: ["No recognizable Pybricks motion commands found."],
      stats,
    };
  }

  const mission = [
    "def run_fll_mission():",
    '    print("Starting Gyro-Corrected Mission Routine...")',
    ...body.map((b) => `    ${b}`),
    '    print("Mission Complete!")',
    "",
    "run_fll_mission()",
    "",
  ];

  return { code: buildHeader(settings) + mission.join("\n"), warnings, stats };
}

export function injectAttachments(
  code: string,
  attachments: { port: string; speed: number; angle: number }[]
): string {
  if (!code || attachments.length === 0) return code;
  const lines = attachments.map(
    (a) => `    run_angle('${a.port}', ${a.speed}, ${a.angle})`
  );
  const marker = '    print("Starting Gyro-Corrected Mission Routine...")';
  return code.replace(marker, [marker, ...lines].join("\n"));
}