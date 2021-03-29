const asentamientoNC = (suelo, deltaProm, sigma0) => {
    const cc = parseFloat(suelo.cc)
    const e0 = parseFloat(suelo.eo)
    const h = parseFloat(suelo.espesor)

    return (cc * h) / (1 + e0) * Math.log10((sigma0 + deltaProm) / sigma0)
}

const asentamientoSC1 = (suelo, deltaProm, sigma0) => {
    const cs = parseFloat(suelo.cs)
    const e0 = parseFloat(suelo.e0)
    const h = parseFloat(suelo.espesor)

    return (cs * h) / (1 + e0) * Math.log10((sigma0 + deltaProm) / sigma0)
}

const asentamientoSC2 = (suelo, deltaProm, sigma0) => {
    const cs = parseFloat(suelo.cs)
    const e0 = parseFloat(suelo.e0)
    const sigmaC = parseFloat(suelo.sigmaC)
    const cc = parseFloat(suelo.cc)
    const h = parseFloat(suelo.espesor)

    return (cs * h) / (1 + e0) * Math.log10(sigmaC / sigma0) + (cc * h) / (1 + e0) * Math.log10((sigma0 + deltaProm) / sigma0)
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

    if (cotas[pos] <= nuevoZ && cotas[pos + 1] > nuevoZ) {
        const h = ((nuevoZ - cotas[pos]) / 2)

        sigma0 = h * (parseFloat(suelos[pos].gammasat) - 9.81)

        deltaSup = qKN / ((b + cotas[pos] - df) * (l + cotas[pos] - df))
        deltaMed = qKN / ((b + h - df) * (l + h - df))
        deltaInf = qKN / ((b + z) * (l + z))

    } else if (cotas[pos] > nuevoZ) {
        sigma0 = 0
    } else if (cotas[pos + 1] < nuevoZ) {

        sigma0 = parseFloat(suelos[pos].espesor) / 2 * (parseFloat(suelos[pos].gammasat) - 9.81)

        const medio = (cotas[pos] + cotas[pos + 1]) / 2

        deltaSup = qKN / ((b + cotas[pos] - df) * (l + cotas[pos] - df))
        deltaMed = qKN / ((b + medio - df) * (l + medio - df))
        deltaInf = qKN / ((b + cotas[pos + 1] - df) * (l + cotas[pos + 1] - df))
    }

    for (let i = 0; i < pos; i++) {
        if (suelos[i].gammasat) {
            sigma0 = sigma0 + (parseFloat(suelos[i].espesor) * (parseFloat(suelos[i].gammasat) - 9.81))
        } else if (suelos[i].gammah) {
            sigma0 = sigma0 + (parseFloat(suelos[i].espesor) * parseFloat(suelos[i].gammah))
        }
    }

    const deltaProm = (deltaSup + 4 * deltaMed + deltaInf) / 6

    return {sigma0, deltaProm}
}

const calcularAsentamientosConsolidados = (suelos, datosIniciales, z) => {

    const nf = datosIniciales.nf

    let cotas = [0]
    let acum = 0
    suelos.forEach((suelo) => {
        acum = acum + parseFloat(suelo.espesor)
        cotas.push(acum)
    })

    let arrayConsolidados = []

    for (i = 0; i < cotas.length - 1; i ++) {
        if (cotas[i] >= nf && cotas[i] <= z) {

            const {sigma0, deltaProm} = calcularSigmaDeltas(i, suelos, z, datosIniciales)
            
            if (suelos[i].cc && !suelos[i].cs) {
                // Asentamiento normalmente consolidado
            
                const consolidado = asentamientoNC(suelos[i], deltaProm, sigma0) * 100
                arrayConsolidados.push(consolidado.toFixed(4))
            } else if (suelos[i].cs && !suelos[i].cc || (sigma0 + deltaProm <= sigmaC)) {
                // Asentamiento sobre consolidado caso I
                
                const consolidado = asentamientoSC1(suelos[i], deltaProm, sigma0) * 100
                arrayConsolidados.push(consolidado.toFixed(4))
            } else if (suelos[i].cc && suelos[i].cs || (sigma0 + deltaProm > sigmaC)) {
                // Asentamiento sobre consolidado caso II
                
                const consolidado = asentamientoSC2(suelos[i], deltaProm, sigma0) * 100
                arrayConsolidados.push(consolidado.toFixed(4))
            }
            
        }
    }

    return arrayConsolidados
}

/* const suelos = [{
    cc: "",
    cohesion: "20",
    cs: "",
    eo: "",
    es: "10000",
    mu: "0.2",
    phi: "10",
    espesor: "2",
    gammasat: '',
    gammah: '15',
    sigmac: ''
}, 
{
    cc: "",
    cohesion: "10",
    cs: "",
    eo: "",
    es: "5000",
    mu: "0.25",
    phi: "15",
    espesor: "1.5",
    gammasat: '',
    gammah: '17',
    sigmac: ''
}, 
{
    cc: "",
    cohesion: "0",
    cs: "",
    eo: "",
    es: "15000",
    mu: "0.3",
    phi: "5",
    espesor: "2",
    gammasat: '',
    gammah: '22',
    sigmac: ''
}, 
{
    cc: "0.09",
    cohesion: "5",
    cs: "",
    eo: "0.072",
    es: "10000",
    mu: "0.35",
    phi: "5",
    espesor: "5",
    gammasat: '20',
    gammah: '',
    sigmac: ''
}
]


const datosIniciales = {
    b: 5,
    d: 3.5,
    df: 2,
    fs: 3,
    l: 6,
    nf: 5.5,
    phi2: 12,
    ql: 450,
    ifz: 0.81
}

const z = calcularZ(datosIniciales.l, datosIniciales.b)
const arrayConsolidados = calcularAsentamientosConsolidados(suelos, datosIniciales, z)
console.log(arrayConsolidados) */