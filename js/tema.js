// Valores por defecto
const TEMA_DEFECTO = {
    acento: '#ff4747',
    fondo: '#121212',
    tarjeta: '#1e1e1e',
    texto: '#ffffff'
};

document.addEventListener("DOMContentLoaded", () => {
    cargarTemaGuardado();
});

function cargarTemaGuardado() {
    const temaGuardado = JSON.parse(localStorage.getItem("habitApp_tema")) || TEMA_DEFECTO;
    aplicarColores(temaGuardado.acento, temaGuardado.fondo, temaGuardado.tarjeta);
}

function aplicarColores(acento, fondo, tarjeta) {
    const root = document.documentElement;
    
    // Aplicar variables CSS en vivo
    root.style.setProperty('--primary-color', acento);
    root.style.setProperty('--primary-hover', ajustarBrilloHex(acento, -20));
    root.style.setProperty('--bg-main', fondo);
    root.style.setProperty('--bg-card', tarjeta);

    // Actualizar inputs si el modal está abierto
    document.getElementById('inputColorAcento').value = acento;
    document.getElementById('inputColorFondo').value = fondo;
    document.getElementById('inputColorTarjeta').value = tarjeta;

    // Guardar en localStorage
    localStorage.setItem("habitApp_tema", JSON.stringify({
        acento: acento,
        fondo: fondo,
        tarjeta: tarjeta
    }));

    // Re-renderizar gráficas si existen en pantalla para tomar el nuevo color de acento
    if (typeof actualizarTodo === "function") {
        actualizarTodo();
    }
}

function actualizarColoresDesdeInputs() {
    const acento = document.getElementById('inputColorAcento').value;
    const fondo = document.getElementById('inputColorFondo').value;
    const tarjeta = document.getElementById('inputColorTarjeta').value;
    
    aplicarColores(acento, fondo, tarjeta);
}

function aplicarTemaPredefinido(acento, fondo, tarjeta) {
    aplicarColores(acento, fondo, tarjeta);
}

function restablecerTemaPorDefecto() {
    aplicarColores(TEMA_DEFECTO.acento, TEMA_DEFECTO.fondo, TEMA_DEFECTO.tarjeta);
}

function abrirModalTema() {
    document.getElementById('modalTema').style.display = 'flex';
}

function cerrarModalTema() {
    document.getElementById('modalTema').style.display = 'none';
}

// Función auxiliar para oscurecer/aclarar el color hover automáticamente
function ajustarBrilloHex(hex, percent) {
    let num = parseInt(hex.replace('#', ''), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
}