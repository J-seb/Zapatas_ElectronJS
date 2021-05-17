let arrayParamsConsolidados = []

const asentamientoNC = (suelo, deltaProm, sigma0, h) => {
    const cc = parseFloat(suelo.cc)
    const e0 = parseFloat(suelo.eo)
    
    return (cc * 2 * h) / (1 + e0) * Math.log10((sigma0 + deltaProm) / sigma0)
}

const asentamientoSC1 = (suelo, deltaProm, sigma0, h) => {
    const cs = parseFloat(suelo.cs)
    const e0 = parseFloat(suelo.eo)

    console.log({cs, e0, suelo, deltaProm, sigma0, h})

    return (cs * 2 * h) / (1 + e0) * Math.log10((sigma0 + deltaProm) / sigma0)
}

const asentamientoSC2 = (suelo, deltaProm, sigma0, h) => {
    const cs = parseFloat(suelo.cs)
    const e0 = parseFloat(suelo.eo)
    const sigmaC = parseFloat(suelo.sc)
    const cc = parseFloat(suelo.cc)

    return (cs * 2 * h) / (1 + e0) * Math.log10(sigmaC / sigma0) + (cc * h) / (1 + e0) * Math.log10((sigma0 + deltaProm) / sigma0)
    // OJO COn el return
}

const calcularCotas = (suelos) => {
    let acum = 0
    let cotas = [0]
    for (let i = 0; i < suelos.length; i ++) {
        acum = acum + parseFloat(suelos[i].espesor)
        cotas.push(acum)
    }
    
    return cotas
}

const calcularSigmaDeltas = (pos, suelos, z, datosIniciales) => {

    const cotas = calcularCotas(suelos)

    const df = datosIniciales.df

    const nuevoZ = z + df

    const l = datosIniciales.l
    const b = datosIniciales.b
    const qKN = datosIniciales.ql * 9.81
    let sigma0 = 0
    let deltaSup = 0
    let deltaMed = 0
    let deltaInf = 0
    let h = 0

    if (cotas[pos] <= nuevoZ && cotas[pos + 1] > nuevoZ) {

        h = (nuevoZ - cotas[pos]) / 2

        sigma0 = h * (parseFloat(suelos[pos].gammasat) - 9.81)

        const medio = (cotas[pos] - df + z)/2
    
        deltaSup = qKN / ((b + cotas[pos] - df) * (l + cotas[pos] - df))
        deltaMed = qKN / ((b + medio) * (l + medio))
        deltaInf = qKN / ((b + z) * (l + z))


    } else if (cotas[pos] > nuevoZ) {
        sigma0 = 0

    } else if (cotas[pos + 1] < nuevoZ) {

        sigma0 = parseFloat(suelos[pos].espesor) / 2 * (parseFloat(suelos[pos].gammasat) - 9.81)

        const medio = (cotas[pos] + cotas[pos + 1]) / 2

        deltaSup = qKN / ((b + cotas[pos] - df) * (l + cotas[pos] - df))
        deltaMed = qKN / ((b + medio - df) * (l + medio - df))
        deltaInf = qKN / ((b + cotas[pos + 1] - df) * (l + cotas[pos + 1] - df))

        h = parseFloat(suelos[i].espesor) / 2
    }

    for (let i = 0; i < pos; i++) {
        if (suelos[i].gammasat) {
            sigma0 = sigma0 + (parseFloat(suelos[i].espesor) * (parseFloat(suelos[i].gammasat) - 9.81))
        } else if (suelos[i].gammah) {
            sigma0 = sigma0 + (parseFloat(suelos[i].espesor) * parseFloat(suelos[i].gammah))
        }
    }

    const deltaProm = (deltaSup + 4 * deltaMed + deltaInf) / 6

    console.log({deltaSup, deltaMed, deltaInf})

    if (sigma0) {
        arrayParamsConsolidados.push([pos + 1, sigma0.toFixed(2), deltaInf.toFixed(2), deltaMed.toFixed(2), deltaSup.toFixed(2), deltaProm.toFixed(2)])
    }

    return {sigma0, deltaProm, h}
}

const calcularAsentamientosConsolidados = (suelos, datosIniciales, z) => {

    const nf = datosIniciales.nf

    let cotas = calcularCotas(suelos)

    let arrayConsolidados = []
    //console.log({cotas})
    for (i = 0; i < cotas.length - 1; i ++) {
        if (cotas[i] >= nf) {
            console.log('Entramos a consolidados estrato', i + 1)
            //console.log({i, suelos, z, datosIniciales})
            const {sigma0, deltaProm, h} = calcularSigmaDeltas(i, suelos, parseFloat(z), datosIniciales)
            console.log({sigma0, deltaProm, h})
            if (suelos[i].cc && !suelos[i].cs) {
                // Asentamiento normalmente consolidados
                console.log('Calculamos asentamiento normalmente consolidado')
                const consolidado = asentamientoNC(suelos[i], deltaProm, sigma0, h) * 100
                arrayConsolidados.push(consolidado.toFixed(2))
            } else if (sigma0 + deltaProm <= parseFloat(suelos[i].sc)) {
                // Asentamiento sobre consolidado caso I
                console.log('Calculamos asentamiento sobre consolidado caso I')
                const consolidado = asentamientoSC1(suelos[i], deltaProm, sigma0, h) * 100
                arrayConsolidados.push(consolidado.toFixed(2))
            } else if (sigma0 + deltaProm > parseFloat(suelos[i].sc)) {
                // Asentamiento sobre consolidado caso II
                console.log('Calculamos asentamiento sobre consolidado caso II')
                const consolidado = asentamientoSC2(suelos[i], deltaProm, sigma0, h) * 100
                arrayConsolidados.push(consolidado.toFixed(2))
            }
            
        }
    }

    return arrayConsolidados
}

/* const suelos = [{
    cc: "",
    cohesion: "10.001",
    cs: "",
    eo: "0.72",
    es: "3000",
    mu: "0.3",
    phi: "20",
    espesor: "3",
    gammasat: '',
    gammah: '17',
    sigmac: ''
}, 
{
    cc: "0.9",
    cohesion: "15",
    cs: "",
    eo: "0.09",
    es: "50000",
    mu: "0.25",
    phi: "30",
    espesor: "4",
    gammasat: '20',
    gammah: '',
    sigmac: ''
}, 
{
    cc: "0.9",
    cohesion: "10",
    cs: "",
    eo: "00.7",
    es: "50000",
    mu: "0.3",
    phi: "20",
    espesor: "3",
    gammasat: '19',
    gammah: '',
    sigmac: ''
}
]


const datosIniciales = {
    b: 3,
    df: 2,
    fs: 3,
    l: 3,
    nf: 3,
    ql: 200,
    ifz: 0.89
}

const z = 6
const arrayConsolidados = calcularAsentamientosConsolidados(suelos, datosIniciales, z)
console.log(arrayConsolidados) */