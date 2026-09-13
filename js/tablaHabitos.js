// ==========================================
// RENDERIZADO Y CONTROL DE LA TABLA DE HÁBITOS
// ==========================================

function renderizarTablaHabitos() {
    const headerDias = document.getElementById('headerDias');
    const tbody = document.getElementById('listaHabitosBody');

    if (!headerDias || !tbody) return;

    const totalDiasMes = new Date(añoSeleccionado, mesSeleccionado + 1, 0).getDate();
    
    // Obtener la fecha actual del sistema a medianoche para comparar solo fechas
    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

    // 1. Encabezados de días
    let headerHTML = `<th class="col-habito">Hábito</th>`;
    for (let d = 1; d <= totalDiasMes; d++) {
        headerHTML += `<th>${d}</th>`;
    }
    if (modoEdicion) headerHTML += `<th>Acción</th>`;
    headerDias.innerHTML = headerHTML;

    tbody.innerHTML = "";

    if (habitos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="${totalDiasMes + (modoEdicion ? 2 : 1)}" style="text-align: center; padding: 20px; color: var(--text-muted);">
                    No hay hábitos registrados. Haz clic en "+ Nuevo Hábito" para comenzar.
                </td>
            </tr>`;
        return;
    }

    // 2. Renderizado de filas
    habitos.forEach(habito => {
        let filaHTML = `<tr>`;
        
        if (modoEdicion) {
            filaHTML += `<td class="col-habito">
                <input type="text" value="${habito.nombre}" onchange="renombrarHabito('${habito.id}', this.value)" style="width: 90%; background: #222; color: #fff; border: 1px solid #555; padding: 4px; border-radius: 4px;">
            </td>`;
        } else {
            filaHTML += `<td class="col-habito">${habito.nombre}</td>`;
        }

        if (!habito.registros) habito.registros = {};

        for (let d = 1; d <= totalDiasMes; d++) {
            const claveFecha = `${añoSeleccionado}-${mesSeleccionado}-${d}`;
            const estaCompletado = habito.registros[claveFecha] === true;

            // Bloquear días pasados respecto a hoy
            const fechaCasilla = new Date(añoSeleccionado, mesSeleccionado, d);
            const esPasado = fechaCasilla < hoy;

            filaHTML += `<td>
                <input type="checkbox" 
                    ${estaCompletado ? 'checked' : ''} 
                    ${esPasado ? 'disabled title="No puedes modificar días pasados"' : ''}
                    onchange="toggleHabitoDia('${habito.id}', ${d}, this.checked)">
            </td>`;
        }

        // Columna del botón para borrar cuando el modo edición está activo
        if (modoEdicion) {
            filaHTML += `<td style="text-align: center;">
                <button class="btn-action-sm" onclick="eliminarHabito('${habito.id}')" title="Eliminar hábito" style="background: transparent; border: none; cursor: pointer; font-size: 16px;">🗑️</button>
            </td>`;
        }

        filaHTML += `</tr>`;
        tbody.innerHTML += filaHTML;
    });
}

// ==========================================
// REGISTRO Y ACTUALIZACIÓN EN TIEMPO REAL
// ==========================================

function toggleHabitoDia(habitoId, dia, completado) {
    const tabActual = tableros.find(t => t.id === tableroActivoId);
    if (!tabActual) return;

    const habito = tabActual.habitos.find(h => String(h.id) === String(habitoId));
    if (!habito) return;

    if (!habito.registros) habito.registros = {};

    const claveFecha = `${añoSeleccionado}-${mesSeleccionado}-${dia}`;

    if (completado) {
        habito.registros[claveFecha] = true;
    } else {
        delete habito.registros[claveFecha];
    }

    guardarTablerosEnStorage();
    actualizarTodo();
}

function agregarHabito() {
    const nombre = prompt("Nombre del nuevo hábito:");
    if (nombre && nombre.trim() !== "") {
        const nuevoHabito = {
            id: "hab_" + Date.now(),
            nombre: nombre.trim(),
            registros: {}
        };
        habitos.push(nuevoHabito);
        
        const tabActual = tableros.find(t => t.id === tableroActivoId);
        if (tabActual) tabActual.habitos = habitos;

        guardarTablerosEnStorage();
        actualizarTodo();
    }
}

function renombrarHabito(habitoId, nuevoNombre) {
    if (!nuevoNombre || nuevoNombre.trim() === "") return;
    const habito = habitos.find(h => String(h.id) === String(habitoId));
    if (habito) {
        habito.nombre = nuevoNombre.trim();
        guardarTablerosEnStorage();
    }
}

function eliminarHabito(habitoId) {
    if (confirm("¿Seguro que deseas eliminar este hábito?")) {
        habitos = habitos.filter(h => String(h.id) === String(habitoId));
        const tabActual = tableros.find(t => t.id === tableroActivoId);
        if (tabActual) tabActual.habitos = habitos;

        guardarTablerosEnStorage();
        actualizarTodo();
    }
}

function toggleModoEdicion() {
    modoEdicion = !modoEdicion;
    renderizarTablaHabitos();
}