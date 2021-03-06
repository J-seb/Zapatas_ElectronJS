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

const calcularElasticos = (datosZapata, suelo, h, z) => {

    // Constantes iniciales para el cálculo

    // zapatas
    const b = datosZapata.b
    const df = datosZapata.df
    const l = datosZapata.l
    const bp = b / 2
    const lp = l / 2
    const mp = (l + z)/ (b + z) // Aumentar a l y b la distancia entre el df y el inicio del estrato

    // Porcentaje de carga en determinado suelo

    let influencia = 1
    if (z !== 0) {
        const m = b / (2 * z)
        const n = l / (2 * z)
        influencia = calcularI(m, n) * 4
    }

    if (arrayParamsElasticosB.length === 0) {
        arrayParamsElasticosB = [bp.toFixed(2), lp.toFixed(2)]
    }

    const npc = h / ((b + z) / 2) // Aumentar a b la distancia entre el df y el inicio del estrato
    const npe = h / (b + z) // Aumentar a b la distancia entre el df y el inicio del estrato

    // suelos
    const mu = parseFloat(suelo.mu)
    const es = parseFloat(suelo.es)

    // Carga
    const q = influencia * datosZapata.ql * 9.81 / (b * l) // 

    const alphaC = 4
    const alphaE = 1

    // Calculo de IF
    const ifz = (1.001 + 1.194 * df / b + 0.842 * l / b + 7.63 * mu) / (1 + 3.738 * df / b + 0.839 * l / b + 7.3 * mu)

    // Calculamos Asentamiento Centro
    const a0c = calcularA0(mp, npc)
    const a1c = calcularA1(mp, npc)
    const a2c = calcularA2(mp, npc)

    const f1c = calcularF1(a0c, a1c)
    const f2c = calcularF2(npc, a2c)

    const isc = calcularIs(f1c, f2c, mu)

    console.log({q, ifz, a0c, a1c, a2c, f1c, f2c, isc, influencia})

    const asenC = !isNaN(formulaElasticos(q, alphaC, bp, mu, es, isc, ifz)) ? (formulaElasticos(q, alphaC, bp, mu, es, isc, ifz) * 100).toFixed(2) : '0.00'

    // Calculamos Asentamiento Esquina
    const a0e = calcularA0(mp, npe)
    const a1e = calcularA1(mp, npe)
    const a2e = calcularA2(mp, npe)

    const f1e = calcularF1(a0e, a1e)
    const f2e = calcularF2(npe, a2e)

    const ise = calcularIs(f1e, f2e, mu)

    const asenE = !isNaN(formulaElasticos(q, alphaE, bp, mu, es, ise, ifz)) ? (formulaElasticos(q, alphaE, bp, mu, es, ise, ifz) * 100).toFixed(2) : '0.00'

    contador = contador + 1

    arrayParamsElasticosC.push([contador, ifz.toFixed(2), mp.toFixed(2), npc.toFixed(2), alphaC.toFixed(2), a0c.toFixed(2), a1c.toFixed(2), a2c.toFixed(2), f1c.toFixed(2), f2c.toFixed(2), isc.toFixed(2)])
    arrayParamsElasticosE.push([contador, ifz.toFixed(2), mp.toFixed(2), npe.toFixed(2), alphaE.toFixed(2), a0e.toFixed(2), a1e.toFixed(2), a2e.toFixed(2), f1e.toFixed(2), f2e.toFixed(2), ise.toFixed(2)])

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

    //df + parseFloat(z) < nf ? limiteInferior = df + parseFloat(z) : limiteInferior = nf

    limiteInferior = df + parseFloat(z)
    let arrayElasticosCentro = []
    let arrayElasticosEsquina = []

    console.log({limiteSuperior, limiteInferior})
    console.log({suelos, datosIniciales})
    console.log({cotas})

    for (i = 0; i < cotas.length - 1; i ++) {
        if ((cotas[i] < limiteSuperior) && (cotas[i + 1] >= limiteSuperior) && !calculoSuperior) {
            h = (cotas[i + 1] - limiteSuperior)

            console.log('Entramos a limite superior, el valor de h es: ' + h)
            const {asenC, asenE} = calcularElasticos(datosIniciales, suelos[i], h, cotas[i] - df)

            console.log({asenC, asenE})
            arrayElasticosCentro.push(asenC)
            arrayElasticosEsquina.push(asenE)
            calculoSuperior = true

        } else if ((cotas[i] < limiteInferior) && (cotas[i + 1] >= limiteInferior) && calculoSuperior && !calculoInferior) {
            h = (limiteInferior - cotas[i])
            console.log({limiteInferior})
            console.log(cotas[i])
            
            console.log('Valor de h es ' + h)
            const {asenC, asenE} = calcularElasticos(datosIniciales, suelos[i], h, cotas[i] - df)

            arrayElasticosCentro.push(asenC)
            arrayElasticosEsquina.push(asenE)

            calculoInferior = true
        } else if (calculoSuperior && !calculoInferior && cotas[i] < limiteInferior) {
            
            h = parseFloat(suelos[i].espesor)
            console.log('Entramos a capa completa, valor de h', h)

            const {asenC, asenE} = calcularElasticos(datosIniciales, suelos[i], h, cotas[i] - df)
            console.log({asenC, asenE})
            arrayElasticosCentro.push(asenC)
            arrayElasticosEsquina.push(asenE)      
        }
    }

    return {arrayElasticosCentro, arrayElasticosEsquina}
}

/*  const suelos = [
    {
        gammah: "17",
        cohesion: "20",
        eo: "0.09",
        es: "10000",
        mu: "0.25",
        phi: "15",
        espesor: "4"
    }, 
    {
        cohesion: "10",
        gammah: "20",
        es: "50000",
        mu: "0.3",
        phi: "30",
        espesor: "4"
    }, 
    {
        cc: "0.6",
        gammasat: "18",
        cohesion: "20",
        eo: "0.72",
        es: "30000",
        mu: "0.3",
        phi: "20",
        espesor: "4"
    }
]

const datosIniciales = {
    b: 4,
    df: 2,
    fs: 3,
    l: 3,
    nf: 4,
    ql: 450,
    iF: 0.65
}

const c = calcularAsentamientosElasticos(suelos, datosIniciales, 8)
console.log(c)


 */