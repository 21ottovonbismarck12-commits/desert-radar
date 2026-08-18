// Gestión de la Interfaz de Usuario
class UIManager {
    update() {
        const healthColor = gameState.health > 50 ? '#0f0' : gameState.health > 25 ? '#ff6600' : '#f00';
        
        document.getElementById('score').textContent = `PUNTOS TOTALES: ${gameState.score}`;
        document.getElementById('points').textContent = `PUNTOS RONDA: ${gameState.roundPoints}`;
        document.getElementById('round').textContent = `RONDA: ${gameState.round}`;
        document.getElementById('timer').textContent = `TIEMPO: ${Math.ceil(gameState.roundTimeRemaining)}s`;
        document.getElementById('threats').textContent = `AMENAZAS: ${enemyManager.getCount()}`;
        document.getElementById('health').textContent = `DEFENSA: ${Math.max(0, Math.floor(gameState.health))}%`;
        document.getElementById('health').style.color = healthColor;

        this.updateThreatList();
    }

    updateThreatList() {
        const threatsList = document.getElementById('threats-detail');
        threatsList.innerHTML = '';
        
        const squadrons = radar.groupEnemiesBySquadron(enemyManager.enemies);
        
        for (let squadronId in squadrons) {
            const squadron = squadrons[squadronId];
            const threatDiv = document.createElement('div');
            threatDiv.className = `threat-item threat-${squadron.type.toLowerCase()}`;
            threatDiv.textContent = `${squadron.symbol} ${squadron.type} (${squadron.enemies.length})`;
            threatsList.appendChild(threatDiv);
        }
    }

    showGameOver() {
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('final-score').textContent = `Puntuación Final: ${gameState.score}`;
        document.getElementById('final-round').textContent = `Rondas Completadas: ${gameState.round - 1}`;
    }

    hideGameOver() {
        document.getElementById('game-over').style.display = 'none';
    }
}

const uiManager = new UIManager();
