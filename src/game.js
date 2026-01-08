/**
 * Aim Trainer - Advanced Modular Entry Point
 * 
 * COORDINATOR PATTERN: This script handles dependency injection and 
 * high-level orchestration between decoupled modules via events.
 */

import { EventEmitter } from './utils/EventEmitter.js';
import { config } from './core/config.js';
import { GameStateManager, GameState } from './core/GameStateManager.js';
import { SessionManager } from './core/SessionManager.js';
import { StatsManager } from './core/StatsManager.js';
import { PersistenceManager } from './core/PersistenceManager.js';
import { DotEngine } from './core/DotEngine.js';
import { DotFactory } from './core/DotFactory.js';

import { OverlayComponent } from './ui/OverlayComponent.js';
import { ScoreboardComponent } from './ui/ScoreboardComponent.js';
import { FeedbackSystem } from './ui/FeedbackSystem.js';

// --- Initialization ---

const events = new EventEmitter();
const fsm = new GameStateManager(events);
const session = new SessionManager(events);
const stats = new StatsManager();
const persistence = new PersistenceManager();
const factory = new DotFactory(config);

const svg = d3.select("#game-canvas");
const dotEngine = new DotEngine(svg, config, handleDotClick, expireDot);

const overlays = new OverlayComponent({
    settings: "#settings-overlay",
    gameOver: "#game-over-overlay",
    finalStats: "#final-stats"
});
const scoreboard = new ScoreboardComponent("#scoreboard-list");
const feedback = new FeedbackSystem("#canvas-wrapper");

const scoreEl = d3.select("#score");
const hitsEl = d3.select("#hits");
const missesEl = d3.select("#misses");
const harmsEl = d3.select("#harms");
const timerEl = d3.select("#timer");

let gameDots = [];

// --- Event Handlers ---

events.on('stateChange', ({ from, to }) => {
    if (to === GameState.PLAYING) {
        overlays.hideAll();
        startActualGame();
    } else if (to === GameState.IDLE) {
        overlays.showSettings();
        refreshScoreboard();
    } else if (to === GameState.GAMEOVER) {
        const finalStats = stats.getStats();
        const name = d3.select("#player-name").property("value").trim() || "Anonymous";
        const diff = d3.select("#difficulty-select").property("value");

        persistence.saveScore(name, finalStats, diff);
        overlays.showGameOver(finalStats);
        refreshScoreboard();
    }
});

events.on('timerTick', (timeLeft) => {
    timerEl.text(formatTime(timeLeft));
});

events.on('timerEnd', () => {
    fsm.setState(GameState.GAMEOVER);
});

events.on('spawnRequest', () => {
    if (gameDots.length >= config.maxDots) return;
    const rect = document.getElementById('canvas-wrapper').getBoundingClientRect();
    const newDot = factory.createDot(rect.width, rect.height);
    gameDots.push(newDot);

    // Set expiration
    const diff = d3.select("#difficulty-select").property("value") || 'intermediate';
    const profile = config.difficulty[diff];
    setTimeout(() => {
        expireDot(newDot.id);
    }, profile.lifespan);

    dotEngine.updateSimulation(gameDots);
    dotEngine.renderDots(gameDots);
});

// --- Logic Helpers ---

function handleDotClick(event, dot) {
    console.log("[DEBUG] Dot clicked", dot.id);
    if (!fsm.isPlaying()) return;

    if (dot.type === 'bonus') {
        stats.registerHit(Date.now() - dot.spawnedAt);
        feedback.show("Hit!", event.clientX, event.clientY, "success-text");
    } else {
        stats.registerHarm();
        feedback.show("Harm", event.clientX, event.clientY, "warning-text");
    }

    updateStatsUI();
    gameDots = gameDots.filter(d => d.id !== dot.id);
    dotEngine.updateSimulation(gameDots);
    dotEngine.renderDots(gameDots);
}

function expireDot(dotId) {
    if (!fsm.isPlaying()) return;
    const dotIndex = gameDots.findIndex(d => d.id === dotId);
    if (dotIndex !== -1) {
        gameDots.splice(dotIndex, 1);
        dotEngine.updateSimulation(gameDots);
        dotEngine.renderDots(gameDots);
    }
}

function updateStatsUI() {
    const s = stats.getStats();
    scoreEl.text(s.score);
    hitsEl.text(s.hits);
    missesEl.text(s.misses);
    harmsEl.text(s.harms);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function refreshScoreboard() {
    const diff = d3.select("#difficulty-select").property("value") || 'intermediate';
    scoreboard.update(persistence.getScores(diff));
}

function startActualGame() {
    console.log("[DEBUG] Session starting...");
    const duration = parseFloat(d3.select("#duration-select").property("value"));
    const diff = d3.select("#difficulty-select").property("value") || 'intermediate';
    const profile = config.difficulty[diff];

    stats.reset();
    factory.reset();
    gameDots = [];
    updateStatsUI();

    dotEngine.clear();
    session.start(duration, profile.spawnInterval);
}

// --- Listeners ---

d3.select("#start-btn").on("click", () => fsm.setState(GameState.PLAYING));
d3.select("#restart-btn").on("click", () => fsm.setState(GameState.IDLE));
d3.select("#difficulty-select").on("change", refreshScoreboard);

d3.select("#canvas-wrapper").on("mousedown", (event) => {
    console.log("[DEBUG] Canvas mousedown on", event.target.tagName, event.target.id);
    if (!fsm.isPlaying()) {
        console.log("[DEBUG] Miss ignored: Not in PLAYING state");
        return;
    }
    if (event.target.id === "game-canvas" || event.target.tagName === "svg") {
        console.log("[DEBUG] Miss registered");
        stats.registerMiss();
        updateStatsUI();
        feedback.show("Miss", event.clientX, event.clientY, "danger-text");
    }
});

function updateDimensions() {
    const rect = document.getElementById('canvas-wrapper').getBoundingClientRect();
    dotEngine.updateDimensions(rect.width, rect.height);
}

window.addEventListener('resize', updateDimensions);
updateDimensions();
refreshScoreboard();
document.body.setAttribute('data-game-ready', 'true');
// --- Test Hooks ---
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.__TEST_HOOKS__ = {
        fsm,
        session,
        stats,
        GameState
    };
}
