/**
 * Aim Trainer - Iteration 2: Game Mechanics & UI
 */

const config = {
    dotRadius: 20,
    spawnInterval: 1000,
    maxDots: 7,
    colors: {
        bonus: ['#58a6ff', '#3fb950', '#d29922'],
        penalty: '#f85149' // Red
    },
    penaltyChance: 0.2,
    difficulty: {
        beginner: { lifespan: 2500, spawnInterval: 1200 },
        intermediate: { lifespan: 1800, spawnInterval: 1000 },
        advanced: { lifespan: 1200, spawnInterval: 800 },
        elite: { lifespan: 800, spawnInterval: 600 }
    }
};

let currentDifficulty = 'intermediate';

let gameState = {
    isActive: false,
    score: 0,
    hits: 0,
    misses: 0,
    harms: 0,
    timeLeft: 0, // in seconds
    dots: [],
    nextId: 0
};

const svg = d3.select("#game-canvas");
const canvasWrapper = d3.select("#canvas-wrapper");
const scoreEl = d3.select("#score");
const hitsEl = d3.select("#hits");
const missesEl = d3.select("#misses");
const harmsEl = d3.select("#harms");
const timerEl = d3.select("#timer");

const settingsOverlay = d3.select("#settings-overlay");
const gameOverOverlay = d3.select("#game-over-overlay");
const durationSelect = d3.select("#duration-select");
const difficultySelect = d3.select("#difficulty-select");

let width, height;
let spawnTimer, countdownTimer;

function updateDimensions() {
    const rect = document.getElementById('canvas-wrapper').getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    svg.attr("viewBox", `0 0 ${width} ${height}`);
}

window.addEventListener('resize', updateDimensions);
updateDimensions();

// Simulation Setup
const simulation = d3.forceSimulation([])
    .force("charge", d3.forceManyBody().strength(5))
    .force("collision", d3.forceCollide().radius(config.dotRadius))
    .on("tick", ticked);

function ticked() {
    gameState.dots.forEach(d => {
        d.x = Math.max(config.dotRadius, Math.min(width - config.dotRadius, d.x));
        d.y = Math.max(config.dotRadius, Math.min(height - config.dotRadius, d.y));
    });

    svg.selectAll(".dot")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

// Background click detection (Misses)
canvasWrapper.on("mousedown", (event) => {
    if (!gameState.isActive) return;

    // Check if we clicked the background or a dot
    if (event.target.id === "game-canvas" || event.target.tagName === "svg") {
        handleMiss(event);
    }
});

function handleMiss(event) {
    gameState.misses++;
    missesEl.text(gameState.misses);
    showFeedback("Miss", event.clientX, event.clientY, "danger-text");
}

function spawnDot() {
    if (!gameState.isActive || gameState.dots.length >= config.maxDots) return;

    const isPenalty = Math.random() < config.penaltyChance;

    const newDot = {
        id: gameState.nextId++,
        x: Math.random() * (width - config.dotRadius * 2) + config.dotRadius,
        y: Math.random() * (height - config.dotRadius * 2) + config.dotRadius,
        type: isPenalty ? 'penalty' : 'bonus',
        color: isPenalty ? config.colors.penalty : config.colors.bonus[Math.floor(Math.random() * config.colors.bonus.length)],
        createdAt: Date.now()
    };

    gameState.dots.push(newDot);

    // Set expiration timeout
    const lifespan = config.difficulty[currentDifficulty].lifespan;
    setTimeout(() => {
        expireDot(newDot.id);
    }, lifespan);

    updateSimulation();
    renderDots();
}

function expireDot(dotId) {
    if (!gameState.isActive) return;

    const dotIndex = gameState.dots.findIndex(d => d.id === dotId);
    if (dotIndex !== -1) {
        gameState.dots.splice(dotIndex, 1);
        updateSimulation();
        renderDots();
    }
}

function updateSimulation() {
    simulation.nodes(gameState.dots);
    simulation.alpha(1).restart();
}

function renderDots() {
    const circles = svg.selectAll(".dot")
        .data(gameState.dots, d => d.id);

    circles.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("id", d => `dot-${d.id}`)
        .attr("r", 0)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", d => d.color)
        .on("mousedown", (event, d) => {
            event.stopPropagation();
            handleDotClick(event, d);
        })
        .transition()
        .duration(300)
        .attr("r", config.dotRadius);

    circles.exit()
        .transition()
        .duration(200)
        .attr("r", 0)
        .remove();
}

function handleDotClick(event, clickedDot) {
    if (!gameState.isActive) return;

    if (clickedDot.type === 'bonus') {
        gameState.hits++;
        gameState.score += 10;
        hitsEl.text(gameState.hits);
        showFeedback("Hit!", event.clientX, event.clientY, "success-text");
    } else {
        gameState.harms++;
        gameState.score = Math.max(0, gameState.score - 15);
        harmsEl.text(gameState.harms);
        showFeedback("Harm", event.clientX, event.clientY, "warning-text");
    }

    scoreEl.text(gameState.score);
    gameState.dots = gameState.dots.filter(d => d.id !== clickedDot.id);

    updateSimulation();
    renderDots();
}

function showFeedback(text, x, y, colorClass) {
    const wrapperRect = document.getElementById('canvas-wrapper').getBoundingClientRect();
    const relativeX = x - wrapperRect.left;
    const relativeY = y - wrapperRect.top;

    canvasWrapper.append("div")
        .attr("class", `feedback-label ${colorClass}`)
        .style("left", `${relativeX}px`)
        .style("top", `${relativeY}px`)
        .text(text)
        .on("animationend", function () { d3.select(this).remove(); });
}

function startSession() {
    const duration = parseFloat(durationSelect.property("value"));
    currentDifficulty = difficultySelect.property("value") || 'intermediate';
    const profile = config.difficulty[currentDifficulty];

    gameState = {
        isActive: true,
        score: 0,
        hits: 0,
        misses: 0,
        harms: 0,
        timeLeft: duration * 60,
        dots: [],
        nextId: 0
    };

    updateUI();
    settingsOverlay.classed("hidden", true);
    gameOverOverlay.classed("hidden", true);
    svg.selectAll("*").remove();

    if (spawnTimer) clearInterval(spawnTimer);
    if (countdownTimer) clearInterval(countdownTimer);

    spawnTimer = setInterval(spawnDot, profile.spawnInterval);
    countdownTimer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    gameState.timeLeft--;
    if (gameState.timeLeft <= 0) {
        endSession();
    }
    updateUI();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateUI() {
    scoreEl.text(gameState.score);
    hitsEl.text(gameState.hits);
    missesEl.text(gameState.misses);
    harmsEl.text(gameState.harms);
    timerEl.text(formatTime(gameState.timeLeft));
}

function endSession() {
    gameState.isActive = false;
    clearInterval(spawnTimer);
    clearInterval(countdownTimer);

    gameOverOverlay.classed("hidden", false);

    d3.select("#final-stats").html(`
        <div class="stat-box">
            <span class="label">Final Score</span>
            <span style="font-size: 2rem; color: var(--accent-color)">${gameState.score}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
            <div><span class="label">Hits</span><div>${gameState.hits}</div></div>
            <div><span class="label">Miss</span><div>${gameState.misses}</div></div>
            <div><span class="label">Harm</span><div>${gameState.harms}</div></div>
        </div>
    `);
}

d3.select("#start-btn").on("click", startSession);
d3.select("#restart-btn").on("click", () => {
    gameOverOverlay.classed("hidden", true);
    settingsOverlay.classed("hidden", false);
});
