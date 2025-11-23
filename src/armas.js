class Arma {
    constructor(daño, municion, nombre, cargadorMax) {
        this.daño = daño;
        this.municion = municion;
        this.municionMax = municion;
        this.nombre = nombre;
        this.cargadorMax = cargadorMax;
        this.cargadores = cargadorMax;
    }

    usar(objetivo) {
        console.log(`Usando ${this.nombre} contra objetivo en (${objetivo.x}, ${objetivo.y})`);
        if (this.tieneMunicion()) {
            objetivo.recibirDaño(this.daño);
            this.municion--;
            return true;
        }
        return false;
    }

    tieneMunicion() {
        return this.municion > 0;
    }

    recargar() {
        if (this.cargadores > 0 && this.municion < this.municionMax) {
            this.municion = this.municionMax;
            this.cargadores--;
            return true;
        }
        return false;
    }
}

class Pistola extends Arma {
    constructor() {
        super(25, 15, "Pistola", 5);
    }
}

class Rifle extends Arma {
    constructor() {
        super(50, 8, "Rifle", 4);
    }
}

class Escopeta extends Arma {
    constructor() {
        super(75, 5, "Escopeta", 3);
    }
}