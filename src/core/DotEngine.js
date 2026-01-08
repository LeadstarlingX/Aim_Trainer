/**
 * DotEngine - Handles the D3 simulation and dot lifecycle
 */
export class DotEngine {
    constructor(svg, config, onDotClick, onDotExpire) {
        this.svg = svg;
        this.config = config;
        this.onDotClick = onDotClick;
        this.onDotExpire = onDotExpire;
        this.width = 0;
        this.height = 0;

        this.simulation = d3.forceSimulation([])
            .force("charge", d3.forceManyBody().strength(5))
            .force("collision", d3.forceCollide().radius(config.dotRadius))
            .on("tick", () => this.ticked());
    }

    updateDimensions(width, height) {
        this.width = width;
        this.height = height;
        this.svg.attr("viewBox", `0 0 ${width} ${height}`);
    }

    ticked() {
        const nodes = this.simulation.nodes();
        nodes.forEach(d => {
            d.x = Math.max(this.config.dotRadius, Math.min(this.width - this.config.dotRadius, d.x));
            d.y = Math.max(this.config.dotRadius, Math.min(this.height - this.config.dotRadius, d.y));
        });

        this.svg.selectAll(".dot")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    spawnDot(nextId, difficulty, dots) {
        const isPenalty = Math.random() < this.config.penaltyChance;
        const newDot = {
            id: nextId,
            x: Math.random() * (this.width - this.config.dotRadius * 2) + this.config.dotRadius,
            y: Math.random() * (this.height - this.config.dotRadius * 2) + this.config.dotRadius,
            type: isPenalty ? 'penalty' : 'bonus',
            color: isPenalty ? this.config.colors.penalty : this.config.colors.bonus[Math.floor(Math.random() * this.config.colors.bonus.length)],
            spawnedAt: Date.now()
        };

        dots.push(newDot);

        const lifespan = this.config.difficulty[difficulty].lifespan;
        setTimeout(() => {
            this.onDotExpire(newDot.id);
        }, lifespan);

        this.updateSimulation(dots);
        this.renderDots(dots);
    }

    updateSimulation(dots) {
        this.simulation.nodes(dots);
        this.simulation.alpha(1).restart();
    }

    renderDots(dots) {
        const circles = this.svg.selectAll(".dot")
            .data(dots, d => d.id);

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
                this.onDotClick(event, d);
            })
            .transition()
            .duration(300)
            .attr("r", this.config.dotRadius);

        circles.exit()
            .transition()
            .duration(200)
            .attr("r", 0)
            .remove();
    }

    clear() {
        this.svg.selectAll("*").remove();
        this.simulation.nodes([]);
    }
}
