// Crear Filas

const DOMDatos = (dato, index) => {
    let valores = Object.values(dato)
    let fila = document.createElement('tr')

    valores.forEach(valor => {
        if (!valor.includes('#')){
            const celda = document.createElement('td')
            if (valor.length > 8)
            {
                celda.textContent = index
            } else {
                celda.textContent = valor
            }
            fila.appendChild(celda)
        }
    });

    return fila
}

// Renderizar Tabla

const renderDatos = (tablaAGraficar, d) => {
    const tabla = document.querySelector(tablaAGraficar)
    tabla.innerHTML = ''
    let item = 1
    d.forEach((dato) => {
        let fila = DOMDatos(dato, item)
        tabla.appendChild(fila)
        item = item + 1
    })
}

module.exports = renderDatos