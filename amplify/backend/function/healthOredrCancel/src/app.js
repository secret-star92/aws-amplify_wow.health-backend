/* Amplify Params - DO NOT EDIT
	API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
	API_HEALTHBACKEND_ORDERPRODUCTTABLE_ARN
	API_HEALTHBACKEND_ORDERPRODUCTTABLE_NAME
	API_HEALTHBACKEND_ORDERTABLE_ARN
	API_HEALTHBACKEND_ORDERTABLE_NAME
	API_HEALTHBACKEND_PAYMENTTABLE_ARN
	API_HEALTHBACKEND_PAYMENTTABLE_NAME
	API_HEALTHBACKEND_PRODUCTINVENTORYTABLE_ARN
	API_HEALTHBACKEND_PRODUCTINVENTORYTABLE_NAME
	API_HEALTHBACKEND_PRODUCTTABLE_ARN
	API_HEALTHBACKEND_PRODUCTTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT //

/* Amplify Params - DO NOT EDIT
	API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const GRAPHQL_ENDPOINT = process.env.API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT;
const fetch = require("node-fetch");
const Request = fetch.Request;

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const json = require("body-parser/lib/types/json");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/**********************
 * Example get method *
 **********************/

app.get("/unicommerce/orders/cancel", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

app.get("/unicommerce/orders/cancel/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/
// {
//   "orderId": "ORD_5n2p6ikgy0d",
//   "orderItems": [
//     {
//       "orderItemId": "63a94dd7856cfb002918dc8b",
//       "productId": "634e478a9891c30029e92561",
//       "variantId": "634e478a9891c30029e92561",
//       "quantity": 1
//     }
//   ]
// }

// {
//   "data": {
//     "getOrder": {
//       "id": "cbe7a054-c9a4-480c-b19f-db70c986b4f6",
//       "status": "PROCESSING",
//       "products": {
//         "items": [
//           {
//             "id": "28104027-ba24-4549-a06e-e9c4f8979fd2",
//             "productId": "3c6e104b-3835-4aee-b1f5-b6cd0642da69",
//             "variantId": null
//           },
//           {
//             "id": "11229b47-0d1e-4d3e-bca9-0aee2c30e455",
//             "productId": "3c6e104b-3835-4aee-b1f5-b6cd0642da65",
//             "variantId": null
//           }
//         ]
//       }
//     }
//   }
// }

// {
//   "status": "SUCCESS",
//   "orderItems": [
//     {
//       "orderItemId": "string",
//       "errorMessage": "order Item Id not available"
//     }
//   ]
// }

async function deleteOrderItem(id) {
  const params = {
    TableName: process.env.API_HEALTHBACKEND_ORDERPRODUCTTABLE_NAME,
    Key: {
      id: id,
    },
    ReturnValues: "ALL_OLD",
  };
  try {
    let deleteStatus = await docClient.delete(params).promise();

    console.log(
      `🚀 ~ file: app.js:129 ~ deleteOrderItem ~ deleteStatus:`,
      JSON.stringify(await deleteStatus)
    );

    return await deleteStatus;
  } catch (err) {
    console.log("deletePinPost failed catch", err.message);
    return { code: 500, message: "Something failed!" };
  }
}

async function deleteOrder(id) {
  const params = {
    TableName: process.env.API_HEALTHBACKEND_ORDERTABLE_NAME,
    Key: {
      id: id,
    },
  };
  try {
    let abc = await docClient.delete(params).promise();
    console.log(
      "🚀 ~ file: app.js:146 ~ deleteOrder ~ abc",
      JSON.stringify(id)
    );
    return { code: 200, message: "Order deleted successfully" };
  } catch (err) {
    console.log("🚀 ~ file: app.js:148 ~ deleteOrder ~ err", err);
    return { code: 500, message: "Something failed!" };
  }
}

async function getOrder(orderId){
  let query = 
  `query MyQuery {
      byorderIdcreatedAtPayment(orderId: "${orderId}") {
        items {
          id
        }
      }
    }`
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': GRAPHQL_API_KEY,
    },
    body: JSON.stringify({
      query: query,     
    }),
  };
  console.log(`🔥 ~ file: app.js:94 ~ //searchProducts ~ options`, options);

  const request = new Request(GRAPHQL_ENDPOINT, options);

  try {
   const response = await fetch(request);
    const body = await response.json();

    console.log(`🚀 ~ file: app.js:189 ~ getOrder ~ body:`, JSON.stringify(body))

    // if (body.errors) statusCode = 400;
    //   {
//     "data": {
//         "byorderIdcreatedAtPayment": {
//             "items": [
//                 {
//                     "id": "98ca9c5e-2dea-4b93-bfeb-99ba91e73bec"
//                 }
//             ]
//         }
//     }
// }

    return await body?.data?.byorderIdcreatedAtPayment?.items?.length > 0 ? true : false
  } catch (error) {
    console.log("🚀 ~ file: app.js:223 ~ //searchProducts ~ error", error)
    
  }
}

app.post("/unicommerce/orders/cancel", async function (req, res) {
  // Add your code here

  const bodyData = req.body;

  console.log(`🚀 ~ file: app.js:158 ~ bodyData:`, JSON.stringify(bodyData));

  let orderId = req.body?.orderId;

  let orderItems = req.body?.orderItems ? req.body?.orderItems : [];

  let successStatus = {
    failed: false,
    success: false,
  };

  let deletedOrderItemsStatus = [];

  let sendResponse = {
    status:
      successStatus?.success && !successStatus?.failed
        ? "SUCCESS"
        : successStatus?.success && successStatus?.failed
        ? "PARTIAL_SUCCESS"
        : "FAILED",

    orderItems: [
      {
        // "orderItemId": null,
        // "errorMessage": "order Item Id not available"
      },
    ],
  };

  console.log(
    `🚀 ~ file: app.js:184 ~ orderItems?.length:`,
    orderItems?.length
  );
  if (orderItems?.length > 0) {
    // orderItems.map(async (data, i) => {
    //   const result = await deleteOrderItem(data.orderItemId);
    //   console.log("🚀 ~ file: app.js:166 ~ orderItems.map ~ result", result);
    // });

    await Promise.all(
      orderItems.map(async (data, i) => {
        try {
          const result = await deleteOrderItem(data.orderItemId);

          //   {
          //     "Attributes": {
          //         "quantity": 1,
          //         "__typename": "OrderProduct",
          //         "totalPrice": 1999,
          //         "orderId": "158ef6ea-34cd-4ee1-9b7c-ff9a3756fa0d",
          //         "updatedAt": "2023-02-27T16:56:15.197Z",
          //         "variantId": "43535345418498",
          //         "price": 1999,
          //         "id": "2369940e-443b-4f12-8ce9-e895b27b1fd0sh1",
          //         "productId": "7937649869058",
          //         "title": "WOW Life Science Plant Based Protein Powder - Cafe Mocha Flavour - 1kg test"
          //     }
          // }

          console.log(
            `🚀 ~ file: app.js:238 ~ orderItems.map ~ await result?.Attributes?.id:`,
            await result?.Attributes?.id
          );

          const isDeleted = (await result?.Attributes?.id) ? true : false;

          if (await result?.Attributes?.id) {
            successStatus["success"] = true;

            // After Delete check

            //after delete get  orderProduct
            //byorderIdcreatedAtPayment >> paramer >> orderID

            // item >> length >>  nothing to do
            // count 0 >>if delete order

            // let isOrderExists = orderId && await getOrder(orderId)

            // console.log(`🚀 ~ file: app.js:282 ~ orderItems.map ~ isOrderExists:`, isOrderExists)

            
          } else {
            successStatus["failed"] = true;
          }

          const generateCustomResponse = {
            orderItemId: data.orderItemId,
            errorMessage: isDeleted ? "" : "order Item Id not available",
          };
          deletedOrderItemsStatus.push(generateCustomResponse);

          console.log(
            "🚀 ~ file: app.js:166 ~ orderItems.map ~ result",
            result
          );
        } catch (error) {
          console.log(`🚀 ~ file: app.js:199 ~ orderItems.map ~ error:`, error);
        }
      })
    );
  }
  let isOrderExists = orderId && await getOrder(orderId)

  console.log(`🚀 ~ file: app.js:282 ~ orderItems.map ~ isOrderExists:`, JSON.stringify(isOrderExists))


if(isOrderExists){}
else {
  
}

  // if(orderItems?.length <= 1 ){
  //   const result = await deleteOrder(orderId);
  //   console.log("🚀 ~ file: app.js:173 ~ result", result)
  // }

  //
  res.json({
    status:
      successStatus?.success && !successStatus?.failed
        ? "SUCCESS"
        : successStatus?.success && successStatus?.failed
        ? "PARTIAL_SUCCESS"
        : "FAILED",
    orderItems: deletedOrderItemsStatus,
  });
});

app.post("/unicommerce/orders/cancel/*", async function (req, res) {
  const bodyData = req.body;

  console.log(`🚀 ~ file: app.js:158 ~ bodyData:`, JSON.stringify(bodyData));

  let orderId = req.body?.orderId;

  let orderItems = req.body?.orderItems ? req.body?.orderItems : [];

  let successStatus = {
    failed: false,
    success: false,
  };

  let deletedOrderItemsStatus = [];

  let sendResponse = {
    status:
      successStatus?.success && !successStatus?.failed
        ? "SUCCESS"
        : successStatus?.success && successStatus?.failed
        ? "PARTIAL_SUCCESS"
        : "FAILED",

    orderItems: [
      {
        // "orderItemId": null,
        // "errorMessage": "order Item Id not available"
      },
    ],
  };

  console.log(
    `🚀 ~ file: app.js:184 ~ orderItems?.length:`,
    orderItems?.length
  );
  if (orderItems?.length > 0) {
    // orderItems.map(async (data, i) => {
    //   const result = await deleteOrderItem(data.orderItemId);
    //   console.log("🚀 ~ file: app.js:166 ~ orderItems.map ~ result", result);
    // });

    await Promise.all(
      orderItems.map(async (data, i) => {
        try {
          const result = await deleteOrderItem(data.orderItemId);

          //   {
          //     "Attributes": {
          //         "quantity": 1,
          //         "__typename": "OrderProduct",
          //         "totalPrice": 1999,
          //         "orderId": "158ef6ea-34cd-4ee1-9b7c-ff9a3756fa0d",
          //         "updatedAt": "2023-02-27T16:56:15.197Z",
          //         "variantId": "43535345418498",
          //         "price": 1999,
          //         "id": "2369940e-443b-4f12-8ce9-e895b27b1fd0sh1",
          //         "productId": "7937649869058",
          //         "title": "WOW Life Science Plant Based Protein Powder - Cafe Mocha Flavour - 1kg test"
          //     }
          // }

          console.log(
            `🚀 ~ file: app.js:238 ~ orderItems.map ~ await result?.Attributes?.id:`,
            await result?.Attributes?.id
          );

          const isDeleted = (await result?.Attributes?.id) ? true : false;

          if (await result?.Attributes?.id) {
            successStatus["success"] = true;

            // After Delete check

            //after delete get  orderProduct
            //byorderIdcreatedAtPayment >> paramer >> orderID

            // item >> length >>  nothing to do
            // count 0 >>if delete order

            // let isOrderExists = orderId && await getOrder(orderId)

            // console.log(`🚀 ~ file: app.js:282 ~ orderItems.map ~ isOrderExists:`, isOrderExists)

            
          } else {
            successStatus["failed"] = true;
          }

          const generateCustomResponse = {
            orderItemId: data.orderItemId,
            errorMessage: isDeleted ? "" : "order Item Id not available",
          };
          deletedOrderItemsStatus.push(generateCustomResponse);

          console.log(
            "🚀 ~ file: app.js:166 ~ orderItems.map ~ result",
            result
          );
        } catch (error) {
          console.log(`🚀 ~ file: app.js:199 ~ orderItems.map ~ error:`, error);
        }
      })
    );
  }
  let isOrderExists = orderId && await getOrder(orderId)

  console.log(`🚀 ~ file: app.js:282 ~ orderItems.map ~ isOrderExists:`, JSON.stringify(isOrderExists))


if(isOrderExists){}
else {
  
}

  // if(orderItems?.length <= 1 ){
  //   const result = await deleteOrder(orderId);
  //   console.log("🚀 ~ file: app.js:173 ~ result", result)
  // }

  //
  res.json({
    status:
      successStatus?.success && !successStatus?.failed
        ? "SUCCESS"
        : successStatus?.success && successStatus?.failed
        ? "PARTIAL_SUCCESS"
        : "FAILED",
    orderItems: deletedOrderItemsStatus,
  });
});

/****************************
 * Example put method *
 ****************************/

app.put("/unicommerce/orders/cancel", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/unicommerce/orders/cancel/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/unicommerce/orders/cancel", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/unicommerce/orders/cancel/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
