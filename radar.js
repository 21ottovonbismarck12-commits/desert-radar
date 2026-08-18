// Sistema de Radar Realista
class RadarSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.radius = Math.min(canvas.width, canvas.height) / 2 - 60;
        this.sweep = 0;
        this.scanLines = [];
        this.gridIntensity = 0.5;
        this.initScanLines();
    }

    initScanLines() {
        for (let i = 0; i < 12; i++) {
            this.scanLines.push({
                angle: (i * Math.PI * 2) / 12,
                intensity: 0
            });
        }
    }

    update() {
        this.sweep = (this.sweep + 1.5) % 360;
        
        // Actualizar intensidad de líneas de escaneo
        this.scanLines.forEach((line, idx) => {
            const sweepRad = (this.sweep * Math.PI) / 180;
            const lineDiff = Math.abs(line.angle - sweepRad);
            line.intensity = Math.max(0, 1 - lineDiff * 2);
        });
    }

    draw(enemies, projectiles, floatingPoints, defenses) {
        this.drawBackground();
        this.drawGrid();
        this.drawRings();
        this.drawCompass();
        this.drawSweep();
        this.drawProjectiles(projectiles);
        this.drawEnemies(enemies);
        this.drawDefenses(defenses);
        this.drawFloatingPoints(floatingPoints);
        this.drawCenter();
    }

    drawBackground() {
        this.ctx.fillStyle = '#000a00';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Efecto de scaneo de fondo
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.15)';
        this.ctx.lineWidth = 0.5;
        
        // Grid vertical
        const gridSpacingX = this.canvas.width / 20;
        for (let x = 0; x <= this.canvas.width; x += gridSpacingX) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Grid horizontal
        const gridSpacingY = this.canvas.height / 15;
        for (let y = 0; y <= this.canvas.height; y += gridSpacingY) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawRings() {
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.8;

        // Anillo principal
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Anillos secundarios (5 divisiones)
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.5;
        for (let i = 1; i < 5; i++) {
            const ringRadius = (this.radius / 5) * i;
            this.ctx.beginPath();
            this.ctx.arc(this.center.x, this.center.y, ringRadius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Etiqueta de distancia
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = 'bold 10px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.globalAlpha = 0.6;
            const distance = (i * 20).toString();
            this.ctx.fillText(distance + 'km', this.center.x + ringRadius + 5, this.center.y - 5);
        }
        this.ctx.globalAlpha = 1;
    }

    drawCompass() {
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.4;

        // Línea horizontal
        this.ctx.beginPath();
        this.ctx.moveTo(this.center.x - this.radius, this.center.y);
        this.ctx.lineTo(this.center.x + this.radius, this.center.y);
        this.ctx.stroke();

        // Línea vertical
        this.ctx.beginPath();
        this.ctx.moveTo(this.center.x, this.center.y - this.radius);
        this.ctx.lineTo(this.center.x, this.center.y + this.radius);
        this.ctx.stroke();

        // Líneas diagonales
        const diagDist = this.radius / Math.sqrt(2);
        this.ctx.globalAlpha = 0.2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.center.x - diagDist, this.center.y - diagDist);
        this.ctx.lineTo(this.center.x + diagDist, this.center.y + diagDist);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.center.x + diagDist, this.center.y - diagDist);
        this.ctx.lineTo(this.center.x - diagDist, this.center.y + diagDist);
        this.ctx.stroke();

        // Etiquetas de dirección
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 14px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('N', this.center.x, this.center.y - this.radius - 20);
        this.ctx.fillText('S', this.center.x, this.center.y + this.radius + 20);
        this.ctx.textAlign = 'right';
        this.ctx.fillText('O', this.center.x - this.radius - 20, this.center.y);
        this.ctx.textAlign = 'left';
        this.ctx.fillText('E', this.center.x + this.radius + 20, this.center.y);
    }

    drawSweep() {
        const sweepAngle = (this.sweep * Math.PI) / 180;
        
        // Línea de escaneo principal
        this.ctx.globalAlpha = 0.8;
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        const sweepX = this.center.x + Math.cos(sweepAngle) * this.radius;
        const sweepY = this.center.y + Math.sin(sweepAngle) * this.radius;
        this.ctx.beginPath();
        this.ctx.moveTo(this.center.x, this.center.y);
        this.ctx.lineTo(sweepX, sweepY);
        this.ctx.stroke();

        // Sector de escaneo relleno
        this.ctx.globalAlpha = 0.1;
        this.ctx.fillStyle = '#00ff00';
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, this.radius, sweepAngle - 0.4, sweepAngle);
        this.ctx.lineTo(this.center.x, this.center.y);
        this.ctx.fill();

        // Brillo de escaneo secundario
        this.ctx.globalAlpha = 0.15;
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, this.radius * 0.8, sweepAngle - 0.1, sweepAngle + 0.1);
        this.ctx.stroke();
    }

    drawProjectiles(projectiles) {
        this.ctx.globalAlpha = 1;
        projectiles.forEach(proj => {
            // Punto central brillante
            this.ctx.fillStyle = '#00ff00';
            this.ctx.beginPath();
            this.ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Aura
            this.ctx.globalAlpha = 0.4;
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Rastro
            this.ctx.globalAlpha = 0.2;
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(proj.x, proj.y, 12, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.globalAlpha = 1;
        });
    }

    drawEnemies(enemies) {
        const squadrons = this.groupEnemiesBySquadron(enemies);
        
        this.ctx.globalAlpha = 0.95;
        for (let squadronId in squadrons) {
            const squadron = squadrons[squadronId];
            if (squadron.enemies.length === 0) continue;

            // Calcular centro del escuadrón
            let avgX = 0, avgY = 0;
            squadron.enemies.forEach(enemy => {
                avgX += enemy.x;
                avgY += enemy.y;
            });
            avgX /= squadron.enemies.length;
            avgY /= squadron.enemies.length;

            // Dibujar símbolo del contacto
            this.drawContactSymbol(avgX, avgY, squadron);
            
            // Dibujar círculo de escuadrón
            this.ctx.globalAlpha = 0.3;
            this.ctx.strokeStyle = squadron.color;
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.arc(avgX, avgY, 25, 0, Math.PI * 2);
            this.ctx.stroke();

            // Etiqueta del contacto
            this.ctx.globalAlpha = 0.8;
            this.ctx.fillStyle = squadron.color;
            this.ctx.font = 'bold 11px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${squadron.type} [${squadron.enemies.length}]`, avgX, avgY + 40);
            
            this.ctx.globalAlpha = 0.95;
        }
    }

    drawContactSymbol(x, y, squadron) {
        this.ctx.fillStyle = squadron.color;
        this.ctx.strokeStyle = squadron.color;
        this.ctx.lineWidth = 1.5;
        this.ctx.globalAlpha = 0.9;

        const size = 12;
        
        switch(squadron.type) {
            case 'JET':
                // Símbolo de avión (triángulo)
                this.ctx.beginPath();
                this.ctx.moveTo(x, y - size);
                this.ctx.lineTo(x + size, y + size);
                this.ctx.lineTo(x - size, y + size);
                this.ctx.closePath();
                this.ctx.fill();
                break;
            case 'MISSILE':
                // Símbolo de misil (flecha)
                this.ctx.beginPath();
                this.ctx.moveTo(x, y - size);
                this.ctx.lineTo(x + size/2, y + size/2);
                this.ctx.lineTo(x, y + size/3);
                this.ctx.lineTo(x - size/2, y + size/2);
                this.ctx.closePath();
                this.ctx.fill();
                break;
            case 'TANK':
                // Símbolo de tanque (cuadrado con tureta)
                this.ctx.fillRect(x - size, y - size/2, size * 2, size);
                this.ctx.fillRect(x - size/4, y - size, size/2, size/2);
                break;
        }

        // Pulso de detección
        this.ctx.globalAlpha = 0.3;
        this.ctx.strokeStyle = squadron.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size + 8, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawDefenses(defenses) {
        this.ctx.globalAlpha = 0.7;
        defenses.forEach(defense => {
            const color = defense.type === 'SHIELD' ? '#0099ff' : '#00ff00';
            
            // Base de la defensa
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(defense.x, defense.y, 6, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Rango de cobertura
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            this.ctx.globalAlpha = 0.3;
            this.ctx.beginPath();
            this.ctx.arc(defense.x, defense.y, defense.range, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.globalAlpha = 0.7;
        });
    }

    drawFloatingPoints(floatingPoints) {
        this.ctx.globalAlpha = 1;
        floatingPoints.forEach((point) => {
            this.ctx.fillStyle = point.color;
            this.ctx.font = 'bold 14px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`+${point.value}`, point.x, point.y);
        });
    }

    drawCenter() {
        // Centro del radar
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = '#00ff00';
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Marcas de orientación
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 1;
        const markerSize = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(this.center.x - markerSize, this.center.y);
        this.ctx.lineTo(this.center.x + markerSize, this.center.y);
        this.ctx.moveTo(this.center.x, this.center.y - markerSize);
        this.ctx.lineTo(this.center.x, this.center.y + markerSize);
        this.ctx.stroke();
    }

    groupEnemiesBySquadron(enemies) {
        const squadrons = {};
        enemies.forEach(enemy => {
            if (!squadrons[enemy.squadronId]) {
                squadrons[enemy.squadronId] = {
                    enemies: [],
                    type: enemy.type,
                    color: enemy.color,
                    symbol: enemy.symbol
                };
            }
            squadrons[enemy.squadronId].enemies.push(enemy);
        });
        return squadrons;
    }
}

const canvas = document.getElementById('radarCanvas');
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const radar = new RadarSystem(canvas);
