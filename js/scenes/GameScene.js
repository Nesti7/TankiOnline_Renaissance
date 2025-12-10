// Основная игровая сцена
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.walls = [];
        this.tank = null;
        this.score = 0;
    }
    
    create() {
        // Устанавливаем границы мира
        this.physics.world.setBounds(0, 0, 1200, 800);
        
        // Создаем карту с препятствиями
        this.createMap();
        
        // Создаем танк игрока
        this.tank = new Tank(this, 100, 100);
        
        // Настраиваем камеру для следования за танком
        this.cameras.main.setBounds(0, 0, 1200, 800);
        this.cameras.main.startFollow(this.tank.getBodySprite(), true, 0.1, 0.1);
        this.cameras.main.setZoom(1);
        this.cameras.main.setDeadzone(100, 100);
        
        // Настраиваем коллизии
        this.setupCollisions();
        
        // Обработка выхода пуль за границы мира
        this.physics.world.on('worldbounds', (event) => {
            if (event.gameObject && event.gameObject.active) {
                // Находим пулю и уничтожаем её
                if (this.tank) {
                    const bullets = this.tank.getBullets();
                    for (let i = bullets.length - 1; i >= 0; i--) {
                        if (bullets[i] && bullets[i].getSprite() === event.gameObject) {
                            bullets[i].destroy();
                            break;
                        }
                    }
                }
            }
        });
        
        // Обновляем UI
        this.updateUI();
    }
    
    createMap() {
        // Создаем границы карты
        const wallThickness = 30;
        
        // Верхняя стена
        for (let x = 0; x < 1200; x += 50) {
            this.walls.push(new Wall(this, x, wallThickness / 2, 50, wallThickness));
        }
        
        // Нижняя стена
        for (let x = 0; x < 1200; x += 50) {
            this.walls.push(new Wall(this, x, 800 - wallThickness / 2, 50, wallThickness));
        }
        
        // Левая стена
        for (let y = 0; y < 800; y += 50) {
            this.walls.push(new Wall(this, wallThickness / 2, y, wallThickness, 50));
        }
        
        // Правая стена
        for (let y = 0; y < 800; y += 50) {
            this.walls.push(new Wall(this, 1200 - wallThickness / 2, y, wallThickness, 50));
        }
        
        // Создаем препятствия внутри карты
        const obstacles = [
            { x: 300, y: 200, w: 80, h: 80 },
            { x: 600, y: 300, w: 100, h: 60 },
            { x: 900, y: 500, w: 60, h: 100 },
            { x: 400, y: 600, w: 120, h: 60 },
            { x: 800, y: 150, w: 60, h: 120 },
            { x: 200, y: 450, w: 80, h: 80 },
            { x: 700, y: 600, w: 100, h: 80 }
        ];
        
        obstacles.forEach(obs => {
            this.walls.push(new Wall(this, obs.x, obs.y, obs.w, obs.h));
        });
    }
    
    setupCollisions() {
        // Создаем группу для всех стен
        this.wallGroup = this.physics.add.staticGroup();
        this.walls.forEach(wall => {
            this.wallGroup.add(wall.body);
        });
        
        // Коллизия танка со стенами
        this.physics.add.collider(
            this.tank.getBodySprite(),
            this.wallGroup,
            null,
            null,
            this
        );
    }
    
    update() {
        if (this.tank) {
            this.tank.update();
            
            // Проверяем коллизии пуль со стенами
            const bullets = this.tank.getBullets();
            for (let i = bullets.length - 1; i >= 0; i--) {
                const bullet = bullets[i];
                if (bullet && bullet.getSprite() && bullet.getSprite().active) {
                    // Проверяем коллизию с каждой стеной
                    this.physics.world.overlap(
                        bullet.getSprite(),
                        this.wallGroup,
                        (bulletSprite, wallBody) => {
                            bullet.destroy();
                        },
                        null,
                        this
                    );
                }
            }
            
            // Обновляем UI каждые несколько кадров (для производительности)
            if (!this.lastUIUpdate || this.time.now - this.lastUIUpdate > 100) {
                this.updateUI();
                this.lastUIUpdate = this.time.now;
            }
        }
    }
    
    updateUI() {
        if (this.tank) {
            const healthElement = document.getElementById('health-value');
            if (healthElement) {
                healthElement.textContent = Math.max(0, Math.floor(this.tank.getHealth()));
            }
            
            const scoreElement = document.getElementById('score-value');
            if (scoreElement) {
                scoreElement.textContent = this.score;
            }
        }
    }
}

