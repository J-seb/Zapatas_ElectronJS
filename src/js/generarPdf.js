const { jsPDF } = require("jspdf")
require('jspdf-autotable')

const crearPDF = () => {

    const canvas2d = document.querySelector('#canvas2d')

    let imgData2D = canvas2d.toDataURL('image/png')
    let imgData3D = cv3d

    let doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16
    });

    doc.setDrawColor('gray')
    
    doc.setFont('helvetica')
    doc.setFontSize(16)
    doc.text("ANÁLISIS DE ZAPATA", 73, 30, );

    doc.line(14, 35, 210-14, 35)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(92, 92, 92)
    doc.text('Modelamiento de zapata', 16, 45)

    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text('Vista 2D', 50, 58)

    doc.text('Vista 3D', 140, 58)

    doc.roundedRect(16, 50, 87, 78, 2, 2)

    doc.addImage(imgData2D, 'PNG', 18, 60, 83, 66, 'Zapata2D', 'NONE')

    doc.roundedRect(107, 50, 87, 78, 2, 2)

    doc.addImage(imgData3D, 'PNG', 109, 60, 83, 66, 'Zapata3D', 'NONE')

    doc.setDrawColor('gray')
    doc.line(16, 62, 103, 62)

    doc.line(107, 62, 194, 62)

    doc.line(14, 132, 210-14, 132)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(92, 92, 92)
    doc.text('Datos iniciales ingresados', 16, 142)

    let datosI = Object.values(datosIniciales)
    datosI.push(met.slice(0, 1).toUpperCase() + met.slice(1, met.length))

    doc.autoTable({
        head: [['L [m]', 'B [m]', 'IF', 'NF [m]', 'Df [m]', 'd [m]', 'Qload [ton]', 'Phi(i) [°]', 'FS', 'Metodología']],
        body: [datosI],
        startY: 148,
        styles: {
            halign: 'center',
            valign: 'middle'
        }
    })

    doc.line(14, doc.lastAutoTable.finalY + 5, 210-14, doc.lastAutoTable.finalY + 5)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(92, 92, 92)
    doc.text('Datos de suelos', 16, doc.lastAutoTable.finalY + 15)

    doc.autoTable({
        html: '#tabla-datos', 
        startY: doc.lastAutoTable.finalY + 20,
        styles: {
            halign: 'center',
            valign: 'middle'
            }
    })

    doc.line(14, doc.lastAutoTable.finalY + 5, 210-14, doc.lastAutoTable.finalY + 5)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(92, 92, 92)
    doc.text('Cálculos', 16, doc.lastAutoTable.finalY + 15)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Capacidad Portante', 16, doc.lastAutoTable.finalY + 22)

    doc.autoTable({
        html: '#tabla-resultados', 
        startY: doc.lastAutoTable.finalY + 27,
        showHead: 'firstPage',
        styles: {
            halign: 'center',
            valign: 'middle',
        },
    })

    let autFinalY = doc.lastAutoTable.finalY

    doc.autoTable({
        html: '#tabla-resultados2', 
        startY: autFinalY + 10,
        showHead: 'firstPage',
        styles: {
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
        showHead: 'firstPage',
        styles: {
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
        showHead: 'firstPage',
        styles: {
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
        showHead: 'firstPage',
        styles: {
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
        showHead: 'firstPage',
        styles: {
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
        showHead: 'firstPage',
        styles: {
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
        showHead: 'firstPage',
        styles: {
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
        showHead: 'firstPage',
        styles: {
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
        showHead: 'firstPage',
        styles: {
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 138,
            right: 16
        }
    })

    doc.setDrawColor('gray')

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Asentamientos', 16, doc.lastAutoTable.finalY + 15)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Parámetros Elásticos', 16, doc.lastAutoTable.finalY + 25)

    autFinalY = doc.lastAutoTable.finalY

    doc.autoTable({
        body: [["B'", arrayParamsElasticosB[0]]],
        startY: autFinalY + 30,
        showHead: 'firstPage',
        styles: {
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
        startY: autFinalY + 30,
        showHead: 'firstPage',
        styles: {
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 77,
            right: 77
        }
    })

    doc.autoTable({
        body: [["m'", arrayParamsElasticosB[2]]],
        startY: autFinalY + 30,
        showHead: 'firstPage',
        styles: {
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 138,
            right: 16
        }
    })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Centro', 16, doc.lastAutoTable.finalY + 10)

    doc.autoTable({
        head: [["Estrato", "n'", 'Alpha', 'A0', 'A1', 'A2', 'F1', 'F2', 'Is']],
        body: arrayParamsElasticosC,
        startY: doc.lastAutoTable.finalY + 15,
        showHead: 'firstPage',
        styles: {
            halign: 'center',
            valign: 'middle',
        },
        
    })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Esquina', 16, doc.lastAutoTable.finalY + 10)

    doc.autoTable({
        head: [["Estrato", "n'", 'Alpha', 'A0', 'A1', 'A2', 'F1', 'F2', 'Is']],
        body: arrayParamsElasticosE,
        startY: doc.lastAutoTable.finalY + 15,
        showHead: 'firstPage',
        styles: {
            halign: 'center',
            valign: 'middle',
        },
        
    })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Parámetros Consolidados', 16, doc.lastAutoTable.finalY + 10)

    doc.autoTable({
        head: [["Estrato", "Sigma 0", 'Delta Inf', 'Delta Med', 'Delta Sup', 'Delta Prom']],
        body: arrayParamsConsolidados,
        startY: doc.lastAutoTable.finalY + 15,
        showHead: 'firstPage',
        styles: {
            halign: 'center',
            valign: 'middle',
        },
        
    })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Aportes por estrato', 16, doc.lastAutoTable.finalY + 10)

    doc.autoTable({
        html: '#tabla-asentamientos', 
        startY: doc.lastAutoTable.finalY + 15,
        showHead: 'firstPage',
        showFoot: 'lastPage',
        styles: {
            halign: 'center',
            valign: 'middle',
        }
        
    })

    autFinalY = doc.lastAutoTable.finalY

    doc.autoTable({
        html: '#tabla-resultados11', 
        startY: autFinalY + 10,
        showHead: 'firstPage',
        styles: {
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
        startY: autFinalY + 10,
        showHead: 'firstPage',
        styles: {
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
        startY: autFinalY + 10,
        showHead: 'firstPage',
        styles: {
            halign: 'center',
            valign: 'middle',
        },
        margin: {
            left: 138,
            right: 16
        }
    })

    doc.line(14, doc.lastAutoTable.finalY + 5, 210-14, doc.lastAutoTable.finalY + 5)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(92, 92, 92)
    doc.text('Conclusiones', 16, doc.lastAutoTable.finalY + 15)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(message, 16, doc.lastAutoTable.finalY + 22, {
        align: "justify",
        maxWidth: 210 - 32
    })

    doc.save("a4.pdf")

}
//crearPDF()

const button = document.querySelector('#exportar')

button.addEventListener('click', () => {
    crearPDF()
})