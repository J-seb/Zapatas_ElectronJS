let arrayParamsElasticosB = []
let arrayParamsElasticosC = []
let arrayParamsElasticosE = []
let contador = 0
/* const calcularZ = (l, b) => {
    let z = 2 * b
    if (l === b) {
        console.log('L y B son iguales')
        return z
    } else {
        console.log('L y B no son iguales')
        let m, n
        let i = 0
        let it = 0
        while ((i * 4) < 0.098 || (i * 4) > 0.102) {
            m = b / (2 * z)
            n = l / (2 * z)
            i = calcularI(m, n)
            console.log('Iteración ' + it + ', i = ' + i + ' ; z = ' + z + ' ; m = ' + m + ' ; n = ' + n)
            i * 4 < 0.0102 ? z = z - 0.01 : z = z + 0.01
            it = it + 1 
        }
        return z.toFixed(1)
    }
}

const calcularI = (m, n) => {

    const m2 = Math.pow(m, 2)
    const n2 = Math.pow(n, 2)
    const primerTermino = (2 * m * n * Math.sqrt(m2 + n2 + 1))/(m2 + n2 + 1 + m2 * n2)
    const segundoTermino = (m2 + n2 + 2) / (m2 + n2 + 1)
    const tercerTermino = Math.atan2((2 * m * n * Math.sqrt(m2 + n2 + 1)), (m2 + n2 + 1 - m2 * n2))

    const i = 1/(4 * Math.PI) * (primerTermino * segundoTermino + tercerTermino)

    return i
} */

const calcularElasticos = (datosZapata, suelo, h) => {

    // Constantes iniciales para el cálculo

    // zapatas
    const b = datosZapata.b
    const l = datosZapata.l
    const bp = b / 2
    const lp = l / 2
    const mp = l / b
    const ifz = datosZapata.iF

    if (arrayParamsElasticosB.length === 0) {
        arrayParamsElasticosB = [bp, lp, mp]
    }

    const npc = h / (b / 2)
    const npe = h / b

    // suelos
    const mu = parseFloat(suelo.mu)
    const es = parseFloat(suelo.es)

    // Carga
    const q = datosZapata.ql * 9.81 / (b * l)

    const alphaC = 4
    const alphaE = 1

    // Calculamos Asentamiento Centro
    const a0c = calcularA0(mp, npc)
    const a1c = calcularA1(mp, npc)
    const a2c = calcularA2(mp, npc)

    const f1c = calcularF1(a0c, a1c)
    const f2c = calcularF2(npc, a2c)

    const isc = calcularIs(f1c, f2c, mu)

    const asenC = (formulaElasticos(q, alphaC, bp, mu, es, isc, ifz) * 100).toFixed(3)

    // Calculamos Asentamiento Esquina
    const a0e = calcularA0(mp, npe)
    const a1e = calcularA1(mp, npe)
    const a2e = calcularA2(mp, npe)

    const f1e = calcularF1(a0e, a1e)
    const f2e = calcularF2(npe, a2e)

    const ise = calcularIs(f1e, f2e, mu)

    const asenE = (formulaElasticos(q, alphaE, bp, mu, es, ise, ifz) * 100).toFixed(3)

    contador = contador + 1

    arrayParamsElasticosC.push([contador, npc.toFixed(3), alphaC.toFixed(3), a0c.toFixed(3), a1c.toFixed(3), a2c.toFixed(3), f1c.toFixed(3), f2c.toFixed(3), isc.toFixed(3)])
    arrayParamsElasticosE.push([contador, npe.toFixed(3), alphaE.toFixed(3), a0e.toFixed(3), a1e.toFixed(3), a2e.toFixed(3), f1e.toFixed(3), f2e.toFixed(3), ise.toFixed(3)])

    return {asenC, asenE}
    
}

const formulaElasticos = (q, alpha, bp, mu, es, iS, iF) => {
    return q * alpha * bp * iS * iF * (1 - Math.pow(mu, 2)) / es
}

const calcularA0 = (mp, np) => {
    const mp2 = Math.pow(mp, 2)
    const np2 = Math.pow(np, 2)
    return mp * Math.log(((1 + Math.sqrt(mp2 + 1)) * Math.sqrt(mp2 + np2))/(mp * (1 + Math.sqrt(mp2 + np2 + 1))))
}

const calcularA1 = (mp, np) => {
    const mp2 = Math.pow(mp, 2)
    const np2 = Math.pow(np, 2)
    return Math.log(((mp + Math.sqrt(mp2 + 1)) * Math.sqrt(1 + np2))/(mp + Math.sqrt(mp2 + np2 + 1)))
}

const calcularA2 = (mp, np) => {
    const mp2 = Math.pow(mp, 2)
    const np2 = Math.pow(np, 2)
    return mp / (np * Math.sqrt(np2 + mp2 + 1))
}

const calcularF1 = (a0, a1) => {
    return (a0 + a1)/Math.PI
}

const calcularF2 = (np, a2) => {
    return np * Math.atan2(a2, 1) / (2 * Math.PI)
}

const calcularIs = (f1, f2, mu) => {
    return f1 + f2 * (1 - 2 * mu) / (1 - mu)
}

const calcularAsentamientosElasticos = (suelos, datosIniciales, z) => {

    const nf = datosIniciales.nf
    const df = datosIniciales.df

    let cotas = [0]
    let acum = 0
    suelos.forEach((suelo) => {
        if (suelo.gammah) {
            acum = acum + parseFloat(suelo.espesor)
            cotas.push(acum)
        }
    })

    const limiteSuperior = datosIniciales.df
    let limiteInferior = 0
    let calculoSuperior = false
    let calculoInferior = false

    let h = 0

    df + parseFloat(z) < nf ? limiteInferior = df + parseFloat(z) : limiteInferior = nf

    let arrayElasticosCentro = []
    let arrayElasticosEsquina = []

    console.log({limiteSuperior, limiteInferior})
    console.log({suelos, datosIniciales})
    console.log({cotas})

    for (i = 0; i < cotas.length - 1; i ++) {
        if ((cotas[i] < limiteSuperior) && (cotas[i + 1] >= limiteSuperior) && !calculoSuperior) {
            h = (cotas[i + 1] - limiteSuperior)

            console.log('Entramos a limite superior, el valor de h es: ' + h)
            const {asenC, asenE} = calcularElasticos(datosIniciales, suelos[i], h)

            console.log({asenC, asenE})
            arrayElasticosCentro.push(asenC)
            arrayElasticosEsquina.push(asenE)
            calculoSuperior = true

        } else if ((cotas[i] < limiteInferior) && (cotas[i + 1] >= limiteInferior) && calculoSuperior && !calculoInferior) {
            h = (limiteInferior - cotas[i])
            console.log({limiteInferior})
            console.log(cotas[i])
            
            console.log('Valor de h es ' + h)
            const {asenC, asenE} = calcularElasticos(datosIniciales, suelos[i], h)

            arrayElasticosCentro.push(asenC)
            arrayElasticosEsquina.push(asenE)

            calculoInferior = true
        } else if (calculoSuperior && !calculoInferior && cotas[i] < limiteInferior) {
            console.log('Entramos a capa completa')
            h = parseFloat(suelos[i].espesor)

            const {asenC, asenE} = calcularElasticos(datosIniciales, suelos[i], h)
            arrayElasticosCentro.push(asenC)
            arrayElasticosEsquina.push(asenE)      
        }
    }

    return {arrayElasticosCentro, arrayElasticosEsquina}
}

/*  const suelos = [
    {
        cc: "",
        gammah: "17",
        cohesion: "10",
        cs: "",
        eo: "0.72",
        es: "15000",
        mu: "0.28",
        phi: "25",
        espesor: "1.5"
    }, 
    {
        cc: "",
        cohesion: "25",
        gammah: "18",
        cs: "",
        eo: "0.8",
        es: "10000",
        mu: "0.25",
        phi: "30",
        espesor: "4"
    }, 
    {
        cc: "",
        gammah: "16",
        cohesion: "5",
        cs: "",
        eo: "0.09",
        es: "30000",
        mu: "0.3",
        phi: "25",
        espesor: "6"
    }
]

const datosIniciales = {
    b: 2,
    d: 3.5,
    df: 1.5,
    fs: 3,
    l: 3,
    nf: 11.5,
    phi2: 12,
    ql: 100,
    iF: 0.93
}

const c = calcularAsentamientosElasticos(suelos, datosIniciales, 5)
console.log(c)


 */