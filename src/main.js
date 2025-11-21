// Configurar teclas cuando la página esté cargada
document.addEventListener('DOMContentLoaded', () => {
    juego.configurarTeclas();
    // Asegurar que inicie en el menú
    juego.enMenu = true;
    document.getElementById('pantallsMenu').classList.remove('hidden');
});