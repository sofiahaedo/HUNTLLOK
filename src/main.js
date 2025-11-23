// Configurar teclas cuando la página esté cargada
document.addEventListener('DOMContentLoaded', () => {
    juego.configurarTeclas();

    // Detectar dispositivo
    if (esTelefono()) {
        console.log("El juego se abrió en un TELÉFONO");
        juego.dispositivo = "telefono";
    } else {
        console.log("El juego se abrió en una PC");
        juego.dispositivo = "pc";
    }

    // Asegurar que inicie en el menú
    juego.enMenu = true;
    document.getElementById('pantallsMenu').classList.remove('hidden');
});

// --- Detectar dispositivo ---
function esTelefono() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function esPC() {
    return !esTelefono();
}
