/* Amplify Params - DO NOT EDIT
	API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIIDOUTPUT
	API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT
	API_HEALTHBACKEND_PRODUCTCATEGORYTABLE_ARN
	API_HEALTHBACKEND_PRODUCTCATEGORYTABLE_NAME
	API_HEALTHBACKEND_PRODUCTINVENTORYTABLE_ARN
	API_HEALTHBACKEND_PRODUCTINVENTORYTABLE_NAME
	API_HEALTHBACKEND_PRODUCTSUBCATEGORYTABLE_ARN
	API_HEALTHBACKEND_PRODUCTSUBCATEGORYTABLE_NAME
	API_HEALTHBACKEND_PRODUCTTABLE_ARN
	API_HEALTHBACKEND_PRODUCTTABLE_NAME
	API_HEALTHBACKEND_STORETABLE_ARN
	API_HEALTHBACKEND_STORETABLE_NAME
	API_HEALTHBACKEND_VARIANTTABLE_ARN
	API_HEALTHBACKEND_VARIANTTABLE_NAME
	API_HEALTHBACKEND_WAREHOUSETABLE_ARN
	API_HEALTHBACKEND_WAREHOUSETABLE_NAME
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

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

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

app.get("/updateInventory", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

app.get("/updateInventory/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/

let failedProducList = [];

const getProduct = async (id) => {
  try {
    var params = {
      Key: {
        id: id,
      },
      TableName: process.env.API_HEALTHBACKEND_PRODUCTTABLE_NAME,
      ProjectionExpression: "id",
    };
    const data = await docClient.get(params).promise();
    console.log("🚀 ~ file: app.js:140 ~ getProduct ~ data", data);
    // if (data) {
    return {
      notFound: data?.Item?.id ? false : true,
      id: data?.Item?.id,
    };
    // }
  } catch (err) {
    console.log("getProduct failed catch", err.message);

    // return {
    //   status :400,
    //   err
    // };
    // return false;
  }
};
const updateProductInventory = async (inventory) => {
  let inventoryParam = +inventory.inventory;

  const productRes = await getProduct(inventory?.productId);
  console.log(
    "🚀 ~ file: app.js:71 ~ updateInventory ~ productRes",
    productRes
  );
  // return {
  //   notFound: data?.Item?.id  ? true : false ,
  //   id: data?.Item?.id
  // }
  if (productRes.notFound !== true) {
    const params = {
      TableName: process.env.API_HEALTHBACKEND_PRODUCTTABLE_NAME,
      Key: {
        id: inventory?.productId,
      },
      UpdateExpression: "set inventory = :v1 ",
      ExpressionAttributeValues: {
        ":v1": inventoryParam,
      },
      ReturnValues: "UPDATED_NEW",
    };
    try {
      const data = await docClient.update(params).promise();
      console.log("🚀 ~ file: app.js:87 ~ updateInventory ~ data", data);
      // return data;
      // if (await data) {
      //   return inventory?.productId;
      // } else {
      //   return false;
      // }
    } catch (error) {
      console.log(
        `🚀 ~ file: app.js:129 ~ updateProductInventory ~ error:`,
        error
      );
    }
  } else {
    return productRes;
  }
};

const updateVarientInventory = async (inventory) => {
  let inventoryParam = +inventory.inventory;

  let isVarientExists = await getVarient(inventory?.variantId);
  console.log(
    "🚀 ~ file: app.js:105 ~ updateVarientInventory ~ isVarientExists",
    isVarientExists
  );

  if (isVarientExists?.notFound !== true) {
    const params = {
      TableName: process.env.API_HEALTHBACKEND_VARIANTTABLE_NAME,
      Key: {
        id: inventory?.variantId,
      },
      UpdateExpression: "set inventory = :v1 ",
      ExpressionAttributeValues: {
        ":v1": inventoryParam,
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const data = await docClient.update(params).promise();
      console.log(
        "🚀 ~ file: app.js:126 ~ updateVarientInventory ~ data",
        data
      );
      if (await data) {
        return inventory?.variantId;
      } else {
        return false;
      }
      // return data;
    } catch (error) {
      return inventory?.variantId;
    }
  } else {
    return isVarientExists;
  }
};

const getVarient = async (id) => {
  console.log("🚀 ~ file: app.js:164 ~ getVarient ~ id", id);
  console.log(
    "🚀 ~ file: app.js:173 ~ getVarient ~ process.env.API_HEALTHBACKEND_VARIANTTABLE_NAME",
    process.env.API_HEALTHBACKEND_VARIANTTABLE_NAME
  );
  try {
    const params1 = {
      Key: {
        id: id,
      },
      TableName: process.env.API_HEALTHBACKEND_VARIANTTABLE_NAME,
      ProjectionExpression: "id, title",
    };
    const data = await docClient.get(params1).promise();
    if (data) {
      return {
        notFound: data?.Item?.id ? false : true,
        id: data?.Item?.id,
      };
    }
    console.log("🚀 ~ file: app.js:171 ~ varient  data", data);

    return (await data?.Item?.id) || false;
  } catch (err) {
    console.log("getVarient failed catch", err.message);

    return false;
  }
};

app.post("/updateInventory", async function (req, res) {
  // Add your code here

  const bodyParams = req.body;

  console.log(
    `🚀 ~ file: app.js:217 ~ bodyParams:`,
    JSON.stringify(bodyParams)
  );

  let failedLists = [];

  if (bodyParams?.inventoryList?.length > 0) {
    await Promise.all(
      bodyParams?.inventoryList.map(async (data) => {
        let isProductFake = false;
        let isVarientFake = false;
        if (data?.productId === data?.variantId) {
          let updateItemResponseProduct = await updateProductInventory(data);

          console.log(
            "🚀 ~ file: app.js:214 ~ bodyParams?.inventoryList.map ~ updateItemResponseProduct",
            updateItemResponseProduct
          );

          isProductFake = updateItemResponseProduct?.notFound;
          if (isProductFake) {
            failedLists.push({
              productId: data?.productId,
              variantId: data?.variantId,
              message: "ProductID missing",
            });
          }
        } else {
          let updateItemResponseProduct = await updateProductInventory(data);
          console.log(
            "🚀 ~ file: app.js:214 ~ bodyParams?.inventoryList.map ~ updateItemResponseProduct",
            updateItemResponseProduct
          );
          isProductFake = updateItemResponseProduct?.notFound;
          let updateItemResponseVarient = await updateVarientInventory(data);
          console.log(
            "🚀 ~ file: app.js:235 ~ bodyParams?.inventoryList.map ~ updateItemResponseVarient",
            updateItemResponseVarient
          );
          isVarientFake =
            updateItemResponseVarient?.notFound === true ? true : false;
          if (isProductFake || isVarientFake) {
            failedLists.push({
              productId: data?.productId,
              variantId: data?.variantId,
              message: "variantId and productId mismatch",
            });
          }
        }
      })
    );
  }

  if (failedLists?.length > 0) {
    res.json({
      status: "FAILED",
      failedProductList: failedLists,
    });
  } else {
    res.json({
      status: "SUCCESS",
      failedProductList: [],
    });
  }
});

app.post("/updateInventory/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

app.put("/updateInventory", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/updateInventory/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/updateInventory", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/updateInventory/*", function (req, res) {
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
