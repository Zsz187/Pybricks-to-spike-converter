/* Sample input: the FLL Path Studio "Churchill Hawks 2.0" script. */

const SAMPLE = `# Created with FLL Path Studio by FTC Team 27003 The Churchill Hawks 2.0
# Pybricks Python Path Script with Gyro Heading Correction
# Gyro gains: drive_kp=4.0, turn_kp=3.5, turn_tolerance=1.0
from pybricks.hubs import PrimeHub
from pybricks.pupdevices import Motor
from pybricks.parameters import Port, Direction
from pybricks.robotics import DriveBase
from pybricks.tools import wait

hub = PrimeHub()
hub.imu.reset_heading(0)
left_motor = Motor(Port.A, Direction.COUNTERCLOCKWISE)
right_motor = Motor(Port.B, Direction.CLOCKWISE)
drive_base = DriveBase(left_motor=left_motor, right_motor=right_motor, wheel_diameter=56.0, axle_track=112.0)
drive_base.reset()
drive_base.settings(straight_speed=400, straight_acceleration=700, turn_rate=360, turn_acceleration=1188)

from pybricks.tools import StopWatch

def angle_diff(a, b):
    d = (a - b + 180) % 360 - 180
    return d

def drive_gyro(distance_mm, speed=400, target_heading=0, kp=4.0, timeout_ms=None):
    drive_base.reset()
    sign = 1 if distance_mm >= 0 else -1
    target_dist = abs(distance_mm)
    if timeout_ms is None:
        timeout_ms = int(target_dist / max(1, abs(speed)) * 2000) + 1500
    sw = StopWatch()
    while abs(drive_base.distance()) < target_dist and sw.time() < timeout_ms:
        error = angle_diff(hub.imu.heading(), target_heading)
        drive_base.drive(speed * sign, -kp * error)
        wait(10)
    drive_base.stop()

def turn_gyro(target_angle, turn_speed=360, kp=3.5, tolerance=1.0, timeout_ms=5000):
    sw = StopWatch()
    while sw.time() < timeout_ms:
        error = angle_diff(target_angle, hub.imu.heading())
        if abs(error) <= tolerance:
            break
        rate = max(-turn_speed, min(turn_speed, error * kp))
        drive_base.drive(0, rate)
        wait(10)
    drive_base.stop()

def drive_scurve(distance_mm, speed=400, target_heading=0, kp=4.0, accel=700, jerk_acc=3500, jerk_dec=1925, dt_ms=20):
    drive_base.reset()
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
    sw = StopWatch()
    while abs(drive_base.distance()) < D and sw.time() < int(T * 1000) + 2000:
        t = sw.time() / 1000.0
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
        error = angle_diff(hub.imu.heading(), target_heading)
        drive_base.drive(cmd * sign, -kp * error)
        wait(dt_ms)
    drive_base.stop()

def drive_tank_curve(distance_mm, speed=200, turn_rate=0, target_heading=0, kp=2.0, timeout_ms=None):
    drive_base.reset()
    sign = 1 if distance_mm >= 0 else -1
    target_dist = abs(distance_mm)
    if timeout_ms is None:
        timeout_ms = int(target_dist / max(1, abs(speed)) * 2500) + 2000
    sw = StopWatch()
    while abs(drive_base.distance()) < target_dist and sw.time() < timeout_ms:
        error = angle_diff(hub.imu.heading(), target_heading)
        rate = turn_rate - kp * error
        drive_base.drive(speed * sign, rate)
        wait(10)
    drive_base.stop()

def run_fll_mission():
    print("Starting Gyro-Corrected Mission Routine...")
    drive_scurve(400.0, target_heading=0.0)
    print("Mission Complete!")

run_fll_mission()`;