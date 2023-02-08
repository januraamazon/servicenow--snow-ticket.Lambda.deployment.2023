//Author: janura@amazon.com Servicenow ticket creation Lambda

// INITIAL LOADS

'use strict';
var AWS = require('aws-sdk'),
    region = "us-east-2",
    secretName = "servicenow-dev56475",
    secret,
    decodedBinarySecret;


var axios = require("axios");
var myConfig = new AWS.Config();
myConfig.update({ region: "us-east-2" });

// INITIAL LOADS ABOVE



module.exports.create = function (event, context, callback) {
      const msgparse = JSON.parse(event.body);
      console.log('snow ticket creation started.... ' + msgparse.caller_id);


//Secrets Management connection ----STARTS HERE -------
var client = new AWS.SecretsManager({
    region: region
});

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            console.log('Data ', data);
            secret = data.SecretString;
            console.log('Secretstring ' +  secret);
            var secretvalues = JSON.parse(secret);
            console.log('secretvalues ', secretvalues);
            
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
            console.log('decodedBinarySecret ' +  decodedBinarySecret);
        }
    }
    
    // Your code goes here. 
            
            var var_snowid = secretvalues.snowid;
            var var_snowpwd = secretvalues.snowpwd;
            var var_snowurl = secretvalues.snowurl;
            console.log('SNOWURL', var_snowurl , " SNOWID", var_snowid, " SNOWPWD ", var_snowpwd);
            


//Secrets Maanager connection ----ENDS HERE -----------


console.log('Did I even come here ?');

//SNOW connection code from here - START

var requestBody = JSON.stringify({
   "short_description": msgparse.short_description + ' with Secrets',
   "description": msgparse.description + ` with secrets`,
   "impact": '3',
   "caller_id": "Anurag Jain",
   "business_service": "AWS"
});

axios.post(var_snowurl + '/api/now/table/incident',
    requestBody,
    {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(var_snowid+':'+var_snowpwd).toString('base64'),
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
});
};
