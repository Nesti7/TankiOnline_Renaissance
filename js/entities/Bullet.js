// Класс для пули
class Bullet {
    constructor(scene, x, y, angle, speed = 500) {
        this.scene = scene;
        this.speed = speed;
        
        // Создаем графическое представление пули
        this.sprite = scene.add.circle(x, y, 5, 0xffff00);
        scene.physics.add.existing(this.sprite);
        
        // Устанавливаем скорость движения
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        this.sprite.body.setVelocity(velocityX, velocityY);
        
        // Устанавливаем размер коллайдера
        this.sprite.body.setSize(10, 10);
        
        // Включаем коллизию с границами мира
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.onWorldBounds = true;
        
        // Время жизни пули (автоматическое уничтожение через 3 секунды)
        this.lifetime = 3000;
        this.createdAt = scene.time.now;
    }
    
    update() {
        // Проверяем время жизни пули
        if (this.scene.time.now - this.createdAt > this.lifetime) {
            this.destroy();
            return;
        }
        
        // Проверяем выход за границы мира
        const bounds = this.scene.physics.world.bounds;
        if (this.sprite.x < bounds.x || this.sprite.x > bounds.x + bounds.width ||
            this.sprite.y < bounds.y || this.sprite.y > bounds.y + bounds.height) {
            this.destroy();
        }
    }
    
    destroy() {
        if (this.sprite && this.sprite.active) {
            this.sprite.destroy();
        }
    }
    
    getSprite() {
        return this.sprite;
    }
}

