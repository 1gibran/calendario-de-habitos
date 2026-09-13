let chartDiarioInstance = null;

function renderizarGraficaDiaria() {
    const canvas = document.getElementById('chartDiario');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const totalDiasMes = new Date(añoSeleccionado, mesSeleccionado + 1, 0).getDate();

    const etiquetasDias = [];
    const porcentajesDiarios = [];

    for (let d = 1; d <= totalDiasMes; d++) {
        etiquetasDias.push(d.toString());

        let totalHabitos = habitos.length;
        let completadosDia = 0;

        if (totalHabitos > 0) {
            habitos.forEach(habito => {
                const claveFecha = `${añoSeleccionado}-${mesSeleccionado}-${d}`;
                if (habito.registros && habito.registros[claveFecha] === true) {
                    completadosDia++;
                }
            });
            porcentajesDiarios.push(Math.round((completadosDia / totalHabitos) * 100));
        } else {
            porcentajesDiarios.push(0);
        }
    }

    const colorAcento = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ff4747';

    if (chartDiarioInstance) {
        chartDiarioInstance.destroy();
    }

    chartDiarioInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetasDias,
            datasets: [{
                label: 'Cumplimiento Diario (%)',
                data: porcentajesDiarios,
                borderColor: colorAcento,
                backgroundColor: 'rgba(255, 71, 71, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 100, ticks: { color: '#888888' } },
                x: { ticks: { color: '#888888', font: { size: 10 } } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}