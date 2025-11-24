class Bala {
    constructor(x, y, direccionX, direccionY, daño) {
        this.x = x;
        this.y = y;
        this.direccionX = direccionX;
        this.direccionY = direccionY;
        this.daño = daño;
        this.velocidad = 8;
        this.width = 20;
        this.height = 20;
        this.activa = true;
        this.imagen = new Image();
        this.imagen.src = 'assets/bala.gif';
        // Hitbox muy pequeña centrada
        this.hitboxWidth = 10;
        this.hitboxHeight = 10;
        this.hitboxOffsetX = 5;
        this.hitboxOffsetY = 5;
    }
    
    getHitboxX() {
        return this.x + this.hitboxOffsetX;
    }

    getHitboxY() {
        return this.y + this.hitboxOffsetY;
    }
    
    actualizar() {
        if (!this.activa) return;
        
        this.x += this.direccionX * this.velocidad;
        this.y += this.direccionY * this.velocidad;
        
        // Verificar colisión con cualquier animal
        juego.animales.forEach(animal => {
            if (animal.estaVivo() && this.colisionaCon(animal)) {
                animal.recibirDaño(this.daño);
                this.activa = false;
            }
        });
        
        // Remover si sale del canvas
        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 420) {
            this.activa = false;
        }
    }
    
    colisionaCon(animal) {
        return this.getHitboxX() < animal.getHitboxX() + animal.hitboxWidth &&
               this.getHitboxX() + this.hitboxWidth > animal.getHitboxX() &&
               this.getHitboxY() < animal.getHitboxY() + animal.hitboxHeight &&
               this.getHitboxY() + this.hitboxHeight > animal.getHitboxY();
    }
    
    dibujar(ctx) {
        if (this.activa) {
            ctx.drawImage(this.imagen, this.x, this.y, this.width, this.height);
        }
    }
}