class Cazador {
    constructor() {
        this.vida = 100;
        this.puntos = 0;
        this.pistola = new Pistola();
        this.rifle = new Rifle();
        this.escopeta = new Escopeta();
        this.arma = this.pistola;
        this.x = 360;
        this.y = 200;
        this.width = 40;
        this.height = 40;
        this.velocidad = 3;
        
        // Sprites para cada arma
        this.sprites = {
            pistola: new Image(),
            rifle: new Image(),
            escopeta: new Image()
        };
        
        // Configurar carga de sprites con logs
        this.sprites.pistola.src = 'assets/frames-cazador/CAZADOR PISTOLAA.png';
        this.sprites.rifle.src = 'assets/frames-cazador/CAZADOR RIFLEE.png';
        this.sprites.escopeta.src = 'assets/frames-cazador/CAZADOR ESCOPETAA.png';
        
        // Configuración de animación
        this.frameWidth = 64;  // Ajusta según tu spritesheet
        this.frameHeight = 64; // Ajusta según tu spritesheet
        this.framesPorFila = 4; // Ajusta según tu spritesheet
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.frameRate = 8;
        this.direccion = 1; // 0=arriba, 1=abajo, 2=derecha, 3=izquierda
        this.estaMoviendo = false;
        
        // Logs de debug
        this.sprites.pistola.onload = () => console.log('✅ Sprite pistola cargado');
        this.sprites.rifle.onload = () => console.log('✅ Sprite rifle cargado');
        this.sprites.escopeta.onload = () => console.log('✅ Sprite escopeta cargado');
        
        // Fallback original
        this.imagen = new Image();
        this.imagen.src = 'assets/cazador.png';
        
        this.armaActual = 'pistola';
        this.teclas = {};
        this.direccionX = 0;
        this.direccionY = -1;
        
        console.log('🎯 Cazador creado, intentando cargar sprites...');
        // Hitbox pequeña centrada en el cuerpo
        this.hitboxWidth = 18;
        this.hitboxHeight = 22;
        this.hitboxOffsetX = 11;
        this.hitboxOffsetY = 14;
    }

    getHitboxX() {
        return this.x + this.hitboxOffsetX;
    }

    getHitboxY() {
        return this.y + this.hitboxOffsetY;
    }

    disparar(direccionX, direccionY) {
        if (this.arma.tieneMunicion()) {
            this.arma.municion--;
            const bala = new Bala(this.x + this.width/2, this.y + this.height/2, direccionX, direccionY, this.arma.daño);
            juego.balas.push(bala);
            juego.actualizarUI();
        } else {
            console.log("Sin munición!");
        }
    }

    recargar() {
        if (this.arma.recargar()) {
            juego.actualizarUI();
            console.log("Recargando...");
        } else {
            console.log("Sin cargadores!");
        }
    }

    cambiarArma(tipoArma) {
        switch(tipoArma) {
            case 1:
                this.arma = this.pistola;
                this.armaActual = 'pistola';
                break;
            case 2:
                this.arma = this.rifle;
                this.armaActual = 'rifle';
                break;
            case 3:
                this.arma = this.escopeta;
                this.armaActual = 'escopeta';
                break;
        }
        juego.actualizarUI();
    }

    recibirDaño(daño) {
        this.vida = Math.max(0, this.vida - daño);
        if (this.vida === 0) {
            this.morir();
        }
        juego.actualizarUI();
    }

    ganarPuntos(puntosGanados) {
        this.puntos += puntosGanados;
        juego.actualizarUI();
    }

    morir() {
        juego.terminarPartida();
    }

    estaVivo() {
        return this.vida > 0;
    }

    mover(dx, dy) {
        const nuevaX = Math.max(0, Math.min(800 - this.width, this.x + dx));
        const nuevaY = Math.max(0, Math.min(420 - this.height, this.y + dy));
        
        // Verificar colisión con animales solo en X
        let puedeX = true;
        juego.animales.forEach(animal => {
            if (animal.estaVivo()) {
                const futuraHitboxX = nuevaX + this.hitboxOffsetX;
                const actualHitboxY = this.y + this.hitboxOffsetY;
                
                if (futuraHitboxX < animal.getHitboxX() + animal.hitboxWidth &&
                    futuraHitboxX + this.hitboxWidth > animal.getHitboxX() &&
                    actualHitboxY < animal.getHitboxY() + animal.hitboxHeight &&
                    actualHitboxY + this.hitboxHeight > animal.getHitboxY()) {
                    puedeX = false;
                }
            }
        });
        
        // Verificar colisión con animales solo en Y
        let puedeY = true;
        juego.animales.forEach(animal => {
            if (animal.estaVivo()) {
                const actualHitboxX = this.x + this.hitboxOffsetX;
                const futuraHitboxY = nuevaY + this.hitboxOffsetY;
                
                if (actualHitboxX < animal.getHitboxX() + animal.hitboxWidth &&
                    actualHitboxX + this.hitboxWidth > animal.getHitboxX() &&
                    futuraHitboxY < animal.getHitboxY() + animal.hitboxHeight &&
                    futuraHitboxY + this.hitboxHeight > animal.getHitboxY()) {
                    puedeY = false;
                }
            }
        });
        
        if (puedeX) this.x = nuevaX;
        if (puedeY) this.y = nuevaY;
    }

    actualizar() {
        this.estaMoviendo = false;
        
        if (this.teclas['KeyW']) {
            this.mover(0, -this.velocidad);
            this.direccion = 1; // Arriba
            this.estaMoviendo = true;
        }
        if (this.teclas['KeyS']) {
            this.mover(0, this.velocidad);
            this.direccion = 0; // Abajo
            this.estaMoviendo = true;
        }
        if (this.teclas['KeyA']) {
            this.mover(-this.velocidad, 0);
            this.direccion = 2; // Izquierda
            this.estaMoviendo = true;
        }
        if (this.teclas['KeyD']) {
            this.mover(this.velocidad, 0);
            this.direccion = 3; // Derecha
            this.estaMoviendo = true;
        }
        
        this.actualizarAnimacion();
    }
    
    actualizarAnimacion() {
        this.frameCounter++;
        
        if (this.frameCounter >= this.frameRate) {
            this.frameCounter = 0;
            
            if (this.estaMoviendo) {
                this.currentFrame++;
                if (this.currentFrame >= this.framesPorFila) {
                    this.currentFrame = 0;
                }
            } else {
                this.currentFrame = 0; // Frame idle
            }
        }
    }

    dibujar(ctx) {
        const spriteArma = this.sprites[this.armaActual];
        
        // Usar sprite específico del arma si está cargado
        if (spriteArma && spriteArma.complete) {
            const frameX = this.currentFrame * this.frameWidth;
            const frameY = this.direccion * this.frameHeight;
            
            ctx.drawImage(
                spriteArma,
                frameX, frameY, this.frameWidth, this.frameHeight,
                this.x, this.y, this.width, this.height
            );
        }
        // Fallback: sprite original
        else if (this.imagen && this.imagen.complete) {
            ctx.drawImage(this.imagen, this.x, this.y, this.width, this.height);
        }
        // Último fallback: rectángulo
        else {
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    colisionaCon(animal) {
        return this.getHitboxX() < animal.getHitboxX() + animal.hitboxWidth &&
               this.getHitboxX() + this.hitboxWidth > animal.getHitboxX() &&
               this.getHitboxY() < animal.getHitboxY() + animal.hitboxHeight &&
               this.getHitboxY() + this.hitboxHeight > animal.getHitboxY();
    }
}