// Класс для создания стен/препятствий
class Wall {
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        // Создаем физическое тело для стены
        this.body = scene.add.rectangle(x, y, width, height, 0x8b4513);
        scene.physics.add.existing(this.body, true); // true = статичное тело
        
        // Устанавливаем размеры коллайдера
        this.body.body.setSize(width, height);
    }
    
    // Метод для уничтожения стены
    destroy() {
        this.body.destroy();
    }
}

