let chartMensualInstance = null;

function renderizarGraficaMensual() {
    const canvas = document.getElementById('chartMensual');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const totalDiasMes = new Date(añoSeleccionado, mesSeleccionado + 1, 0).getDate();

    // 1. Cálculo de avance real del mes
    const totalPosible = habitos.length * totalDiasMes;
    let completados = 0;

    habitos.forEach(habito => {
        if (!habito.registros) return;
        for (let d = 1; d <= totalDiasMes; d++) {
            const claveFecha = `${añoSeleccionado}-${mesSeleccionado}-${d}`;
            if (habito.registros[claveFecha] === true) {
                completados++;
            }
        }
    });

    // 2. Operación matemática del porcentaje completado vs. pendiente
    const porcentajeCompletado = totalPosible > 0 ? Math.round((completados / totalPosible) * 100) : 0;
    const porcentajePendiente = 100 - porcentajeCompletado;

    const colorAcento = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#ff4747';

    // Destruir la instancia previa antes de redibujar
    if (chartMensualInstance) {
        chartMensualInstance.destroy();
    }

    // 3. Plugin personalizado para mostrar el % formateado en el centro de la dona
    const centroPorcentajePlugin = {
        id: 'centroPorcentaje',
        afterDraw(chart) {
            const { ctx, chartArea: { width, height, top, left } } = chart;
            ctx.save();
            ctx.font = 'bold 24px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            
            // Dibuja el número con el símbolo de porcentaje %
            ctx.fillText(`${porcentajeCompletado}%`, centerX, centerY);
            ctx.restore();
        }
    };

    // 4. Construcción del gráfico con formato %
    chartMensualInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                `Progresado: ${porcentajeCompletado}%`, 
                `Faltante: ${porcentajePendiente}%`
            ],
            datasets: [{
                data: [porcentajeCompletado, porcentajePendiente],
                backgroundColor: [colorAcento, '#333333'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%', // Espacio libre al centro para el texto del %
            plugins: {
                legend: { 
                    position: 'bottom', 
                    labels: { 
                        color: '#ffffff',
                        font: { size: 12 }
                    } 
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}`;
                        }
                    }
                }
            }
        },
        plugins: [centroPorcentajePlugin]
    });
}