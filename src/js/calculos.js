// Declaramos dos variables globales mas
// datosIniciales será un objeto que guardará los datos iniciales de la zapata entre otros.
// Cálculos tabla es el array de objetos para mostrar resultados
let datosIniciales = {}
let calculosTabla = []
const botonCalcular = document.querySelector('#calcular')

// Campos de tablas para los parámetros N
const tNC = document.querySelector('#resnc')
const tNQ = document.querySelector('#resnq')
const tNY = document.querySelector('#resny')

// Campos de tablas para los parámetros S
const tSC = document.querySelector('#ressc')
const tSQ = document.querySelector('#ressq')
const tSY = document.querySelector('#ressy')

// Campos de tablas para los parámetros D
const tDC = document.querySelector('#resdc')
const tDQ = document.querySelector('#resdq')
const tDY = document.querySelector('#resdy')

// Seleccción de Metodología

const sel = document.querySelector('#metodologia')

// Evento click en botón PLAY

// Guardar la opción de metodología en la variable met.
// Reiniciar valores datos iniciales y cálculos tabla
// Llenar el objeto datos iniciales con los campos relacionados a la clase datos iniciales.
// Calcular posteriormente el phipromedio y el hc final a partir del proceso iterativo
// Renderizar datos en la tabla resultados con los cálculos iterativos del ángulo y demás parámetros

// Luego, si la metodología es hansen, aplicar la función calcular hansen con parámetro de entrada phiprom
// y mostrar resultados, lo mismo con las funciones calcularMeyerhof y calcularTerzaghi

// Posteriormente calcular la cohesión promedio
// Calcular finalmente Q y Y.

// ******* Determinar la factibilidad de los datos de zapata ***********

botonCalcular.addEventListener('click', () => {
    calculosTabla = []
    datosIniciales = {}
    const met = sel.value
    document.querySelectorAll('.datos-iniciales').forEach((dato) => {
        datosIniciales[dato.name] = parseFloat(dato.value)
    })
    const {phiProm, hC} = calcular(datosIniciales)

    renderDatos('#resultados', calculosTabla)
  
    if (met === 'hansen') {
        const {nC, nQ, nY, sC, sQ, sY, dC, dQ, dY} = calcularHansen(phiProm)
        mostrarCoeficientes({nC, nQ, nY, sC, sQ, sY, dC, dQ, dY})
    } else if (met === 'meyerhof') {
        const {nC, nQ, nY, sC, sQ, sY, dC, dQ, dY} = calcularMeyerhof(phiProm)
        mostrarCoeficientes({nC, nQ, nY, sC, sQ, sY, dC, dQ, dY})
    } else {
        const {nC, nQ, nY, sC, sQ, sY, dC, dQ, dY} = calcularTerzaghi(phiProm)
        mostrarCoeficientes({nC, nQ, nY, sC, sQ, sY, dC, dQ, dY})
    }

    const cProm = calcularProm(datos, datosIniciales.df, parseFloat(datosIniciales.df) + parseFloat(hC), 'cohesion')

    const {qProm, yProm} = calcularQY(hC)
    
    graph2d()
    
    console.log(cProm)
    console.log({qProm, yProm})

})

// Cálculo de parámetros iterativos


// Funcion para calcular el alpha
const calcularAlpha = (phi) => {
    return 45 + phi/2
}

// Función para calcular el Ro
const calcularRo = (b, alpha) => {
    return b/(2 * Math.cos(alpha * Math.PI / 180))
}

// Función para calcular R
const calcularR = (ro, alpha, phi) => {
    return ro * Math.exp(alpha * Math.PI / 180 * Math.tan(phi * Math.PI / 180))
}

// Función para calcular el HC
const calcularHc = (phi, r) => {
    return hc = Math.cos(phi * Math.PI / 180) * r
}

// Función para calcular promedios **** IMPORTANTE ****
const calcularProm = (suelos, inicio, fin, param) => {

    const limiteSuperior = parseFloat(inicio)
    const limiteInferior = parseFloat(fin)
    
    console.log(limiteSuperior)
    console.log(limiteInferior)

    let arrayParams = []
    if (param === 'gamma-sat') {
        arrayParams = suelos.map(suelo => parseFloat(suelo[param]) - 9.81)
    } else {
        arrayParams = suelos.map(suelo => parseFloat(suelo[param]))
    }

    console.log(arrayParams)

    const cotas = [0]
    let acum = 0

    // Buscar cotas
    suelos.forEach((suelo) => {
        acum = acum + parseFloat(suelo.espesor)
        cotas.push(acum)
    })

    let acumSuelo =  0

    let influenciaSuperior = 0
    let influenciaInferior = 0
    let capaCompleta = 0
    let calculoSuperior = false
    let calculoInferior = false

    // Comparar con límite superior, inferior y capas intermedias
    for (i = 0; i < cotas.length - 1; i ++) {
        if ((cotas[i] < limiteSuperior) && (cotas[i + 1] >= limiteSuperior) && !calculoSuperior) {
            influenciaSuperior = (cotas[i + 1] - limiteSuperior) * arrayParams[i]
            acumSuelo = acumSuelo + (cotas[i + 1] - limiteSuperior)
            calculoSuperior = true
        } else if ((cotas[i] < limiteInferior) && (cotas[i + 1] >= limiteInferior) && calculoSuperior && !calculoInferior) {
            influenciaInferior = (limiteInferior - cotas[i]) * arrayParams[i]
            acumSuelo = acumSuelo + (limiteInferior - cotas[i])
            calculoInferior = true
        } else if (calculoSuperior && !calculoInferior && cotas[i] < limiteInferior) {
            capaCompleta = capaCompleta + parseFloat(suelos[i].espesor) * arrayParams[i]
            acumSuelo = acumSuelo + parseFloat(suelos[i].espesor)
        }
    }
    
    if (limiteSuperior < 0.001) {
        return (influenciaInferior + influenciaSuperior + capaCompleta)
    } else {
        return (influenciaInferior + influenciaSuperior + capaCompleta) / acumSuelo
    }
}

// Función para calcular phi promedio, hc y demás parámetros iterativos
const calcular = (datosIniciales) => {
    let phi = 0
    let phiProm = 0
    let hC = 0
    const b = parseFloat(datosIniciales.b)
    for (let i = 0; i < 5; i++) {
        if (calculosTabla.length === 0) {
            phi = parseFloat(datosIniciales.phi2)
        } else {
            phi = calculosTabla[i - 1].phiProm
        }
        let alpha = calcularAlpha(phi).toFixed(3)
        let ro = calcularRo(b, alpha).toFixed(3)
        let r = calcularR(ro, alpha, phi).toFixed(3)
        hC = calcularHc(phi, r).toFixed(3)
        phiProm = calcularProm(datos, datosIniciales.df, parseFloat(datosIniciales.df) + parseFloat(hC), 'phi').toFixed(3)

        let _id = uuidv4()
        calculosTabla.push({_id, alpha, ro, r, hC, phiProm})
    }
    return {phiProm, hC}
}

// Función para calcular parámetros por metodología de Hansen
const calcularHansen = (phiPromedio) => {

    const phiRadianes = phiPromedio * Math.PI / 180

    const b = parseFloat(datosIniciales.b)
    const l = parseFloat(datosIniciales.l)
    const df = parseFloat(datosIniciales.df)

    // Factores de carga
    const nQ = Math.exp(Math.PI * Math.tan(phiRadianes)) * Math.pow(Math.tan(((45 + phiPromedio/2) * Math.PI / 180)), 2)
    const nC = (nQ - 1) / Math.tan(phiRadianes)
    const nY = 1.5 * (nQ - 1) * Math.tan(phiRadianes)

    // Factores de forma

    const sC = 1 + nQ / nC * b / l
    const sQ = 1 + b / l * Math.sin(phiRadianes)
    const sY = 1 - 0.4 * b / l <= 0.6 ? 1 - 0.4 * b / l : 0.6

    // Factores de profundidad

    const k = df / b <= 1 ? df / b : Math.atan2(df, b)

    const dC = 1 + 0.4 * k
    const dY = 1
    const dQ = 1 + 2 * Math.tan(phiRadianes) * Math.pow((1 - Math.sin(phiRadianes)), 2) * k

    return {nC, nQ, nY, sC, sQ, sY, dC, dQ, dY}
}

// Función para determinar parámetros por metodología Terzaghi
const calcularTerzaghi = (phiPromedio) => {

    const phiRadianes = phiPromedio * Math.PI / 180

    // Factores de carga
    const nQ = Math.exp(2 * (0.75 * Math.PI - phiRadianes / 2) * Math.tan(phiRadianes)) / (2 * Math.pow((Math.cos((45 + parseFloat(phiPromedio)/2) * Math.PI / 180)), 2))
    const nC = (nQ - 1) / Math.tan(phiRadianes)
    const kpr = 3 * Math.pow(Math.tan((45 + (parseFloat(phiPromedio) + 33)/2) * Math.PI / 180), 2)
    const nY = Math.tan(phiRadianes) / 2 * (kpr / Math.pow(Math.cos(phiRadianes), 2) - 1)
    
    // Factores de forma
    const sC = 1.3
    const sY = 0.8
    const sQ = 0

    // Factores de profundidad
    const dC = 0
    const dQ = 0
    const dY = 0

    return {nC, nQ, nY, sC, sQ, sY, dC, dQ, dY}
}

// Función para determinar parámetros por metodología Meyerhof
const calcularMeyerhof = (phiPromedio) => {

    const phiRadianes = phiPromedio * Math.PI / 180

    const b = parseFloat(datosIniciales.b)
    const l = parseFloat(datosIniciales.l)
    const df = parseFloat(datosIniciales.df)

    // Factores de carga
    const nQ = Math.exp(Math.PI * Math.tan(phiRadianes)) * Math.pow(Math.tan(((45 + phiPromedio/2) * Math.PI / 180)), 2)
    const nC = (nQ - 1) / Math.tan(phiRadianes)
    const nY = (nQ - 1) * Math.tan(1.4 * phiRadianes)

    // Factores de forma
    const kp = Math.pow((Math.tan((45 + phiPromedio / 2) * Math.PI / 180)), 2)
    const sQ = 1 + 0.1 * kp * b / l
    const sC = 1 + 0.2 * kp * b / l
    const sY = sC

    // Factores de profundidad

    const dQ = 1 + 0.1 * Math.sqrt(kp) * df / b
    const dY = dQ
    const dC = 1 + 0.2 * Math.sqrt(kp) * df / b

    return {nC, nQ, nY, sC, sQ, sY, dC, dQ, dY}
}

// Mostrar parámetros 
const mostrarCoeficientes = ({nC, nQ, nY, sC, sQ, sY, dC, dQ, dY}) => {

    tNC.textContent = nC.toFixed(4)
    tNQ.textContent = nQ.toFixed(4)
    tNY.textContent = nY.toFixed(4)

    tSC.textContent = sC.toFixed(4)
    tSQ.textContent = sQ.toFixed(4)
    tSY.textContent = sY.toFixed(4)

    tDC.textContent = dC.toFixed(4)
    tDQ.textContent = dQ.toFixed(4)
    tDY.textContent = dY.toFixed(4)
}

// Función para calcular Q y Y
const calcularQY = (hC) => {
    const d = parseFloat(datosIniciales.d)
    const b = parseFloat(datosIniciales.b)
    const nf = parseFloat(datosIniciales.nf)
    const df = parseFloat(datosIniciales.df)
    const hc = parseFloat(hC)

    let qProm = 0
    let yProm = 0
    
    if (d > b) {
        // Caso 3
        qProm = parseFloat(datos[0]['gamma-h']) * df
        yProm = calcularProm(datos, df, df + hc, 'gamma-h')
        
    } else if (nf < df) {
        // Caso 1
        const yH = parseFloat(datos[0]['gamma-h'])
        const d1 = parseFloat(datos[0].espesor)
        const y = parseFloat(datos[1]['gamma-sat']) - 9.81
        const d2 = df - d1
        qProm = yH * d1 + y * d2
        yProm = calcularProm(datos, hC, datosIniciales, 'gammaSat')
    } else if (nf > df) {
        // Caso 2

        console.log('Entramos a caso 2')
        qProm = calcularProm(datos, 0.000001, df, 'gamma-h')

        console.log(qProm)
        ymProm = calcularProm(datos, df, nf, 'gamma-h')
        ypProm = calcularProm(datos, nf, df + hc, 'gamma-sat')

        console.log(ymProm)
        console.log(ypProm)
        yProm = parseFloat(ypProm) + d/b * (parseFloat(ymProm) - parseFloat(ypProm))

        return {qProm, yProm}
    }
}