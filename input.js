// Gestión de Entrada
class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleClick(e) {
        if (gameState.gameOver || gameState.paused || !gameState.roundActive) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - radar.center.x;
        const dy = y - radar.center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radar.radius) {
            let targetEnemy = null;
            let minDist = 40;

            enemyManager.enemies.forEach(enemy => {
                const d = Math.hypot(x - enemy.x, y - enemy.y);
                if (d < minDist) {
                    targetEnemy = enemy;
                    minDist = d;
                }
            });

            if (targetEnemy) {
                gameState.selectedTarget = targetEnemy;
                projectileManager.fire(radar.center.x, radar.center.y, targetEnemy.x, targetEnemy.y);
            }
        }
    }

    handleKeyDown(e) {
        if (e.key === ' ') {
            e.preventDefault();
            gameState.paused = !gameState.paused;
        }
        if (e.key.toLowerCase() === 'r') {
            location.reload();
        }
    }
}

const inputManager = new InputManager(canvas);
