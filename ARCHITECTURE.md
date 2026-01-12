# Architecture & Design Patterns

This document provides a technical overview of the **Aim Trainer** codebase, explaining the core architectural decisions and design patterns used to create a modular, scalable, and testable game.

## 🏗️ High-Level Architecture: Event-Driven Coordinator

The application follows a **Decoupled, Event-Driven Architecture**. Use of strict unidirectional data flow or rigid hierarchy is avoided in favor of independent modules that communicate via a central event bus.

### **The Coordinator (`game.js`)**
*   **Role**: The "Brain" or "Main Controller".
*   **Responsibilities**:
    *   Initializes all core modules (Session, Stats, UI, Engine).
    *   Wires dependencies (injecting `EventEmitter`).
    *   Listens to high-level events (e.g., `spawnRequest`) and delegates work to appropriate modules.
*   **Benefit**: This keeps business logic out of the UI components and UI logic out of the core math modules.

---

## 🧩 Core Design Patterns

### 1. Observer Pattern (Event Bus)
*   **Implementation**: `src/utils/EventEmitter.js`
*   **Concept**: Entities subscribe to events of interest rather than being directly called by other entities.
*   **In Practice**:
    *   The **SessionManager** (Timer) simply emits `'timerTick'`. It does not know that a UI element exists.
    *   The **UI** listens for `'timerTick'` and updates the text.
*   **Why**: You can completely rewrite the UI without touching the Timer logic, and vice versa.

### 2. Finite State Machine (FSM)
*   **Implementation**: `src/core/GameStateManager.js`
*   **Concept**: The game can only be in one valid state at a time (`IDLE`, `PLAYING`, `PAUSED`, `GAMEOVER`).
*   **In Practice**:
    *   Before spawning a dot, the code checks `fsm.isPlaying()`.
    *   Transitions are logged and broadcasted via events.
*   **Why**: Eliminates entire classes of bugs, such as:
    *   Clicking targets after the game ends.
    *   Starting a new game while one is already running.
    *   Timers continuing to tick during a pause.

### 3. Factory Pattern
*   **Implementation**: `src/core/DotFactory.js`
*   **Concept**: Encapsulation of object creation logic.
*   **In Practice**:
    *   `game.js` calls `factory.createDot(width, height)`.
    *   The Factory handles the complex logic: generating random coordinates, deciding if it's a "Bonus" or "Penalty" (based on config), and assigning colors.
*   **Why**: Centralizes randomness and configuration. If you want to add a "Super Bonus" dot later, you only change the Factory, not the main game loop.

### 4. Separation of Concerns (Logic vs. View)
*   **Logic Modules**:
    *   `SessionManager`: Time keeping.
    *   `StatsManager`: Score, accuracy, reaction time math.
    *   `PersistenceManager`: LocalStorage read/write.
*   **View Modules**:
    *   `DotEngine.js`: Visualizes the game state using **D3.js**.
    *   `ui/*.js`: Handles HTML/CSS overlays and feedback.
*   **Why**: Makes the codebase testable. You can unit test the `StatsManager` without needing a browser or SVG support.

---

## 🔄 The Game Loop Flow

1.  **Start**:
    *   User clicks "Start".
    *   `game.js` calls `fsm.setState(GameState.PLAYING)`.
    *   `overlays` hides the menu.
    *   `session` starts the countdowns.

2.  **Spawn Cycle**:
    *   `session` emits `spawnRequest`.
    *   `game.js`:
        1.  Checks limits (is game full?).
        2.  Asks `factory` for a new dot data object.
        3.  Adds dot to local state (`gameDots`).
        4.  Tells `dotEngine` to render the new state.

3.  **Interaction**:
    *   User clicks a dot in the SVG.
    *   `DotEngine` captures the DOM event and calls the `handleDotClick` callback in `game.js`.
    *   `game.js`:
        1.  Checks if dot is Bonus or Penalty.
        2.  Updates `stats`.
        3.  Removes dot from state.
        4.  Triggers visual feedback (`feedback.show()`).

4.  **End**:
    *   Timer hits 0 -> `session` emits `timerEnd`.
    *   `game.js` sets state to `GAMEOVER`.
    *   `persistence` saves the score.
    *   `overlays` shows the summary screen.
