/**
 * GameStateManager - Finite State Machine for Aim Trainer
 * States: IDLE, PLAYING, PAUSED, GAMEOVER
 */
export const GameState = {
    IDLE: 'IDLE',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER'
};

export class GameStateManager {
    constructor(eventEmitter) {
        this.events = eventEmitter;
        this.currentState = GameState.IDLE;
    }

    setState(newState) {
        if (this.currentState === newState) return;

        const oldState = this.currentState;
        this.currentState = newState;


        this.events.emit('stateChange', { from: oldState, to: newState });
    }

    isIdle() { return this.currentState === GameState.IDLE; }
    isPlaying() { return this.currentState === GameState.PLAYING; }
    isPaused() { return this.currentState === GameState.PAUSED; }
    isGameOver() { return this.currentState === GameState.GAMEOVER; }
}
