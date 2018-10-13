const telegramBot = require('node-telegram-bot-api')
const token = '677335275:AAFY9z6lzMUPFJpTEz1ShAUixSjabbnKA7g'

const bot = new telegramBot(token , {polling: true})


//bot initial message
bot.on('message' , (msg) => {
    const msgText = msg.text
    if(msgText !== 'location' || msgText !== 'contact'){
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

    }
    
})

bot.on("callback_query" , (callbackQuery) =>{
    const message = callbackQuery.message 
    const menuOption = callbackQuery.data
    console.log(menuRouter(menuOption))
    console.log(actionRequest(message , menuOption))
    console.log(callbackQuery)
    // actionRequest(message , menuOption)

    if(actionRequest(message , menuOption) === undefined ){
        bot.sendMessage(message.chat.id , menuOption , {
            reply_markup: {
                inline_keyboard: menuRouter(menuOption)
            }
        })
    }
})

function actionRequest(message,actionRequest){
    let userData = {}
    userData.actionType = actionRequest
    if(actionRequest === 'safePlace' || actionRequest === 'emgServicesPoliceStation' || actionRequest === 'emgServicesHospital' || actionRequest === 'atmFnb' || actionRequest === 'atmAbsa' || actionRequest === 'atmCapitecBank' || actionRequest === 'atmStandardBank' || actionRequest === 'busTrainRoutesMyCiti' || actionRequest === 'busTrainRoutesMetroRail' || actionRequest === 'closestTaxi' || actionRequest === ''){
        bot.sendMessage(message.chat.id , "Please give us your location ", {
            reply_markup: {
                one_time_keyboard: true ,
                keyboard: [[{
                    text: "My Location",
                    request_location: true
                }] , ["Cancel"]]
            }
        })
        .then(() =>{
            bot.once("location" , (message) => {
                userData.latitude = message.location.longitude
                userData.longitude = message.location.latitude
                console.log([message.location.longitude , message.location.latitude].join(";"))
                bot.sendMessage(message.chat.id , "Please give us your number" ,{
                    reply_markup: {
                        one_time_keyboard: true,
                        keyboard: [[{
                            text: "My Phone Number",
                            request_contact: true
                        }], ["Cancel"]]
                    }
                })
                .then(() => {
                   bot.once("contact" , (message) => {
                       userData.phone_number = message.contact.phone_number
                       userData.first_name = message.contact.first_name 
                       userData.last_name = message.contact.last_name
                       console.log(message.contact.phone_number , message.contact.first_name , message.contact.last_name)
                   })
                })
            })
        })
        console.log(userData)
        actionRequestRouter(userData)
        userData = null 
        console.log(userData)

    }
}



function menuRouter(userCallback_data){
    console.log(userCallback_data)
    if(userCallback_data === 'emgServices'){
        return [[{text: 'Police Station' , callback_data: 'emgServicesPoliceStation'},
        {text: 'Hospital' , callback_data: 'emgServicesHospital'}]]

    } else if(userCallback_data === 'atm') {
        return [[{text: 'Fnb' , callback_data: 'atmFnb'} , 
        {text: 'Absa' , callback_data: 'atmAbsa'}],[
            {text: 'Capitec Bank' , callback_data: 'atmCapitecBank'},
            {text: 'Standard Bank' , callback_data: 'atmStandardBank'}
        ]]
    }else if(userCallback_data === 'busTrainRoutes'){
        return [[{text: 'MyCiti' , callback_data: 'busTrainRoutesMyCiti'},
            {text: 'MetroRail' , callback_data: 'busTrainRoutesMetroRail'}]]

    }
}

function actionRequestRouter(userData){
    const userInputData = userData
    if(userInputData.actionType === 'safePlace'){
        safePlace(userInputData)
    } else if(userInputData.actionType === 'emgServicesPoliceStation'){

        emergencyService(userInputData)
    } else if (userInputData.actionType === 'emgServicesHospital'){
        emergencyService(userInputData)
    } else if (userInputData.actionType === 'atmFnb'){
        closestAtm(userInputData)
    } else if (userInputData.actionType === 'atmAbsa'){
        closestAtm(userInputData)
    } else if (userInputData.actionType === 'atmCapitecBank'){
        closestAtm(userInputData)
    }else if (userInputData.actionType === 'busTrainRoutesMyCiti'){
        closestBusTrainStation(userInputData)
    }else if (userInputData.actionType === 'busTrainRoutesMetroRail'){
        closestBusTrainStation(userInputData)
    } else if(userInputData.actionType === 'uberRequest'){
        uberRequest(userInputData)

    }else if (userInputData.actionType === 'closestTaxi'){
        closestTaxiRank(userInputData)

    }

}

// safe place function 

function safePlace(userData){

}

// closest atm function 
function closestAtm(userData){

}


// closest emergency service
function emergencyService(userData){

}

// closest taxi rank 

function closestTaxiRank(userData){

}

// closest bus and strain station 
function closestBusTrainStation(userData){

}

// uber request 
function uberRequest(userData){

}

