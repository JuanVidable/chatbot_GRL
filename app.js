const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flujoFinal = addKeyword(EVENTS.ACTION).addAnswer("Se canceló ésta conversación por inactividad. Para volver a activarla simplemente escribe un mensaje.")

const flowMenu = addKeyword('volver', 'bolver', 'volber', 'volvr')
.addAnswer(
    [
        '¿Cómo prefieres continuar? Por favor escriba a continuación un número',
        '',
        '1️⃣ Conocer detalles del proyecto',
        '2️⃣ Opciones de inversión',
        '3️⃣ Proyecciones de rentabilidad (ROI)',
        '4️⃣ Otras consultas, asesor comercial'
    ],
    {capture:true},
    async (ctx, {gotoFlow, fallBack}) => {
        if(ctx.body>4 || ctx.body<1){
            return fallBack('Respuesta Inválida, intente nuevamente ingresando un solo número, por ejemplo 1.')
        }
        if(ctx.body==1){
            return gotoFlow(flowDetalles)
        }
        if(ctx.body==2){
            return gotoFlow(flowOportunidades)
        }if(ctx.body==3){
            return gotoFlow(flowRentabilidad)
        }if(ctx.body==4){
            return gotoFlow(flowAsesor)
        }else{
            return fallBack('Respuesta Inválida, intente nuevamente ingresando un solo número, por ejemplo 1.')
        }
    }
    
)


const flowDetalles = addKeyword('1')
    .addAnswer(['En Grand Reserve Lodges, ofrecemos una experiencia de lujo sin igual en una de las regiones vitivinícolas más exclusivas del mundo: el Valle de Uco, ubicado en Mendoza, Argentina.',
        '',
        '🔹 Suites de lujo: diseñadas para garantizar privacidad y vistas inigualables a los viñedos y la Cordillera de los Andes.',
        '🔹 Estilo único: combinamos la sofisticación con la autenticidad para ofrecer una estancia premium en un entorno natural impresionante.',
        '🔹 Alojamiento exclusivo: orientado a turistas que buscan exclusividad, confort y lujo.',
        '🔹 Desarrollo exclusivo: 30 módulos habitacionales, diseñados para fundirse en armonía con el paisaje. Una experiencia que redefinirá el concepto de hotel boutique en el Valle de Uco.',
    ]
    )
    .addAnswer(
        'Para volver al menú principal escribe *volver*',
        null,
        null,
        [flowMenu]
    )

    const flowOportunidades = addKeyword('2')
    .addAnswer(['Grand Reserve Lodges te ofrece la oportunidad de ser parte de una operación hotelera de lujo, rentable y en crecimiento.',
        '',
        '🔹 Propiedad de suites: a través de nuestro modelo de Condo hotel.',
        '🔹 Inversión inicial: a partir de USD 150,000.',
        '🔹 Rentabilidad asegurada: con participación directa en los ingresos del hotel, gracias a una administración eficiente. 📈 contamos con el management de empresas líderes en Hoteles.',
    ]
    )
    .addAnswer(
        'Para volver al menú principal escribe *volver*',
    null,
    null,
    [flowMenu]
    )

    const flowRentabilidad = addKeyword('3')
    .addAnswer(['Tu inversión en Grand Reserve Lodges proyecta una rentabilidad anual del 15% al 18%, basada en una ocupación estimada del 60% (donde los años anteriores como 2023 fue del 80%)',
        '',
        '🔹 Tarifas: entre USD 250 y USD 400 por noche, dependiendo de la temporada y demanda.',
        '🔹 Crecimiento del turismo: el turismo enológico en Mendoza está en constante crecimiento. En 2023, la región recibió más de 3.8 millones de visitantes, con una proyección de aumento del 20% para 2024.'
    ])
    .addAnswer(
        'Para volver al menú principal escribe *volver*',
    null,
    null,
    [flowMenu]
    )

    const flowAsesor = addKeyword('4')
    .addAnswer([
        'Un asesor comercial se estará comunicando lo antes posible para darte más información sobre nuestro proyecto'
    ])
    .addAnswer(
        'Para volver al menú principal escribe *volver*',
    null,
    null,
    [flowMenu]
    )

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer(
        [
            'Bienvenido/a a Grand Reserve Lodges, donde el lujo y las experiencias se fusionan en el corazón del Valle de Uco, Mendoza. 🍇🍷',
            '',
            'Soy tu asistente virtual y estoy aquí para brindarte toda la información sobre esta exclusiva oportunidad de inversión en nuestros hoteles.',
            '',
            'Primero antes de empezar, ¿Podrías indicarme tu nombre?'
        ],
        {capture:true},
        async (ctx, {flowDynamic, state}) =>{
            await state.update({name: ctx.body})
            await flowDynamic('¡Gracias por tus datos!')
        }
    )
    .addAnswer(
    [
        '¿Cómo prefieres continuar? Por favor escriba a continuación un número',
        '',
        '1️⃣ Conocer detalles del proyecto',
        '2️⃣ Opciones de inversión',
        '3️⃣ Proyecciones de rentabilidad (ROI)',
        '4️⃣ Otras consultas, asesor comercial'
    ],
    {capture:true},
    async (ctx, {gotoFlow, fallBack}) => {
        if(ctx.body>4 || ctx.body<1){
            return fallBack('Respuesta Inválida, intente nuevamente ingresando un solo número, por ejemplo 1.')
        }
        if(ctx.body==1){
            return gotoFlow(flowDetalles)
        }
        if(ctx.body==2){
            return gotoFlow(flowOportunidades)
        }if(ctx.body==3){
            return gotoFlow(flowRentabilidad)
        }if(ctx.body==4){
            return gotoFlow(flowAsesor)
        }else{
            return fallBack('Respuesta Inválida, intente nuevamente ingresando un solo número, por ejemplo 1.')
        }
    }
)




const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowMenu, flowDetalles, flowRentabilidad, flowOportunidades])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
