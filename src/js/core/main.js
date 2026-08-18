// Loop principal del juego
let gameLoopRunning = false;

function startRound() {
    gameState.roundActive = true;
    gameState.roundTimeRemaining = gameState.roundTime;
    gameState.roundStartTime = Date.now();
    enemyManager.clear();
    projectileManager.clear();
    enemyManager.spawnWave(radar.center, radar.radius, gameState.round);
    gameLoopRunning = true;
}

function endRound() {
    gameState.roundActive = false;
    gameLoopRunning = false;
    
    if (gameState.health <= 0) {
        endGame();
    } else {
        shopManager.show();
    }
}

function endGame() {
    gameState.gameOver = true;
    gameLoopRunning = false;
    uiManager.showGameOver();
    audio.playGameOverSound();
}

function handleMissileImpact(enemy) {
    const config = ENEMY_TYPES[enemy.type];
    gameState.addScore(config.threat * 10);
    gameState.addRoundPoints(config.points);
    projectileManager.createFloatingPoint(enemy.x, enemy.y, config.points, '#ffff00');
    audio.playExplosionSound();
}

function update() {
    if (gameState.gameOver || gameState.paused || !gameState.roundActive) return;

    // Actualizar radar
    radar.update();

    // Actualizar enemigos
    enemyManager.update(radar.center, radar.radius);

    // Detectar impacto de misiles en la base
    for (let i = enemyManager.enemies.length - 1; i >= 0; i--) {
        const enemy = enemyManager.enemies[i];
        if (enemy.type === 'MISSILE') {
            const dist = Math.hypot(enemy.x - radar.center.x, enemy.y - radar.center.y);
            if (dist < 50) {
                const damage = gameState.maxHealth * GAME_CONFIG.MISSILE_DAMAGE;
                if (gameState.damageHealth(damage)) {
                    endRound();
                }
                handleMissileImpact(enemy);
                enemyManager.removeEnemy(i);
            }
        }
    }

    // Actualizar proyectiles
    projectileManager.update(enemyManager.enemies);

    // Actualizar tiempo
    gameState.roundTimeRemaining = gameState.roundTime - (Date.now() - gameState.roundStartTime) / 1000;
    
    if (gameState.roundTimeRemaining <= 0) {
        endRound();
    }
}

function draw() {
    radar.draw(
        enemyManager.enemies,
        projectileManager.projectiles,
        projectileManager.floatingPoints,
        gameState.defenses
    );
}

function gameLoop() {
    if (gameLoopRunning) {
        update();
    }
    draw();
    uiManager.update();
    requestAnimationFrame(gameLoop);
}

// Inicialización
window.addEventListener('load', () => {
    audio.init();
    startRound();
    gameLoop();
});
