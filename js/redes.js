/**
 * Motor de inferencia para el Sistema Experto de Redes Sociales
 * Implementa encadenamiento hacia adelante (forward chaining)
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-redes');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluarRedes();
        });
    }
});

/**
 * Función principal del motor de inferencia para redes sociales
 */
function evaluarRedes() {
    // Obtener valores del formulario
    const plataforma = document.getElementById('plataforma').value;
    const publico = document.getElementById('publico').value;
    const tipo = document.getElementById('tipo').value;
    const frecuencia = document.querySelector('input[name="frecuencia"]:checked')?.value;
    const objetivo = document.getElementById('objetivo').value;

    // Validar que todos los campos estén completos
    if (!plataforma || !publico || !tipo || !frecuencia || !objetivo) {
        mostrarMensaje('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Base de hechos (hechos iniciales)
    const hechos = {
        plataforma: plataforma,
        publico: publico,
        tipo: tipo,
        frecuencia: frecuencia,
        objetivo: objetivo
    };

    // Base de reglas
    const reglas = [
        {
            id: 'R1',
            condicion: (hechos) => hechos.plataforma === 'TikTok' && hechos.publico === 'jóvenes',
            estrategia: 'Videos cortos, virales y con tendencias musicales',
            recomendacion: 'Crea contenido dinámico de 15-60 segundos, usa música popular y participa en challenges actuales'
        },
        {
            id: 'R2',
            condicion: (hechos) => hechos.plataforma === 'LinkedIn' && hechos.publico === 'profesionales',
            estrategia: 'Contenido educativo, casos de éxito y artículos de opinión',
            recomendacion: 'Publica artículos largos, comparte insights profesionales y establece autoridad en tu sector'
        },
        {
            id: 'R3',
            condicion: (hechos) => hechos.objetivo === 'ventas' && hechos.tipo === 'comercial',
            estrategia: 'Anuncios pagados y publicaciones con CTA',
            recomendacion: 'Invierte en publicidad segmentada y usa llamadas a la acción claras en cada publicación'
        },
        {
            id: 'R4',
            condicion: (hechos) => hechos.frecuencia === 'baja' && hechos.objetivo === 'crecimiento',
            estrategia: 'Incrementar publicaciones a mínimo 3 por semana',
            recomendacion: 'Aumenta la frecuencia de publicación para mantener el engagement y mejorar el alcance orgánico'
        },
        {
            id: 'R5',
            condicion: (hechos) => hechos.plataforma === 'Instagram' && hechos.tipo === 'entretenimiento',
            estrategia: 'Reels, carruseles y colaboraciones',
            recomendacion: 'Enfócate en Reels virales, crea carruseles interactivos y colabora con otros creadores'
        },
        {
            id: 'R6',
            condicion: (hechos) => hechos.objetivo === 'marca personal' && hechos.plataforma === 'YouTube',
            estrategia: 'Videos largos con narrativa propia y constancia mensual',
            recomendacion: 'Desarrolla series temáticas, mantén una narrativa consistente y publica mínimo 2 videos mensuales'
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
 * @returns {Object} - Resultado con estrategia y reglas activadas
 */
function forwardChaining(hechos, reglas) {
    const reglasActivadas = [];
    let resultado = null;

    // Evaluar cada regla contra los hechos
    for (const regla of reglas) {
        if (regla.condicion(hechos)) {
            reglasActivadas.push({
                id: regla.id,
                estrategia: regla.estrategia,
                recomendacion: regla.recomendacion
            });

            // Tomar la primera regla que se active (prioridad simple)
            if (!resultado) {
                resultado = {
                    estrategia: regla.estrategia,
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
        // Mostrar estrategia principal
        diagnosticoElement.textContent = `Estrategia recomendada: ${resultado.resultado.estrategia}`;
        recomendacionElement.textContent = resultado.resultado.recomendacion;

        // Mostrar reglas activadas
        resultado.reglasActivadas.forEach(regla => {
            const li = document.createElement('li');
            li.className = 'rule-item';
            li.innerHTML = `
                <div class="rule-name">${regla.id}: ${regla.estrategia}</div>
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
        diagnosticoElement.textContent = 'Estrategia recomendada: General';
        recomendacionElement.textContent = 'No se encontraron recomendaciones específicas con los datos ingresados. Analiza tu audiencia y adapta el contenido a cada plataforma.';
        
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
    const form = document.getElementById('form-redes');
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
    console.log('Plataforma:', hechos.plataforma);
    console.log('Público:', hechos.publico);
    console.log('Tipo:', hechos.tipo);
    console.log('Frecuencia:', hechos.frecuencia);
    console.log('Objetivo:', hechos.objetivo);
}