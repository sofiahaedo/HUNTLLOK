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
        if (this.x < 0 || this.x > 720 || this.y < 0 || this.y > 400) {
            this.activa = false;
        }
    }
    
    colisionaCon(animal) {
        return this.x < animal.x + animal.width &&
               this.x + this.width > animal.x &&
               this.y < animal.y + animal.height &&
               this.y + this.height > animal.y;
    }
    
    dibujar(ctx) {
        if (this.activa) {
            ctx.drawImage(this.imagen, this.x, this.y, this.width, this.height);
        }
    }
}