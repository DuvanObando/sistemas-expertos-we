/**
 * Motor de inferencia para el Sistema Experto de Diagnóstico Psicológico
 * Implementa encadenamiento hacia adelante (forward chaining)
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-psicologico');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluarPsicologico();
        });
    }
});

/**
 * Función principal del motor de inferencia para diagnóstico psicológico
 */
function evaluarPsicologico() {
    // Obtener valores del formulario
    const humor = document.getElementById('humor').value;
    const ansiedad = document.getElementById('ansiedad').value;
    const sueno = document.getElementById('sueno').value;
    const sociales = document.querySelector('input[name="sociales"]:checked')?.value;
    const funcionamiento = document.querySelector('input[name="funcionamiento"]:checked')?.value;
    const estres = document.getElementById('estres').value;

    // Validar que todos los campos estén completos
    if (!humor || !ansiedad || !sueno || !sociales || !funcionamiento || !estres) {
        mostrarMensaje('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Base de hechos (hechos iniciales)
    const hechos = {
        humor: humor,
        ansiedad: ansiedad,
        sueno: sueno,
        sociales: sociales,
        funcionamiento: funcionamiento,
        estres: estres
    };

    // Base de reglas
    const reglas = [
        {
            id: 'R1',
            condicion: (hechos) => hechos.humor === 'negativo' && hechos.sueno === 'mala' && hechos.funcionamiento === 'afectado',
            evaluacion: 'Posible depresión',
            recomendacion: 'CONSULTA URGENTE con profesional de salud mental. Los síntomas sugieren posible depresión que requiere evaluación profesional inmediata.'
        },
        {
            id: 'R2',
            condicion: (hechos) => hechos.ansiedad === 'severa' && hechos.estres === 'crónico',
            evaluacion: 'Trastorno de ansiedad',
            recomendacion: 'Busca evaluación profesional. La ansiedad severa y el estrés crónico requieren intervención especializada.'
        },
        {
            id: 'R3',
            condicion: (hechos) => hechos.sociales === 'aislamiento' && hechos.humor === 'negativo',
            evaluacion: 'Riesgo de aislamiento social',
            recomendacion: 'Considera hablar con amigos, familiares o un terapeuta. El aislamiento prolongado puede afectar negativamente la salud mental.'
        },
        {
            id: 'R4',
            condicion: (hechos) => hechos.estres === 'alto' && hechos.sueno === 'regular',
            evaluacion: 'Estrés agudo',
            recomendacion: 'Implementa técnicas de relajación, ejercicio regular y considera hablar con un consejero sobre manejo del estrés.'
        },
        {
            id: 'R5',
            condicion: (hechos) => hechos.humor === 'positivo' && hechos.funcionamiento === 'normal',
            evaluacion: 'Salud mental estable',
            recomendacion: 'Mantén hábitos saludables y continúa con el autocuidado. Considera check-ups regulares con profesionales.'
        },
        {
            id: 'R6',
            condicion: (hechos) => hechos.ansiedad === 'alta' && hechos.funcionamiento === 'dificultad',
            evaluacion: 'Ansiedad intermedia',
            recomendacion: 'Practica técnicas de respiración, mindfulness y considera consultar con un profesional para manejar la ansiedad.'
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
 * @returns {Object} - Resultado con evaluación y reglas activadas
 */
function forwardChaining(hechos, reglas) {
    const reglasActivadas = [];
    let resultado = null;

    // Evaluar cada regla contra los hechos
    for (const regla of reglas) {
        if (regla.condicion(hechos)) {
            reglasActivadas.push({
                id: regla.id,
                evaluacion: regla.evaluacion,
                recomendacion: regla.recomendacion
            });

            // Tomar la primera regla que se active (prioridad simple)
            if (!resultado) {
                resultado = {
                    evaluacion: regla.evaluacion,
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
        // Mostrar evaluación principal
        diagnosticoElement.textContent = `Evaluación: ${resultado.resultado.evaluacion}`;
        recomendacionElement.textContent = resultado.resultado.recomendacion;

        // Estilo especial para evaluaciones urgentes
        if (resultado.resultado.evaluacion === 'Posible depresión' || resultado.resultado.evaluacion === 'Trastorno de ansiedad') {
            recomendacionElement.style.color = '#dc2626';
            recomendacionElement.style.fontWeight = 'bold';
        }

        // Mostrar reglas activadas
        resultado.reglasActivadas.forEach(regla => {
            const li = document.createElement('li');
            li.className = 'rule-item';
            
            // Estilo especial para reglas críticas
            if (regla.id === 'R1' || regla.id === 'R2') {
                li.style.borderLeftColor = '#dc2626';
                li.style.background = '#fef2f2';
            }
            
            li.innerHTML = `
                <div class="rule-name" style="${regla.id === 'R1' || regla.id === 'R2' ? 'color: #dc2626;' : ''}">${regla.id}: ${regla.evaluacion}</div>
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
        diagnosticoElement.textContent = 'Evaluación: General';
        recomendacionElement.textContent = 'No se encontraron patrones específicos con los datos ingresados. Si tienes preocupaciones sobre tu salud mental, siempre es recomendable consultar con un profesional.';
        
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
    const form = document.getElementById('form-psicologico');
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
    console.log('Humor:', hechos.humor);
    console.log('Ansiedad:', hechos.ansiedad);
    console.log('Sueño:', hechos.sueno);
    console.log('Sociales:', hechos.sociales);
    console.log('Funcionamiento:', hechos.funcionamiento);
    console.log('Estrés:', hechos.estres);
}