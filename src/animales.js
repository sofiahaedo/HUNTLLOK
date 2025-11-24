class Animal {
    constructor(x, y, vida, puntosPorMatar, imagen) {
        this.x = x;
        this.y = y;
        this.vida = vida;
        this.puntosPorMatar = puntosPorMatar;
        this.imagen = imagen;
        this.vivo = true;
        this.width = 40;
        this.height = 40;
        // Hitbox centrada y pequeña
        this.hitboxWidth = 20;
        this.hitboxHeight = 20;
        this.hitboxOffsetX = 10;
        this.hitboxOffsetY = 15;
    }

    getHitboxX() {
        return this.x + this.hitboxOffsetX;
    }

    getHitboxY() {
        return this.y + this.hitboxOffsetY;
    }

    recibirDaño(daño) {
        this.vida = Math.max(0, this.vida - daño);
        if (this.vida === 0) {
            this.morir();
        }
    }

    morir() {
        this.vivo = false;
        juego.cazador.ganarPuntos(this.puntosPorMatar);
        juego.removerAnimal(this);
        juego.crearNuevoAnimal();
    }

    estaVivo() {
        return this.vivo;
    }

    atacar(cazador) {
        // Implementado en subclases
    }

    dibujar(ctx) {
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.fillStyle = 'white';
        // ctx.font = '12px Arial';
        // ctx.fillText(this.nombre, this.x, this.y - 5);
       
        // Si tiene imagen, dibujar imagen
        if (this.imagen && this.imagen.complete) {
            ctx.drawImage(this.imagen, this.x, this.y, this.width, this.height);
        } 
        // Si tiene color, dibujar rectángulo
        else if (this.color) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Dibujar nombre
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(this.nombre, this.x, this.y - 5);
    }
    

    distanciaA(objeto) {
        const dx = this.x - objeto.x;
        const dy = this.y - objeto.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    perseguir(cazador) {    
        if (!this.estaVivo()) return;        
        const dx = cazador.x - this.x;
        const dy = cazador.y - this.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        if (distancia <= this.rangoDeteccion && distancia > 0) {
            this.x += (dx / distancia) * this.velocidad;
            this.y += (dy / distancia) * this.velocidad;
        } else {
            // Movimiento aleatorio cuando no persigue
            this.moverAleatoriamente();
        }
    }

    moverAleatoriamente() {
        if (!this.direccionAleatoria || Math.random() < 0.02) {
            this.direccionAleatoria = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            };
        }
        
        const nuevaX = Math.max(0, Math.min(800 - this.width, this.x + this.direccionAleatoria.x * (this.velocidad * 0.3)));
        const nuevaY = Math.max(0, Math.min(420 - this.height, this.y + this.direccionAleatoria.y * (this.velocidad * 0.3)));
        
        // Verificar colisión con cazador en X
        let puedeX = true;
        const futuraHitboxX = nuevaX + this.hitboxOffsetX;
        const actualHitboxY = this.y + this.hitboxOffsetY;
        
        if (futuraHitboxX < juego.cazador.getHitboxX() + juego.cazador.hitboxWidth &&
            futuraHitboxX + this.hitboxWidth > juego.cazador.getHitboxX() &&
            actualHitboxY < juego.cazador.getHitboxY() + juego.cazador.hitboxHeight &&
            actualHitboxY + this.hitboxHeight > juego.cazador.getHitboxY()) {
            puedeX = false;
        }
        
        // Verificar colisión con cazador en Y
        let puedeY = true;
        const actualHitboxX = this.x + this.hitboxOffsetX;
        const futuraHitboxY = nuevaY + this.hitboxOffsetY;
        
        if (actualHitboxX < juego.cazador.getHitboxX() + juego.cazador.hitboxWidth &&
            actualHitboxX + this.hitboxWidth > juego.cazador.getHitboxX() &&
            futuraHitboxY < juego.cazador.getHitboxY() + juego.cazador.hitboxHeight &&
            futuraHitboxY + this.hitboxHeight > juego.cazador.getHitboxY()) {
            puedeY = false;
        }
        
        if (puedeX) this.x = nuevaX;
        if (puedeY) this.y = nuevaY;
    }

}

class Conejo extends Animal {
    constructor(x, y) {
        super(x, y, 25, 10);
        this.nombre = "Conejo";
        this.color = "#8B4513";
        this.velocidad = 0.8;
        this.rangoDeteccion = 0;
        // Hitbox muy pequeña centrada
        this.hitboxWidth = 18;
        this.hitboxHeight = 18;
        this.hitboxOffsetX = 11;
        this.hitboxOffsetY = 16;
    }

    atacar(cazador) {
        // Los conejos colisionan pero no hacen daño
        console.log("Conejo tocado!");
    }
}

class Ciervo extends Animal {
    constructor(x, y) {
        super(x, y, 75, 30);
        this.nombre = "Ciervo";
        this.color = "#D2691E";
        this.velocidad = 1;
        this.rangoDeteccion = 0;
        // Hitbox centrada en el torso
        this.hitboxWidth = 22;
        this.hitboxHeight = 18;
        this.hitboxOffsetX = 9;
        this.hitboxOffsetY = 16;
    }

    atacar(cazador) {
        // Los ciervos colisionan pero no hacen daño
        console.log("Ciervo tocado!");
    }
}

class Oso extends Animal {
    constructor(x, y) {
        super(x, y, 150, 50);
        this.nombre = "Oso";
        this.width = 80;  // Mucho más grande que el cazador
        this.height = 80;
        this.velocidad = 1;
        this.rangoDeteccion = 150;
        
        // Cargar sprite sheet
        this.spriteSheet = new Image();
        this.spriteSheet.src = './assets/oso-idle-2.png';
        this.imagenCargada = false;
        
        this.spriteSheet.onload = () => {
            this.imagenCargada = true;
            console.log("✅ Sprite del oso cargado!");
            console.log("   Tamaño:", this.spriteSheet.width, "x", this.spriteSheet.height);
        };
        
        this.spriteSheet.onerror = () => {
            console.error("❌ Error al cargar sprite del oso");
        };
        
        // CONFIGURACIÓN PARA TU SPRITE
        this.frameWidth = 64;      //64px
        this.frameHeight = 64;     //64px
        this.framesPorFila = 8;    //8 frames
        
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameRate = 10;       // Velocidad normal
        this.idleFrameRate = 30;   // Velocidad idle (más lento)
        
        this.direccion = 2;        // Empieza mirando abajo
        this.estaPersiguiendo = false;
        
        // Hitbox centrada en el cuerpo visible del oso
        this.hitboxWidth = 30;
        this.hitboxHeight = 30;
        this.hitboxOffsetX = 25;
        this.hitboxOffsetY = 35;
    }
    
    actualizarAnimacion() {
        if (!this.imagenCargada) return;
        
        this.frameCounter++;
        
        // Usar velocidad diferente según el estado
        const velocidadActual = this.estaPersiguiendo ? this.frameRate : this.idleFrameRate;
        
        if (this.frameCounter >= velocidadActual) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            // En idle, solo usar los primeros 2-3 frames para respiración sutil
            const maxFrames = this.estaPersiguiendo ? this.framesPorFila : 3;
            
            if (this.currentFrame >= maxFrames) {
                this.currentFrame = 0;
            }
        }
    }
    
    calcularDireccion(dx, dy) {
        const angulo = Math.atan2(dy, dx);
        
        if (angulo > -Math.PI/4 && angulo <= Math.PI/4) {
            return 2;  // Derecha →
        } else if (angulo > Math.PI/4 && angulo <= 3*Math.PI/4) {
            return 1;  // Abajo ↓
        } else if (angulo > 3*Math.PI/4 || angulo <= -3*Math.PI/4) {
            return 3;  // Izquierda ←
        } else {
            return 0    ;  // Arriba ↑
        }
    }
    
    dibujar(ctx) {
        if (!this.estaVivo()) return;
        
        if (!this.imagenCargada) {
            ctx.fillStyle = "#654321";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(this.nombre, this.x + (this.width / 2) - 15, this.y + this.height + 15);
            return;
        }
        
        this.actualizarAnimacion();
        
        const frameX = this.currentFrame * this.frameWidth;
        const frameY = this.direccion * this.frameHeight;
        
        ctx.drawImage(
            this.spriteSheet,
            frameX, frameY, this.frameWidth, this.frameHeight,
            this.x, this.y, this.width, this.height
        );
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(this.nombre, this.x + (this.width / 2) - 15, this.y + this.height + 15);
        
        // // Debug
        // ctx.fillStyle = 'yellow';
        // ctx.font = '10px Arial';
        // const simboloDireccion = ['espaldas', 'frente', '→', '←'][this.direccion];
        // ctx.fillText(`${simboloDireccion} F:${this.currentFrame}`, this.x, this.y + this.height + 15);
    }
    
    perseguir(cazador) {    
        if (!this.estaVivo()) return;
        
        const dx = cazador.x - this.x;
        const dy = cazador.y - this.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        if (distancia <= this.rangoDeteccion && distancia > 0) {
            this.estaPersiguiendo = true;
            this.direccion = this.calcularDireccion(dx, dy);
            
            const nuevaX = Math.max(0, Math.min(800 - this.width, this.x + (dx / distancia) * this.velocidad));
            const nuevaY = Math.max(0, Math.min(420 - this.height, this.y + (dy / distancia) * this.velocidad));
            
            // Verificar colisión con cazador en X
            let puedeX = true;
            const futuraHitboxX = nuevaX + this.hitboxOffsetX;
            const actualHitboxY = this.y + this.hitboxOffsetY;
            
            if (futuraHitboxX < juego.cazador.getHitboxX() + juego.cazador.hitboxWidth &&
                futuraHitboxX + this.hitboxWidth > juego.cazador.getHitboxX() &&
                actualHitboxY < juego.cazador.getHitboxY() + juego.cazador.hitboxHeight &&
                actualHitboxY + this.hitboxHeight > juego.cazador.getHitboxY()) {
                puedeX = false;
            }
            
            // Verificar colisión con cazador en Y
            let puedeY = true;
            const actualHitboxX = this.x + this.hitboxOffsetX;
            const futuraHitboxY = nuevaY + this.hitboxOffsetY;
            
            if (actualHitboxX < juego.cazador.getHitboxX() + juego.cazador.hitboxWidth &&
                actualHitboxX + this.hitboxWidth > juego.cazador.getHitboxX() &&
                futuraHitboxY < juego.cazador.getHitboxY() + juego.cazador.hitboxHeight &&
                futuraHitboxY + this.hitboxHeight > juego.cazador.getHitboxY()) {
                puedeY = false;
            }
            
            if (puedeX) this.x = nuevaX;
            if (puedeY) this.y = nuevaY;
        } else {
            this.estaPersiguiendo = false;
            // Movimiento aleatorio cuando no persigue
            this.moverAleatoriamente();
        }
    }

    atacar(cazador) {
        if (this.estaVivo()) {
            cazador.recibirDaño(20);
        }
    }
}


class Dinosaurio extends Animal {
    constructor(x, y,) {
        super(x, y, 200, 150);
        this.nombre = "dino";
        //this.color = "#652121ff";
        this.velocidad = 2;
        this.rangoDeteccion = 200;
        this.imagen = new Image();
        this.imagen.src = './assets/dino.jpg';
        // Hitbox centrada en el cuerpo del dino
        this.hitboxWidth = 32;
        this.hitboxHeight = 32;
        this.hitboxOffsetX = 4;
        this.hitboxOffsetY = 8;
    }
    atacar(cazador) {
        if (this.estaVivo()) {
            cazador.recibirDaño(30);
        }
    }

    perseguir(cazador) {    
        if (!this.estaVivo()) return;        
        const dx = cazador.x - this.x;
        const dy = cazador.y - this.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        if (distancia <= this.rangoDeteccion && distancia > 0) {
            const nuevaX = Math.max(0, Math.min(800 - this.width, this.x + (dx / distancia) * this.velocidad));
            const nuevaY = Math.max(0, Math.min(420 - this.height, this.y + (dy / distancia) * this.velocidad));
            
            // Verificar colisión con cazador en X
            let puedeX = true;
            const futuraHitboxX = nuevaX + this.hitboxOffsetX;
            const actualHitboxY = this.y + this.hitboxOffsetY;
            
            if (futuraHitboxX < juego.cazador.getHitboxX() + juego.cazador.hitboxWidth &&
                futuraHitboxX + this.hitboxWidth > juego.cazador.getHitboxX() &&
                actualHitboxY < juego.cazador.getHitboxY() + juego.cazador.hitboxHeight &&
                actualHitboxY + this.hitboxHeight > juego.cazador.getHitboxY()) {
                puedeX = false;
            }
            
            // Verificar colisión con cazador en Y
            let puedeY = true;
            const actualHitboxX = this.x + this.hitboxOffsetX;
            const futuraHitboxY = nuevaY + this.hitboxOffsetY;
            
            if (actualHitboxX < juego.cazador.getHitboxX() + juego.cazador.hitboxWidth &&
                actualHitboxX + this.hitboxWidth > juego.cazador.getHitboxX() &&
                futuraHitboxY < juego.cazador.getHitboxY() + juego.cazador.hitboxHeight &&
                futuraHitboxY + this.hitboxHeight > juego.cazador.getHitboxY()) {
                puedeY = false;
            }
            
            if (puedeX) this.x = nuevaX;
            if (puedeY) this.y = nuevaY;
        } else {
            // Movimiento aleatorio cuando no persigue
            this.moverAleatoriamente();
        }
    }
}
