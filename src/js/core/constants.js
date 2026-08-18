// Constantes del juego
const DEFENSES = {
    GUN: {
        name: 'Cañón AA',
        cost: 50,
        description: 'Dispara a Jets/Misiles',
        range: 100,
        damage: 2,
        fireRate: 0.5
    },
    MISSILE: {
        name: 'Lanzador Misiles',
        cost: 80,
        description: 'Destruye grupos de tanques',
        range: 150,
        damage: 5,
        fireRate: 1
    },
    SHIELD: {
        name: 'Escudo de Energía',
        cost: 120,
        description: 'Bloquea 1 ataque crítico',
        absorption: 50,
        duration: 30
    }
};

const ENEMY_TYPES = {
    JET: { speed: 60, health: 1, color: '#ff0000', symbol: '✈', threat: 30, points: 2 },
    MISSILE: { speed: 80, health: 1, color: '#ff9900', symbol: '➤', threat: 50, points: 3 },
    TANK: { speed: 30, health: 3, color: '#ffff00', symbol: '⬛', threat: 20, points: 1 }
};

const TANK_FORMATIONS = {
    WEDGE: [
        { x: 0, y: 0 }, { x: 30, y: -20 }, { x: 30, y: 20 },
        { x: 60, y: -35 }, { x: 60, y: 35 }
    ],
    LINE: [
        { x: 0, y: -25 }, { x: 0, y: 0 }, { x: 0, y: 25 },
        { x: 0, y: -50 }, { x: 0, y: 50 }
    ],
    COLUMN: [
        { x: 0, y: 0 }, { x: -25, y: 0 }, { x: 25, y: 0 },
        { x: -50, y: 0 }, { x: 50, y: 0 }
    ],
    DIAMOND: [
        { x: 0, y: 0 }, { x: 30, y: 0 }, { x: -30, y: 0 },
        { x: 0, y: 30 }, { x: 0, y: -30 }
    ]
};

const GAME_CONFIG = {
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 700,
    INITIAL_ROUND_TIME: 20,
    HEALTH_HEAL_PER_ROUND: 10,
    ROUND_TIME_INCREASE: 1.1,
    MISSILE_DAMAGE: 0.35,
    PROJECTILE_SPEED: 350
};
