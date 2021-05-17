const { jsPDF } = require("jspdf")
const moment = require('moment')
const path = require('path')
const fs = require('fs')
require('jspdf-autotable')
//require('../js/fonts/Roboto-Regular-Module')

const generateNewName = () => {
    const files = fs.readdirSync(__dirname)
    let arrayIndex = []
    if (files) {
        files.forEach((file) => {
            if (file.includes('zapatas')) {
                const ext = file.indexOf('.pdf')
                const num = parseInt(file.slice(7, ext))
                arrayIndex.push(num)
            }
        })
        if (arrayIndex.length > 0) {
            arrayIndex.sort((a, b) => a - b)
            return 'zapatas' + (arrayIndex[arrayIndex.length - 1] + 1).toString() + '.pdf'
        } else {
            return 'zapatas1.pdf'
        }
    }
}

const crearPDF = () => {

    // Obtener la imagen 2d y 3d
    const canvas2d = document.querySelector('#canvas2d')

    // Recordemos que cv3d ya existe y cambia su valor cada que se mueva la imagen
    let imgData2D = canvas2d.toDataURL('image/png')
    let imgData3D = cv3d

    // Creamos un nuevo documento jsPDF con las características mencionadas
    let doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16
    });

    const time = new Date().getTime()
    const date = moment(time).format('DD/MM/YYYY hh:mm a')

    // Ingresamos y cargamos las fonts previamente convertidas de ttf a base64 ubicadas en
    // js/fonts

    let fontUsed = "Roman10"

    doc.addFileToVFS("LM-Roman-10-Regular.ttf", lmRomanFont)
    doc.addFont("LM-Roman-10-Regular.ttf", "Roman10", "normal")

    doc.addFileToVFS("LM-Roman-10-Regular-Bold.ttf", lmRomanFontBold)
    doc.addFont("LM-Roman-10-Regular-Bold.ttf", "Roman10", "bold")

    doc.addFileToVFS("Montserrat-Regular.ttf", montserratFont)
    doc.addFont("Montserrat-Regular.ttf", "Montserrat", "normal")

    doc.addFileToVFS("Montserrat-Regular-Bold.ttf", montserratFontBold)
    doc.addFont("Montserrat-Regular-Bold.ttf", "Montserrat", "bold")

    doc.addFileToVFS("Roboto-Regular.ttf", robotoFont)
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal")

    // Seleccionamos la fuente que vamos a usar, en este caso tomamos Montserrat en su forma
    // Regular y Bold

    doc.setFont(fontUsed);

    // Configuramos el color para hacer las lineas y cuadriláteros en el pdf

    doc.setDrawColor('gray')

    // Configuramos color de encabezado de pdf

    let colorHead = [66, 66, 66]
    
    // Configuramos el tamaño de letra para fecha y titulo título

    doc.setFontSize(8)
    doc.setTextColor(0)
    doc.text('Fecha y hora de reporte: ' + date, 135, 32)
    
    doc.setFontSize(16)
    doc.setTextColor(0)
    doc.text("CÁLCULO CAPACIDAD PORTANTE Y ASENTAMIENTOS", 27, 23);

    doc.rect(14, 14, 210-28, 297-28)

    doc.line(14, 28, 210-14, 28)

    doc.setFontSize(14)
    doc.text("Resultados", 95, 40);

    doc.setFontSize(12)
    //doc.setTextColor(92, 92, 92)
    doc.setFont(fontUsed, 'bold')
    doc.text('Modelamiento de zapata', 16, 45)

    doc.setFontSize(14)
    //doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.setFont(fontUsed, 'normal')
    doc.text('Vista 2D', 50, 58)

    doc.text('Vista 3D', 140, 58)

    doc.roundedRect(16, 50, 87, 78, 2, 2)

    doc.addImage(imgData2D, 'PNG', 18, 60, 83, 66, 'Zapata2D', 'NONE')

    doc.roundedRect(107, 50, 87, 78, 2, 2)

    doc.addImage(imgData3D, 'PNG', 109, 60, 83, 66, 'Zapata3D', 'NONE')

    //doc.setDrawColor('gray')
    doc.line(16, 62, 103, 62)

    doc.line(107, 62, 194, 62)

    doc.line(14, 132, 210-14, 132)

    doc.setFontSize(12)
    doc.setFont(fontUsed, 'bold')
    //doc.setTextColor(92, 92, 92)
    doc.text('Condiciones de carga - Geometría - Nivel Freático', 16, 142)

    let datosI = Object.values(datosIniciales)
    datosI.push(met.slice(0, 1).toUpperCase() + met.slice(1, met.length))

    doc.setFont(fontUsed, 'normal')
    doc.autoTable({
        head: [['L [m]', 'B [m]', 'NF [m]', 'Df [m]', 'Qload [ton]', 'FS', 'Phi(i) [°]', 'Metodología']],
        body: [datosI],
        startY: 148,
        headStyles: {
            fillColor: colorHead
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle'
        },
        margin: {
            left: 16,
            right: 16
        }
    })
    doc.setDrawColor('gray')
    doc.line(14, doc.lastAutoTable.finalY + 5, 210-14, doc.lastAutoTable.finalY + 5)

    doc.setFontSize(12)
    doc.setFont(fontUsed, 'bold')
    //doc.setTextColor(92, 92, 92)
    doc.text('Perfil Geotécnico', 16, doc.lastAutoTable.finalY + 15)

    doc.autoTable({
        html: '#tabla-datos', 
        startY: doc.lastAutoTable.finalY + 20,
        headStyles: {
            fillColor: colorHead
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle'
        },
        margin: {
            left: 16,
            right: 16
        }
    })
    doc.setDrawColor('gray')
    doc.line(14, doc.lastAutoTable.finalY + 5, 210-14, doc.lastAutoTable.finalY + 5)

   /*  doc.setFontSize(14)
    doc.setFont(fontUsed, 'normal')
    //doc.setTextColor(92, 92, 92)
    doc.text('Resultados', 90, doc.lastAutoTable.finalY + 15)
 */
    doc.setFontSize(12)
    doc.setFont(fontUsed, 'bold')
    doc.text('Análisis de Capacidad Portante', 72, doc.lastAutoTable.finalY + 15)

    doc.autoTable({
        html: '#tabla-resultados', 
        startY: doc.lastAutoTable.finalY + 22,
        showHead: 'firstPage',
        headStyles: {
            fillColor: colorHead
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 16,
            right: 16
        }
    })

    let autFinalY = doc.lastAutoTable.finalY

    doc.autoTable({
        html: '#tabla-resultados2', 
        startY: autFinalY + 10,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 16,
            right: 138
        }
    })

    doc.autoTable({
        html: '#tabla-resultados3', 
        startY: autFinalY + 10,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 77,
            right: 77
        }
    })

    doc.autoTable({
        html: '#tabla-resultados4', 
        startY: autFinalY + 10,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 138,
            right: 16
        }
    })

    autFinalY = doc.lastAutoTable.finalY

    doc.autoTable({
        html: '#tabla-resultados5', 
        startY: autFinalY + 10,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 16,
            right: 138
        }
    })

    doc.autoTable({
        html: '#tabla-resultados6', 
        startY: autFinalY + 10,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 77,
            right: 77
        }
    })

    doc.autoTable({
        html: '#tabla-resultados7', 
        startY: autFinalY + 10,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 138,
            right: 16
        }
    })

    autFinalY = doc.lastAutoTable.finalY

    doc.autoTable({
        html: '#tabla-resultados8', 
        startY: autFinalY + 5,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 16,
            right: 138
        }
    })

    doc.autoTable({
        html: '#tabla-resultados9', 
        startY: autFinalY + 5,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 77,
            right: 77
        }
    })

    doc.autoTable({
        html: '#tabla-resultados10', 
        startY: autFinalY + 5,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 138,
            right: 16
        }
    })

    doc.setDrawColor('gray')
    doc.line(14, doc.lastAutoTable.finalY + 5, 210-14, doc.lastAutoTable.finalY + 5, 'DF')
    doc.rect(14, 14, 210-28, 297-28)

    doc.setFontSize(12)
    doc.setFont(fontUsed, 'bold')
    doc.text('Cálculo de Asentamientos', 75, doc.lastAutoTable.finalY + 15)

    //doc.setFontSize(12)
    //doc.setFont('helvetica', 'normal')
    doc.text('Asentamientos Elásticos', 16, doc.lastAutoTable.finalY + 25)

    autFinalY = doc.lastAutoTable.finalY

    doc.autoTable({
        body: [["B'", arrayParamsElasticosB[0]]],
        startY: autFinalY + 35,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 16,
            right: 138
        }
    })

    doc.autoTable({
        body: [["L'", arrayParamsElasticosB[1]]],
        startY: autFinalY + 35,
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 77,
            right: 77
        }
    })

    doc.setFontSize(12)
    doc.setFont(fontUsed , 'bold')
    doc.text('Asentamientos en centro', 16, doc.lastAutoTable.finalY + 15)

    doc.autoTable({
        head: [["Estrato", "If", "m'", "n'", 'Alpha', 'A0', 'A1', 'A2', 'F1', 'F2', 'Is']],
        body: arrayParamsElasticosC,
        startY: doc.lastAutoTable.finalY + 20,
        headStyles: {
            fillColor: colorHead
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 16,
            right: 16
        }
        
    })

    doc.setFontSize(12)
    doc.setFont(fontUsed, 'bold')
    doc.text('Asentamientos en esquinas', 16, doc.lastAutoTable.finalY + 15)

    doc.autoTable({
        head: [["Estrato", "If", "m'", "n'", 'Alpha', 'A0', 'A1', 'A2', 'F1', 'F2', 'Is']],
        body: arrayParamsElasticosE,
        startY: doc.lastAutoTable.finalY + 20,
        headStyles: {
            fillColor: colorHead
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 16,
            right: 16
        }
    })

    doc.setFontSize(12)
    doc.setFont(fontUsed, 'bold')
    doc.text('Parámetros Consolidados', 16, doc.lastAutoTable.finalY + 15)

    doc.autoTable({
        head: [["Estrato", "Sigma 0", 'Delta Inf', 'Delta Med', 'Delta Sup', 'Delta Prom']],
        body: arrayParamsConsolidados,
        startY: doc.lastAutoTable.finalY + 20,
        showHead: 'firstPage',
        headStyles: {
            fillColor: colorHead
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 16,
            right: 16
        }
    })

    doc.setFontSize(12)
    doc.setFont(fontUsed, 'bold')
    doc.text('Asentamientos por estrato', 16, doc.lastAutoTable.finalY + 15)

    doc.autoTable({
        html: '#tabla-asentamientos', 
        startY: doc.lastAutoTable.finalY + 20,
        showHead: 'firstPage',
        showFoot: 'lastPage',
        headStyles: {
            fillColor: colorHead
        },
        footStyles: {
            fillColor: colorHead
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 16,
            right: 16
        }
    })

    autFinalY = doc.lastAutoTable.finalY

    doc.autoTable({
        html: '#tabla-resultados11', 
        startY: autFinalY + 15,
        showHead: 'firstPage',
        pageBreak: 'avoid',
        rowPageBreak: 'avoid',
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 16,
            right: 138
        }
    })

    doc.autoTable({
        html: '#tabla-resultados12', 
        startY: autFinalY + 15,
        showHead: 'firstPage',
        pageBreak: 'avoid',
        rowPageBreak: 'avoid',
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 77,
            right: 77
        }
    })

    doc.autoTable({
        html: '#tabla-resultados13', 
        startY: autFinalY + 15,
        showHead: 'firstPage',
        pageBreak: 'avoid',
        rowPageBreak: 'avoid',
        columnStyles: {
            0: { fillColor: colorHead, textColor: 255},
        },
        styles: {
            font: fontUsed,
            fontStyle: 'normal',
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 138,
            right: 16
        }
    })

    doc.setDrawColor('gray')
    doc.line(14, doc.lastAutoTable.finalY + 5, 210-14, doc.lastAutoTable.finalY + 5, 'DF')

    doc.setFontSize(14)
    doc.setFont(fontUsed, 'bold')
    doc.text('Conclusiones', 16, doc.lastAutoTable.finalY + 15)

    doc.setFontSize(10)
    doc.setFont(fontUsed, 'normal')
    doc.text('Capacidad', 16, doc.lastAutoTable.finalY + 23)

    doc.setFontSize(10)
    doc.text(message[0], 16, doc.lastAutoTable.finalY + 28, {
        align: "justify",
        maxWidth: 210 - 32
    })

    doc.setFontSize(10)
    doc.setFont(fontUsed, 'normal')
    doc.text('Asentamientos:', 16, doc.lastAutoTable.finalY + 45)

    doc.setFontSize(10)
    doc.text(message[1], 16, doc.lastAutoTable.finalY + 50, {
        align: "justify",
        maxWidth: 210 - 32
    })

    doc.setFontSize(10)
    doc.setFont(fontUsed, 'normal')
    doc.text('NOTA:', 16, doc.lastAutoTable.finalY + 67)

    doc.setFontSize(10)
    doc.text(message[2], 16, doc.lastAutoTable.finalY + 72, {
        align: "justify",
        maxWidth: 210 - 32
    })

    doc.rect(14, 14, 210-28, doc.lastAutoTable.finalY + 78)

    doc.save(generateNewName())

}


const button = document.querySelector('#exportar')

button.addEventListener('click', () => {
    crearPDF()
})
