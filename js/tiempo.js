/**
 * Motor de inferencia para el Sistema Experto de Gestión del Tiempo
 * Implementa encadenamiento hacia adelante (forward chaining)
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-tiempo');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluarTiempo();
        });
    }
});

/**
 * Función principal del motor de inferencia para gestión del tiempo
 */
function evaluarTiempo() {
    // Obtener valores del formulario
    const suenoHoras = parseFloat(document.getElementById('sueno-horas').value);
    const trabajoHoras = parseFloat(document.getElementById('trabajo-horas').value);
    const ocioHoras = parseFloat(document.getElementById('ocio-horas').value);
    const procrastinacion = document.querySelector('input[name="procrastinacion"]:checked')?.value;
    const herramientas = document.querySelector('input[name="herramientas"]:checked')?.value;

    // Validar que todos los campos estén completos
    if (isNaN(suenoHoras) || isNaN(trabajoHoras) || isNaN(ocioHoras) || !procrastinacion || !herramientas) {
        mostrarMensaje('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Validar rangos lógicos
    if (suenoHoras < 0 || suenoHoras > 24 || trabajoHoras < 0 || trabajoHoras > 24 || ocioHoras < 0 || ocioHoras > 24) {
        mostrarMensaje('Las horas deben estar entre 0 y 24.');
        return;
    }

    // Base de hechos (hechos iniciales)
    const hechos = {
        suenoHoras: suenoHoras,
        trabajoHoras: trabajoHoras,
        ocioHoras: ocioHoras,
        procrastinacion: procrastinacion,
        herramientas: herramientas
    };

    // Base de reglas
    const reglas = [
        {
            id: 'R1',
            condicion: (hechos) => hechos.suenoHoras < 6,
            diagnostico: 'Descanso insuficiente',
            recomendacion: 'reorganizar agenda para dormir mínimo 7 horas'
        },
        {
            id: 'R2',
            condicion: (hechos) => hechos.trabajoHoras > 10 && hechos.ocioHoras < 1,
            diagnostico: 'Sobrecarga laboral',
            recomendacion: 'incorporar pausas activas y descanso'
        },
        {
            id: 'R3',
            condicion: (hechos) => hechos.procrastinacion === 'alta' && hechos.herramientas === 'no',
            diagnostico: 'Procrastinación severa',
            recomendacion: 'implementar Pomodoro y planificador semanal'
        },
        {
            id: 'R4',
            condicion: (hechos) => hechos.procrastinacion === 'media' && hechos.herramientas === 'si',
            diagnostico: 'Gestión mejorable',
            recomendacion: 'afinar prioridades con matriz de Eisenhower'
        },
        {
            id: 'R5',
            condicion: (hechos) => hechos.suenoHoras >= 7 && hechos.trabajoHoras <= 8 && hechos.procrastinacion === 'baja',
            diagnostico: 'Gestión saludable',
            recomendacion: 'mantener hábitos actuales'
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
 * @returns {Object} - Resultado con diagnóstico y reglas activadas
 */
function forwardChaining(hechos, reglas) {
    const reglasActivadas = [];
    let resultado = null;

    // Evaluar cada regla contra los hechos
    for (const regla of reglas) {
        if (regla.condicion(hechos)) {
            reglasActivadas.push({
                id: regla.id,
                diagnostico: regla.diagnostico,
                recomendacion: regla.recomendacion
            });

            // Tomar la primera regla que se active (prioridad simple)
            if (!resultado) {
                resultado = {
                    diagnostico: regla.diagnostico,
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
        // Mostrar diagnóstico y recomendación principal
        diagnosticoElement.textContent = `Diagnóstico: ${resultado.resultado.diagnostico}`;
        recomendacionElement.textContent = resultado.resultado.recomendacion;

        // Mostrar reglas activadas
        resultado.reglasActivadas.forEach(regla => {
            const li = document.createElement('li');
            li.className = 'rule-item';
            li.innerHTML = `
                <div class="rule-name">${regla.id}: ${regla.diagnostico}</div>
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
        diagnosticoElement.textContent = 'Diagnóstico: Neutro';
        recomendacionElement.textContent = 'No se encontraron recomendaciones específicas con los datos ingresados. Intenta ajustar tus hábitos de tiempo.';
        
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
    const form = document.getElementById('form-tiempo');
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
    console.log('Horas de sueño:', hechos.suenoHoras);
    console.log('Horas de trabajo:', hechos.trabajoHoras);
    console.log('Horas de ocio:', hechos.ocioHoras);
    console.log('Procrastinación:', hechos.procrastinacion);
    console.log('Herramientas:', hechos.herramientas);
}