// Generar el ID llegado el caso de necesitarse
const { v4: uuidv4 } = require('uuid');

// Variables globales con las que vamos a trabajar para pedir datos de capas o estratos
// Datos: Array para guardar cada estrato como elemento de ese array
// Elemento seleccionado: Carga el elemento seleccionado de la tabla de estratos ingresados
// Capa: Capa actual ingresada
let datos = []
let elementoSeleccionado = {}
let capa = 0

// Manejo del DOM, apuntamos a las etiquetas HTML con el id correspondiente en el archivo index.html

// Estos para obtener los elementos del formulario
const gammaH = document.querySelector('#gammah')
const cohesion = document.querySelector('#cohesion')
const gammaSat = document.querySelector('#gammasat')
const es = document.querySelector('#es')
const phi = document.querySelector('#phi')
const espesor = document.querySelector('#espesor')
const mu = document.querySelector('#mu')
const eo = document.querySelector('#eo')
const cc = document.querySelector('#cc')
const cs = document.querySelector('#cs')
const nombre = document.querySelector('#nombre')
const color = document.querySelector('#color')

// Estos para darle la funcionalidad de los botones agregar-modificar-eliminar
const botonAgregar = document.querySelector('#boton-agregar')
const botonEditar = document.querySelector('#boton-modificar')
const botonEliminar = document.querySelector('#boton-eliminar')

// Crear suelos (ver canvas.js)
graph2d()

// Cuando se haga submit al formulario, vamos a ejecutar lo que necesitemos
// Creamos un objeto vacío al cual vamos a llenar luego con los datos del formulario
// Evitamos que el formulario recargue la ventana
// Agregamos al objeto un ID unico (ver documentación de uuid en npmjs.com)

// Apuntamos a todos los elementos con clase "datos suelos" y por cada elemento, agregamos al objeto con el nombre
// del campo y su valor correspondiente.

// Al terminar, agregamos el objeto al array con el método push
// Renderizamos la tabla y reseteamos el formulario

document.querySelector('#agregar-elemento').addEventListener('submit', (e) => {
    let objForm = {}
    e.preventDefault()
    objForm._id = uuidv4()
    document.querySelectorAll('.datos-suelos').forEach((elemento) => {
        objForm[elemento.name] = elemento.value 
    })
    datos.push(objForm)
    renderDatos('#elementos', datos)
    resetForm()

})

// Seleccionar elementos (Evento DOM)

document.querySelector('#elementos').addEventListener('click', (e) => {
    capa = e.target.parentElement.cells.item(0).outerText
    elementoSeleccionado = seleccionarElemento(capa)
})

// Seleccionar elementos (Función)

const seleccionarElemento = (capa) => {
    const elemento = datos[capa - 1]

    botonAgregar.setAttribute("disabled", "true")
    botonEditar.removeAttribute("disabled")
    botonEliminar.removeAttribute("disabled")
    
    gammaH.value = elemento["gammah"]
    cohesion.value = elemento["cohesion"]
    gammaSat.value = elemento["gammasat"]
    es.value = elemento["es"]
    phi.value = elemento["phi"]
    espesor.value = elemento["espesor"]
    mu.value = elemento["mu"]
    eo.value = elemento["eo"]
    cc.value = elemento["cc"]
    cs.value = elemento["cs"]
    nombre.value = elemento["nombre"]
    color.value = elemento["color"]

    return elemento
}

// Editar elemento (Evento DOM)

botonEditar.addEventListener('click', () => {
    editarElemento(elementoSeleccionado)
    renderDatos('#elementos', datos)
    resetForm()
})

// Eliminar elemento (Evento DOM)

botonEliminar.addEventListener('click', () => {
    eliminarElemento(elementoSeleccionado)
    renderDatos('#elementos', datos)
    resetForm()
})

// Editar elemento (Función)

const editarElemento = (e) => {
    document.querySelectorAll('.datos-suelos').forEach((elemento) => {
        e[elemento.name] = elemento.value 
    })

    botonAgregar.removeAttribute("disabled")
    botonEditar.setAttribute("disabled", "true")
    botonEliminar.setAttribute("disabled", "true")

}

// Eliminar elemento (Función)

const eliminarElemento = (e) => {
    datos.splice(capa - 1, 1)
    renderDatos('#elementos', datos)

    botonAgregar.removeAttribute("disabled")
    botonEditar.setAttribute("disabled", "true")
    botonEliminar.setAttribute("disabled", "true")
}

// Resetear formulario

const resetForm = () => {
    gammaH.value = ''
    cohesion.value = ''
    gammaSat.value = ''
    es.value = ''
    phi.value = ''
    espesor.value = ''
    mu.value = ''
    eo.value = ''
    cc.value = ''
    cs.value = ''
    nombre.value = 'Arena'
    color.value = '#000000'
}