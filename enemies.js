// Gestión de Enemigos
class Enemy {
    constructor(x, y, type, squadronId) {
        const config = ENEMY_TYPES[type];
        this.x = x;
        this.y = y;
        this.type = type;
        this.squadronId = squadronId;
        this.angle = 0;
        this.speed = config.speed;
        this.health = config.health;
        this.color = config.color;
        this.symbol = config.symbol;
    }

    update(radarCenter, radarRadius) {
        this.x += Math.cos(this.angle) * this.speed * 0.016;
        this.y += Math.sin(this.angle) * this.speed * 0.016;
        
        const dist = Math.hypot(this.x - radarCenter.x, this.y - radarCenter.y);
        return dist < radarRadius + 80; // Retorna true si aún está en pantalla
    }

    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }
}

class EnemyManager {
    constructor() {
        this.enemies = [];
        this.squadronCount = 0;
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    removeEnemy(index) {
        this.enemies.splice(index, 1);
    }

    update(radarCenter, radarRadius) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const isValid = this.enemies[i].update(radarCenter, radarRadius);
            if (!isValid) {
                this.removeEnemy(i);
            }
        }
    }

    spawnJet(radarCenter, radarRadius, round) {
        const angle = Math.random() * Math.PI * 2;
        const distance = radarRadius - 30;
        const x = radarCenter.x + Math.cos(angle) * distance;
        const y = radarCenter.y + Math.sin(angle) * distance;

        const jet = new Enemy(x, y, 'JET', `JET-${this.squadronCount++}`);
        jet.angle = angle + Math.PI + (Math.random() - 0.5) * 0.3;
        this.addEnemy(jet);
        audio.playRadarSound();
    }

    spawnMissile(radarCenter, radarRadius, round) {
        const angle = Math.random() * Math.PI * 2;
        const distance = radarRadius - 30;
        const x = radarCenter.x + Math.cos(angle) * distance;
        const y = radarCenter.y + Math.sin(angle) * distance;

        const missile = new Enemy(x, y, 'MISSILE', `MISSILE-${this.squadronCount++}`);
        missile.angle = angle + Math.PI + (Math.random() - 0.5) * 0.3;
        this.addEnemy(missile);
        audio.playRadarSound();
    }

    spawnTankSquadron(radarCenter, radarRadius, round) {
        const formationNames = Object.keys(TANK_FORMATIONS);
        const formationType = formationNames[Math.floor(Math.random() * formationNames.length)];
        const formation = TANK_FORMATIONS[formationType];

        const angle = Math.random() * Math.PI * 2;
        const distance = radarRadius - 30;
        const leaderX = radarCenter.x + Math.cos(angle) * distance;
        const leaderY = radarCenter.y + Math.sin(angle) * distance;
        const squadronId = `TANK-${this.squadronCount++}`;

        formation.forEach((pos) => {
            const rotatedX = pos.x * Math.cos(angle + Math.PI) - pos.y * Math.sin(angle + Math.PI);
            const rotatedY = pos.x * Math.sin(angle + Math.PI) + pos.y * Math.cos(angle + Math.PI);

            const tank = new Enemy(leaderX + rotatedX, leaderY + rotatedY, 'TANK', squadronId);
            tank.angle = angle + Math.PI + (Math.random() - 0.5) * 0.1;
            this.addEnemy(tank);
        });
        audio.playRadarSound();
    }

    spawnWave(radarCenter, radarRadius, round) {
        const jetCount = Math.ceil(round / 2);
        for (let i = 0; i < jetCount; i++) {
            this.spawnJet(radarCenter, radarRadius, round);
        }

        const missileCount = Math.ceil(round / 3);
        for (let i = 0; i < missileCount; i++) {
            this.spawnMissile(radarCenter, radarRadius, round);
        }

        const tankGroupCount = Math.ceil(round / 2);
        for (let i = 0; i < tankGroupCount; i++) {
            this.spawnTankSquadron(radarCenter, radarRadius, round);
        }
    }

    clear() {
        this.enemies = [];
        this.squadronCount = 0;
    }

    getCount() {
        return this.enemies.length;
    }
}

const enemyManager = new EnemyManager();
