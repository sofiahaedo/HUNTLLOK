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
    }

    iniciar() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.crearAnimalesIniciales();
        this.actualizarUI();
        this.juegoActivo = true;
        
        this.gameLoop = setInterval(() => {
            this.actualizar();
            this.dibujar();
        }, 1000/60);
    }

    crearAnimalesIniciales() {
        for (let i = 0; i < 3; i++) {
            this.crearNuevoAnimal();
        }
    }

    crearNuevoAnimal() {
        const x = Math.random() * 640;
        const y = Math.random() * 320;
        
        const tiposAnimales = [
            () => new Conejo(x, y),
            () => new Ciervo(x, y),
            () => new Oso(x, y)
        ];
        
        const nuevoAnimal = tiposAnimales[Math.floor(Math.random() * tiposAnimales.length)]();
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
                    this.salirAlMenu();
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
    
    // 1. Actualizar movimiento del cazador
    this.cazador.actualizar();
    
    // 2. Actualizar balas
    this.balas.forEach(bala => bala.actualizar());
    this.balas = this.balas.filter(bala => bala.activa);
    
    // 3. Mover osos hacia el cazador
    this.animales.forEach(animal => {
        if (animal instanceof Oso) {
            animal.perseguir(this.cazador);
        }
    });
    
    // 4. Verificar colisiones cazador-animal
    this.animales.forEach(animal => {
        if (animal.estaVivo() && this.cazador.colisionaCon(animal)) {
            animal.atacar(this.cazador);
        }
    });
    
    // 5. NUEVO: Procesar animales muertos ANTES de removerlos
    this.animales.forEach(animal => {
        if (!animal.estaVivo()) {
            // Dar puntos al cazador
            this.cazador.ganarPuntos(animal.puntosPorMatar);
            // Crear un nuevo animal
            this.crearNuevoAnimal();
        }
    });
    
    // 6. Remover animales muertos
    this.animales = this.animales.filter(animal => animal.estaVivo());
    }

    dibujar() {
        // Limpiar base
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar cazador
        this.cazador.dibujar(this.ctx);
        
        // Dibujar animales
        this.animales.forEach(animal => {
            animal.dibujar(this.ctx);
        });
        
        // Dibujar balas
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
        clearInterval(this.gameLoop);
        
        // Mostrar pantalla de guardar puntaje
        this.enGuardarPuntaje = true;
        document.getElementById('finalScore').textContent = this.cazador.puntos;
        document.getElementById('saveScoreScreen').classList.remove('hidden');
    }

    reiniciar() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        this.cazador = new Cazador();
        this.animales = [];
        this.balas = [];
        this.pausado = false;
        this.juegoActivo = false;
        this.enGuardarPuntaje = false;
        this.enIngresarNombre = false;
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        document.getElementById('saveScoreScreen').classList.add('hidden');
        document.getElementById('nameInputScreen').classList.add('hidden');
        this.iniciar();
    }

    actualizarUI() {
        document.getElementById('vida').textContent = this.cazador.vida;
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
        document.getElementById('menuScreen').classList.add('hidden');
        document.getElementById('gameContainer').classList.remove('hidden');
        this.iniciar();
    }

    mostrarTabla() {
        this.enMenu = false;
        this.enTabla = true;
        document.getElementById('menuScreen').classList.add('hidden');
        document.getElementById('scoreScreen').classList.remove('hidden');
        this.actualizarTabla();
    }

     resetearAlMenu() {
    if (this.gameLoop) {
        clearInterval(this.gameLoop);
    }
    this.juegoActivo = false;
    this.pausado = false;
    this.enMenu = true;
    this.enTabla = false;
    this.enGuardarPuntaje = false;
    this.enIngresarNombre = false;
    
    // Ocultar todas las pantallas
    ['gameContainer', 'gameOver', 'pauseScreen', 'scoreScreen', 
     'saveScoreScreen', 'nameInputScreen'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    
    // Mostrar menú
    document.getElementById('menuScreen').classList.remove('hidden');
    document.getElementById('playerName').value = '';
    }

    manejarGuardarPuntaje(e) {
        switch(e.code) {
            case 'KeyS':
                this.mostrarIngresarNombre();
                break;
            case 'KeyN':
                this.volverAlMenu();
                break;
        }
    }

    manejarGuardarPuntaje(e) {
        switch(e.code) {
            case 'KeyS':
                this.mostrarIngresarNombre();
                break;
            case 'KeyN':
                this.volverAlMenu();
                break;
        }
    }

    mostrarIngresarNombre() {
        this.enGuardarPuntaje = false;
        this.enIngresarNombre = true;
        document.getElementById('saveScoreScreen').classList.add('hidden');
        document.getElementById('nameInputScreen').classList.remove('hidden');
        document.getElementById('playerName').focus();
    }

    manejarIngresarNombre(e) {
        if (e.code === 'Enter') {
            const nombre = document.getElementById('playerName').value.trim();
            if (nombre) {
                tablaPuntajes.agregarPuntaje(nombre, this.cazador.puntos);
            }
            this.volverAlMenu();
        } else if (e.code === 'Escape') {
            this.volverAlMenu();
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
            document.getElementById('pauseScreen').classList.remove('hidden');
        } else {
            document.getElementById('pauseScreen').classList.add('hidden');
        }
    }
}

const juego = new Juego();



