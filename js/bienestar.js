/**
 * Motor de inferencia para el Sistema Experto de Bienestar Emocional
 * Implementa encadenamiento hacia adelante (forward chaining)
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-bienestar');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluarBienestar();
        });
    }
});

/**
 * Función principal del motor de inferencia para bienestar emocional
 */
function evaluarBienestar() {
    // Obtener valores del formulario
    const animo = document.getElementById('animo').value;
    const estres = document.getElementById('estres').value;
    const sueno = document.getElementById('sueno').value;
    const social = document.querySelector('input[name="social"]:checked')?.value;
    const fisica = document.querySelector('input[name="fisica"]:checked')?.value;

    // Validar que todos los campos estén completos
    if (!animo || !estres || !sueno || !social || !fisica) {
        mostrarMensaje('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Base de hechos (hechos iniciales)
    const hechos = {
        animo: animo,
        estres: estres,
        sueno: sueno,
        social: social,
        fisica: fisica
    };

    // Base de reglas
    const reglas = [
        {
            id: 'R1',
            condicion: (hechos) => hechos.animo === 'bajo' && hechos.sueno === 'mala' && hechos.social === 'aislada',
            diagnostico: 'Estado decaído',
            recomendacion: 'buscar acompañamiento social y establecer rutina de descanso'
        },
        {
            id: 'R2',
            condicion: (hechos) => hechos.estres === 'alto' && hechos.fisica === 'nula',
            diagnostico: 'Estado tensionado',
            recomendacion: 'incorporar ejercicio ligero y técnicas de respiración'
        },
        {
            id: 'R3',
            condicion: (hechos) => hechos.animo === 'medio' && hechos.estres === 'medio' && hechos.sueno === 'regular',
            diagnostico: 'Estado estable con alertas',
            recomendacion: 'fortalecer hábitos de autocuidado'
        },
        {
            id: 'R4',
            condicion: (hechos) => hechos.animo === 'alto' && hechos.social === 'activa' && hechos.fisica === 'frecuente',
            diagnostico: 'Estado saludable',
            recomendacion: 'mantener hábitos actuales'
        },
        {
            id: 'R5',
            condicion: (hechos) => hechos.estres === 'alto' && hechos.sueno === 'mala',
            diagnostico: 'Agotamiento emocional',
            recomendacion: 'consultar con profesional de salud mental'
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
        diagnosticoElement.textContent = 'Diagnóstico: No específico';
        recomendacionElement.textContent = 'No se encontraron recomendaciones específicas con los datos ingresados. Intenta ajustar tus respuestas.';
        
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
    const form = document.getElementById('form-bienestar');
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
    console.log('Ánimo:', hechos.animo);
    console.log('Estrés:', hechos.estres);
    console.log('Sueño:', hechos.sueno);
    console.log('Social:', hechos.social);
    console.log('Física:', hechos.fisica);
}