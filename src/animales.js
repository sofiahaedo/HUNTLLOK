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
        }
    }

}

class Conejo extends Animal {
    constructor(x, y) {
        super(x, y, 25, 10);
        this.nombre = "Conejo";
        this.color = "#8B4513";
        
    }

    atacar(cazador) {
        // Los conejos no atacan
    }
}

class Ciervo extends Animal {
    constructor(x, y) {
        super(x, y, 75, 30);
        this.nombre = "Ciervo";
        this.color = "#D2691E";
    }

    atacar(cazador) {
        // Los ciervos no atacan
    }
}

class Oso extends Animal {
    constructor(x, y) {
        super(x, y, 150, 50);
        this.nombre = "Oso";
        this.color = "#654321";
        this.velocidad = 1;
        this.rangoDeteccion = 150;
        
    }

    perseguir(cazador) {    
        if (!this.estaVivo()) return;        
        const dx = cazador.x - this.x;
        const dy = cazador.y - this.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        if (distancia <= this.rangoDeteccion && distancia > 0) {
            this.x += (dx / distancia) * this.velocidad;
            this.y += (dy / distancia) * this.velocidad;
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
        this.imagen.src = './assets/dino.jpg'
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
            this.x += (dx / distancia) * this.velocidad;
            this.y += (dy / distancia) * this.velocidad;
        }
    }
}
