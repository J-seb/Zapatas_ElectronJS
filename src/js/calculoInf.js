const calcularZ = (l, b) => {
    let z = 2 * b
    let i = 0
    if (l === b) {
        i = '-'
        z = z.toFixed(1)
    } else {
        let m, n
        let it = 0
        while ((i * 4) < 0.098 || (i * 4) > 0.102) {
            m = b / (2 * z)
            n = l / (2 * z)
            i = calcularI(m, n)
            i * 4 < 0.0102 ? z = z - 0.01 : z = z + 0.01
            it = it + 1 
        }
        i = (i * 4 * 100).toFixed(2)
        z = z.toFixed(1)
    }
    return {z, i}
}

const calcularI = (m, n) => {

    const m2 = Math.pow(m, 2)
    const n2 = Math.pow(n, 2)
    const primerTermino = (2 * m * n * Math.sqrt(m2 + n2 + 1))/(m2 + n2 + 1 + m2 * n2)
    const segundoTermino = (m2 + n2 + 2) / (m2 + n2 + 1)
    const tercerTermino = Math.atan2((2 * m * n * Math.sqrt(m2 + n2 + 1)), (m2 + n2 + 1 - m2 * n2))

    const i = 1/(4 * Math.PI) * (primerTermino * segundoTermino + tercerTermino)

    return i
}