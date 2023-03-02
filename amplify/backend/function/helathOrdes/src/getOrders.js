const GRAPHQL_ENDPOINT = process.env.API_HEALTHBACKEND_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_HEALTHBACKEND_GRAPHQLAPIKEYOUTPUT;
const fetch = require("node-fetch");
const Request = fetch.Request;

const {
    getOrder,
    listOrders,
    searchOrders,
    searchOrders2,
} = require("./graphql.js"); // graphql.js exports the GraphQL query
// const { sendResponse } = require('./generateResponse.js');

const getOrders = async (queryParams) => {
    console.log(
        `🔥 ~ file: getOrders.js:10 ~ getOrders ~ queryParams`,
        queryParams
    );

    let statusCode = 200;
    let message = "Something Wrong";
    let body;
    let response;
    let variables;

    if (queryParams?.orderIds) {
        variables = {
            id: queryParams?.orderIds,
        };
    } else if (queryParams.orderStatus === "CREATED") {
        // searchOrders(limit: 10, nextToken: "", filter: {status: {eq: ""}, orderDate: {gte: "", lte: ""}})

        // variables: {
        //     limit= 10,
        //     nextToken= "",
        // }
        variables = {
            filter: {
                // "status":{
                //   "eq": queryParams.orderStatus,
                // },
                orderDate: {
                    gte: queryParams.orderDateFrom,
                    // "lte": queryParams.orderDateTo,
                },

                and: {
                    orderDate: {
                        // "gte": queryParams.orderDateFrom,
                        lte: queryParams.orderDateTo,
                    },
                },
                // "sku":{
                //   "eq": queryParam.skus
                // },
            },
            //   "limit" : queryParams.pageSize,
            //   "nextToken" : queryParams.pageNumber
        };
    }

    // let query = gql`query MyQuery {
    //   searchUsers(filter: {signUpDate: {gt: "${args.signUpDateGT}", lt: "${args.signUpDateLT}"}, isActive: {eq: ${isActive}}, isBlockByAdmin: {eq: "${isBlockByAdmin}"}} ${queryNextToken}) {
    //     nextToken
    //     total
    //        items {
    //           id
    //         }
    //   }
    // }`

    // searchProducts(filter: {isPublished: {eq: ${queryIsPublished}}},limit:${queryParam.pageSize}) {
    let queryNextToken = queryParams?.pageNumber
        ? `, nextToken : "${queryParams.pageNumber}"`
        : "";
    // let queryIsPublished = queryParams.publishedStatus === 'PUBLISHED' ? true : false
    // searchOrders(filter: {orderDate: {gte: "${queryParams.orderDateFrom}", lt: "${queryParams.orderDateTo}"} }, ${queryNextToken}) {

    let searchOrders3 = `
  query MyQuery{
    searchOrders(filter: {orderDate: {gte: "${queryParams.orderDateFrom}", lt: "${queryParams.orderDateTo}"} },  limit:1000, sort: {direction: desc, field: orderDate}) {
     
    items {
      id
      code
      userId
      user {
        id
        owner
        firstName
        lastName
        email
        phone
        gender
        dob
        country
        state
        city
        pinCode
        landmark
        address
        location
        area
        isActive
        authProvider
        totalOrders
        totalSpent
        walletBalance
        walletSpent
        totalStoreCredit
        isAdmin
        profilePhotoUrl
        createdAt
        updatedAt
      }
      channelName
      shippingAddress {
        name
        phone
        email
        country
        state
        city
        pinCode
        landmark
        address
        location
        area
      }
      billingAddress {
        name
        phone
        email
        country
        state
        city
        pinCode
        landmark
        address
        location
        area
      }
      totalStoreCredit
      couponCodeId
      totalCashOnDeliveryCharges
      totalDiscount
      totalGiftCharges
      totalPrepaidAmount
      totalShippingCharges
      taxExempted
      cFormProvided
      thirdPartyShipping
      sla
      priority
      orderDate
      status
      products {
        items {
          additionalInfo
          cashOnDeliveryCharges
          centralGstPercentage
          compensationCessPercentage
          createdAt
          currency
          deliveryPartner
          discount
          dispatchDate
          facilityCode
          gstin
          id
          integratedGstPercentage
          invoiceDate
          invoiceNumber
          onHold
          orderId
          price
          productId
          quantity
          returnAWB
          returnDate
          returnReason
          returnShippingProvider
          sellingPrice
          shippingCharges
          shippingMethodCode
          sku
          stateGstPercentage
          status
          taxRate
          tentativeDeliveryDate
          title
          totalPrice
          trackingId
          unionTerritoryGstPercentage
          updatedAt
          variantId
        }
        nextToken
      }
      payments {
        nextToken
      }
      createdAt
      updatedAt
    }
    nextToken
    total
  
  }
  }
  `;
    const getOrder = /* GraphQL */ `
query GetOrder {
  getOrder(id: "${queryParams?.orderIds}") {
    id
    code
    userId
    user {
      id
      owner
      firstName
      lastName
      email
      phone
      gender
      dob
      country
      state
      city
      pinCode
      landmark
      address
      location
      area
      isActive
      authProvider
      totalOrders
      totalSpent
      walletBalance
      walletSpent
      totalStoreCredit
      isAdmin
      profilePhotoUrl
      createdAt
      updatedAt
    }
    channelName
    shippingAddress {
      address
      area
      city
      country
      email
      landmark
      location
      name
      phone
      pinCode
      state
    }
    billingAddress {
      address
      area
      city
      country
      email
      landmark
      location
      name
      phone
      pinCode
      state
    }
    totalStoreCredit
    couponCodeId
    totalCashOnDeliveryCharges
    totalDiscount
    totalGiftCharges
    totalPrepaidAmount
    totalShippingCharges
    taxExempted
    cFormProvided
    thirdPartyShipping
    sla
    priority
    orderDate
    status
    products {
      items {
        additionalInfo
        cashOnDeliveryCharges
        centralGstPercentage
        compensationCessPercentage
        createdAt
        currency
        deliveryPartner
        discount
        dispatchDate
        facilityCode
        gstin
        id
        integratedGstPercentage
        invoiceDate
        invoiceNumber
        onHold
        orderId
        price
        productId
        quantity
        returnAWB
        returnDate
        returnReason
        returnShippingProvider
        sellingPrice
        shippingCharges
        shippingMethodCode
        sku
        stateGstPercentage
        status
        taxRate
        tentativeDeliveryDate
        title
        totalPrice
        trackingId
        unionTerritoryGstPercentage
        updatedAt
        variantId
      }
      nextToken
    }
    payments {
      items {
        id
        userId
        orderId
        method
        amount
        createdAt
        updatedAt
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}
`;
    const options = {
        method: "POST",
        headers: {
            "x-api-key": GRAPHQL_API_KEY,
        },
        body: JSON.stringify({
            // query: queryParams?.orderIds ? getOrder : listOrders,
            query: queryParams?.orderIds ? getOrder : searchOrders3,
            //   variables: variables,
            //    {
            //     //   filter: {
            //     //     publishedAt: {
            //     //       exists: publishedStatus,
            //     //     },
            //     //   },
            //   },
        }),
    };
    console.log(`🔥 ~ file: getOrders.js:46 ~ getOrders ~ options`, options);

    const request = new Request(GRAPHQL_ENDPOINT, options);

    try {
        response = await fetch(request);
        body = await response.json();
        console.log(`🔥 ~ file: getOrders.js:77 ~ getOrders ~ body`, body);
        message = "";
        if (body.errors) statusCode = 400;
    } catch (error) {
        console.log(`🔥 ~ file: getOrders.js:77 ~ getOrders ~ error`, error);
        statusCode = 400;
        (message = error.message),
            (body = {
                errors: [
                    {
                        status: response.status,
                        message: error.message,
                        stack: error.stack,
                    },
                ],
            });
    }
    return {
        statusCode,
        body,
        message,
    };
};

module.exports = {
    getOrders,
};

// pageSize=50                                      mandatory  Yes	Fixed: 50
// pageNumber=1                                     mandatory: Yes	Default: 1
// orderStatus=CREATED                              Yes	Fixed: CREATED

// &orderDateFrom=2021-09-22T16:13:44+05:30
// &orderDateTo=2021-12-21T16:13:44+05:30&
// orderIds	string	Order ID’s	-	-
// orderIds	string	Item ID’s	-	-
