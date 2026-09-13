// Cargar meta guardada al iniciar la aplicación
document.addEventListener("DOMContentLoaded", () => {
    const fechaGuardada = localStorage.getItem("habitApp_fechaMeta");
    const inputFecha = document.getElementById("fechaMeta");

    if (fechaGuardada) {
        inputFecha.value = fechaGuardada;
        calcularTiempoRestante(fechaGuardada);
    }
});

function guardarYCalcularMeta() {
    const inputFecha = document.getElementById("fechaMeta");
    const fechaSeleccionada = inputFecha.value;

    if (fechaSeleccionada) {
        localStorage.setItem("habitApp_fechaMeta", fechaSeleccionada);
        calcularTiempoRestante(fechaSeleccionada);
    }
}

function calcularTiempoRestante(fechaMetaStr) {
    const badge = document.getElementById("badgeContador");
    
    // Convertir fechas (Ajustando la zona horaria)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const partes = fechaMetaStr.split("-");
    const meta = new Date(partes[0], partes[1] - 1, partes[2]);

    if (meta <= hoy) {
        badge.innerText = "🎉 ¡Llegó el día de tu meta!";
        badge.style.background = "#28a745"; // Verde al cumplir la fecha
        return;
    }

    let años = meta.getFullYear() - hoy.getFullYear();
    let meses = meta.getMonth() - hoy.getMonth();
    let dias = meta.getDate() - hoy.getDate();

    // Ajuste de días en meses con diferente número de días
    if (dias < 0) {
        meses -= 1;
        const ultimoDiaMesAnterior = new Date(meta.getFullYear(), meta.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
    }

    // Ajuste de meses
    if (meses < 0) {
        años -= 1;
        meses += 12;
    }

    // Construcción dinámica de la frase
    let textoPartes = [];
    if (años > 0) textoPartes.push(`${años} ${años === 1 ? 'año' : 'años'}`);
    if (meses > 0) textoPartes.push(`${meses} ${meses === 1 ? 'mes' : 'meses'}`);
    if (dias > 0) textoPartes.push(`${dias} ${dias === 1 ? 'día' : 'días'}`);

    badge.innerText = "⏳ Faltan " + textoPartes.join(", ");
    badge.style.background = "linear-gradient(135deg, #ff4747, #b31212)";
}