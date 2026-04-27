/**
 * Motor de inferencia para el Sistema Experto de Compras Inteligentes
 * Implementa encadenamiento hacia adelante (forward chaining)
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-compras');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluarCompras();
        });
    }
});

/**
 * Función principal del motor de inferencia para compras inteligentes
 */
function evaluarCompras() {
    // Obtener valores del formulario
    const categoria = document.getElementById('categoria').value;
    const presupuesto = document.getElementById('presupuesto').value;
    const urgencia = document.querySelector('input[name="urgencia"]:checked')?.value;
    const prioridad = document.querySelector('input[name="prioridad"]:checked')?.value;
    const frecuencia = document.querySelector('input[name="frecuencia"]:checked')?.value;

    // Validar que todos los campos estén completos
    if (!categoria || !presupuesto || !urgencia || !prioridad || !frecuencia) {
        mostrarMensaje('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Base de hechos (hechos iniciales)
    const hechos = {
        categoria: categoria,
        presupuesto: presupuesto,
        urgencia: urgencia,
        prioridad: prioridad,
        frecuencia: frecuencia
    };

    // Base de reglas
    const reglas = [
        {
            id: 'R1',
            condicion: (hechos) => hechos.categoria === 'tecnología' && hechos.presupuesto === 'alto' && hechos.prioridad === 'calidad',
            estrategia: 'Gama alta de marcas reconocidas',
            recomendacion: 'Opta por productos tecnológicos de marcas premium con garantía extendida y servicio postventa'
        },
        {
            id: 'R2',
            condicion: (hechos) => hechos.categoria === 'tecnología' && hechos.presupuesto === 'bajo',
            estrategia: 'Gama media o reacondicionados certificados',
            recomendacion: 'Considera tecnología reacondicionada con garantía o marcas de buena relación calidad-precio'
        },
        {
            id: 'R3',
            condicion: (hechos) => hechos.urgencia === 'alta',
            estrategia: 'Comercios con disponibilidad inmediata o entrega rápida',
            recomendacion: 'Prioriza tiendas locales o marketplaces con entrega express, aunque el precio sea ligeramente superior'
        },
        {
            id: 'R4',
            condicion: (hechos) => hechos.prioridad === 'precio' && hechos.frecuencia === 'esporádica',
            estrategia: 'Productos genéricos o marca propia',
            recomendacion: 'Para compras ocasionales, las marcas propias o genéricas ofrecen excelente valor sin comprometer calidad básica'
        },
        {
            id: 'R5',
            condicion: (hechos) => hechos.categoria === 'alimentación' && hechos.frecuencia === 'diaria',
            estrategia: 'Compras al por mayor o suscripciones',
            recomendacion: 'Para productos de consumo diario, considera compras mayoristas o servicios de suscripción para optimizar costos'
        },
        {
            id: 'R6',
            condicion: (hechos) => hechos.prioridad === 'marca' && hechos.presupuesto === 'medio',
            estrategia: 'Buscar promociones de marcas reconocidas',
            recomendacion: 'Vigila ofertas temporales, liquidaciones o programas de lealtad de tus marcas preferidas'
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
        recomendacionElement.textContent = 'No se encontraron recomendaciones específicas con los datos ingresados. Compara precios y lee reseñas antes de comprar.';
        
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
    const form = document.getElementById('form-compras');
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
    console.log('Categoría:', hechos.categoria);
    console.log('Presupuesto:', hechos.presupuesto);
    console.log('Urgencia:', hechos.urgencia);
    console.log('Prioridad:', hechos.prioridad);
    console.log('Frecuencia:', hechos.frecuencia);
}