// Toast
let message = ''

const crearToast = (m) => {
    const body = document.querySelector('body')
    const firstScript = document.querySelector('#primer-script')

    const toast = document.createElement('div')
    toast.setAttribute('role', 'alert')
    toast.setAttribute('class', 'toast hide')
    toast.setAttribute('style', 'position: absolute; top: 1%; left: 35%;')
    toast.setAttribute('data-bs-autohide', 'false')

    const divFlex = document.createElement('div')
    divFlex.setAttribute('class', 'd-flex mx-3')

    const toastBody = document.createElement('div')
    toastBody.setAttribute('class', 'toast-body')
    toastBody.textContent = m

    const closeButton = document.createElement('button')
    closeButton.setAttribute('type', 'button')
    closeButton.setAttribute('class', 'btn-close me-2 m-auto')
    closeButton.setAttribute('data-bs-dismiss', 'toast')
    
    divFlex.appendChild(toastBody)
    divFlex.appendChild(closeButton)

    toast.appendChild(divFlex)

    body.insertBefore(toast, firstScript)
    
}

const eliminarToast = () => {
    toast = document.querySelector('.toast')
    toast.remove()
}


const mostrarToast = (m) => {

    crearToast(m)
    let miToast = document.querySelector('.toast')
    let toast = new Bootstrap.Toast(miToast, {
        animation: true,
        autohide: false
    })
    toast.show()
    miToast.addEventListener('hidden.bs.toast', (e) => {
        toast.dispose()
        eliminarToast()
    })
}


// Modal

const crearModal = () => {
    const body = document.querySelector('body')
    const firstScript = document.querySelector('#primer-script')

    const modal = document.createElement('div')
    modal.setAttribute('class', 'modal fade')
    modal.setAttribute('data-bs-backdrop', 'static')
    modal.setAttribute('data-bs-keyboard', 'false')
    modal.setAttribute('tabindex', '-1')

    const divModalDialog = document.createElement('div')
    divModalDialog.setAttribute('class', 'modal-dialog modal-dialog-centered')

    const divModalContent = document.createElement('div')
    divModalContent.setAttribute('class', 'modal-content')

    const divModalHeader = document.createElement('div')
    divModalHeader.setAttribute('class', 'modal-header mx-3')

    const h5 = document.createElement('h5')
    h5.setAttribute('class', 'modal-title')
    h5.textContent = 'Resultados'

    const divModalBody = document.createElement('div')
    divModalBody.setAttribute('class', 'modal-body mx-3')

    const p = document.createElement('p')
    p.setAttribute('id', 'textoFinal')

    const divModalFooter = document.createElement('div')
    divModalFooter.setAttribute('class', 'modal-footer mx-3')

    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('class', 'btn btn-primary')
    button.setAttribute('data-bs-dismiss', 'modal')
    button.textContent = 'Cerrar'

    divModalFooter.appendChild(button)
    divModalBody.appendChild(p)
    divModalHeader.appendChild(h5)

    divModalContent.appendChild(divModalHeader)
    divModalContent.appendChild(divModalBody)
    divModalContent.appendChild(divModalFooter)

    divModalDialog.appendChild(divModalContent)
    
    modal.appendChild(divModalDialog)

    body.insertBefore(modal, firstScript)
}

const eliminarModal = () => {
    const modal = document.querySelector('.modal')
    modal.remove()
}

const modalFinalZapata = (datosZapata, qAdmT, tAsentamientos) => {
    crearModal()

    const miModal = document.querySelector('.modal')
    const modal = new Bootstrap.Modal(miModal)

    const qload = parseFloat(datosZapata.ql)
    const qadm = parseFloat(qAdmT)

    const bodyModal = document.querySelector('#textoFinal')
    bodyModal.innerHTML = ''

    let m1, m2
    let m3 = 'Se recomienda al ingeniero/Usuario realizar un análisis de los Asentamientos Diferenciales. Esta herramienta no considera las deformaciones diferenciales.'

    if (1.1 * qload < qadm) {

        m1 = 'De acuerdo al análisis realizado con los datos ingresados, las simulaciones realizadas indican que las dimensiones de zapata y perfíl geotécnico cumplen en términos de capacidad portante. Se establece con seguridad que el diseño de la zapata es el adecuado.'

        if (tAsentamientos < 3) {

            m2 = 'Los asentamientos calculados indican que las deformaciones están dentro del rango permisible de 3 cm y de la tolerancia de asentamientos totales según H.4.9.2 (a)'
    
            bodyModal.innerHTML = '<br><p style="color: green; text-align: center;"><i class="fa fa-check-circle fa-5x"></i></p><br><p>Capacidad:</p><p>' + m1 + '</p><br><p>Asentamientos: </p><p>' + m2 + '</p><br><p>NOTA: </p><p>' + m3 + '</p>'
    
        } else if (tAsentamientos < 30) {

            m2 = 'Los asentamientos calculados indican que las deformaciones exceden los límites permisibles de 3 cm para asentamientos y se encuentran dentro del límite según H.4.9.2 (a). Se recomienda realizar una verificación de diseño que considere la validación de los resultados.'
    
            bodyModal.innerHTML = '<br><p style="color: yellow; text-align: center;"><i class="fa fa-exclamation-triangle fa-5x"></i></p><br><p>Capacidad:</p><p>' + m1 + '</p><br><p>Asentamientos: </p><p>' + m2 + '</p><br><p>NOTA: </p><p>' + m3 + '</p>'
    
        } else {
            m2 = 'Los asentamientos calculados indican que las deformaciones exceden los límites permisibles de 3 cm para asentamientos y los límites tolerables según H.4.9.2 (a). Se recomienda modificar el diseño de la cimentación propuesta y realizar un análisis global considerando los asentamientos diferenciales de la estructura.'

            bodyModal.innerHTML = '<br><p style="color: red; text-align: center;"><i class="fa fa-times-circle fa-5x"></i></p><br><p>Capacidad:</p><p>' + m1 + '</p><br><p>Asentamientos: </p><p>' + m2 + '</p><br><p>NOTA: </p><p>' + m3 + '</p>'

        }
    } else {

        m1 = 'De acuerdo al análisis realizado con los datos ingresados, las simulaciones realizadas indican que las dimensiones de zapata y perfil geotécnico no cumplen con la capacidad solicitada. Se recomienda modificar dimensiones de zapata y perfil estratigráfico.'

        if (tAsentamientos < 3) {

            m2 = 'Los asentamientos calculados indican que las deformaciones están dentro del rango permisible de 3 cm y de la tolerancia de asentamientos totales según H.4.9.2 (a)'
    
            bodyModal.innerHTML = '<br><p style="color: yellow; text-align: center;"><i class="fa fa-exclamation-triangle fa-5x"></i></p><br><p>Capacidad:</p><p>' + m1 + '</p><br><p>Asentamientos: </p><p>' + m2 + '</p><br><p>NOTA: </p><p>' + m3 + '</p>'
    
        } else if (tAsentamientos < 30) {

            m2 = 'Los asentamientos calculados indican que las deformaciones exceden los límites permisibles de 3 cm para asentamientos y se encuentran dentro del límite según H.4.9.2 (a). Se recomienda realizar una verificación de diseño que considere la validación de los resultados.'
    
            bodyModal.innerHTML = '<br><p style="color: red; text-align: center;"><i class="fa fa-times-circle fa-5x"></i></p><br><p>Capacidad:</p><p>' + m1 + '</p><br><p>Asentamientos: </p><p>' + m2 + '</p><br><p>NOTA: </p><p>' + m3 + '</p>'

        } else {
            m2 = 'Los asentamientos calculados indican que las deformaciones exceden los límites permisibles de 3 cm para asentamientos y los límites tolerables según H.4.9.2 (a). Se recomienda modificar el diseño de la cimentación propuesta y realizar un análisis global considerando los asentamientos diferenciales de la estructura.'

            bodyModal.innerHTML = '<br><p style="color: red; text-align: center;"><i class="fa fa-times-circle fa-5x"></i></p><br><p>Capacidad:</p><p>' + m1 + '</p><br><p>Asentamientos: </p><p>' + m2 + '</p><br><p>NOTA: </p><p>' + m3 + '</p>'
        }
       
    }

    message = [m1, m2, m3]
    

    modal.show()
    miModal.addEventListener('hidden.bs.modal', (e) => {
        modal.dispose()
        eliminarModal()
    })
}