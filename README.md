# Aim Trainer | D3.js Edition

Inspired by **Counter-Strike 2** aim maps and other professional training tools like **AimLabz**, this project is a high-performance, web-based aim trainer built entirely with **D3.js**.

## 🎯 Game Features

- **Immersive Fullscreen**: The game fills your entire browser viewport for a distraction-free training environment.
- **Dynamic Difficulty**: 4 difficulty levels (Beginner, Intermediate, Advanced, Elite) that adjust target lifespan and spawn rates.
- **D3 Force Simulation**: Targets use fluid, collision-aware movement patterns.
- **Persistent Scoreboard**: Your top 5 sessions per difficulty are saved locally to your browser.
- **Advanced Performance Analytics**:
    - **Accuracy %**: Real-time precision tracking (Hits vs. Total Clicks).
    - **Avg Reaction Time**: Measures speed in milliseconds (ms).
- **Player Profiles**: Custom names for local progress tracking.

## 🎯 Game Rules

The goal is to hit as many targets as possible within the session time while avoiding penalties.

### Target Types
- **Bonus Dots (Vibrant Colors)**: Click these to earn **+10 points**.
- **Penalty Dots (Red)**: Avoid these! Clicking them results in **-15 points**.
- **Expiration**: Bonus dots vanish if not clicked within their lifespan. This doesn't count as a miss, but affects your potential score.
- **The Void (Background)**: Clicking the background counts as a **Miss** and reduces your accuracy.

### Safety Features
- **Mandatory Identification**: Players must enter a name (min 4 chars) to start, ensuring all scores are properly attributed.
- **Emergency Exit**: An **Exit** button is available during the session to abort the game immediately without saving stats.

## ⚙️ Settings
- **Session Duration**: Choose between **0.5, 1, 2, 3, or 5 minutes**.
- **Difficulty Selection**: Switch profiles to increase target speed and reduce their time on screen.

## ✨ UPCOMING Features
- **Mobile Support**: Fully responsive touch controls for training on the go.
- **Visual Charts**: Interactive D3 charts for historical progress analysis.
- **Online Leaderboards**: Global competition using a light backend.

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
- **Vanilla CSS**: Premium dark-mode aesthetics with horizontal UI layout.
- **Vanilla CSS**: Premium dark-mode aesthetics with horizontal UI layout.
- **Local Storage**: Persistence for player stats and scoreboards.

## 🏗️ Architecture & Patterns
- **Coordinator Pattern**: `game.js` acts as the central hub, orchestrating communication between decoupled modules.
- **Observer Pattern**: An event-driven architecture (`EventEmitter.js`) allowing components (Timer, logic, UI) to communicate without direct dependencies.
- **Factory Pattern**: `DotFactory.js` encapsulates the complexity of creating game objects (dots) with varying properties (bonus/penalty, colors).
- **State Machine**: A strict Finite State Machine (`GameStateManager.js`) manages transitions between Idle, Playing, and Game Over states to prevent logic errors.

---
*Created for precision and performance.*
