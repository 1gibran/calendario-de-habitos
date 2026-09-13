let chartSemanalInstance = null;

function renderizarGraficaSemanal() {
    const canvas = document.getElementById('chartSemanal');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const totalDiasMes = new Date(añoSeleccionado, mesSeleccionado + 1, 0).getDate();

    const semanas = [
        { nombre: 'Sem 1', inicio: 1, fin: 7 },
        { nombre: 'Sem 2', inicio: 8, fin: 14 },
        { nombre: 'Sem 3', inicio: 15, fin: 21 },
        { nombre: 'Sem 4', inicio: 22, fin: totalDiasMes }
    ];

    const porcentajesSemanales = semanas.map(sem => {
        let totalPosibleSemana = habitos.length * (sem.fin - sem.inicio + 1);
        let completadosSemana = 0;

        habitos.forEach(habito => {
            if (!habito.registros) return;
            for (let d = sem.inicio; d <= sem.fin; d++) {
                const claveFecha = `${añoSeleccionado}-${mesSeleccionado}-${d}`;
                if (habito.registros[claveFecha] === true) {
                    completadosSemana++;
                }
            }
        });

        return totalPosibleSemana > 0 ? Math.round((completadosSemana / totalPosibleSemana) * 100) : 0;
    });

    const colorAcento = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ff4747';

    if (chartSemanalInstance) {
        chartSemanalInstance.destroy();
    }

    chartSemanalInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: semanas.map(s => s.nombre),
            datasets: [{
                label: 'Cumplimiento %',
                data: porcentajesSemanales,
                backgroundColor: colorAcento,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 100, ticks: { color: '#888888' } },
                x: { ticks: { color: '#888888' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}