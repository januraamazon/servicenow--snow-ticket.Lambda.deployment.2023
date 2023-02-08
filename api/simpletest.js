// INITIAL LOADS

'use strict';
var AWS = require("aws-sdk");
var myConfig = new AWS.Config();
myConfig.update({ region: "us-east-2" });

// INITIAL LOADS ABOVE

//------------------------------------------------------------------------------
//QLDB Table create

module.exports.create = function (event, context, callback) {
      const msgparse = JSON.parse(event.body);
      console.log('snow ticket start ' + msgparse.caller_id);



    //qldb code ends here
  // This is the response back as JSON
  const response = {
    statusCode: 201,
   body: JSON.stringify({message: `Created fake ticket ${msgparse.caller_id}`,
                      statuscode: 201,
                      status: `table created`
   }),
  };

  callback(null, response);
};
