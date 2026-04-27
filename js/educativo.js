/**
 * Motor de inferencia para el Sistema Experto Educativo Adaptativo
 * Implementa encadenamiento hacia adelante (forward chaining)
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-educativo');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluarEducativo();
        });
    }
});

/**
 * Función principal del motor de inferencia para educativo adaptativo
 */
function evaluarEducativo() {
    // Obtener valores del formulario
    const estilo = document.getElementById('estilo').value;
    const nivel = document.getElementById('nivel').value;
    const tiempo = document.getElementById('tiempo').value;
    const contenido = document.querySelector('input[name="contenido"]:checked')?.value;
    const motivacion = document.querySelector('input[name="motivacion"]:checked')?.value;
    const tema = document.getElementById('tema').value;

    // Validar que todos los campos estén completos
    if (!estilo || !nivel || !tiempo || !contenido || !motivacion || !tema) {
        mostrarMensaje('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Base de hechos (hechos iniciales)
    const hechos = {
        estilo: estilo,
        nivel: nivel,
        tiempo: tiempo,
        contenido: contenido,
        motivacion: motivacion,
        tema: tema
    };

    // Base de reglas
    const reglas = [
        {
            id: 'R1',
            condicion: (hechos) => hechos.estilo === 'visual' && hechos.contenido === 'práctico',
            estrategia: 'Aprendizaje basado en videos tutoriales y proyectos visuales',
            recomendacion: 'Utiliza plataformas como YouTube, Coursera con videos, crea diagramas y mapas mentales, desarrolla proyectos prácticos con resultados visibles'
        },
        {
            id: 'R2',
            condicion: (hechos) => hechos.nivel === 'principiante' && hechos.tiempo === 'menos 1',
            estrategia: 'Microaprendizaje con sesiones cortas y progresivas',
            recomendacion: 'Divide el contenido en lecciones de 15-20 minutos, usa apps de microlearning, establece metas diarias pequeñas y consistentes'
        },
        {
            id: 'R3',
            condicion: (hechos) => hechos.motivacion === 'certificación' && hechos.tema === 'tecnología',
            estrategia: 'Ruta estructurada hacia certificaciones técnicas',
            recomendacion: 'Sigue rutas oficiales de certificación (AWS, Google, Microsoft), combina teoría con labs prácticos, únete a comunidades de estudio'
        },
        {
            id: 'R4',
            condicion: (hechos) => hechos.estilo === 'auditivo' && hechos.contenido === 'teórico',
            estrategia: 'Podcasts educativos y audiolibros conceptuales',
            recomendacion: 'Suscríbete a podcasts especializados, utiliza audiobooks, participa en grupos de discusión, graba tus propias explicaciones'
        },
        {
            id: 'R5',
            condicion: (hechos) => hechos.nivel === 'avanzado' && hechos.tiempo === 'más 4',
            estrategia: 'Proyectos integrales y mentoría avanzada',
            recomendacion: 'Desarrolla proyectos complejos, busca mentoría con expertos, contribuye a open source, publica artículos técnicos'
        },
        {
            id: 'R6',
            condicion: (hechos) => hechos.estilo === 'kinestésico' && hechos.tema === 'negocios',
            estrategia: 'Simulaciones empresariales y aprendizaje experiencial',
            recomendacion: 'Participa en simulaciones de negocios, crea prototipos de proyectos, únete a competencias empresariales, aplica conceptos en casos reales'
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
        diagnosticoElement.textContent = 'Estrategia recomendada: Personalizada';
        recomendacionElement.textContent = 'No se encontraron estrategias específicas con los datos ingresados. Combina diferentes métodos de aprendizaje y experimenta con diversas técnicas.';
        
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
    const form = document.getElementById('form-educativo');
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
    console.log('Estilo:', hechos.estilo);
    console.log('Nivel:', hechos.nivel);
    console.log('Tiempo:', hechos.tiempo);
    console.log('Contenido:', hechos.contenido);
    console.log('Motivación:', hechos.motivacion);
    console.log('Tema:', hechos.tema);
}