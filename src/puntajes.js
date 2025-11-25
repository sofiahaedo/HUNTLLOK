class TablaPuntajes {
    constructor() {
        this.mejoresPuntajes = this.cargarPuntajes();
    }

    cargarPuntajes() {
        const puntajes = localStorage.getItem('puntajesJuegoCaza');
        return puntajes ? JSON.parse(puntajes) : [];
    }

    guardarPuntajes() {
        localStorage.setItem('puntajesJuegoCaza', JSON.stringify(this.mejoresPuntajes));
    }

    agregarPuntaje(nombre, puntaje) {
        this.mejoresPuntajes.push({nombre, puntaje});
        this.ordenarPuntajes();
        this.mantenerTop5();
        this.guardarPuntajes();
    }

    ordenarPuntajes() {
        this.mejoresPuntajes.sort((a, b) => b.puntaje - a.puntaje);
    }

    mantenerTop5() {
        if (this.mejoresPuntajes.length > 5) {
            this.mejoresPuntajes = this.mejoresPuntajes.slice(0, 5);
        }
    }

    mostrarPuntajes() {
        return this.mejoresPuntajes.slice(0, 5);
    }

}

const tablaPuntajes = new TablaPuntajes();