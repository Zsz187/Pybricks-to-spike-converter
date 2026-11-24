/* =====================================================================
   PYBRICKS -> SPIKE PRIME CONVERSION ENGINE
   Exposes globals: DEFAULT_SETTINGS, convert(), IMPORT_MAP, etc.
   ===================================================================== */

const DEFAULT_SETTINGS = {
  wheelDiameter: 56.0,
  axleTrack: 112.0,
  driveKp: 4.0,
  turnKp: 3.5,
  turnTolerance: 1.0,
  drivePorts: ["A", "B"],
};

const IMPORT_MAP = {
  "pybricks.hubs": "spike",
  "pybricks.pupdevices": "spike",
  "pybricks.parameters": "spike",
  "pybricks.robotics": "spike",
  "pybricks.tools": "spike.control",
  "pybricks.geometry": "spike",
  "pybricks.iodevices": "spike",
  "pybricks.media": "spike",
  "pybricks.messaging": "spike",
  "pybricks.ev3devices": "spike",
  "pybricks.nxtdevices": "spike",
  "pybricks": "spike",
};

const SYMBOL_MAP = {
  PrimeHub: "PrimeHub",
  InventorHub: "PrimeHub",
  EssentialHub: "PrimeHub",
  CityHub: "PrimeHub",
  TechnicHub: "PrimeHub",
  MoveHub: "PrimeHub",
  Motor: "Motor",
  DCMotor: "Motor",
  DriveBase: "MotorPair",
  ColorSensor: "ColorSensor",
  ColorDistanceSensor: "ColorSensor",
  UltrasonicSensor: "DistanceSensor",
  ForceSensor: "ForceSensor",
  TouchSensor: "ForceSensor",
  InfraredSensor: "DistanceSensor",
  Port: "Port",
  Direction: "Direction",
  Stop: "Stop",
  Color: "Color",
  Button: "Button",
  wait: "wait_for_seconds",
  StopWatch: "Timer",
  Timer: "Timer",
  Matrix: "Matrix",
  vector: "vector",
};

const METHOD_MAP = {
  ".imu.reset_heading": ".motion_sensor.reset_yaw_angle",
  ".imu.heading": ".motion_sensor.get_yaw_angle",
  ".imu.angle": ".motion_sensor.get_yaw_angle",
  ".imu.rotation": ".motion_sensor.get_yaw_angle",
  ".imu.acceleration": ".motion_sensor.get_acceleration",
  ".imu.angular_velocity": ".motion_sensor.get_angular_velocity",
  ".imu.tilt": ".motion_sensor.get_tilt_angles",
  ".imu.ready": ".motion_sensor.is_ready",
  ".imu.settings": ".motion_sensor.set_yaw_angle",
  ".battery.voltage": ".battery.get_voltage",
  ".battery.current": ".battery.get_current",
  ".battery.percentage": ".battery.get_percentage",
  ".buttons.pressed": ".buttons.is_pressed",
  ".speaker.beep": ".sound.beep",
  ".speaker.volume": ".sound.set_volume",
  ".light.on": ".status_light.on",
  ".light.off": ".status_light.off",
  ".light.blink": ".status_light.blink",
  ".display.text": ".display.show",
  ".display.image": ".display.show",
  ".display.off": ".display.clear",
  ".run": ".start",
  ".run_time": ".run_for_seconds",
  ".run_angle": ".run_for_degrees",
  ".run_until_stalled": ".run_to_position",
  ".stop": ".stop",
  ".brake": ".stop",
  ".hold": ".stop",
  ".coast": ".stop",
  ".angle": ".get_position",
  ".speed": ".get_speed",
  ".load": ".get_speed",
  ".reset_angle": ".set_position",
  ".dc": ".start",
  ".straight": ".move",
  ".turn": ".move",
  ".drive": ".start",
  ".drive_time": ".start",
  ".drive_angle": ".start",
  ".curve": ".move",
  ".reset": ".reset",
  ".settings": ".set_default_speed",
  ".distance": ".get_distance",
  ".color": ".get_color",
  ".reflection": ".get_reflected_light_intensity",
  ".ambient": ".get_ambient_light_intensity",
  ".rgb": ".get_rgb_intensity",
  ".hsv": ".get_hsv",
  ".presence": ".get_distance_cm",
  ".force": ".get_force_newton",
  ".pressed": ".is_pressed",
  ".touched": ".is_pressed",
  ".measure": ".get_distance_cm",
};

const CONST_MAP = {
  "Direction.CLOCKWISE": "Direction.CLOCKWISE",
  "Direction.COUNTERCLOCKWISE": "Direction.COUNTERCLOCKWISE",
  "Stop.COAST": "Stop.COAST",
  "Stop.BRAKE": "Stop.BRAKE",
  "Stop.HOLD": "Stop.HOLD",
  "Color.RED": "Color.RED",
  "Color.GREEN": "Color.GREEN",
  "Color.BLUE": "Color.BLUE",
  "Color.YELLOW": "Color.YELLOW",
  "Color.WHITE": "Color.WHITE",
  "Color.BLACK": "Color.BLACK",
  "Color.NONE": "Color.NONE",
  "Button.LEFT": "Button.LEFT",
  "Button.RIGHT": "Button.RIGHT",
  "Button.CENTER": "Button.CENTER",
};

function buildHeader(s) {
  return `# =====================================================================
# Auto-generated SPIKE Prime Python from Pybricks (FLL Path Studio)
# Converted by Pybricks -> SPIKE Converter
# Drive motors on ${s.drivePorts[0]} & ${s.drivePorts[1]}, attachments on C-F, gyro via hub IMU
# =====================================================================
from spike import PrimeHub, MotorPair, Motor, ColorSensor, DistanceSensor, ForceSensor
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

def drive_gyro(distance_mm, speed=400, target_heading=0, kp=DRIVE_KP, timeout_ms=None):
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

def turn_gyro(target_angle, turn_speed=360, kp=TURN_KP, tolerance=TURN_TOLERANCE, timeout_ms=5000):
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

def drive_scurve(distance_mm, speed=400, target_heading=0, kp=DRIVE_KP,
                 accel=700, jerk_acc=3500, jerk_dec=1925, dt_ms=20):
    """Rest-to-rest S-curve velocity profile with gyro correction."""
    reset_heading()
    sign = 1 if distance_mm >= 0 else -1
    D = abs(distance_mm)
    if D < 1:
        return
    V = abs(speed)
    A = max(1, abs(accel))
    JA = max(1, abs(jerk_acc))
    JD = max(1, abs(jerk_dec))

    def half_dist(v, j):
        tj = A / j
        ta = v / A - tj
        if ta >= 0:
            return (v * v) / (2 * A) + (v * tj) / 2
        tje = (v / j) ** 0.5
        return v * tje

    def half_time(v, j):
        tj = A / j
        ta = v / A - tj
        if ta >= 0:
            return ta + 2 * tj
        return 2 * ((v / j) ** 0.5)

    lo, hi = 0.0, float(V)
    for _ in range(24):
        mid = 0.5 * (lo + hi)
        if half_dist(mid, JA) + half_dist(mid, JD) <= D:
            lo = mid
        else:
            hi = mid
    v_peak = lo if lo > 1 else min(V, D)
    t_acc = half_time(v_peak, JA)
    t_dec = half_time(v_peak, JD)
    d_pair = half_dist(v_peak, JA) + half_dist(v_peak, JD)
    t_cruise = max(0, (D - d_pair) / max(1, v_peak))
    T = t_acc + t_cruise + t_dec
    timer = Timer()
    while timer.time() * 1000 < int(T * 1000) + 2000:
        t = timer.time()
        if t <= t_acc and t_acc > 0:
            tau = t / t_acc
            cmd = v_peak * (3 * tau * tau - 2 * tau * tau * tau)
        elif t <= t_acc + t_cruise:
            cmd = v_peak
        elif T > t_acc + t_cruise:
            tau = (t - t_acc - t_cruise) / max(1e-6, t_dec)
            tau = max(0, min(1, tau))
            cmd = v_peak * (1 - (3 * tau * tau - 2 * tau * tau * tau))
        else:
            cmd = 0
        cmd = max(0, min(V, cmd))
        error = angle_diff(gyro.get_yaw_angle(), target_heading)
        drive.start(cmd * sign, cmd * sign - kp * error)
        wait_for_seconds(dt_ms / 1000.0)
    drive.stop()

def drive_tank_curve(distance_mm, speed=200, turn_rate=0, target_heading=0, kp=2.0, timeout_ms=None):
    """Follow a short path chord with simultaneous drive + turn (tank differential)."""
    reset_heading()
    sign = 1 if distance_mm >= 0 else -1
    target_dist = abs(distance_mm)
    if timeout_ms is None:
        timeout_ms = int(target_dist / max(1, abs(speed)) * 2500) + 2000
    timer = Timer()
    traveled = 0
    while traveled < target_dist and timer.time() * 1000 < timeout_ms:
        error = angle_diff(gyro.get_yaw_angle(), target_heading)
        rate = turn_rate - kp * error
        drive.start(speed * sign, speed * sign + rate)
        wait_for_seconds(0.01)
        traveled += abs(speed) * 0.01 * 0.9
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

function normalize(line) {
  return line.replace(/\s+/g, " ").trim();
}

function parseArgs(argStr) {
  const args = {};
  const parts = argStr.split(",");
  let positional = 0;
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    if (eq > -1) {
      args[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    } else {
      args["_" + positional++] = trimmed;
    }
  }
  return args;
}

function extractCall(line, name) {
  const re = new RegExp("(?:^|[^\\w])" + name + "\\s*\\(([^)]*)\\)", "i");
  const m = line.match(re);
  return m ? m[1] : null;
}

function substituteSymbols(code) {
  let out = code;
  out = out.replace(
    /from\s+(pybricks[\w.]*)\s+import\s+([^\n]+)/g,
    (m, mod, names) => {
      const target = IMPORT_MAP[mod] || "spike";
      const mapped = names
        .split(",")
        .map((n) => {
          const t = n.trim();
          return SYMBOL_MAP[t] || t;
        })
        .join(", ");
      return "from " + target + " import " + mapped;
    }
  );
  out = out.replace(/import\s+(pybricks[\w.]*)/g, (m, mod) => {
    return "import " + (IMPORT_MAP[mod] || "spike");
  });
  const methods = Object.keys(METHOD_MAP).sort((a, b) => b.length - a.length);
  for (const key of methods) {
    out = out.split(key).join(METHOD_MAP[key]);
  }
  for (const key of Object.keys(CONST_MAP)) {
    out = out.split(key).join(CONST_MAP[key]);
  }
  for (const key of Object.keys(SYMBOL_MAP)) {
    const re = new RegExp("\\b" + key + "\\b", "g");
    out = out.replace(re, SYMBOL_MAP[key]);
  }
  return out;
}

const IGNORE_PATTERNS = [
  /^\)\s*[,;]?\s*$/,
  /^\w+\s*=\s*-?\d+(?:\.\d+)?\s*,?$/,
  /^(wheel_diameter|axle_track|straight_speed|straight_acceleration|turn_rate|turn_acceleration)\s*=/i,
];

function isIgnorable(line) {
  return IGNORE_PATTERNS.some((re) => re.test(line));
}

function convert(input, settings) {
  settings = settings || DEFAULT_SETTINGS;
  const warnings = [];
  const stats = { straight: 0, turns: 0, other: 0 };
  const body = [];
  const preamble = [];

  const lines = input.split("\n");
  for (const raw of lines) {
    const line = normalize(raw);
    if (!line) continue;
    if (line.startsWith("#")) continue;
    if (/^def\s+/i.test(line)) continue;
    if (/^run_fll_mission\s*\(\s*\)/i.test(line)) continue;
    if (/^(return|"""|''')/.test(line)) continue;

    const dg = extractCall(line, "drive_gyro");
    if (dg !== null) {
      const a = parseArgs(dg);
      const dist = a["_0"] || "0";
      const heading = a["target_heading"] || "0";
      const speed = a["speed"] || "400";
      body.push("drive_gyro(" + dist + ", speed=" + speed + ", target_heading=" + heading + ")");
      stats.straight++;
      continue;
    }

    const ds = extractCall(line, "drive_scurve");
    if (ds !== null) {
      const a = parseArgs(ds);
      const dist = a["_0"] || "0";
      const heading = a["target_heading"] || "0";
      const speed = a["speed"] || "400";
      body.push("drive_scurve(" + dist + ", speed=" + speed + ", target_heading=" + heading + ")");
      stats.straight++;
      continue;
    }

    const dtc = extractCall(line, "drive_tank_curve");
    if (dtc !== null) {
      const a = parseArgs(dtc);
      const dist = a["_0"] || "0";
      const speed = a["speed"] || "200";
      const turnRate = a["turn_rate"] || "0";
      const heading = a["target_heading"] || "0";
      body.push(
        "drive_tank_curve(" + dist + ", speed=" + speed + ", turn_rate=" + turnRate +
        ", target_heading=" + heading + ")"
      );
      stats.straight++;
      continue;
    }

    const tg = extractCall(line, "turn_gyro");
    if (tg !== null) {
      const a = parseArgs(tg);
      const angle = a["_0"] || "0";
      const speed = a["turn_speed"] || "360";
      body.push("turn_gyro(" + angle + ", turn_speed=" + speed + ")");
      stats.turns++;
      continue;
    }

    const ra = extractCall(line, "run_angle");
    if (ra !== null && /\.run_angle/i.test(line)) {
      const a = parseArgs(ra);
      const speed = a["_0"] || "500";
      const angle = a["_1"] || "0";
      const motorMatch = line.match(/([A-Za-z_]\w*)\s*\.\s*run_angle/i);
      const varName = motorMatch ? motorMatch[1] : "attach_D";
      const portMatch = varName.match(/_([A-F])$/i);
      const port = portMatch ? portMatch[1].toUpperCase() : "D";
      body.push("run_angle('" + port + "', " + speed + ", " + angle + ")");
      stats.other++;
      continue;
    }

    const rt = extractCall(line, "run_time");
    if (rt !== null && /\.run_time/i.test(line)) {
      const a = parseArgs(rt);
      const speed = a["_0"] || "500";
      const seconds = a["_1"] || "1";
      const motorMatch = line.match(/([A-Za-z_]\w*)\s*\.\s*run_time/i);
      const varName = motorMatch ? motorMatch[1] : "attach_D";
      const portMatch = varName.match(/_([A-F])$/i);
      const port = portMatch ? portMatch[1].toUpperCase() : "D";
      body.push("run_attach('" + port + "', " + speed + ", " + seconds + ")");
      stats.other++;
      continue;
    }

    const straightMatch = line.match(/(?:drive_base|drive|robot)\s*\.\s*straight\s*\(\s*(-?\d+(?:\.\d+)?)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)/i);
    if (straightMatch) {
      const dist = straightMatch[1];
      const speed = straightMatch[2] || "400";
      body.push("drive_gyro(" + dist + ", speed=" + speed + ")");
      stats.straight++;
      continue;
    }

    const turnMatch = line.match(/(?:drive_base|drive|robot)\s*\.\s*turn\s*\(\s*(-?\d+(?:\.\d+)?)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)/i);
    if (turnMatch) {
      const angle = turnMatch[1];
      const speed = turnMatch[2] || "360";
      body.push("turn_gyro(" + angle + ", turn_speed=" + speed + ")");
      stats.turns++;
      continue;
    }

    const waitMatch = line.match(/\bwait\s*\(\s*(\d+(?:\.\d+)?)\s*\)/i);
    if (waitMatch) {
      body.push("wait_for_seconds(" + waitMatch[1] + ")");
      stats.other++;
      continue;
    }

    if (/^print\s*\(/i.test(line)) {
      body.push(line);
      stats.other++;
      continue;
    }

    if (isIgnorable(line)) continue;

    const converted = substituteSymbols(line);

    if (
      /^(hub|drive|gyro|left_motor|right_motor|attach_\w+)\s*=/i.test(converted) ||
      /^(hub|drive|gyro|left_motor|right_motor|attach_\w+)\./i.test(converted)
    ) {
      preamble.push(converted);
      stats.other++;
      continue;
    }

    if (/[=()]/.test(converted)) {
      body.push(converted);
      stats.other++;
      continue;
    }

    warnings.push('Unrecognized line skipped: "' + line + '"');
  }

  if (body.length === 0 && preamble.length === 0) {
    return { code: "", warnings: ["No recognizable Pybricks commands found."], stats };
  }

  const mission = [
    "def run_fll_mission():",
    '    print("Starting Gyro-Corrected Mission Routine...")',
    ...body.map((b) => "    " + b),
    '    print("Mission Complete!")',
    "",
    "run_fll_mission()",
    "",
  ];

  const preambleBlock = preamble.length
    ? "# --- Converted setup statements ---\n" + preamble.join("\n") + "\n\n"
    : "";

  return {
    code: buildHeader(settings) + preambleBlock + mission.join("\n"),
    warnings,
    stats,
  };
}