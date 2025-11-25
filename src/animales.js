class Animal {
    constructor(x, y, puntosPorMatar, imagen, velocidad) {
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
        this.velocidad = velocidad;
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

   
    dibujar(ctx) {
        if (this.imagen && this.imagen.complete) {
            ctx.drawImage(this.imagen, this.x, this.y, this.width, this.height);
        } else if (this.color) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(this.nombre, this.x, this.y - 5);
    }
    

    distanciaA(objeto) { //Calcula Distancia entre 2 puntos
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
        
    
        let puedeX = true;
        const futuraHitboxX = nuevaX + this.hitboxOffsetX;
        const actualHitboxY = this.y + this.hitboxOffsetY;
        
        if (futuraHitboxX < juego.cazador.getHitboxX() + juego.cazador.hitboxWidth &&
            futuraHitboxX + this.hitboxWidth > juego.cazador.getHitboxX() &&
            actualHitboxY < juego.cazador.getHitboxY() + juego.cazador.hitboxHeight &&
            actualHitboxY + this.hitboxHeight > juego.cazador.getHitboxY()) {
            puedeX = false;
        }
        
        
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
        this.velocidad = 1.5;
        this.rangoDeteccion = 80;
        
        
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'assets/frames Conejo/conejito.png';
        this.imagenCargada = false;
        
    
        this.imagenMuerte = new Image();
        this.imagenMuerte.src = 'assets/frames Conejo/conejo muerto.png';
        
        this.spriteSheet.onload = () => {
            this.imagenCargada = true;
        };
        

        
    
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.framesPorFila = 4;
        
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameRate = 6; 
        this.idleFrameRate = 15;
        
        
        this.direccion = 2;
        this.estaMoviendo = false;
        this.tiempoMuerte = 0;
        this.mostrarImagenMuerte = false;
        
    
        this.hitboxWidth = 18;
        this.hitboxHeight = 18;
        this.hitboxOffsetX = 11;
        this.hitboxOffsetY = 16;
    }
    
    actualizarAnimacion() {
        if (!this.imagenCargada) return;
        
        this.frameCounter++;
        
        const velocidadActual = this.estaMoviendo ? this.frameRate : this.idleFrameRate;
        
        if (this.frameCounter >= velocidadActual) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            const maxFrames = this.estaMoviendo ? this.framesPorFila : 2;
            
            if (this.currentFrame >= maxFrames) {
                this.currentFrame = 0;
            }
        }
    }
    
    calcularDireccion(dx, dy) {
        const angulo = Math.atan2(dy, dx);
        
        if (angulo > -Math.PI/4 && angulo <= Math.PI/4) {
            return 0; // Derecha
        } else if (angulo > Math.PI/4 && angulo <= 3*Math.PI/4) {
            return 2; // Frente
        } else if (angulo > 3*Math.PI/4 || angulo <= -3*Math.PI/4) {
            return 1; // Izquierda
        } else {
            return 3; // Detrás
        }
    }
    
    perseguir(cazador) {
        if (!this.estaVivo()) return;
        
        const dx = cazador.x - this.x;
        const dy = cazador.y - this.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        if (distancia <= this.rangoDeteccion && distancia > 0) {

            this.estaMoviendo = true;
            this.direccion = this.calcularDireccion(-dx, -dy);
            
            const nuevaX = Math.max(0, Math.min(800 - this.width, this.x - (dx / distancia) * this.velocidad));
            const nuevaY = Math.max(0, Math.min(420 - this.height, this.y - (dy / distancia) * this.velocidad));
            
            this.x = nuevaX;
            this.y = nuevaY;
        } else {
            this.estaMoviendo = false;
            this.moverAleatoriamente();
        }
    }
    
    morir() {
        this.vivo = false;
        this.mostrarImagenMuerte = true;
        this.tiempoMuerte = 60;
        juego.cazador.ganarPuntos(this.puntosPorMatar);
    }
    
    dibujar(ctx) {
        if (!this.estaVivo() && this.mostrarImagenMuerte) {
            if (this.imagenMuerte.complete) {
                ctx.drawImage(this.imagenMuerte, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = "#8B0000";
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = 'white';
                ctx.font = '10px Arial';
                ctx.fillText("MUERTO", this.x, this.y + 15);
            }
            
            this.tiempoMuerte--;
            if (this.tiempoMuerte <= 0) {
                this.mostrarImagenMuerte = false;
                juego.removerAnimal(this);
                juego.crearNuevoAnimal();
            }
            return;
        }
        
        if (!this.estaVivo()) return;
        
       
        
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
        ctx.fillText(this.nombre, this.x, this.y - 5);
    }

    
}

class Ciervo extends Animal {
    constructor(x, y) {
        super(x, y, 75, 30);
        this.nombre = "Ciervo";
        this.velocidad = 2;
        this.rangoDeteccion = 120;
        
        
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'assets/frames-ciervo/Frames-Ciervo.png';
        this.imagenCargada = false;
        
    
        this.imagenMuerte = new Image();
        this.imagenMuerte.src = 'assets/frames-ciervo/ciervo muerto.png';
        
        this.spriteSheet.onload = () => {
            this.imagenCargada = true;
        };
        
        
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.framesPorFila = 4;
        
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameRate = 4;
        this.idleFrameRate = 20;
        
    
        this.direccion = 2; 
        this.estaMoviendo = false;
        this.tiempoMuerte = 0;
        this.mostrarImagenMuerte = false;
        
    
        this.hitboxWidth = 22;
        this.hitboxHeight = 18;
        this.hitboxOffsetX = 9;
        this.hitboxOffsetY = 16;
    }
    
    actualizarAnimacion() {
        if (!this.imagenCargada) return;
        
        this.frameCounter++;
        
        const velocidadActual = this.estaMoviendo ? this.frameRate : this.idleFrameRate;
        
        if (this.frameCounter >= velocidadActual) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            const maxFrames = this.estaMoviendo ? this.framesPorFila : 2;
            
            if (this.currentFrame >= maxFrames) {
                this.currentFrame = 0;
            }
        }
    }
    
    calcularDireccion(dx, dy) {
        const angulo = Math.atan2(dy, dx);
        
        if (angulo > -Math.PI/4 && angulo <= Math.PI/4) {
            return 0;
        } else if (angulo > Math.PI/4 && angulo <= 3*Math.PI/4) {
            return 2; 
        } else if (angulo > 3*Math.PI/4 || angulo <= -3*Math.PI/4) {
            return 1; 
        } else {
            return 3; 
        }
    }
    
    perseguir(cazador) {
        if (!this.estaVivo()) return;
        
        const dx = cazador.x - this.x;
        const dy = cazador.y - this.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        if (distancia <= this.rangoDeteccion && distancia > 0) {
    
            this.estaMoviendo = true;
            this.direccion = this.calcularDireccion(-dx, -dy);
            
            const nuevaX = Math.max(0, Math.min(800 - this.width, this.x - (dx / distancia) * this.velocidad));
            const nuevaY = Math.max(0, Math.min(420 - this.height, this.y - (dy / distancia) * this.velocidad));
            
            this.x = nuevaX;
            this.y = nuevaY;
        } else {
            this.estaMoviendo = false;
            this.moverAleatoriamente();
        }
    }
    
    morir() {
        this.vivo = false;
        this.mostrarImagenMuerte = true;
        this.tiempoMuerte = 60;
        juego.cazador.ganarPuntos(this.puntosPorMatar);
    }
    
    dibujar(ctx) {
        if (!this.estaVivo() && this.mostrarImagenMuerte) {
        
            if (this.imagenMuerte.complete) {
                ctx.drawImage(this.imagenMuerte, this.x, this.y, this.width, this.height);
            } 
            
            this.tiempoMuerte--;
            if (this.tiempoMuerte <= 0) {
                this.mostrarImagenMuerte = false;

                juego.removerAnimal(this);
                juego.crearNuevoAnimal();
            }
            return;
        }
        
        if (!this.estaVivo()) return;
        
       
        
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
        ctx.fillText(this.nombre, this.x, this.y - 5);
    }

}

class Oso extends Animal {
    constructor(x, y) {
        super(x, y, 150, 50);
        this.nombre = "Oso";
        this.width = 80; 
        this.height = 80;
        this.velocidad = 1;
        this.rangoDeteccion = 200;
        
    
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'assets/frames-oso/oso-idle-2.png';
        this.imagenCargada = false;
        
        this.spriteSheet.onload = () => {
            this.imagenCargada = true;
        };
        
        this.frameWidth = 64;     
        this.frameHeight = 64;     
        this.framesPorFila = 8;   
        
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameRate = 10;      
        this.idleFrameRate = 30;   
        
        this.direccion = 2;        
        this.estaPersiguiendo = false;
        
    
        this.cooldownAtaque = 0;
        this.tiempoEntreAtaques = 60; 
        
    
        this.hitboxWidth = 30;
        this.hitboxHeight = 30;
        this.hitboxOffsetX = 25;
        this.hitboxOffsetY = 35;
    }
    
    actualizarAnimacion() {
        if (!this.imagenCargada) return;
        
        this.frameCounter++;
        
        
        const velocidadActual = this.estaPersiguiendo ? this.frameRate : this.idleFrameRate;
        
        if (this.frameCounter >= velocidadActual) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            
            const maxFrames = this.estaPersiguiendo ? this.framesPorFila : 3;
            
            if (this.currentFrame >= maxFrames) {
                this.currentFrame = 0;
            }
        }
    }
    
    calcularDireccion(dx, dy) {
        const angulo = Math.atan2(dy, dx);
        
        if (angulo > -Math.PI/4 && angulo <= Math.PI/4) {
            return 2;  // Derecha 
        } else if (angulo > Math.PI/4 && angulo <= 3*Math.PI/4) {
            return 1;  // Abajo 
        } else if (angulo > 3*Math.PI/4 || angulo <= -3*Math.PI/4) {
            return 3;  // Izquierda 
        } else {
            return 0    ;  // Arriba 
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
        

    }
    
    perseguir(cazador) {    
        if (!this.estaVivo()) return;
        
    
        if (this.cooldownAtaque > 0) {
            this.cooldownAtaque--;
        }
        
        const dx = cazador.x - this.x;
        const dy = cazador.y - this.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        if (distancia <= this.rangoDeteccion && distancia > 0) {
            this.estaPersiguiendo = true;
            this.direccion = this.calcularDireccion(dx, dy);
            
    
            this.x = Math.max(0, Math.min(800 - this.width, this.x + (dx / distancia) * this.velocidad));
            this.y = Math.max(0, Math.min(420 - this.height, this.y + (dy / distancia) * this.velocidad));
        } else {
            this.estaPersiguiendo = false;
            this.moverAleatoriamente();
        }
    }

    atacar(cazador) {
        if (this.estaVivo() && this.cooldownAtaque <= 0) {
            cazador.recibirDaño(20);
            this.cooldownAtaque = this.tiempoEntreAtaques;

        }
    }
}


class Dinosaurio extends Animal {
    constructor(x, y,) {
        super(x, y, 200, 150);
        this.nombre = "dino";

        this.velocidad = 2;
        this.rangoDeteccion = 200;
        this.imagen = new Image();
        this.imagen.src = './assets/dino.png'
        
        
        this.cooldownAtaque = 0;
        this.tiempoEntreAtaques = 45; 
    }
    atacar(cazador) {
        if (this.estaVivo() && this.cooldownAtaque <= 0) {
            cazador.recibirDaño(50);
            this.cooldownAtaque = this.tiempoEntreAtaques;

        }
    }
        
    

    perseguir(cazador) {    
        if (!this.estaVivo()) return;
        
    
        if (this.cooldownAtaque > 0) {
            this.cooldownAtaque--;
        }
        
        const dx = cazador.x - this.x;
        const dy = cazador.y - this.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        if (distancia <= this.rangoDeteccion && distancia > 0) {
    
            this.x = Math.max(0, Math.min(800 - this.width, this.x + (dx / distancia) * this.velocidad));
            this.y = Math.max(0, Math.min(420 - this.height, this.y + (dy / distancia) * this.velocidad));
        } else {
            this.moverAleatoriamente();
        }
    }
}
