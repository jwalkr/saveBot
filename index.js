const telegramBot = require('node-telegram-bot-api')
const token = '677335275:AAFY9z6lzMUPFJpTEz1ShAUixSjabbnKA7g'

const bot = new telegramBot(token , {polling: true})

//Google Places

const  GooglePlaces = require('node-googleplaces') ;
const  map = require('google_directions');
 
const places = new GooglePlaces('AIzaSyD_nm-KcgETF1MQZfiX2uxHcWa1PLNf4mo');

//Message Notification
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let userInfomation = {}

const latitude = '-11.406255'
const longitude = '20.659324'
const number = '27734757309'



//bot initial message
bot.on('message' , (msg) => {
    const msgText = msg.text
    if(msgText !== 'location' || msgText !== 'contact'){
        bot.sendMessage(msg.chat.id , 'Hey I am DaaiBot , How can help you' , {
            reply_markup: {
                inline_keyboard: [[
                    {text: 'Safe Place' , callback_data: 'safePlace'},
                    {text: 'ATM' , callback_data: 'atm'},
                    
                ] , [
                    // {text: 'Closest Taxi' , callback_data: 'closestTaxi'},
                    
                    {text: 'Emergency Services' , callback_data: 'emgServices'}
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

    userInfomation.actionType = actionRequest
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
                userInfomation.latitude = message.location.longitude
                userInfomation.longitude = message.location.latitude
                console.log(userInfomation)
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
                    console.log(userInfomation)
                    userInfomation.phone_number = message.contact.phone_number
                    userInfomation.first_name = message.contact.first_name 
                    userInfomation.last_name = message.contact.last_name
                    console.log(userInfomation)

                    handleBotService(userInfomation)
                       console.log(message.contact.phone_number , message.contact.first_name , message.contact.last_name)
                   })
                })
                
            })
            
        })
        console.log(userInfomation)
        
        

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
    
    // console.log(userInputData)
    if(userData.actionType === 'safePlace'){
        console.log(userInputData)
        safePlace(userInputData)
    } 
    else if(userInputData.actionType === 'emgServicesPoliceStation'){

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


//RewriteFunction

function handleBotService(userData)
{

    if(userData.actionType == 'safePlace')
    {

        let placeParams = {
            location: latitude + ","+ longitude,
    
            types: 'Petrol Station',
    
            radius: 1000
    
        }

        places.nearbySearch(placeParams,(err, res) => {
            

            //Send SMS
    
            // getDirectionsSteps(res.body.results[0].vicinity,placeParams.location);
            sendNotification('Your directions shall be sent to you shortly' , number);
    
          });
      

    }else if(userData.actionType ==  'emgServicesHospital')
    {

        let placeParams = {
            location: latitude + ","+ longitude,
    
            types: 'doctors',
    
            radius: 1000
    
        }


        places.nearbySearch(placeParams,(err, res) => {
            

            //Send SMS
           
            sendNotification('Your directions shall be sent to you shortly' , number);
    
          });


    }else if(userData.actionType == 'emgServicesPoliceStation')
    {


        let placeParams = {
            location: latitude + ","+ longitude,
    
            types: 'Police Station',
    
            radius: 1000
    
        }

        places.nearbySearch(placeParams,(err, res) => {
            

            //Send SMS
           
            sendNotification('Your directions shall be sent to you shortly' , number);
    
          });


    }else if(userData.actionType == 'atmFnb')
    {

        let placeParams = {
            location: latitude + ","+ longitude,
    
            types: 'atm',
    
            radius: 1000
    
        }

        places.nearbySearch(placeParams,(err, res) => {
            

            //Send SMS
            sendNotification('Your directions shall be sent to you shortly' , number);
    
          });


    }


}

// safe place function 

function safePlace(userData){
    console.log(userData)

    let placeParams = {
        location: userData.latitude+","+userData.longitute,

        types: 'Petrol Station',

        radius: 1000

    }

    console.log(userData)

    //Locate the safest place
    places.nearbySearch(placeParams,(err, res) => {
        console.log(res.body.results);
        //get the list od steps required to go to the destination
        // getDirectionsSteps(res.body.results[0].vicinity,placeParams.location);
        // //get the distance of the place
        // getDistance(res.body.results[0].vicinity,placeParams.location);
       

      });

}

// closest atm function 
function closestAtm(userData){

    let placeParams = {
        location: userData.latitude+","+userData.longitute,
        types: 'atm',
        radius: 1000

    }

    //Locate the safest place
    places.nearbySearch(placeParams,(err, res) => {
       
        //get the list od steps required to go to the destination
        getDirectionsSteps(res.body.results[0].vicinity,placeParams.location);
        //get the distance od the place
        getDistance(res.body.results[0].vicinity,placeParams.location);
        
        
      });

}




// closest emergency service
function emergencyService(userData){

    let placeParams= {};

    if(userData.actionType =='emgServicesHospital' )
   {

        placeParams = {
           location: userData.latitude+","+userData.longitute,
           types: 'doctors',
           radius: 1000
   
       }



   }else if(userData.actionType =='emgServicesPoliceStation')
   {

       placeParams = {
           location: userData.latitude+","+userData.longitute,
           types: 'Police',
           radius: 1000
   
       }


   }

//Locate the emergency place
places.nearbySearch(placeParams,(err, res) => {

   //get the list od steps required to go to the destination
   
   getDirectionsSteps(res.body.results[1].vicinity,placeParams.location);
   //get the distance od the place
   getDistance(res.body.results[1].vicinity,placeParams.location);
   
   
 });

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


function sendNotification(messageContent,userNumber)
{


        var xhr = new XMLHttpRequest(),
            body = JSON.stringify({
                "content": messageContent,
                "to": [userNumber]
            });
         xhr.open("POST", 'https://platform.clickatell.com/messages', true);
         xhr.setRequestHeader("Content-Type", "application/json");
         xhr.setRequestHeader("Authorization", "ewBVar0-TOOwdDYwjO1PUg==");
         xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('success');
            }
         };
         
         xhr.send(body);

}



//Additional Information on places


//get detailed steps to your destination
function getDirectionsSteps(destination,userLatLong)
{

    let  params = {
    
        origin: userLatLong,
        destination: destination,
        key: "AIzaSyD_nm-KcgETF1MQZfiX2uxHcWa1PLNf4mo",
     
    };
    map.getDirectionSteps(params, function (err, steps){
        if (err) {
            console.log(err);
            return 1;
        }
     
        // parse the JSON object of steps into a string output
        var output="";
        var stepCounter = 1;
        steps.forEach(function(stepObj) {
            var instruction = stepObj.html_instructions;
            instruction = instruction.replace(/<[^>]*>/g, ""); // regex to remove html tags
            var distance = stepObj.distance.text;
            var duration = stepObj.duration.text;
            output += "Step " + stepCounter + ": " + instruction + " ("+ distance +"/"+ duration+")\n";
            stepCounter++;
        });	
        console.log(output);
    });



}

//get distance in km's
function getDistance(destination,userLatLong)
{

    let  params = {
    
        origin: userLatLong,
        destination: destination,
        key: "AIzaSyD_nm-KcgETF1MQZfiX2uxHcWa1PLNf4mo",
     
    };

    map.getDistance(params, function (err, data) {
        if (err) {
            console.log(err);
            return 1;
        }
        console.log(data)
    });

}


