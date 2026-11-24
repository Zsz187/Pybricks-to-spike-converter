# Pybricks to SPIKE Converter

Convert **Pybricks** / **FLL Path Studio** Python into **LEGO SPIKE Prime** Python — with gyro-corrected straights and turns.

Built for FLL teams who prototype in Pybricks but need to run on the SPIKE Prime app.

## Live demo

Once deployed: `https://<username>.github.io/<repo>/`

## Features

- **Straight driving** — `drive_gyro(distance_mm, speed, target_heading)` with proportional gyro correction.
- **Gyro turns** — `turn_gyro(angle, turn_speed)` pivoting to an absolute heading by the shortest path.
- **S-curve motion** — `drive_scurve(...)` rest-to-rest jerk-limited profile.
- **Tank curves** — `drive_tank_curve(...)` simultaneous drive + turn.
- **Full API map** — hubs, motors, DriveBase, sensors, tools, battery, speaker, display.
- **Attachment motors** — add/edit/remove motor moves.
- **Calibration panel** — wheel diameter, axle track, Kp gains, tolerance, drive ports.
- **Copy / download** the generated `.py` file.

## Usage

1. Open the site.
2. Paste a Pybricks / FLL Path Studio script.
3. Click **Convert to SPIKE**.
4. Copy or download the generated SPIKE Prime Python.

## Deploy to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The included workflow publishes the site on every push to `main`.

## Project structure
