//Author: janura@amazon.com Servicenow ticket creation Lambda

// INITIAL LOADS

'use strict';
var AWS = require("aws-sdk");
var axios = require("axios");
var myConfig = new AWS.Config();
myConfig.update({ region: "us-east-2" });

// INITIAL LOADS ABOVE



module.exports.create = function (event, context, callback) {
      const msgparse = JSON.parse(event.body);
      console.log('snow ticket creation started.... ' + msgparse.caller_id);

//SNOW connection code from here - START

var requestBody = JSON.stringify({
   "short_description": msgparse.short_description,
   "description": msgparse.description,
   "impact": '3',
   "caller_id": "Anurag Jain",
   "business_service": "AWS"
});

axios.post('https://dev56475.service-now.com/api/now/table/incident',
    requestBody,
    {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + Buffer.from('admin'+':'+'Dil1990$Wale1991!').toString('base64'),
            // 'Authorization': 'Basic '+btoa('admin'+':'+'admin'),
        }
    })
    .then(function (reqresponse) {
        console.log(reqresponse.data.result);
        var incident_number = reqresponse.data.result.number; 
        console.log('Ticket number is ' +  incident_number);
        const response = {
        statusCode: 201,
        body: JSON.stringify({message: `Created Servicenow ticket : ${incident_number}`,
                      statuscode: 201,
                      status: `ticket created`
   }),
  };

  callback(null, response);
       
    })
    .catch(function (error) {
        console.log("===========********========= ERROR ===========********=========", error);
        const response = {
        statusCode: 401,
        body: JSON.stringify({message: `ERR: creating ticket`,
                      statuscode: 401,
                      status: `FAILED`
   }),
  };

  callback(null, response);
});



//SNOW CONNECTION CODE ----ENDS HERE ----


   
  // This is the response back as JSON
  
};
