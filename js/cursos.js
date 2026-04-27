/**
 * Motor de inferencia para el Sistema Experto de Selección de Cursos
 * Implementa encadenamiento hacia adelante (forward chaining)
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-cursos');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluarCursos();
        });
    }
});

/**
 * Función principal del motor de inferencia para selección de cursos
 */
function evaluarCursos() {
    // Obtener valores del formulario
    const interes = document.getElementById('interes').value;
    const promedio = document.getElementById('promedio').value;
    const carga = document.getElementById('carga').value;
    const modalidad = document.querySelector('input[name="modalidad"]:checked')?.value;
    const ingles = document.getElementById('ingles').value;

    // Validar que todos los campos estén completos
    if (!interes || !promedio || !carga || !modalidad || !ingles) {
        mostrarMensaje('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Base de hechos (hechos iniciales)
    const hechos = {
        interes: interes,
        promedio: promedio,
        carga: carga,
        modalidad: modalidad,
        ingles: ingles
    };

    // Base de reglas
    const reglas = [
        {
            id: 'R1',
            condicion: (hechos) => hechos.interes === 'tecnología' && hechos.promedio === 'alto',
            recomendacion: 'Programación Avanzada o Inteligencia Artificial',
            explicacion: 'Tu interés en tecnología y alto rendimiento académico te capacitan para cursos avanzados de programación e IA'
        },
        {
            id: 'R2',
            condicion: (hechos) => hechos.interes === 'humanidades' && hechos.ingles === 'alto',
            recomendacion: 'Literatura Comparada o Pensamiento Crítico',
            explicacion: 'Tu buen nivel de inglés te permite acceder a material académico internacional en humanidades'
        },
        {
            id: 'R3',
            condicion: (hechos) => hechos.carga === 'alta',
            recomendacion: 'Solo una electiva de baja exigencia',
            explicacion: 'Con alta carga académica, es recomendable elegir cursos que no sobrecarguen tu horario'
        },
        {
            id: 'R4',
            condicion: (hechos) => hechos.interes === 'negocios' && hechos.promedio === 'medio',
            recomendacion: 'Fundamentos de Emprendimiento o Marketing Digital',
            explicacion: 'Tu perfil se adecua a cursos prácticos de negocios que no requieran alto rendimiento académico'
        },
        {
            id: 'R5',
            condicion: (hechos) => hechos.modalidad === 'virtual' && hechos.carga === 'media',
            recomendacion: 'Cursos asincrónicos en línea',
            explicacion: 'La modalidad virtual con carga media se beneficia de cursos flexibles y asincrónicos'
        },
        {
            id: 'R6',
            condicion: (hechos) => hechos.interes === 'artes',
            recomendacion: 'Diseño Creativo o Apreciación Musical',
            explicacion: 'Tu interés en las artes te dirige hacia cursos creativos y expresivos'
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
            li.innerHTML = `
                <div class="rule-name">${regla.id}: ${regla.recomendacion}</div>
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
        recomendacionElement.textContent = 'No se encontraron recomendaciones específicas con los datos ingresados. Considera cursos básicos de tu área de interés.';
        
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
    const form = document.getElementById('form-cursos');
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
    console.log('Interés:', hechos.interes);
    console.log('Promedio:', hechos.promedio);
    console.log('Carga:', hechos.carga);
    console.log('Modalidad:', hechos.modalidad);
    console.log('Inglés:', hechos.ingles);
}