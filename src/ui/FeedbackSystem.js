/**
 * FeedbackSystem - Handles floating hit/miss feedback labels
 */
export class FeedbackSystem {
    constructor(containerSelector) {
        this.container = d3.select(containerSelector);
    }

    show(text, x, y, colorClass) {
        const wrapperRect = this.container.node().getBoundingClientRect();
        const relativeX = x - wrapperRect.left;
        const relativeY = y - wrapperRect.top;

        this.container.append("div")
            .attr("class", `feedback-label ${colorClass}`)
            .style("left", `${relativeX}px`)
            .style("top", `${relativeY}px`)
            .text(text)
            .on("animationend", function () { d3.select(this).remove(); });
    }
}
