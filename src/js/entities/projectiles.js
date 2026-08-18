// Gestión de Proyectiles
class Projectile {
    constructor(fromX, fromY, toX, toY) {
        this.x = fromX;
        this.y = fromY;
        this.angle = Math.atan2(toY - fromY, toX - fromX);
        this.speed = GAME_CONFIG.PROJECTILE_SPEED;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed * 0.016;
        this.y += Math.sin(this.angle) * this.speed * 0.016;
    }

    isInBounds(canvasWidth, canvasHeight) {
        return !(this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight);
    }
}

class ProjectileManager {
    constructor(canvas) {
        this.projectiles = [];
        this.canvas = canvas;
        this.floatingPoints = [];
    }

    fire(fromX, fromY, toX, toY) {
        this.projectiles.push(new Projectile(fromX, fromY, toX, toY));
        audio.playFireSound();
    }

    update(enemies) {
        // Actualizar proyectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.update();

            if (!proj.isInBounds(this.canvas.width, this.canvas.height)) {
                this.projectiles.splice(i, 1);
                continue;
            }

            // Detectar colisiones
            let hit = false;
            for (let e = enemies.length - 1; e >= 0; e--) {
                const enemy = enemies[e];
                const d = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
                if (d < 25) {
                    const isDead = enemy.takeDamage(1);
                    hit = true;
                    audio.playHitSound();

                    if (isDead) {
                        const points = ENEMY_TYPES[enemy.type].points;
                        const threat = ENEMY_TYPES[enemy.type].threat;
                        
                        gameState.addScore(threat * 10);
                        gameState.addRoundPoints(points);
                        this.createFloatingPoint(enemy.x, enemy.y, points, '#ffff00');
                        enemies.splice(e, 1);
                        audio.playKillSound();
                    }
                    break;
                }
            }

            if (hit) {
                this.projectiles.splice(i, 1);
            }
        }

        // Actualizar puntos flotantes
        this.floatingPoints = this.floatingPoints.filter(point => {
            point.y -= 1;
            point.life--;
            return point.life > 0;
        });
    }

    createFloatingPoint(x, y, value, color) {
        this.floatingPoints.push({
            x: x,
            y: y,
            value: value,
            color: color,
            life: 60
        });
    }

    clear() {
        this.projectiles = [];
        this.floatingPoints = [];
    }
}

const projectileManager = new ProjectileManager(canvas);
