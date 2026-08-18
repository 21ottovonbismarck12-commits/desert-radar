// Gestión de la Tienda
class ShopManager {
    show() {
        gameState.inShop = true;
        const overlay = document.getElementById('shop-overlay');
        overlay.classList.add('active');

        document.getElementById('shop-points-display').textContent = 
            `PUNTOS DISPONIBLES: ${gameState.roundPoints}`;

        this.renderShopItems();
    }

    hide() {
        gameState.inShop = false;
        const overlay = document.getElementById('shop-overlay');
        overlay.classList.remove('active');
    }

    renderShopItems() {
        const shopItems = document.getElementById('shop-items');
        shopItems.innerHTML = '';

        for (let defenseKey in DEFENSES) {
            const defense = DEFENSES[defenseKey];
            const canAfford = gameState.roundPoints >= defense.cost;
            
            const item = document.createElement('div');
            item.className = `shop-item ${!canAfford ? 'disabled' : ''}`;
            item.innerHTML = `
                <h3>${defense.name}</h3>
                <p>${defense.description}</p>
                <div class="shop-price">Costo: ${defense.cost} puntos</div>
            `;
            
            if (canAfford) {
                item.onclick = () => this.buyDefense(defenseKey);
            }
            
            shopItems.appendChild(item);
        }
    }

    buyDefense(defenseKey) {
        const defense = DEFENSES[defenseKey];
        if (gameState.spendRoundPoints(defense.cost)) {
            gameState.addScore(defense.cost);
            
            gameState.defenses.push({
                type: defenseKey,
                x: radar.center.x + (Math.random() - 0.5) * 60,
                y: radar.center.y + (Math.random() - 0.5) * 60,
                ...defense
            });

            document.getElementById('shop-points-display').textContent = 
                `PUNTOS DISPONIBLES: ${gameState.roundPoints}`;
            
            audio.playFireSound();
            this.renderShopItems();
        }
    }
}

const shopManager = new ShopManager();

// Función global para continuar el juego
function continueGame() {
    gameState.nextRound();
    shopManager.hide();
    startRound();
}
