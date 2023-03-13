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
	API_HEALTHBACKEND_PRODUCTTABLE_ARN
	API_HEALTHBACKEND_PRODUCTTABLE_NAME
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
const { getOrders } = require("./getOrders");
const {
  getOrdersResponse,
  orderStatusResponse,
} = require("./generateResponse");

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

app.get("/orders", async function (req, res) {
  // Add your code here
  // pageNumber=1&pageSize=5&orderIds=abc
  // orderDateTo

  let dateFrom = req.query.orderDateFrom || null;
  let dateTo = req.query.orderDateTo || null;
  console.log("🚀 ~ file: app.js:49 ~ dateTo", dateTo);

  let queryParams = {};
  let fromIndex= 0
  let toIndex = 50

  if (req.query.orderIds) {
    console.log("🚀 ~ file: app.js:52 ~ queryParams?. if", )
    queryParams = {
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize, //fixed req.query.pageNumber,
      orderIds: req.query.orderIds,
    };
  } else {
    queryParams = {
      pageNumber: +req.query.pageNumber || 1,
      pageSize: +req.query.pageSize || 50, //fixed req.query.pageNumber,
      // orderIds: req.query.orderIds ,
      orderDateFrom: new Date(dateFrom?.replace(/ /g, "+")).toISOString(),
      orderDateTo: new Date(dateTo?.replace(/ /g, "+")).toISOString(), //
      orderStatus: req.query.orderStatus, // Mandatory for getOrders
      // orderIds: req.query.orderIds , //Mandatory for getOrders status only
    };

     fromIndex = ((queryParams?.pageNumber-1) * queryParams?.pageSize) 
     toIndex = fromIndex + (queryParams?.pageSize )
  }
  // if (queryParams.orderIds) {
  //     // order status
  //     res.json({
  //         message: "order status!",
  //         // body: JSON.stringify(queryResponse.body),
  //     });
  // } else
  if (queryParams.orderStatus === "CREATED" || queryParams.orderIds) {
    // get orders
    // if (
    //    ( queryParams.orderStatus === "CREATED" &&
    //     queryParams.orderDateFrom &&
    //     queryParams.orderDateTo) || queryParams.orderIds
    // ) {
    let response = [];

    const queryResponse = await getOrders(queryParams);
    console.log(
      `🔥 ~ file: app.js:66 ~ queryResponse`,
      JSON.stringify(queryResponse)
    );
    let listItems;

    if (queryParams.orderIds && queryResponse?.body?.data?.getOrder) {
      listItems = queryResponse.body.data.getOrder;
      console.log(`🔥 ~ file: app.js:74 ~ listItems`, listItems.length);
      // orderStatusResponse
      listItems && response.push(orderStatusResponse(listItems));
    } else if (queryParams.orderStatus === "CREATED") {
      // body: { data: { searchOrders: [Object] } },
      listItems = queryResponse?.body?.data?.searchOrders.items;

      listItems &&
        listItems.length > 0 &&
        listItems.slice(fromIndex,toIndex).map((order) => {
          response.push(getOrdersResponse(order));
        });
    }

    response = {
      orders: response,
      // nextToken: JSON.stringify(
      //     queryResponse.body.data?.listOrders?.nextToken || null
      // ),
      // total: JSON.stringify(queryResponse.body.data.listOrders.total),
    };
    //

    console.log("🚀 ~ file: app.js:106 ~ response", response);

    if (queryResponse.statusCode === 200) {
      res.json(
        // body: JSON.stringify(queryResponse.body),
        //   statusCode: queryResponse.statusCode,
        //   total: JSON.stringify(queryResponse.body.data.searchProducts.total),
        response
      );
    } else {
      res.json({
        // message: queryResponse.message,
        message: queryResponse.body?.errors[0]?.message,
        error: queryResponse?.body?.errors,
        // body: JSON.stringify(queryResponse.body),
      });
    }
    // }
  } else {
    res.json({
      message: "Invalid Parameters!",
      statusCode: 404,
      // body: JSON.stringify(queryResponse.body),
    });
  }
});

app.get("/orders/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/

app.post("/orders", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

// app.post("/orders/*", function (req, res) {
//   // Add your code here
//   res.json({ success: "post call succeed!", url: req.url, body: req.body });
// });

/****************************
 * Example put method *
 ****************************/

app.put("/orders", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/orders/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/orders", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/orders/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});


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

app.post("/orders/cancel", async function (req, res) {
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


app.post("/orders/dispatch", async function (req, res) {
  // Add your code here

  let bodyData = req.body;

  let allItemsStatus = [];
  let successStatus = {
    failed: false,
    success: false,
  };

  console.log(`🚀 ~ file: app.js:85 ~ bodyData:`, JSON.stringify(bodyData));

  if (bodyData?.orderItems.length > 0) {
    await Promise.all(
      bodyData?.orderItems.map(async (data, i) => {
        try {
          //check is order exists
          let getItem = await getOrderProduct(data?.orderItemId);

          console.log(`🚀 ~  getItem:`, JSON.stringify(await getItem));

          let isOrderExists = await getItem?.Item?.id;

          console.log(`🚀 ~ isOrderExists:`, isOrderExists);

          if (isOrderExists != undefined) {
            let updateItemResponse = await dispatchOrderItem(
              data?.orderItemId,
              data
            );

            let checkres = JSON.stringify(updateItemResponse);

            console.log("🚀 ~  checkres", checkres);

            successStatus["success"] = true;

          } else {
            // allItemsStatus.push(data?.orderItemId);
            successStatus["failed"] = true;
          }


          //Generating  Response
          const generateCustomResponse = {
            orderItemId: data.orderItemId,
            errorMessage: isOrderExists ? "" : "order Item Id not available",
          };

          allItemsStatus.push(generateCustomResponse);
        } catch (error) {
          console.log(
            "🚀 ~ file: app.js:92 ~ bodyData?.orderItems.map ~ error",
            error
          );
        }
      })
    );
  }
  res.json({
    status:
      successStatus?.success && !successStatus?.failed
        ? "SUCCESS"
        : successStatus?.success && successStatus?.failed
        ? "PARTIAL_SUCCESS"
        : "FAILED",
    orderItems: allItemsStatus,
  });
  // if (allItemsStatus.length === 0) {
  //   res.json({
  //     status: "SUCCESS",
  //     orderItems: bodyData?.orderItems?.map((data) => {
  //       return {
  //         orderItemId: data?.orderItemId,
  //         errorMessage: "",
  //       };
  //     }),
  //   });
  // } else {
  //   res.json({
  //     status: "FAILED",
  //     orderItems: allItemsStatus?.map((item) => {
  //       return {
  //         orderItemId: item,
  //         errorMessage: "item was not found",
  //       };
  //     }),
  //   });
  // }
});

async function dispatchOrderItem(id, updatedField) {
  const params = {
    TableName: process.env.API_HEALTHBACKEND_ORDERPRODUCTTABLE_NAME,
    Key: {
      id: id,
    },
    UpdateExpression:
      "set centralGstPercentage = :v1, compensationCessPercentage = :v2, integratedGstPercentage = :v3, stateGstPercentage = :v4 , taxRate = :v5 , unionTerritoryGstPercentage = :v6 ",
    ExpressionAttributeValues: {
      ":v1": updatedField?.centralGstPercentage,
      ":v2": updatedField?.compensationCessPercentage,
      ":v3": updatedField?.integratedGstPercentage,
      ":v4": updatedField?.stateGstPercentage,
      ":v5": updatedField?.taxRate,
      ":v6": updatedField?.unionTerritoryGstPercentage,
    },
    ReturnValues: "UPDATED_NEW",
  };

  console.log(`🚀 ~ file: app.js:74 ~ dispatchOrderItem ~ params:`, params);

  try {
    return await docClient.update(params).promise();
  } catch (error) {
    console.log(`🚀 ~ file: app.js:80 ~ dispatchOrderItem ~ error:`, error);
  }
}

const getOrderProduct = async (id) => {
  const params = {
    TableName: process.env.API_HEALTHBACKEND_ORDERPRODUCTTABLE_NAME,
    Key: { id: id },
  };

  try {
    return await docClient.get(params).promise();
  } catch (error) {
    console.log(`🚀 ~ file: app.js:95 ~ getOrderProduct ~ error:`, error);
  }
};

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
