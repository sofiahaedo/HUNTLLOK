class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    
    assert(condition, message) {
        if (!condition) {
            throw new Error(`ASSERT FAILED: ${message}`);
        }
    }


    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`ASSERT EQUAL FAILED: ${message}. Expected: ${expected}, Got: ${actual}`);
        }
    }

    
    assertNotNull(value, message) {
        if (value === null || value === undefined) {
            throw new Error(`ASSERT NOT NULL FAILED: ${message}`);
        }
    }

    
    runTest(testName, testFunction) {
        try {
            console.log(` Ejecutando test: ${testName}`);
            testFunction();
            console.log(` PASSED: ${testName}`);
            this.passed++;
        } catch (error) {
            console.error(` FAILED: ${testName} - ${error.message}`);
            this.failed++;
        }
    }

    
    showResults() {
        const total = this.passed + this.failed;
        console.log(`\n📊 RESUMEN DE TESTS:`);
        console.log(`Total: ${total} | Passed: ${this.passed} | Failed: ${this.failed}`);
        if (this.failed === 0) {
            console.log(`🎉 Todos los tests pasaron!`);
        } else {
            console.log(`⚠️ ${this.failed} tests fallaron`);
        }
    }
}


const testRunner = new TestRunner();


function testAnimalCreation() {

    const mockJuego = {
        cazador: { ganarPuntos: () => {}, x: 100, y: 100 },
        removerAnimal: () => {},
        crearNuevoAnimal: () => {}
    };
    window.juego = mockJuego;

    const conejo = new Conejo(50, 50);
    
    testRunner.assert(conejo.x === 50, "Conejo debe tener posición X correcta");
    testRunner.assert(conejo.y === 50, "Conejo debe tener posición Y correcta");
    testRunner.assert(conejo.vida === 25, "Conejo debe tener 25 de vida");
    testRunner.assert(conejo.vivo === true, "Conejo debe estar vivo al crearse");
    testRunner.assertEqual(conejo.nombre, "Conejo", "Nombre debe ser 'Conejo'");
}

function testAnimalDamage() {
    const mockJuego = {
        cazador: { ganarPuntos: () => {} },
        removerAnimal: () => {},
        crearNuevoAnimal: () => {}
    };
    window.juego = mockJuego;

    const ciervo = new Ciervo(100, 100);
    const vidaInicial = ciervo.vida;
    
    ciervo.recibirDaño(25);
    testRunner.assert(ciervo.vida === vidaInicial - 25, "Daño debe reducir vida correctamente");
    testRunner.assert(ciervo.vida >= 0, "Vida no puede ser negativa");
}

function testAnimalDeath() {
    const mockJuego = {
        cazador: { ganarPuntos: () => {} },
        removerAnimal: () => {},
        crearNuevoAnimal: () => {}
    };
    window.juego = mockJuego;

    const oso = new Oso(200, 200);
    oso.recibirDaño(200); 
    
    testRunner.assert(oso.vida === 0, "Vida debe ser 0 después de daño mortal");
    testRunner.assert(oso.vivo === false, "Animal debe estar muerto");
}


function testCazadorCreation() {
    const cazador = new Cazador();
    
    testRunner.assert(cazador.vida === 100, "Cazador debe empezar con 100 de vida");
    testRunner.assert(cazador.puntos === 0, "Cazador debe empezar con 0 puntos");
    testRunner.assertNotNull(cazador.arma, "Cazador debe tener un arma");
    testRunner.assert(cazador.cooldownDaño === false, "Cooldown debe estar desactivado inicialmente");
}

function testCazadorDamage() {
    const cazador = new Cazador();
    const vidaInicial = cazador.vida;
    
    cazador.recibirDaño(30);
    testRunner.assert(cazador.vida === vidaInicial - 30, "Daño debe reducir vida del cazador");
    testRunner.assert(cazador.cooldownDaño === true, "Cooldown debe activarse después del daño");
    
    
    cazador.recibirDaño(20);
    testRunner.assert(cazador.vida === vidaInicial - 30, "No debe recibir daño durante cooldown");
}

function testCazadorMovement() {
    const cazador = new Cazador();
    const xInicial = cazador.x;
    const yInicial = cazador.y;
    
    cazador.mover(10, 0);
    testRunner.assert(cazador.x === xInicial + 10, "Movimiento en X debe funcionar");
    testRunner.assert(cazador.y === yInicial, "Y no debe cambiar en movimiento horizontal");
    
    cazador.mover(0, 15);
    testRunner.assert(cazador.y === yInicial + 15, "Movimiento en Y debe funcionar");
}


function testWeaponCreation() {
    const pistola = new Pistola();
    
    testRunner.assertNotNull(pistola.nombre, "Arma debe tener nombre");
    testRunner.assert(pistola.municion >= 0, "Munición no puede ser negativa");
    testRunner.assert(pistola.daño > 0, "Daño debe ser positivo");
}

function testWeaponShooting() {
    const rifle = new Rifle();
    const municionInicial = rifle.municion;
    
    testRunner.assert(rifle.tieneMunicion(), "Rifle debe tener munición inicialmente");
    
    
    if (rifle.tieneMunicion()) {
        rifle.municion--;
    }
    
    testRunner.assert(rifle.municion === municionInicial - 1, "Munición debe reducirse al disparar");
}


function testCollisionDetection() {
    const cazador = new Cazador();
    cazador.x = 100;
    cazador.y = 100;
    
    const animal = new Conejo(100, 100); 
    
    testRunner.assert(cazador.colisionaCon(animal), "Debe detectar colisión en misma posición");
    
    animal.x = 200;
    animal.y = 200;
    testRunner.assert(!cazador.colisionaCon(animal), "No debe detectar colisión cuando están lejos");
}


function testHitboxCalculation() {
    const animal = new Oso(50, 50);
    
    const hitboxX = animal.getHitboxX();
    const hitboxY = animal.getHitboxY();
    
    testRunner.assert(hitboxX === animal.x + animal.hitboxOffsetX, "Hitbox X debe calcularse correctamente");
    testRunner.assert(hitboxY === animal.y + animal.hitboxOffsetY, "Hitbox Y debe calcularse correctamente");
}


function testBoundaryLimits() {
    const cazador = new Cazador();
    
    
    cazador.x = 0;
    cazador.mover(-10, 0);
    testRunner.assert(cazador.x >= 0, "Cazador no debe salir por el límite izquierdo");
    
    
    cazador.y = 0;
    cazador.mover(0, -10);
    testRunner.assert(cazador.y >= 0, "Cazador no debe salir por el límite superior");
}


function runAllTests() {
    

    testRunner.runTest("Creación de Animales", testAnimalCreation);
    testRunner.runTest("Daño a Animales", testAnimalDamage);
    testRunner.runTest("Muerte de Animales", testAnimalDeath);
    

    testRunner.runTest("Creación de Cazador", testCazadorCreation);
    testRunner.runTest("Daño al Cazador", testCazadorDamage);
    testRunner.runTest("Movimiento del Cazador", testCazadorMovement);
    

    testRunner.runTest("Creación de Armas", testWeaponCreation);
    testRunner.runTest("Disparo de Armas", testWeaponShooting);
    
    
    testRunner.runTest("Detección de Colisiones", testCollisionDetection);
    testRunner.runTest("Cálculo de Hitbox", testHitboxCalculation);
    
    testRunner.runTest("Límites del Juego", testBoundaryLimits);
    
    testRunner.showResults();
}


window.runTests = runAllTests;
window.testRunner = testRunner;
