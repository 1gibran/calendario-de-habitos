const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Obtener fecha actual en tiempo real del sistema
const hoy = new Date();
let añoSeleccionado = hoy.getFullYear(); 
let mesSeleccionado = hoy.getMonth(); 
let modoEdicion = false;

// ESTRUCTURA DE TABLEROS MÚLTIPLES
let tableros = [];
let tableroActivoId = null;
let habitos = [];

function initApp() {
    // Forzar la lectura de la fecha exacta al iniciar
    const fechaActual = new Date();
    añoSeleccionado = fechaActual.getFullYear();
    mesSeleccionado = fechaActual.getMonth();

    cargarTablerosDesdeStorage();
    poblarSelectoresFecha();
    poblarSelectorTableros();
    cargarHabitosTableroActual();
    escucharEventosFecha();
    actualizarTodo();
}

// 1. CARGA Y GESTIÓN DE TABLEROS
function cargarTablerosDesdeStorage() {
    const dataGuardada = localStorage.getItem("habitApp_tableros");
    if (dataGuardada) {
        tableros = JSON.parse(dataGuardada);
    } else {
        tableros = [
            { id: "tab_1", nombre: "Personal", habitos: [
                { id: 1, nombre: "Hacer ejercicio 💪" },
                { id: 2, nombre: "Aprender inglés 🇬🇧" }
            ]}
        ];
        guardarTablerosEnStorage();
    }
    tableroActivoId = localStorage.getItem("habitApp_tableroActivoId") || tableros[0].id;
}

function guardarTablerosEnStorage() {
    localStorage.setItem("habitApp_tableros", JSON.stringify(tableros));
    localStorage.setItem("habitApp_tableroActivoId", tableroActivoId);
}

function poblarSelectorTableros() {
    const select = document.getElementById("selectTablero");
    if (!select) return;
    select.innerHTML = "";

    tableros.forEach(tab => {
        let opt = document.createElement("option");
        opt.value = tab.id;
        opt.innerText = tab.nombre;
        if (tab.id === tableroActivoId) opt.selected = true;
        select.appendChild(opt);
    });
}

function cargarHabitosTableroActual() {
    const tabActual = tableros.find(t => t.id === tableroActivoId);
    habitos = tabActual ? tabActual.habitos : [];
}

function cambiarTablero() {
    const select = document.getElementById("selectTablero");
    if (!select) return;
    tableroActivoId = select.value;
    localStorage.setItem("habitApp_tableroActivoId", tableroActivoId);
    cargarHabitosTableroActual();
    actualizarTodo();
}

function crearNuevoTablero() {
    const nombre = prompt("Nombre del nuevo espacio / tablero:");
    if (nombre && nombre.trim() !== "") {
        const nuevoId = "tab_" + Date.now();
        tableros.push({ id: nuevoId, nombre: nombre.trim(), habitos: [] });
        tableroActivoId = nuevoId;
        guardarTablerosEnStorage();
        poblarSelectorTableros();
        cargarHabitosTableroActual();
        actualizarTodo();
    }
}

function renombrarTableroActual() {
    const tabActual = tableros.find(t => t.id === tableroActivoId);
    if (!tabActual) return;
    const nuevoNombre = prompt("Nuevo nombre para el espacio:", tabActual.nombre);
    if (nuevoNombre && nuevoNombre.trim() !== "") {
        tabActual.nombre = nuevoNombre.trim();
        guardarTablerosEnStorage();
        poblarSelectorTableros();
    }
}

function eliminarTableroActual() {
    if (tableros.length <= 1) {
        alert("Debes mantener al menos un tablero activo.");
        return;
    }
    const tabActual = tableros.find(t => t.id === tableroActivoId);
    if (confirm(`¿Eliminar el espacio "${tabActual.nombre}" y todos sus hábitos?`)) {
        tableros = tableros.filter(t => t.id !== tableroActivoId);
        tableroActivoId = tableros[0].id;
        guardarTablerosEnStorage();
        poblarSelectorTableros();
        cargarHabitosTableroActual();
        actualizarTodo();
    }
}

// 2. GENERACIÓN DE FECHAS
function poblarSelectoresFecha() {
    const selectAño = document.getElementById('selectAño') || document.getElementById('selectAnio');
    const selectMes = document.getElementById('selectMes');

    if (!selectAño || !selectMes) return;

    selectAño.innerHTML = "";
    selectMes.innerHTML = "";

    const anioActual = hoy.getFullYear();
    const anioInicio = anioActual - 2;
    const anioFin = anioActual + 10;

    // Generar opciones de año
    for (let a = anioInicio; a <= anioFin; a++) {
        let opt = document.createElement('option');
        opt.value = a.toString();
        opt.innerText = a;
        if (a === añoSeleccionado) opt.selected = true;
        selectAño.appendChild(opt);
    }

    // Generar opciones de mes
    nombresMeses.forEach((m, idx) => {
        let opt = document.createElement('option');
        opt.value = idx.toString();
        opt.innerText = m;
        if (idx === mesSeleccionado) opt.selected = true;
        selectMes.appendChild(opt);
    });

    // Fuerza la selección del valor
    selectAño.value = añoSeleccionado.toString();
    selectMes.value = mesSeleccionado.toString();
}

function escucharEventosFecha() {
    const selectAño = document.getElementById('selectAño') || document.getElementById('selectAnio');
    const selectMes = document.getElementById('selectMes');

    if (selectAño) selectAño.onchange = actualizarTodo;
    if (selectMes) selectMes.onchange = actualizarTodo;
}

// 3. ACTUALIZADOR GENERAL
function actualizarTodo() {
    const selectAño = document.getElementById('selectAño') || document.getElementById('selectAnio');
    const selectMes = document.getElementById('selectMes');

    // Solo actualizar la variable si el selector tiene una opción seleccionada válida
    if (selectAño && selectAño.value !== "" && !isNaN(parseInt(selectAño.value, 10))) {
        añoSeleccionado = parseInt(selectAño.value, 10);
    }
    if (selectMes && selectMes.value !== "" && !isNaN(parseInt(selectMes.value, 10))) {
        mesSeleccionado = parseInt(selectMes.value, 10);
    }

    const titulo = document.getElementById('tituloMesAño');
    if (titulo) {
        titulo.innerText = `${nombresMeses[mesSeleccionado]} ${añoSeleccionado}`;
    }

    const tabActual = tableros.find(t => t.id === tableroActivoId);
    if (tabActual) {
        tabActual.habitos = habitos;
        guardarTablerosEnStorage();
    }

    if (typeof renderizarTablaHabitos === 'function') renderizarTablaHabitos();
    if (typeof renderizarGraficaMensual === 'function') renderizarGraficaMensual();
    if (typeof renderizarGraficaSemanal === 'function') renderizarGraficaSemanal();
    if (typeof renderizarGraficaDiaria === 'function') renderizarGraficaDiaria();
}


// Evento seguro para iniciar la app en cuanto la página esté lista
document.addEventListener('DOMContentLoaded', initApp);
// Registrar Service Worker para soporte offline PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW error:', err));
    });
}

// ==========================================
// FUNCIONES DE COPIA DE SEGURIDAD (JSON)
// ==========================================

// Descarga un archivo .json con todos tus hábitos y tableros
function exportarDatos() {
    const data = localStorage.getItem("habitApp_tableros");
    if (!data) return alert("No hay datos para guardar.");
    
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `respaldo_habitos_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}

// Lee un archivo .json previamente descargado y restaura la información
function importarDatos(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            JSON.parse(e.target.result); // Revisa que el archivo sea correcto
            localStorage.setItem("habitApp_tableros", e.target.result);
            alert("¡Datos restaurados con éxito!");
            location.reload(); // Recarga la página para mostrar los datos cargados
        } catch(err) {
            alert("El archivo seleccionado no es una copia de seguridad válida.");
        }
    };
    reader.readAsText(archivo);
}

