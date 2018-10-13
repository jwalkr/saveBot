const telegramBot = require('node-telegram-bot-api')
const token = '677335275:AAFY9z6lzMUPFJpTEz1ShAUixSjabbnKA7g'

const bot = new telegramBot(token , {polling: true})


//bot initial message
bot.on('message' , (msg) => {
    bot.sendMessage(msg.chat.id , 'Hey I am DaaiBot , How can help you' , {
        reply_markup: {
            inline_keyboard: [[
                {text: 'Safe Place' , callback_data: 'safePlace'},
                {text: 'Emergency Services' , callback_data: 'emgServices'},
                
            ] , [
                {text: 'Closest Taxi' , callback_data: 'closestTaxi'},
                {text: 'ATM' , callback_data: 'atm'}
                ] ,[{text: 'Bus & Train Routes' , callback_data: 'busTrainRoutes'},
                {text: 'Uber Request' , callback_data: 'uberRequest'}

                ]]
        }
    })
})

bot.on("callback_query" , (callbackQuery) =>{
    const message = callbackQuery.message 
    const menuOption = callbackQuery.data
    console.log(menuRouter(menuOption))
    console.log(callbackQuery)

    if(menuOption !== undefined){
        bot.sendMessage(message.chat.id , menuOption , {
            reply_markup: {
                inline_keyboard: menuRouter(menuOption)
            }
        })
    }
})



function menuRouter(userCallback_data){
    if(userCallback_data === 'emgServices'){
        return [[{text: 'Police Station' , callback_data: 'emgServicesPoliceStation'},
        {text: 'Hospital' , callback_data: 'emgServicesHospital'}]]

    } else if(userCallback_data === 'atm') {
        return [[{text: 'Fnb' , callback_data: 'atmFnb'} , 
        {text: 'Absa' , callback_data: 'atmAbsa'}],[
            {text: 'Capitec Bank' , callback_data: 'atmCapitcBank'},
            {text: 'Standard Bank' , callback_data: 'atmStandardBank'}
        ]]
    }else if(userCallback_data === 'busTrainRoutes'){
        return [[{text: 'MyCiti' , callback_data: 'busTrainRoutes'},
            {text: 'MetroRail' , callback_data: 'busTrainRout'}]]

    }
}