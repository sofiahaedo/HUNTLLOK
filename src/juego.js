class Juego {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.cazador = new Cazador();
        this.animales = [];
        this.balas = [];
        this.gameLoop = null;
        this.juegoActivo = false;
        this.pausado = false;
        this.enMenu = true;
        this.enTabla = false;
        this.enGuardarPuntaje = false;
        this.enIngresarNombre = false;
        this.enInstrucciones = false;
    }

    iniciar() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.crearAnimalesIniciales();
        this.actualizarUI();
        this.juegoActivo = true;
        
        this.loop();
    }

    loop() {
        if (this.juegoActivo) {
            this.actualizar();
            this.dibujar();
            this.gameLoop = requestAnimationFrame(() => this.loop());
        }
    }

    crearAnimalesIniciales() {
        for (let i = 0; i < 4; i++) {
            this.crearNuevoAnimal();
        }
    }

    crearNuevoAnimal() {
        let x, y, distancia;
        const rangoMinimo = 200;
        
        do {
            x = Math.random() * (800 - 80);
            y = Math.random() * (420 - 80);
            const dx = x - this.cazador.x;
            const dy = y - this.cazador.y;
            distancia = Math.sqrt(dx * dx + dy * dy);
        } while (distancia < rangoMinimo);
        
        const tiposAnimales = [
            () => new Conejo(x, y), 
            () => new Ciervo(x, y),
            () => new Oso(x, y),
            () => new Dinosaurio(x, y)
        ];
        
        const indice = Math.floor(Math.random() * tiposAnimales.length);
        const nuevoAnimal = tiposAnimales[indice]();
        this.animales.push(nuevoAnimal);
    }

    configurarTeclas() {
        document.addEventListener('keydown', (e) => {
            if (this.enMenu) {
                this.manejarTeclasMenu(e);
                return;
            }
            
            if (this.enTabla) {
                if (e.code === 'Escape') {
                    this.resetearAlMenu();
                }
                return;
            }
            
            if (this.enInstrucciones) {
                if (e.code === 'Escape') {
                    this.mostrarMenu();
                }
                return;
            }
            
            if (this.enGuardarPuntaje) {
                this.manejarGuardarPuntaje(e);
                return;
            }
            
            if (this.enIngresarNombre) {
                this.manejarIngresarNombre(e);
                return;
            }
            
            if (!this.juegoActivo) return;
            
            this.cazador.teclas[e.code] = true;
            
            switch(e.code) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.cazador.disparar(0, -1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.cazador.disparar(0, 1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.cazador.disparar(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.cazador.disparar(1, 0);
                    break;
                case 'KeyR':
                    this.cazador.recargar();
                    break;
                case 'KeyP':
                    this.pausar();
                    break;
                case 'Enter':
                    this.reiniciar();
                    break;
                case 'Escape':
                    this.terminarPartida();
                    break;
                case 'Digit1':
                    this.cazador.cambiarArma(1);
                    break;
                case 'Digit2':
                    this.cazador.cambiarArma(2);
                    break;
                case 'Digit3':
                    this.cazador.cambiarArma(3);
                    break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (this.cazador) {
                this.cazador.teclas[e.code] = false;
            }
        });
    }

   actualizar() {
    if (!this.juegoActivo || this.pausado) return;
    

    this.cazador.actualizar();
    
    
    this.balas.forEach(bala => bala.actualizar());
    this.balas = this.balas.filter(bala => bala.activa);
    

    this.animales.forEach(animal => {
        animal.perseguir(this.cazador);
    });
    

    this.animales.forEach(animal => {
        if (animal.estaVivo() && this.cazador.colisionaCon(animal)) {
            animal.atacar(this.cazador);
        }
    });
    
    this.animales.forEach(animal => {
        if (!animal.estaVivo()) {
            this.cazador.ganarPuntos(animal.puntosPorMatar);
            this.crearNuevoAnimal();
        }
    });
    
    this.animales = this.animales.filter(animal => animal.estaVivo());
    }

    dibujar() {
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        
        this.cazador.dibujar(this.ctx);
        
        this.animales.forEach(animal => {
            animal.dibujar(this.ctx);
        });
        
        
        this.balas.forEach(bala => {
            bala.dibujar(this.ctx);
        });
    }

    animalMasCercano() {
        const animalesVivos = this.animales.filter(animal => animal.estaVivo());
        if (animalesVivos.length === 0) return null;
        
        return animalesVivos.reduce((cercano, animal) => {
            const distanciaActual = animal.distanciaA(this.cazador);
            const distanciaCercano = cercano.distanciaA(this.cazador);
            return distanciaActual < distanciaCercano ? animal : cercano;
        });
    }

    removerAnimal(animal) {
        const index = this.animales.indexOf(animal);
        if (index > -1) {
            this.animales.splice(index, 1);
        }
    }

    terminarPartida() {
        this.juegoActivo = false;
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        
    
        this.enGuardarPuntaje = true;
        document.getElementById('finalScore').textContent = this.cazador.puntos;
        document.getElementById('salvarPuntos').classList.remove('hidden');
    }

    reiniciar() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        this.cazador = new Cazador();
        this.animales = [];
        this.balas = [];
        this.pausado = false;
        this.juegoActivo = false;
        this.enGuardarPuntaje = false;
        this.enIngresarNombre = false;
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('PantallaPausa').classList.add('hidden');
        document.getElementById('salvarPuntos').classList.add('hidden');
        document.getElementById('pantallaNombre').classList.add('hidden');
        this.iniciar();
    }

    actualizarUI() {
        const vida = this.cazador.vida;
        document.getElementById('vida').textContent = vida;
        
        
        const barraVida = document.getElementById('barra-vida-fill');
        const porcentajeVida = vida / 100;
        barraVida.style.width = `${porcentajeVida * 100}%`;
        
        
        if (vida <= 33) {
            barraVida.style.background = '#e74c3c';
        } else if (vida <= 66) {
            barraVida.style.background = 'linear-gradient(90deg, #e74c3c 0%, #f39c12 100%)';
        } else {
            barraVida.style.background = 'linear-gradient(90deg, #f39c12 0%, #27ae60 100%)';
        }
        
        document.getElementById('puntos').textContent = this.cazador.puntos;
        document.getElementById('arma').textContent = this.cazador.arma.nombre;
        document.getElementById('municion').textContent = `${this.cazador.arma.municion}/${this.cazador.arma.cargadores}`;
    }

    manejarTeclasMenu(e) {
        switch(e.code) {
            case 'Digit1':
                this.iniciarJuego();
                break;
            case 'Digit2':
                this.mostrarTabla();
                break;
            case 'Digit3':
                this.mostrarInstrucciones();
                break;
            case 'Digit4':
                window.close();
                break;
        }
    }

    iniciarJuego() {
        this.enMenu = false;
        this.cazador = new Cazador();
        this.animales = [];
        this.balas = [];
        this.pausado = false;
        document.getElementById('pantallsMenu').classList.add('hidden');
        document.getElementById('tablero').classList.remove('hidden');
        this.iniciar();
    }

    mostrarTabla() {
        this.enMenu = false;
        this.enTabla = true;
        document.getElementById('pantallsMenu').classList.add('hidden');
        document.getElementById('pantallaPuntos').classList.remove('hidden');
        this.actualizarTabla();
    }

    resetearAlMenu() {
    if (this.gameLoop) {
        cancelAnimationFrame(this.gameLoop);
    }
    this.juegoActivo = false;
    this.pausado = false;
    this.enMenu = true;
    this.enTabla = false;
    this.enGuardarPuntaje = false;
    this.enIngresarNombre = false;
    this.enInstrucciones = false;
    

    ['tablero', 'gameOver', 'PantallaPausa', 'pantallaPuntos', 
     'salvarPuntos', 'pantallaNombre'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    

    document.getElementById('pantallsMenu').classList.remove('hidden');
    document.getElementById('playerName').value = '';
    }


    manejarGuardarPuntaje(e) {
        switch(e.code) {
            case 'KeyS':
                this.mostrarIngresarNombre();
                break;
            case 'KeyN':
                this.resetearAlMenu();
                break;
        }
    }

    mostrarIngresarNombre() {
        this.enGuardarPuntaje = false;
        this.enIngresarNombre = true;
        document.getElementById('salvarPuntos').classList.add('hidden');
        document.getElementById('pantallaNombre').classList.remove('hidden');
        document.getElementById('playerName').focus();
    }

    manejarIngresarNombre(e) {
        if (e.code === 'Enter') {
            const nombre = document.getElementById('playerName').value.trim();
            if (nombre) {
                tablaPuntajes.agregarPuntaje(nombre, this.cazador.puntos);
            }
            this.resetearAlMenu();
        } else if (e.code === 'Escape') {
            this.resetearAlMenu();
        }
    }

    actualizarTabla() {
        const scoreList = document.getElementById('scoreList');
        const puntajes = tablaPuntajes.mostrarPuntajes();
        
        if (puntajes.length === 0) {
            scoreList.innerHTML = '<p>No hay puntajes registrados</p>';
        } else {
            scoreList.innerHTML = puntajes.map((score, index) => 
                `<p>${index + 1}. ${score.nombre} - ${score.puntaje} puntos</p>`
            ).join('');
        }
    }



    pausar() {
        this.pausado = !this.pausado;
        if (this.pausado) {
            document.getElementById('PantallaPausa').classList.remove('hidden');
        } else {
            document.getElementById('PantallaPausa').classList.add('hidden');
        }
    }


    mostrarInstrucciones() {
        this.enMenu = false;
        this.enInstrucciones = true;
        document.getElementById('pantallsMenu').classList.add('hidden');
        document.getElementById('Instrucciones').classList.remove('hidden');
    }

    mostrarMenu() {
        this.enMenu = true;
        this.enInstrucciones = false;
        document.getElementById('Instrucciones').classList.add('hidden');
        document.getElementById('pantallsMenu').classList.remove('hidden');
    }
}


const juego = new Juego();



