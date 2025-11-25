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
        //this.imagen = new Image();
        //this.imagen.src = 'assets/balas/bala.gif';


        // Cargar sprite sheet
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'assets/balas/balas-Frames.png';
        this.imagenCargada = false;
        
        this.spriteSheet.onload = () => {
            this.imagenCargada = true;
            console.log("Sprite de bala cargado!");
        };
        
        this.spriteSheet.onerror = () => {
            console.error("Error al cargar sprite de bala");
        };
        
        // CONFIGURACIÓN PARA SPRITE DE BALA
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.framesPorFila = 6;
        
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameRate = 5; // Animación rápida para bala
        
        // Determinar dirección para sprite
        this.direccionSprite = this.calcularDireccionSprite(direccionX, direccionY);
    
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
        
        // Actualizar animación
        this.actualizarAnimacion();
        
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
    
    calcularDireccionSprite(dx, dy) {
        if (dy < 0) return 0;      // Arriba
        if (dy > 0) return 1;      // Abajo  
        if (dx > 0) return 2;      // Derecha
        if (dx < 0) return 3;      // Izquierda
        return 0; // Default
    }
    
    actualizarAnimacion() {
        if (!this.imagenCargada) return;
        
        this.frameCounter++;
        
        if (this.frameCounter >= this.frameRate) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            if (this.currentFrame >= this.framesPorFila) {
                this.currentFrame = 0;
            }
        }
    }
    
    dibujar(ctx) {
        if (!this.activa) return;
        
        if (this.imagenCargada) {
            const frameX = this.currentFrame * this.frameWidth;
            const frameY = this.direccionSprite * this.frameHeight;
            
            ctx.drawImage(
                this.spriteSheet,
                frameX, frameY, this.frameWidth, this.frameHeight,
                this.x, this.y, this.width, this.height
            );
        } else {
            // Fallback: círculo amarillo
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}