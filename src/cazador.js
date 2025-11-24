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
        this.imagen = new Image();
        this.imagen.src = 'assets/cazador.png';
        this.teclas = {};
        this.direccionX = 0;
        this.direccionY = -1;
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
                break;
            case 2:
                this.arma = this.rifle;
                break;
            case 3:
                this.arma = this.escopeta;
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
        if (this.teclas['KeyW']) this.mover(0, -this.velocidad);
        if (this.teclas['KeyS']) this.mover(0, this.velocidad);
        if (this.teclas['KeyA']) this.mover(-this.velocidad, 0);
        if (this.teclas['KeyD']) this.mover(this.velocidad, 0);
    }

    dibujar(ctx) {
        ctx.drawImage(this.imagen, this.x, this.y, this.width, this.height);
    }

    colisionaCon(animal) {
        return this.getHitboxX() < animal.getHitboxX() + animal.hitboxWidth &&
               this.getHitboxX() + this.hitboxWidth > animal.getHitboxX() &&
               this.getHitboxY() < animal.getHitboxY() + animal.hitboxHeight &&
               this.getHitboxY() + this.hitboxHeight > animal.getHitboxY();
    }
}