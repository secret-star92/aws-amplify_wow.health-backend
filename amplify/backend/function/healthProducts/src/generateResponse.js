const validateResponse = (data, type) => {
  if (type === "boolean") return data || false;
  if (type === "str") return data || null;
  if (type === "NULL") return data || "L";
  if (type === "int") return data || 0;
  if (type === "obj") return data || {};
  if (type === "arr") return data || [];
};
const sendResponse = ( productData) => {
  console.log(`🔥 ~ file: generateResponse.js:9 ~ sendResponse ~ productData`, productData.variants.items)
  const response = 
      {
        id: validateResponse(productData?.id, "str"), //"string"
        parentTitle: validateResponse(productData?.title, "str"), //"string"
        brand: validateResponse(productData?.brand, "str"), //"string"
        // variants: [
        //   {
        //     imageUrl: validateResponse(productData?.thumbImages, "str"), //"string"
        //     productUrl: validateResponse(productData?.productUrl, "str"), //"string" //not found
        //     variantId: validateResponse(productData?.variantId, "str"), //"string"
        //     title: validateResponse(productData?.title, "str"), //"string"
        //     sku: validateResponse(productData?.sku, "str"), //"string"
        //     size: validateResponse(productData?.size, "str"), //"string"
        //     color: validateResponse(productData?.color, "str"), //"string"
        //     live: false,
        //     productDescription: validateResponse(productData?.productDescription, "str"), //"string"
        //     itemPrice: {
        //       currency: validateResponse(productData?.currency, "str"), //"string"
        //       listingPrice: validateResponse(productData?.listingPrice, "int"), //0,
        //       mrp: validateResponse(productData?.mrp, "int"),
        //       msp: validateResponse(productData?.msp, "int"),
        //       netSellerPayable:validateResponse(productData?.netSellerPayable, "int"),
        //     },
        //     inventory: validateResponse(productData?.inventory, "int"),
        //     blockedInventory:validateResponse(productData?.blockedInventory, "int"),
        //     pendency:validateResponse(productData?.pendency, "int"),
        //   },
        // ],
        variants: productData.variants.items.length>0 ? productData.variants.items.map((data,i)=> {
          return {
               
            imageUrl: validateResponse(data?.imageUrl, "str"), //"string"
            productUrl: validateResponse(data?.productUrl, "str"), //"string" //not found
            variantId: validateResponse(data?.id, "str"), //"string"
            title: validateResponse(data?.title, "str"), //"string"
            sku: validateResponse(data?.sku, "str"), //"string"
            size: validateResponse(data?.size, "NULL"), //"string"
            color: validateResponse(data?.color, "str"), //"string"
            live: data.status==='ENABLED' ? true : false, //not found
            productDescription: validateResponse(productData?.productDescription, "str"), //"string"
            // itemPrice: {
            //   currency: validateResponse(data?.currency, "str"), //"string"
            //   listingPrice: validateResponse(data?.listingPrice, "int"), //0,
            //   mrp: validateResponse(data?.price, "int"),
            //   msp: validateResponse(data?.msp, "int"), // not found
            //   netSellerPayable:validateResponse(data?.netSellerPayable, "int"), // not found
            // },
            inventory: validateResponse(data?.inventory, "int"),
            blockedInventory:0,
            pendency:validateResponse(data?.pendency, "int"), // not found
          
          }
        }) : [ {
               
          imageUrl: validateResponse(productData?.thumbImages, "str"), //"string"
          productUrl: validateResponse(productData?.productUrl, "str"), //"string" //not found
          variantId: validateResponse(productData?.id, "str"), //"string"
          title: validateResponse(productData?.title, "str"), //"string"
          sku: validateResponse(productData?.sku, "str"), //"string"
          size: validateResponse(productData?.size, "str"), //"string"
          color: validateResponse(productData?.color, "str"), //"string"
          live: productData.status==='ENABLED' ? true : false, //not found
          productDescription: validateResponse(productData?.productDescription, "str"), //"string"
          // itemPrice: {
          //   currency: validateResponse(productData?.currency, "str"), //"string"
          //   listingPrice: validateResponse(productData?.listingPrice, "int"), //0,
          //   mrp: validateResponse(productData?.price, "int"),
          //   msp: validateResponse(productData?.msp, "int"), // not found
          //   netSellerPayable:validateResponse(productData?.netSellerPayable, "int"), // not found
          // },
          inventory: validateResponse(productData?.inventory, "int"),
          blockedInventory:0,
          pendency:validateResponse(productData?.pendency, "int"), // not found
        
        }]
        ,
        commissionPercentage:validateResponse(productData?.commissionPercentage, "int"), //not found
        paymentGatewayCharge:validateResponse(productData?.paymentGatewayCharge, "int"), //not found
        logisticsCost:validateResponse(productData?.logisticsCost, "int"), //not  found
        additionalInfo: validateResponse(productData?.invalid, "str"), //"string" //longDescription
        created: productData?.createdAt,
      
  };
  return response;
};

module.exports = {
  sendResponse,
};

// 2023-02-09T18:51:23.230Z	c1d25f40-458e-45d8-bad2-717147a811bc	INFO	🚀 ~ file: app.js:100 ~ app.get ~ queryResponse {
//   "statusCode": 200,
//   "body": {
//       "data": {
//           "searchProducts": {
//               "items": [
//                   {
//                       "id": "d533b2a5-7d06-4bd7-a49d-b21e13dd504d",
//                       "title": "test product 1",
//                       "brand": "demo",
//                       "vendor": "Himel",
//                       "categoryId": "64de63d3-1b9e-45ba-a9e6-affab40656fa",
//                       "storeId": null,
//                       "store": null,
//                       "isFeatured": true,
//                       "category": {
//                           "id": "64de63d3-1b9e-45ba-a9e6-affab40656fa",
//                           "name": "New Category",
//                           "description": "<p><span style=\"color: rgb(255,255,255);background-color: rgb(147,101,184);\">Category Add with Image Test</span></p>\n",
//                           "isFeatured": false,
//                           "totalProducts": null,
//                           "priority": 1,
//                           "imageUrl": "categories/1675306555816-56115273.png",
//                           "createdAt": "2023-02-01T13:27:12.081Z",
//                           "updatedAt": "2023-02-01T13:27:12.081Z"
//                       },
//                       "productType": "helth",
//                       "createdAt": "2023-02-07T19:53:42.255Z",
//                       "slug": "test",
//                       "productDescription": "this is test test test test",
//                       "longDescription": "<p>Hello <strong>This is test</strong></p>\n",
//                       "updatedAt": "2023-02-09T11:46:08.018Z",
//                       "publishedAt": null,
//                       "price": 699,
//                       "sku": "qwe12131",
//                       "size": "3",
//                       "color": "black",
//                       "status": "ENABLED",
//                       "position": 1,
//                       "currency": "inr",
//                       "costPrice": 100,
//                       "listingPrice": 150,
//                       "taxable": false,
//                       "barcode": "1212",
//                       "tags": "tiger,bear",
//                       "weight": 4,
//                       "weightUnit": "kg",
//                       "inventory": 10,
//                       "blockedInventory": 10,
//                       "rating": 5,
//                       "totalOrders": 0,
//                       "additionalInfo": "ss",
//                       "thumbImages": "products/1675861784619-fullstackmark.jpg",
//                       "isTaxEnabled": false,
//                       "isInventoryEnabled": true,
//                       "hasVarient": false,
//                       "variants": {
//                           "items": [
//                               {
//                                   "barcode": "er",
//                                   "blockedInventory": 10,
//                                   "color": "er",
//                                   "costPrice": 1.5,
//                                   "createdAt": "2023-02-09T17:21:04.382Z",
//                                   "currency": "ere",
//                                   "imageUrl": "erere",
//                                   "id": "bb36b910-fd43-44f8-9310-838af470f331",
//                                   "inventory": 10,
//                                   "listingPrice": 1.5,
//                                   "position": 10,
//                                   "price": 1.5,
//                                   "productId": "d533b2a5-7d06-4bd7-a49d-b21e13dd504d",
//                                   "size": "rer",
//                                   "sku": "erer",
//                                   "status": "ENABLED",
//                                   "taxable": false,
//                                   "title": "demo",
//                                   "updatedAt": "2023-02-09T17:21:04.382Z",
//                                   "weight": 1.5,
//                                   "weightUnit": "kg"
//                               }
//                           ],
//                           "nextToken": null
//                       },
//                       "images": {
//                           "items": [
//                               {
//                                   "alt": "products/1675861734881-mario.png",
//                                   "createdAt": "2023-02-07T23:38:21.534Z",
//                                   "height": null,
//                                   "id": "012d323f-3031-4c44-907d-bd98a6d4bb22",
//                                   "imageKey": "products/1675861734881-mario.png",
//                                   "isThumb": null,
//                                   "position": null,
//                                   "productId": "d533b2a5-7d06-4bd7-a49d-b21e13dd504d",
//                                   "updatedAt": "2023-02-07T23:38:21.534Z",
//                                   "width": null
//                               },
//                               {
//                                   "alt": "products/1675861784619-fullstackmark.jpg",
//                                   "createdAt": "2023-02-07T23:39:02.223Z",
//                                   "height": null,
//                                   "id": "21d65f50-e70e-4d00-9000-ca3b8c2e281f",
//                                   "imageKey": "products/1675861784619-fullstackmark.jpg",
//                                   "isThumb": null,
//                                   "position": null,
//                                   "productId": "d533b2a5-7d06-4bd7-a49d-b21e13dd504d",
//                                   "updatedAt": "2023-02-07T23:39:02.223Z",
//                                   "width": null
//                               }
//                           ],
//                           "nextToken": null
//                       },
//                       "reviews": {
//                           "items": []
//                       }
//                   },
//                   {
//                       "id": "3c6e104b-3835-4aee-b1f5-b6cd0642da65",
//                       "title": "test product 2",
//                       "brand": "demo",
//                       "vendor": "Himel",
//                       "categoryId": "f288572b-f919-45f0-8aa2-365e3ee3610e",
//                       "storeId": null,
//                       "store": null,
//                       "isFeatured": true,
//                       "category": {
//                           "id": "f288572b-f919-45f0-8aa2-365e3ee3610e",
//                           "name": "Apple Cider Vinegar",
//                           "description": "apple cider vinegar drink",
//                           "isFeatured": false,
//                           "totalProducts": null,
//                           "priority": 0,
//                           "imageUrl": "categories/1675421383766-Peanut_Butter_KV_1944x_1.jpg",
//                           "createdAt": "2023-02-03T10:49:45.319Z",
//                           "updatedAt": "2023-02-03T10:49:45.319Z"
//                       },
//                       "productType": "helth",
//                       "createdAt": "2023-02-07T19:53:25.220Z",
//                       "slug": "test",
//                       "productDescription": "this is testdddddddddd",
//                       "longDescription": "<p>helllo</p>\n",
//                       "updatedAt": "2023-02-07T23:51:47.158Z",
//                       "publishedAt": null,
//                       "price": 799,
//                       "sku": "qwe",
//                       "size": "3",
//                       "color": "black",
//                       "status": "ENABLED",
//                       "position": 1,
//                       "currency": "inr",
//                       "costPrice": 2,
//                       "listingPrice": 2,
//                       "taxable": false,
//                       "barcode": "1212",
//                       "tags": "test",
//                       "weight": 2,
//                       "weightUnit": "kg",
//                       "inventory": 10,
//                       "blockedInventory": 10,
//                       "rating": 5,
//                       "totalOrders": 0,
//                       "additionalInfo": "ss",
//                       "thumbImages": "products/1675862534185-best-logos-2017-1.jpg",
//                       "isTaxEnabled": false,
//                       "isInventoryEnabled": true,
//                       "hasVarient": false,
//                       "variants": {
//                           "items": [],
//                           "nextToken": null
//                       },
//                       "images": {
//                           "items": [
//                               {
//                                   "alt": "products/1675862534185-best-logos-2017-1.jpg",
//                                   "createdAt": "2023-02-07T23:51:38.366Z",
//                                   "height": null,
//                                   "id": "36372613-756e-4741-b43f-8e5f5ea0325c",
//                                   "imageKey": "products/1675862534185-best-logos-2017-1.jpg",
//                                   "isThumb": null,
//                                   "position": null,
//                                   "productId": "3c6e104b-3835-4aee-b1f5-b6cd0642da65",
//                                   "updatedAt": "2023-02-07T23:51:38.366Z",
//                                   "width": null
//                               }
//                           ],
//                           "nextToken": null
//                       },
//                       "reviews": {
//                           "items": []
//                       }
//                   }
//               ],
//               "nextToken": "WyIzYzZlMTA0Yi0zODM1LTRhZWUtYjFmNS1iNmNkMDY0MmRhNjUiXQ==",
//               "total": 2,
//               "aggregateItems": []
//           }
//       }
//   },
//   "message": "Something Wrong"
// }
