/**
 * Aim Trainer - Iteration 1 Core Engine
 * Uses D3.js v7 for visualizations and animations.
 */

const config = {
    dotRadius: 20,
    spawnInterval: 1000,
    maxDots: 5,
    colors: ['#58a6ff', '#3fb950', '#d29922'], // Bonus colors for iteration 1
};

let score = 0;
let dots = [];
let nextId = 0;

const svg = d3.select("#game-canvas");
const scoreEl = d3.select("#score");
const startBtn = d3.select("#start-btn");

let width, height;

// Get dimensions of the canvas
function updateDimensions() {
    const wrapper = document.getElementById('canvas-wrapper');
    const rect = wrapper.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    svg.attr("viewBox", `0 0 ${width} ${height}`);
}

window.addEventListener('resize', updateDimensions);
updateDimensions();

/**
 * Game Engine using D3 Force Simulation
 */
const simulation = d3.forceSimulation(dots)
    .force("charge", d3.forceManyBody().strength(5))
    .force("x", d3.forceX(width / 2).strength(0.01))
    .force("y", d3.forceY(height / 2).strength(0.01))
    .force("collision", d3.forceCollide().radius(config.dotRadius))
    .on("tick", ticked);

function ticked() {
    // Keep dots within bounds
    dots.forEach(d => {
        d.x = Math.max(config.dotRadius, Math.min(width - config.dotRadius, d.x));
        d.y = Math.max(config.dotRadius, Math.min(height - config.dotRadius, d.y));
    });

    const circles = svg.selectAll(".dot")
        .data(dots, d => d.id);

    circles.attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

function spawnDot() {
    if (dots.length >= config.maxDots) return;

    const newDot = {
        id: nextId++,
        x: Math.random() * (width - config.dotRadius * 2) + config.dotRadius,
        y: Math.random() * (height - config.dotRadius * 2) + config.dotRadius,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        createdAt: Date.now()
    };

    dots.push(newDot);
    
    simulation.nodes(dots);
    simulation.alpha(1).restart();

    renderDots();
}

function renderDots() {
    const circles = svg.selectAll(".dot")
        .data(dots, d => d.id);

    // Enter
    circles.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 0)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", d => d.color)
        .on("click", (event, d) => handleDotClick(d))
        .transition()
        .duration(300)
        .attr("r", config.dotRadius);

    // Exit
    circles.exit()
        .transition()
        .duration(300)
        .attr("r", 0)
        .remove();
}

function handleDotClick(clickedDot) {
    // Basic score increment
    score += 10;
    scoreEl.text(score);

    // Remove the dot
    dots = dots.filter(d => d.id !== clickedDot.id);
    
    simulation.nodes(dots);
    simulation.alpha(0.5).restart();
    
    renderDots();
}

// Game Loop
let spawnTimer;
function startGame() {
    score = 0;
    scoreEl.text(score);
    dots = [];
    nextId = 0;
    
    if (spawnTimer) clearInterval(spawnTimer);
    spawnTimer = setInterval(spawnDot, config.spawnInterval);
    
    startBtn.text("Restart Session");
    svg.selectAll("*").remove(); // Clear canvas
}

startBtn.on("click", startGame);
