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

    if (tAsentamientos < 30) {
        if (1.1 * qload < qadm) {
            const m1 = 'Los cálculos de capacidad portante indican que las dimensiones de la zapata permiten soportar la carga inicial sobre los estratos con las características ingresadas con amplio margen. '
            const m2 = 'Por tanto, se establece con seguridad que el diseño de la zapata es el adecuado para los estratos ingresados y la carga respectiva. '
            const m3 = 'Por otro lado, los resultados de asentamientos nos indican que el desplazamiento de la carga es menor al máximo permitido de 30cm.'
    
            bodyModal.innerHTML = '<br><p style="color: green; text-align: center;"><i class="fa fa-check-circle fa-5x"></i></p><br><br>' + m1 + '<br><br>' + m2 + '<br><br>' + m3

            message = m1 + m2 + m3
    
    
        } else if (qload < qadm) {
            const m1 = 'Los cálculos indican que las dimensiones de la zapata permiten soportar la carga inicial sobre los estratos con las características ingresadas. '
            const m2 = 'Sin embargo, se recomienda cambiar ligeramente las dimensiones con el objetivo de tener un margen de carga mayor entre la ingresada y la calculada. '
            const m3 = 'Por otro lado, los resultados de asentamientos nos indican que el desplazamiento de la carga es menor al máximo permitido de 30cm'
    
            bodyModal.innerHTML = '<br><p style="color: yellow; text-align: center;"><i class="fa fa-exclamation-triangle fa-5x"></i></p><br><br>' + m1 + '<br><br>' + m2 + '<br><br>' + m3

            message = m1 + m2 + m3
    
        } else {
            const m1 = 'Los cálculos indican que las dimensiones de la zapata no cumplen con la carga mínima ingresada, por tanto es necesario cambiar sus medidas y recalcular. '

            bodyModal.innerHTML = '<br><p style="color: red; text-align: center;"><i class="fa fa-times-circle fa-5x"></i></p><br><br>' + m1

            message = m1
        }
    } else {
        const m1 = 'Los cálculos de asentamientos indican que los suelos no son aptos para construcción, ya que el desplazamiento de la carga bajo las condiciones de suelos, carga y dimensiones de la zapata es mayor a 30 cm. '

        bodyModal.innerHTML = '<br><p style="color: red; text-align: center;"><i class="fa fa-times-circle fa-5x"></i></p><br><br>' + m1

        message = m1
    }
    

    modal.show()
    miModal.addEventListener('hidden.bs.modal', (e) => {
        modal.dispose()
        eliminarModal()
    })
}