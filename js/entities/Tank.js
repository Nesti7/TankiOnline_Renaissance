// Класс для танка игрока
class Tank {
    constructor(scene, x, y) {
        this.scene = scene;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.speed = 200;
        this.rotationSpeed = 0.05;
        this.lastShotTime = 0;
        this.shootCooldown = 300; // миллисекунды между выстрелами
        
        // Создаем корпус танка
        this.bodySprite = scene.add.rectangle(x, y, 40, 40, 0x4ade80);
        scene.physics.add.existing(this.bodySprite);
        this.bodySprite.body.setCollideWorldBounds(true);
        this.bodySprite.body.setSize(40, 40);
        
        // Создаем пушку танка
        this.gunSprite = scene.add.rectangle(x, y - 25, 8, 20, 0x22c55e);
        scene.physics.add.existing(this.gunSprite);
        this.gunSprite.body.setSize(8, 20);
        
        // Массив для хранения пуль
        this.bullets = [];
        
        // Клавиши управления
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasdKeys = scene.input.keyboard.addKeys('W,S,A,D');
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    
    update() {
        // Определяем нажатые клавиши
        const up = this.cursors.up.isDown || this.wasdKeys.W.isDown;
        const down = this.cursors.down.isDown || this.wasdKeys.S.isDown;
        const left = this.cursors.left.isDown || this.wasdKeys.A.isDown;
        const right = this.cursors.right.isDown || this.wasdKeys.D.isDown;
        const shoot = Phaser.Input.Keyboard.JustDown(this.spaceKey);
        
        // Поворот танка
        if (left) {
            this.bodySprite.setRotation(this.bodySprite.rotation - this.rotationSpeed);
        }
        if (right) {
            this.bodySprite.setRotation(this.bodySprite.rotation + this.rotationSpeed);
        }
        
        // Движение танка
        if (up) {
            this.scene.physics.velocityFromRotation(
                this.bodySprite.rotation,
                this.speed,
                this.bodySprite.body.velocity
            );
        } else if (down) {
            this.scene.physics.velocityFromRotation(
                this.bodySprite.rotation,
                -this.speed,
                this.bodySprite.body.velocity
            );
        } else {
            this.bodySprite.body.setVelocity(0, 0);
        }
        
        // Обновляем позицию пушки относительно корпуса
        const gunOffsetX = Math.cos(this.bodySprite.rotation) * 0;
        const gunOffsetY = Math.sin(this.bodySprite.rotation) * 0;
        this.gunSprite.setPosition(
            this.bodySprite.x + gunOffsetX,
            this.bodySprite.y + gunOffsetY
        );
        this.gunSprite.setRotation(this.bodySprite.rotation);
        
        // Стрельба
        if (shoot && this.canShoot()) {
            this.shoot();
        }
        
        // Обновляем пули
        this.updateBullets();
    }
    
    canShoot() {
        const now = this.scene.time.now;
        return now - this.lastShotTime >= this.shootCooldown;
    }
    
    shoot() {
        const now = this.scene.time.now;
        this.lastShotTime = now;
        
        // Вычисляем позицию выстрела (конец пушки)
        const gunLength = 25;
        const bulletX = this.bodySprite.x + Math.cos(this.bodySprite.rotation) * gunLength;
        const bulletY = this.bodySprite.y + Math.sin(this.bodySprite.rotation) * gunLength;
        
        // Создаем пулю
        const bullet = new Bullet(this.scene, bulletX, bulletY, this.bodySprite.rotation);
        this.bullets.push(bullet);
    }
    
    updateBullets() {
        // Обновляем все пули и удаляем уничтоженные
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet && bullet.getSprite() && bullet.getSprite().active) {
                bullet.update();
            } else {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
        return this.health <= 0;
    }
    
    getBodySprite() {
        return this.bodySprite;
    }
    
    getGunSprite() {
        return this.gunSprite;
    }
    
    getBullets() {
        return this.bullets;
    }
    
    getHealth() {
        return this.health;
    }
    
    getMaxHealth() {
        return this.maxHealth;
    }
}

