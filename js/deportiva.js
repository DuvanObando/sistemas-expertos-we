/**
 * Motor de inferencia para el Sistema Experto de Alimentación Deportiva
 * Implementa encadenamiento hacia adelante (forward chaining)
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-deportiva');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluarDeportiva();
        });
    }
});

/**
 * Función principal del motor de inferencia para alimentación deportiva
 */
function evaluarDeportiva() {
    // Obtener valores del formulario
    const objetivo = document.getElementById('objetivo').value;
    const frecuencia = document.getElementById('frecuencia').value;
    const intensidad = document.getElementById('intensidad').value;
    const restricciones = document.querySelector('input[name="restricciones"]:checked')?.value;
    const horario = document.getElementById('horario').value;

    // Validar que todos los campos estén completos
    if (!objetivo || !frecuencia || !intensidad || !restricciones || !horario) {
        mostrarMensaje('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Base de hechos (hechos iniciales)
    const hechos = {
        objetivo: objetivo,
        frecuencia: frecuencia,
        intensidad: intensidad,
        restricciones: restricciones,
        horario: horario
    };

    // Base de reglas
    const reglas = [
        {
            id: 'R1',
            condicion: (hechos) => hechos.objetivo === 'ganar masa' && hechos.frecuencia === 'alta',
            plan: 'Alto consumo proteico (2-2.5g/kg) con carbohidratos complejos',
            recomendacion: 'Consume proteínas magras, carbohidratos complejos y realiza 5-6 comidas diarias distribuidas'
        },
        {
            id: 'R2',
            condicion: (hechos) => hechos.objetivo === 'perder peso' && hechos.intensidad === 'intensa',
            plan: 'Déficit calórico controlado con alto contenido proteico',
            recomendacion: 'Reduce 300-500 calorías diarias, prioriza proteínas y vegetales, consume carbohidratos pre/post entrenamiento'
        },
        {
            id: 'R3',
            condicion: (hechos) => hechos.restricciones === 'vegano' && hechos.objetivo === 'ganar masa',
            plan: 'Proteínas vegetales variadas con suplementación B12',
            recomendacion: 'Combina legumbres, cereales, frutos secos y considera suplementos de proteína vegetal y B12'
        },
        {
            id: 'R4',
            condicion: (hechos) => hechos.horario === 'mañana' && hechos.intensidad === 'intensa',
            plan: 'Desayuno completo con carbohidratos de absorción lenta',
            recomendacion: 'Consume avena, frutas y proteínas 2 horas antes del entrenamiento, rehidratación durante la sesión'
        },
        {
            id: 'R5',
            condicion: (hechos) => hechos.objetivo === 'rendimiento' && hechos.frecuencia === 'alta',
            plan: 'Periodización nutricional según entrenamiento',
            recomendacion: 'Ajusta carbohidratos según intensidad diaria, prioriza recuperación con proteínas post-entrenamiento'
        },
        {
            id: 'R6',
            condicion: (hechos) => hechos.restricciones === 'vegetariano' && hechos.intensidad === 'intensa',
            plan: 'Proteínas lácteas, huevos y legumbres con aminoácidos completos',
            recomendacion: 'Incluye yogur griego, queso cottage, huevos y combina legumbres con arroz para proteínas completas'
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
 * @returns {Object} - Resultado con plan y reglas activadas
 */
function forwardChaining(hechos, reglas) {
    const reglasActivadas = [];
    let resultado = null;

    // Evaluar cada regla contra los hechos
    for (const regla of reglas) {
        if (regla.condicion(hechos)) {
            reglasActivadas.push({
                id: regla.id,
                plan: regla.plan,
                recomendacion: regla.recomendacion
            });

            // Tomar la primera regla que se active (prioridad simple)
            if (!resultado) {
                resultado = {
                    plan: regla.plan,
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
        // Mostrar plan principal
        diagnosticoElement.textContent = `Plan recomendado: ${resultado.resultado.plan}`;
        recomendacionElement.textContent = resultado.resultado.recomendacion;

        // Mostrar reglas activadas
        resultado.reglasActivadas.forEach(regla => {
            const li = document.createElement('li');
            li.className = 'rule-item';
            li.innerHTML = `
                <div class="rule-name">${regla.id}: ${regla.plan}</div>
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
        diagnosticoElement.textContent = 'Plan recomendado: General';
        recomendacionElement.textContent = 'No se encontraron planes específicos con los datos ingresados. Consulta con un nutricionista deportivo para un plan personalizado.';
        
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
    const form = document.getElementById('form-deportiva');
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
    console.log('Objetivo:', hechos.objetivo);
    console.log('Frecuencia:', hechos.frecuencia);
    console.log('Intensidad:', hechos.intensidad);
    console.log('Restricciones:', hechos.restricciones);
    console.log('Horario:', hechos.horario);
}