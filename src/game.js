/**
 * Aim Trainer - Modular Main Game Entry
 * Orchestrates the coordination between Managers and Engine components.
 */

// Initialize Managers
const statsManager = new StatsManager();
const persistenceManager = new PersistenceManager();
const uiManager = new UIManager({
    settings: "#settings-overlay",
    gameOver: "#game-over-overlay",
    score: "#score",
    hits: "#hits",
    misses: "#misses",
    harms: "#harms",
    timer: "#timer",
    playerName: "#player-name",
    scoreboardList: "#scoreboard-list",
    finalStats: "#final-stats",
    canvasWrapper: "#canvas-wrapper"
});

const svg = d3.select("#game-canvas");
const dotEngine = new DotEngine(svg, config, handleDotClick, expireDot);

let currentDifficulty = 'intermediate';
let spawnTimer, countdownTimer;
let gameState = {
    isActive: false,
    timeLeft: 0,
    dots: [],
    nextId: 0
};

// --- Initialization ---
function updateDimensions() {
    const rect = document.getElementById('canvas-wrapper').getBoundingClientRect();
    dotEngine.updateDimensions(rect.width, rect.height);
}

window.addEventListener('resize', updateDimensions);
updateDimensions();

// --- Event Handlers ---

// Background click detection
d3.select("#canvas-wrapper").on("mousedown", (event) => {
    if (!gameState.isActive) return;
    if (event.target.id === "game-canvas" || event.target.tagName === "svg") {
        statsManager.registerMiss();
        uiManager.updateStats(statsManager.getStats());
        uiManager.showFeedback("Miss", event.clientX, event.clientY, "danger-text");
    }
});

function handleDotClick(event, clickedDot) {
    if (!gameState.isActive) return;

    if (clickedDot.type === 'bonus') {
        statsManager.registerHit(Date.now() - clickedDot.spawnedAt);
        uiManager.showFeedback("Hit!", event.clientX, event.clientY, "success-text");
    } else {
        statsManager.registerHarm();
        uiManager.showFeedback("Harm", event.clientX, event.clientY, "warning-text");
    }

    uiManager.updateStats(statsManager.getStats());
    gameState.dots = gameState.dots.filter(d => d.id !== clickedDot.id);
    dotEngine.updateSimulation(gameState.dots);
    dotEngine.renderDots(gameState.dots);
}

function expireDot(dotId) {
    if (!gameState.isActive) return;
    const dotIndex = gameState.dots.findIndex(d => d.id === dotId);
    if (dotIndex !== -1) {
        gameState.dots.splice(dotIndex, 1);
        dotEngine.updateSimulation(gameState.dots);
        dotEngine.renderDots(gameState.dots);
    }
}

// --- Session Lifecycle ---

function startSession() {
    const duration = parseFloat(d3.select("#duration-select").property("value"));
    currentDifficulty = d3.select("#difficulty-select").property("value") || 'intermediate';
    const profile = config.difficulty[currentDifficulty];

    statsManager.reset();
    gameState = {
        isActive: true,
        timeLeft: duration * 60,
        dots: [],
        nextId: 0
    };

    uiManager.updateStats(statsManager.getStats());
    uiManager.updateTimer(gameState.timeLeft);
    uiManager.hideOverlays();

    dotEngine.clear();

    if (spawnTimer) clearInterval(spawnTimer);
    if (countdownTimer) clearInterval(countdownTimer);

    spawnTimer = setInterval(() => {
        dotEngine.spawnDot(gameState.nextId++, currentDifficulty, gameState.dots);
    }, profile.spawnInterval);

    countdownTimer = setInterval(() => {
        gameState.timeLeft--;
        uiManager.updateTimer(gameState.timeLeft);
        if (gameState.timeLeft <= 0) endSession();
    }, 1000);
}

function endSession() {
    gameState.isActive = false;
    clearInterval(spawnTimer);
    clearInterval(countdownTimer);

    const stats = statsManager.getStats();
    const name = uiManager.getPlayerName();

    persistenceManager.saveScore(name, stats, currentDifficulty);
    uiManager.showGameOver(stats);
    refreshScoreboard();
}

function refreshScoreboard() {
    const diff = d3.select("#difficulty-select").property("value") || 'intermediate';
    uiManager.updateScoreboard(persistenceManager.getScores(diff));
}

// --- Listeners ---

d3.select("#start-btn").on("click", startSession);
d3.select("#restart-btn").on("click", () => uiManager.showSettings());
d3.select("#difficulty-select").on("change", refreshScoreboard);

// Initial load
refreshScoreboard();
