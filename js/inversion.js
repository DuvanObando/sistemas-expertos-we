/**
 * Motor de inferencia para el Sistema Experto de Inversión
 * Implementa encadenamiento hacia adelante (forward chaining)
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-inversion');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluarInversion();
        });
    }
});

/**
 * Función principal del motor de inferencia para inversión
 */
function evaluarInversion() {
    // Obtener valores del formulario
    const capital = document.getElementById('capital').value;
    const perfil = document.querySelector('input[name="perfil"]:checked')?.value;
    const horizonte = document.getElementById('horizonte').value;
    const conocimiento = document.getElementById('conocimiento').value;
    const objetivo = document.getElementById('objetivo').value;

    // Validar que todos los campos estén completos
    if (!capital || !perfil || !horizonte || !conocimiento || !objetivo) {
        mostrarMensaje('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Base de hechos (hechos iniciales)
    const hechos = {
        capital: capital,
        perfil: perfil,
        horizonte: horizonte,
        conocimiento: conocimiento,
        objetivo: objetivo
    };

    // Base de reglas
    const reglas = [
        {
            id: 'R1',
            condicion: (hechos) => hechos.perfil === 'conservador' && hechos.horizonte === 'corto',
            recomendacion: 'CDT o cuentas de ahorro de alto rendimiento',
            explicacion: 'Tu perfil conservador y horizonte corto requieren instrumentos de bajo riesgo y alta liquidez'
        },
        {
            id: 'R2',
            condicion: (hechos) => hechos.perfil === 'moderado' && hechos.horizonte === 'mediano',
            recomendacion: 'Fondos de inversión colectiva diversificados',
            explicacion: 'Tu perfil moderado se beneficia de la diversificación y plazos medios para balancear riesgo y retorno'
        },
        {
            id: 'R3',
            condicion: (hechos) => hechos.perfil === 'agresivo' && hechos.conocimiento === 'alto' && hechos.capital === 'alto',
            recomendacion: 'Acciones, ETFs o criptoactivos',
            explicacion: 'Tu perfil agresivo, alto conocimiento y capital significativo te permiten asumir mayores riesgos'
        },
        {
            id: 'R4',
            condicion: (hechos) => hechos.capital === 'bajo' && hechos.conocimiento === 'bajo',
            recomendacion: 'Iniciar con educación financiera y ahorro programado',
            explicacion: 'Con capital y conocimiento limitados, prioriza el aprendizaje y hábitos de ahorro'
        },
        {
            id: 'R5',
            condicion: (hechos) => hechos.objetivo === 'crecimiento' && hechos.horizonte === 'largo',
            recomendacion: 'Fondos indexados o portafolios accionarios',
            explicacion: 'El crecimiento a largo plazo se beneficia de la inversión en mercados y el poder del interés compuesto'
        },
        {
            id: 'R6',
            condicion: (hechos) => hechos.objetivo === 'especulación' && hechos.perfil !== 'agresivo',
            recomendacion: 'ADVERTENCIA: Incompatibilidad entre objetivo y perfil',
            explicacion: 'La especulación requiere perfil agresivo. Considera reevaluar tus objetivos o tolerancia al riesgo'
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
 * @returns {Object} - Resultado con recomendación y reglas activadas
 */
function forwardChaining(hechos, reglas) {
    const reglasActivadas = [];
    let resultado = null;

    // Evaluar cada regla contra los hechos
    for (const regla of reglas) {
        if (regla.condicion(hechos)) {
            reglasActivadas.push({
                id: regla.id,
                recomendacion: regla.recomendacion,
                explicacion: regla.explicacion
            });

            // Tomar la primera regla que se active (prioridad simple)
            if (!resultado) {
                resultado = {
                    recomendacion: regla.recomendacion,
                    explicacion: regla.explicacion
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
        // Mostrar recomendación principal
        diagnosticoElement.textContent = `Recomendación: ${resultado.resultado.recomendacion}`;
        recomendacionElement.textContent = resultado.resultado.explicacion;

        // Mostrar reglas activadas
        resultado.reglasActivadas.forEach(regla => {
            const li = document.createElement('li');
            li.className = 'rule-item';
            
            // Estilo especial para la regla de advertencia
            if (regla.id === 'R6') {
                li.style.borderLeftColor = '#dc2626';
                li.style.background = '#fef2f2';
            }
            
            li.innerHTML = `
                <div class="rule-name" style="${regla.id === 'R6' ? 'color: #dc2626;' : ''}">${regla.id}: ${regla.recomendacion}</div>
                <div class="rule-description">${regla.explicacion}</div>
            `;
            reglasList.appendChild(li);
        });

        // Mostrar contenedor de resultados con animación
        resultadosDiv.classList.add('show');

        // Hacer scroll suave hacia los resultados
        resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else {
        // Mostrar mensaje si no se encontraron recomendaciones
        diagnosticoElement.textContent = 'Recomendación: General';
        recomendacionElement.textContent = 'No se encontraron recomendaciones específicas con los datos ingresados. Considera consultar con un asesor financiero profesional.';
        
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
    const form = document.getElementById('form-inversion');
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
    console.log('Capital:', hechos.capital);
    console.log('Perfil:', hechos.perfil);
    console.log('Horizonte:', hechos.horizonte);
    console.log('Conocimiento:', hechos.conocimiento);
    console.log('Objetivo:', hechos.objetivo);
}