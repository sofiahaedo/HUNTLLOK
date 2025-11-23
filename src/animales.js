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
        this.frameRate = 10;       // Ajustá si querés más rápido/lento
        
        this.direccion = 2;        // Empieza mirando abajo
        this.estaPersiguiendo = false;
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
            ctx.fillText(this.nombre, this.x, this.y - 5);
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
        ctx.fillText(this.nombre, this.x, this.y - 5);
        
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
            
            this.x += (dx / distancia) * this.velocidad;
            this.y += (dy / distancia) * this.velocidad;
        } else {
            this.estaPersiguiendo = false;
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
