const validateResponse = (data, type) => {
  if (type === "boolean") return data || false;
  if (type === "str") return data || null;
  if (type === "int") return data || 0;
  if (type === "obj") return data || {};
  if (type === "arr") return data || [];
};
const sendResponse = ( productData) => {
  const response = {
    products: [
      {
        id: validateResponse(productData?.id, "str"), //"string"
        parentTitle: validateResponse(productData?.parentTitle, "str"), //"string"
        brand: validateResponse(productData?.brand, "str"), //"string"
        variants: [
          {
            imageUrl: validateResponse(productData?.imageUrl, "str"), //"string"
            productUrl: validateResponse(productData?.productUrl, "str"), //"string"
            variantId: validateResponse(productData?.variantId, "str"), //"string"
            title: validateResponse(productData?.title, "str"), //"string"
            sku: validateResponse(productData?.sku, "str"), //"string"
            size: validateResponse(productData?.size, "str"), //"string"
            color: validateResponse(productData?.color, "str"), //"string"
            live: false,
            productDescription: validateResponse(productData?.productDescription, "str"), //"string"
            itemPrice: {
              currency: validateResponse(productData?.currency, "str"), //"string"
              listingPrice: validateResponse(productData?.listingPrice, "int"), //0,
              mrp: validateResponse(productData?.mrp, "int"),
              msp: validateResponse(productData?.msp, "int"),
              netSellerPayable:validateResponse(productData?.netSellerPayable, "int"),
            },
            inventory: validateResponse(productData?.inventory, "int"),
            blockedInventory:validateResponse(productData?.blockedInventory, "int"),
            pendency:validateResponse(productData?.pendency, "int"),
          },
        ],
        commissionPercentage:validateResponse(productData?.commissionPercentage, "int"),
        paymentGatewayCharge:validateResponse(productData?.paymentGatewayCharge, "int"),
        logisticsCost:validateResponse(productData?.logisticsCost, "int"),
        additionalInfo: validateResponse(productData?.additionalInfo, "str"), //"string"
        created: productData?.createdAt,
      },
    ],
  };
  return response;
};

module.exports = {
  sendResponse,
};

// "body": {
//     "data": {
//         "searchProducts": {
//             "items": [
//                 {
//                     "id": "f47714de-9687-4a80-896b-bfa84c04bd99",
//                     "title": "Multivitamin for Women - with Vitamin A, Lutein & Lycopene",
//                     "brand": null,
//                     "vendor": "Wow Life Science",
//                     "categoryId": "2740",
//                     "storeId": null,
//                     "store": null,
//                     "isFeatured": false,
//                     "category": null,
//                     "productType": "Vitamins & Supplements",
//                     "createdAt": "2023-01-30T17:32:36.445Z",
//                     "slug": "wow-life-science-multivitamin-for-women-60-capsules",
//                     "productDescription": null,
//                     "longDescription": null,
//                     "updatedAt": "2023-01-30T17:32:36.445Z",
//                     "publishedAt": "2023-01-30T17:32:36.445Z",
//                     "price": 500,
//                     "sku": null,
//                     "size": null,
//                     "color": null,
//                     "status": "ENABLED",
//                     "position": null,
//                     "currency": null,
//                     "costPrice": null,
//                     "listingPrice": 500,
//                     "taxable": null,
//                     "barcode": null,
//                     "tags": "All, banking-upiapps, best-selling, BOGO, Daily-Essentials-Range, Energy-Boost, Except-Men, General-Wellbeing, Immunity Care, life science, lp-structure, Multivitamins, not-a-combo, nutrition-and-health-best, Product-Range, Super-Saver-Packs, v_months, Value-Packs, Vitamins-Range, Womens-Health-New, wow-sunday",
//                     "weight": null,
//                     "weightUnit": null,
//                     "inventory": null,
//                     "blockedInventory": null,
//                     "rating": null,
//                     "totalOrders": null,
//                     "additionalInfo": null,
//                     "thumbImages": null,
//                     "isTaxEnabled": null,
//                     "isInventoryEnabled": null,
//                     "hasVarient": null,
//                     "variants": {
//                         "nextToken": null
//                     },
//                     "images": {
//                         "nextToken": null
//                     },
//                     "reviews": {
//                         "nextToken": null
//                     }
//                 },
