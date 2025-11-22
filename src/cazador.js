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
        this.x = Math.max(0, Math.min(680, this.x + dx));
        this.y = Math.max(0, Math.min(360, this.y + dy));
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
        return this.x < animal.x + animal.width &&
               this.x + this.width > animal.x &&
               this.y < animal.y + animal.height &&
               this.y + this.height > animal.y;
    }
}