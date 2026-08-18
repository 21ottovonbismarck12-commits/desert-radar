// Gestión del Estado del Juego
class GameState {
    constructor() {
        this.score = 0;
        this.roundPoints = 0;
        this.round = 1;
        this.roundTime = GAME_CONFIG.INITIAL_ROUND_TIME;
        this.roundTimeRemaining = GAME_CONFIG.INITIAL_ROUND_TIME;
        this.health = 100;
        this.maxHealth = 100;
        this.threats = 0;
        this.gameOver = false;
        this.paused = false;
        this.selectedTarget = null;
        this.roundActive = false;
        this.inShop = false;
        this.defenses = [];
        this.roundStartTime = 0;
    }

    reset() {
        this.score = 0;
        this.roundPoints = 0;
        this.round = 1;
        this.roundTime = GAME_CONFIG.INITIAL_ROUND_TIME;
        this.health = 100;
        this.gameOver = false;
        this.defenses = [];
    }

    damageHealth(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            return true; // Game Over
        }
        return false;
    }

    addScore(points) {
        this.score += points;
    }

    addRoundPoints(points) {
        this.roundPoints += points;
    }

    spendRoundPoints(amount) {
        if (this.roundPoints >= amount) {
            this.roundPoints -= amount;
            return true;
        }
        return false;
    }

    nextRound() {
        this.round++;
        this.roundTime *= GAME_CONFIG.ROUND_TIME_INCREASE;
        this.health = Math.min(this.maxHealth, this.health + GAME_CONFIG.HEALTH_HEAL_PER_ROUND);
        this.roundPoints = 0;
    }
}

const gameState = new GameState();
