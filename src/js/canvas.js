const graph2d = () => {
    const canvas = document.querySelector('#canvas2d')
    
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d')

        //Limpiamos el Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        

        if (datos.length === 0) {
            eGraph(ctx, 310, 70, '#795548', 100, 'Arena', 'H1')
            eGraph(ctx, 310, 170, '#ff9800', 140, 'Arcilla', 'H2')
            eGraph(ctx, 310, 310, '#7f2b11', 110, 'Grava', 'H3')

            zGraph(ctx, 310, 70, '#a8a3a3', 200, 250, 40, 240, 50, 'B', 'df', 'd', 'nf')
            flechaVU2D(ctx, 310, 50, 30, 'Carga (Ton)')

            eGraph(ctx, 310, 420, '#656565', 30, '', 'Inf')
            text(ctx, 'E S T R A T O   R O C O S O', 177, 443, 20)

        } else {
            // Ancho Total Estratos = 500px
            // Alto Total Estratos =  350px
            if (Object.keys(datosIniciales).length !== 0) {

                // Averiguamos cuanto es la profundidad total de todas las capas
                let totalProfundidad = 0 
                datos.forEach((dato) => {
                    totalProfundidad = totalProfundidad + parseFloat(dato.espesor)
                })
                
                // Hacemos recorrido por cada capa para averiguar su respectiva altura en px y graficar
                let acum = 0
                datos.forEach((suelo) => {
                    const hpx = espesor2px(suelo.espesor, 350, totalProfundidad)

                    eGraph(ctx, 310, 70 + acum, suelo.color, hpx, suelo.nombre, `${suelo.espesor} m`)
                    acum = acum + hpx
                })
                const df = espesor2px(parseFloat(datosIniciales.df), 350, totalProfundidad)
                const b = espesor2px(parseFloat(datosIniciales.b), 350, 7)
                const anchoZ = espesor2px(0.4, 350, 7)
                const d = espesor2px(parseFloat(datosIniciales.d), 350, totalProfundidad)
                const nf = espesor2px(parseFloat(datosIniciales.nf), 350, totalProfundidad)

                zGraph(ctx, 310, 70, '#a8a3a3', df, b, d, nf, anchoZ, `${datosIniciales.b} m`, `${datosIniciales.df} m`, `${datosIniciales.d} m`, `${datosIniciales.nf} m`)

                flechaVU2D(ctx, 310, 50, 30, `${datosIniciales.ql} Ton`)
            }
            else {
                alert('Por favor ingrese datos iniciales para mostrar gráfica 2D')
            }

            eGraph(ctx, 310, 420, '#656565', 30, '', 'Inf')
            text(ctx, 'E S T R A T O   R O C O S O', 177, 443, 20)
        }      
    } else {
        alert('Canvas is not supported in this app')
    }
}

const zGraph = (ctx, x, y, color, h, b, d, nf, az, sB, sdf, sd, snf) => {

    nivFreatico(ctx, x, y + nf)

    ctx.beginPath()
    ctx.moveTo(x + az/2, y - 5)
    
    ctx.lineTo(x + az/2, y + h - az)
    ctx.lineTo(x + b/2, y + h - az)
    ctx.lineTo(x + b/2, y + h)
    ctx.lineTo(x - b/2, y + h)
    ctx.lineTo(x - b/2, y + h - az)
    ctx.lineTo(x - az/2, y + h - az)
    ctx.lineTo(x - az/2, y - 5)

    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1
    ctx.stroke()

    cGraphH(ctx, b, x - b/2, y + h - az/2, sB)
    cGraphV(ctx, h, x - 270, y, sdf)
    cGraphV(ctx, d, x - 270, y + h, sd)
    cGraphV(ctx, nf, x - 290, y, snf)

}

const eGraph = (ctx, x, y, color, h, tipoSuelo, vCota) => {

    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    ctx.beginPath()

    ctx.moveTo(x, y)
    
    ctx.lineTo(x + 250, y)
    ctx.lineTo(x + 250, y + h)
    ctx.lineTo(x - 250, y + h)
    ctx.lineTo(x - 250, y)
    ctx.lineTo(x, y)

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.8})`
    ctx.fill()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1
    ctx.stroke()

    achurado(ctx, Math.floor(Math.random() * 1001), 1, x, y, h)

    cGraphV(ctx, h, x + 270, y, vCota)
    text(ctx, tipoSuelo, x + 200, y + h - 10, 15)
}

const cGraphH = (ctx, h, x, y, s) => {

    ctx.beginPath()
    
    ctx.moveTo(x, y)
    ctx.lineTo(x + h/2 - 10, y)

    ctx.moveTo(x + h/2 + 10, y)
    ctx.lineTo(x + h, y)

    ctx.moveTo(x - 5, y - 5)
    ctx.lineTo(x + 5, y + 5)

    ctx.moveTo(x + h - 5, y - 5)
    ctx.lineTo(x + h + 5, y + 5)

    ctx.stroke()

    text(ctx, s, x + h/2 - 5, y + 4, 10)

}

const cGraphV = (ctx, h, x, y, s) => {

    ctx.beginPath()
    
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + h/2 - 10)

    ctx.moveTo(x, y + h/2 + 10)
    ctx.lineTo(x, y + h)

    ctx.moveTo(x - 5, y - 5)
    ctx.lineTo(x + 5, y + 5)

    ctx.moveTo(x - 5, y + h - 5)
    ctx.lineTo(x + 5, y + h + 5)

    ctx.stroke()

    text(ctx, s, x - 4, y + h/2 + 3, 10)

}

const text = (ctx, s, x, y, size) => {
    ctx.font = `${size}px Arial`
    ctx.fillStyle = 'black'
    ctx.fillText(s, x, y)
}

const achurado = (ctx, d, t, x, y, h) => {
    for (i = 1; i <= d; i++) {
        const rx = Math.random() * 500 - 250
        const ry = Math.random() * h
        ctx.fillStyle = 'black'
        ctx.fillRect(x + rx, y + ry, t, t)
    }
}

const flechaVU2D = (ctx, x, y, h, textoCarga) => {

    ctx.beginPath()
    
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + h)

    ctx.moveTo(x + 7, y + h - 7)
    ctx.lineTo(x, y + h)
    ctx.lineTo(x - 7, y + h - 7)

    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'
    ctx.stroke()

    text(ctx, textoCarga, x - 35, y - 8, 15)

}

const nivFreatico = (ctx, x, y) => {
    ctx.beginPath()
    
    ctx.moveTo(x - 250, y)
    ctx.lineTo(x + 250, y)

    ctx.strokeStyle = 'blue'
    ctx.lineWidth = 2
    ctx.stroke()

    text(ctx, 'NF', x - 240, y - 10, 15)
}

const espesor2px = (esp, px, total) => {
    return parseFloat(esp) * parseFloat(px) / parseFloat(total)
}
