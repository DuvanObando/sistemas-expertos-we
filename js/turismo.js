/**
 * Motor de inferencia para el Sistema Experto de Turismo
 * Implementa encadenamiento hacia adelante (forward chaining)
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-turismo');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluarTurismo();
        });
    }
});

/**
 * Función principal del motor de inferencia para turismo
 */
function evaluarTurismo() {
    // Obtener valores del formulario
    const clima = document.getElementById('clima').value;
    const presupuesto = document.getElementById('presupuesto').value;
    const tipo = document.getElementById('tipo').value;
    const duracion = document.querySelector('input[name="duracion"]:checked')?.value;
    const acompanantes = document.querySelector('input[name="acompanantes"]:checked')?.value;

    // Validar que todos los campos estén completos
    if (!clima || !presupuesto || !tipo || !duracion || !acompanantes) {
        mostrarMensaje('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Base de hechos (hechos iniciales)
    const hechos = {
        clima: clima,
        presupuesto: presupuesto,
        tipo: tipo,
        duracion: duracion,
        acompanantes: acompanantes
    };

    // Base de reglas
    const reglas = [
        {
            id: 'R1',
            condicion: (hechos) => hechos.clima === 'cálido' && hechos.tipo === 'relax' && hechos.presupuesto === 'alto',
            destino: 'Caribe Mexicano (Cancún, Riviera Maya)',
            recomendacion: 'Playas paradisíacas con resorts todo incluido y actividades acuáticas'
        },
        {
            id: 'R2',
            condicion: (hechos) => hechos.clima === 'frío' && hechos.tipo === 'aventura',
            destino: 'Patagonia Chilena o Argentina',
            recomendacion: 'Nieve, montañas, trekking y deportes de invierno en paisajes espectaculares'
        },
        {
            id: 'R3',
            condicion: (hechos) => hechos.tipo === 'cultural' && hechos.presupuesto === 'medio',
            destino: 'Ciudad de México o Cusco (Perú)',
            recomendacion: 'Historia, arqueología, gastronomía y museos en ciudades con gran patrimonio cultural'
        },
        {
            id: 'R4',
            condicion: (hechos) => hechos.acompanantes === 'familia' && hechos.tipo === 'familiar',
            destino: 'Orlando, Florida o Parques Nacionales de Colombia',
            recomendacion: 'Parques temáticos, actividades para niños y destinos seguros con infraestructura familiar'
        },
        {
            id: 'R5',
            condicion: (hechos) => hechos.presupuesto === 'bajo' && hechos.duracion === 'corto',
            destino: 'Destinos locales o regionales cercanos',
            recomendacion: 'Explora lugares cercanos a tu ciudad, reduce costos de transporte y apoya el turismo local'
        },
        {
            id: 'R6',
            condicion: (hechos) => hechos.acompanantes === 'pareja' && hechos.tipo === 'relax',
            destino: 'Islas del Rosario (Colombia) o Santa Marta',
            recomendacion: 'Destinos románticos con playas tranquilas, spas y actividades para parejas'
        }
    ];

    // Motor de inferencia - Encadenamiento hacia adelante
    const resultado = forwardChaining(hechos, reglas);

    // Mostrar resultados
    mostrarResultados(resultado);
}

/**
 * Motor de inferencia con encadenamiento hacia adelante
 * @param {Object} hechos - Hechos iniciales
 * @param {Array} reglas - Base de reglas
 * @returns {Object} - Resultado con destino y reglas activadas
 */
function forwardChaining(hechos, reglas) {
    const reglasActivadas = [];
    let resultado = null;

    // Evaluar cada regla contra los hechos
    for (const regla of reglas) {
        if (regla.condicion(hechos)) {
            reglasActivadas.push({
                id: regla.id,
                destino: regla.destino,
                recomendacion: regla.recomendacion
            });

            // Tomar la primera regla que se active (prioridad simple)
            if (!resultado) {
                resultado = {
                    destino: regla.destino,
                    recomendacion: regla.recomendacion
                };
            }
        }
    }

    return {
        resultado: resultado,
        reglasActivadas: reglasActivadas,
        hechos: hechos
    };
}

/**
 * Muestra los resultados del sistema experto
 * @param {Object} resultado - Resultado del motor de inferencia
 */
function mostrarResultados(resultado) {
    const resultadosDiv = document.getElementById('resultados');
    const diagnosticoElement = document.getElementById('diagnostico');
    const recomendacionElement = document.getElementById('recomendacion');
    const reglasList = document.getElementById('reglas-activadas');

    // Limpiar resultados anteriores
    reglasList.innerHTML = '';

    if (resultado.resultado) {
        // Mostrar destino principal
        diagnosticoElement.textContent = `Destino recomendado: ${resultado.resultado.destino}`;
        recomendacionElement.textContent = resultado.resultado.recomendacion;

        // Mostrar reglas activadas
        resultado.reglasActivadas.forEach(regla => {
            const li = document.createElement('li');
            li.className = 'rule-item';
            li.innerHTML = `
                <div class="rule-name">${regla.id}: ${regla.destino}</div>
                <div class="rule-description">${regla.recomendacion}</div>
            `;
            reglasList.appendChild(li);
        });

        // Mostrar contenedor de resultados con animación
        resultadosDiv.classList.add('show');

        // Hacer scroll suave hacia los resultados
        resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else {
        // Mostrar mensaje si no se encontraron recomendaciones
        diagnosticoElement.textContent = 'Destino recomendado: Personalizado';
        recomendacionElement.textContent = 'No se encontraron recomendaciones específicas con los datos ingresados. Considera destinos que combinen tus preferencias principales.';
        
        const li = document.createElement('li');
        li.className = 'rule-item no-results';
        li.innerHTML = `
            <div class="rule-description">No se activaron reglas específicas con la combinación actual de respuestas.</div>
        `;
        reglasList.appendChild(li);

        resultadosDiv.classList.add('show');
        resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Muestra un mensaje de error o información
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarMensaje(mensaje) {
    // Crear elemento temporal para mostrar mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'results-container show';
    mensajeDiv.style.background = 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
    mensajeDiv.style.borderColor = '#ef4444';
    mensajeDiv.innerHTML = `
        <div class="no-results">
            <p>${mensaje}</p>
        </div>
    `;

    // Insertar después del formulario
    const form = document.getElementById('form-turismo');
    form.parentNode.insertBefore(mensajeDiv, form.nextSibling);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);

    // Hacer scroll hacia el mensaje
    mensajeDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Función para resetear el formulario y resultados
 */
function limpiarResultados() {
    const resultadosDiv = document.getElementById('resultados');
    if (resultadosDiv) {
        resultadosDiv.classList.remove('show');
    }
}

/**
 * Función auxiliar para depuración - muestra los hechos actuales
 */
function debugHechos(hechos) {
    console.log('Hechos actuales:', hechos);
    console.log('Clima:', hechos.clima);
    console.log('Presupuesto:', hechos.presupuesto);
    console.log('Tipo:', hechos.tipo);
    console.log('Duración:', hechos.duracion);
    console.log('Acompañantes:', hechos.acompanantes);
}