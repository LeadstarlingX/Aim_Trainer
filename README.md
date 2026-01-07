# Aim Trainer | D3.js Edition

Inspired by **Counter-Strike 2** aim maps and other professional training tools like **AimLabz**, this project is a high-performance, web-based aim trainer built entirely with **D3.js**.

## 🎯 Game Rules

The goal is to hit as many targets as possible within the session time while avoiding penalties.

### Target Types
- **Bonus Dots (Vibrant Colors)**: Click these to earn **+10 points** and increment your **Hits**.
- **Penalty Dots (Red)**: Avoid these! Clicking them results in **-15 points** and increments your **Harms** count.
- **The Void (Background)**: Clicking anywhere else on the canvas counts as a **Miss**.

### Stats Tracking
- **Score**: Your total points (clamped to 0).
- **Hits**: Successful target acquisitions.
- **Miss**: Clicks that didn't hit any target.
- **Harm**: Clicks on accidental/penalty targets.

## ⚙️ Settings
- **Session Duration**: Choose between **0.5, 1, 2, 3, or 5 minutes** per session.
- **Dynamic Movement**: Targets use a D3 force simulation to move and collide, providing a fluid training experience.

## ✨ UPCOMING Features
- **Levels of Difficulty**:
    - **Easy**: Slow, predictable movement, larger dots.
    - **Medium**: Faster movement, more randomness.
    - **Hard**: Chaotic movement, smaller dots.
    - **Crazy**: Extremely fast, highly randomized sizes.
- **Player Profiles**: Register with a unique name to track your progress.
- **Scoreboard**: Local persistence of top players per difficulty level.
- **Advanced Dashboard**:
    - Click Accuracy (%)
    - Average Reaction Time (ms)
    - Level Completion Rates
- **Mobile Support**: Fully responsive touch controls for training on the go.

## 🛠️ Dependencies

This project is designed to be lightweight. Production dependencies are loaded via CDN, while development tools are managed via `npm`.

### Production
- **[D3.js v7](https://d3js.org/)**: Used for all SVG visualizations, force simulations, and animations. (Loaded via CDN in `index.html`)

### Development & Testing
- **[Node.js](https://nodejs.org/)**: Required for running the test suite and local development server.
- **[Playwright](https://playwright.dev/)**: End-to-end testing framework used to verify game mechanics.
- **[http-server](https://www.npmjs.com/package/http-server)**: A simple, zero-configuration command-line http server.

### Installation
To set up the development environment:
```bash
# Install development dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium
```

## 🚀 Technical Stack
- **D3.js v7**: Force simulations, transitions, and SVG rendering.
- **Vanilla CSS**: Premium dark-mode aesthetics.
- **Local Storage**: (Upcoming) Persistence for player stats.

---
*Created for precision and performance.*
