const States = require("./states.json");
const Countries = require("./countries.json");

const stateMap = States.reduce((a, b) => ({ ...a, [b.value]: b.name }), {});
const countryMap = Countries.reduce((a, b) => ({ ...a, [b.value]: b.name }), {});

const validateResponse = (data, type) => {
    if (type === "boolean") return data || false;
    if (type === "str") return data || null;
    if (type === "int") return data || 0;
    if (type === "obj") return data || {};
    if (type === "arr") return data || [];
    if (type === "state") return stateMap[data] || null;
    if (type === "country") return countryMap[data] || null;
};

const getOrdersResponse = (orderData) => {
    console.log(
        `🔥🔥 ~ file: generateResponse.js:9 ~ getOrdersResponse ~ orderData`,
        orderData
    );
    const response = {
        id: validateResponse(orderData?.id, "str"), //"string",
        code: validateResponse(orderData?.code, "str"), //"string",
        orderDate: validateResponse(orderData?.orderDate, "str"),
        orderStatus: "CREATED", // "CREATED",
        sla: validateResponse(orderData?.orderDate, "str"),
        priority: 0, // 0,
        paymentType: "COD", //"PREPAID", //not found
        orderPrice: {
            currency: "INR", //"INR",
            totalCashOnDeliveryCharges: validateResponse(
                orderData?.totalCashOnDeliveryCharges,
                "int"
            ), //  0,
            totalDiscount: validateResponse(orderData?.totalDiscount, "int"), // 0,
            totalGiftCharges: validateResponse(
                orderData?.totalGiftCharges,
                "int"
            ), // 0,
            totalStoreCredit: validateResponse(
                orderData?.totalStoreCredit,
                "int"
            ), // 0,
            totalPrepaidAmount: validateResponse(
                orderData?.totalPrepaidAmount,
                "int"
            ), // 0,
            totalShippingCharges: validateResponse(
                orderData?.totalShippingCharges,
                "int"
            ), // 0
        },
        orderItems: orderData.products.items.map((data) => {
            return {
                orderItemId: validateResponse(data?.id, "str"), //"string",
                status: "CREATED", // "CREATED",
                productId: validateResponse(data?.productId, "str"), // //"string",
                variantId: data?.variantId ? validateResponse(data?.variantId, "str") : validateResponse(data?.productId, "str"), //"string",
                sku: validateResponse(data?.sku, "str"), //"string",
                returnReason: validateResponse(data?.returnReason, "str"), //"string",
                returnDate: validateResponse(data?.returnDate, "str"), //"string",
                returnAWB: validateResponse(data?.returnAWB, "str"), //"string",
                returnShippingProvider: validateResponse(
                    data?.returnShippingProvider,
                    "str"
                ), //"string",
                title: validateResponse(data?.title, "str"), //"string",
                shippingMethodCode: "STD",
                orderItemPrice: {
                    cashOnDeliveryCharges: validateResponse(
                        data?.cashOnDeliveryCharges,
                        "int"
                    ), // 0,
                    sellingPrice: validateResponse(
                        data?.price,
                        "int"
                    ), //0,
                    shippingCharges: validateResponse(
                        data?.shippingCharges,
                        "int"
                    ), //0,
                    discount: validateResponse(data?.discount, "int"), //0,
                    totalPrice: validateResponse(data?.totalPrice, "int"), //0,
                    transferPrice: validateResponse(data?.invalid, "int"), //0,
                    currency: "INR", //"string"
                },
                quantity: validateResponse(data?.quantity, "int"), //0,
                // giftWrap: {
                //     giftWrapMessage: validateResponse(data?.invalid, "str"), ////"string",
                //     giftWrapCharges: validateResponse(data?.invalid, "str"), //0
                // },
                onHold: validateResponse(data?.onHold, "boolean"), // false,
                packetNumber: 1, // 0,
                facilityCode: validateResponse(data?.facilityCode, "str"), ////"string"
            };
        }),
        taxExempted: false, //false,
        cFormProvided: false, // false,
        thirdPartyShipping: validateResponse(
            orderData?.thirdPartyShipping,
            "boolean"
        ), // false,
        shippingAddress: {
            addressLine1: validateResponse(
                orderData?.shippingAddress?.address,
                "str"
            ), ////"string",
            addressLine2: validateResponse(orderData?.invalid, "str"), ////"string",
            city: validateResponse(orderData?.shippingAddress?.city, "str"), // //"string",
            country: validateResponse(
                orderData?.shippingAddress?.country,
                "country"
            ), // //"string",
            email: validateResponse(orderData?.shippingAddress?.email, "str"), ////"string",
            name: validateResponse(orderData?.shippingAddress?.name, "str"), ////"string",
            phone: validateResponse(orderData?.shippingAddress?.phone, "str"), ////"string",
            pincode: validateResponse(
                orderData?.shippingAddress?.pinCode,
                "str"
            ), //"string",
            state: validateResponse(orderData?.shippingAddress?.state, "state"), //"string"
        },
        billingAddress: {
            addressLine1: validateResponse(
                orderData?.billingAddress?.address,
                "str"
            ), //"string",
            addressLine2: validateResponse(
                orderData?.billingAddress?.invalid,
                "str"
            ), //"string",
            city: validateResponse(orderData?.billingAddress?.city, "str"), //"string",
            country: validateResponse(
                orderData?.billingAddress?.country,
                "country"
            ), //"string",
            email: validateResponse(orderData?.billingAddress?.email, "str"), //"string",
            name: validateResponse(orderData?.billingAddress?.name, "str"), //"string",
            phone: validateResponse(orderData?.billingAddress?.phone, "str"), //"string",
            pincode: validateResponse(
                orderData?.billingAddress?.pinCode,
                "str"
            ), //"string",
            state: validateResponse(orderData?.billingAddress?.state, "state"), //"string"
        },
        gstin: validateResponse(orderData?.invalid, "str"), //"string",
        additionalInfo: validateResponse(orderData?.invalid, "str"), //"string" //not found
    };
    return response;
};

const orderStatusResponse = (orderData) => {
    console.log(
        `🔥 ~ file: generateResponse.js:94 ~ orderStatusResponse ~ orderData`,
        orderData
    );
    const response = {
        id: validateResponse(orderData?.id, "str"), //"string",
        orderDate: validateResponse(orderData?.orderDate, "str"),
        code: validateResponse(orderData?.code, "str"),
        orderStatus: "CREATED", //+"CREATED",
        sla: validateResponse(orderData?.orderDate, "str"), //  "2017-01-02T08:12:53",
        priority: 0, // 0,
        paymentType: "COD", // "string",
        orderPrice: {
            currency: "INR", //  "string",
            totalCashOnDeliveryCharges: validateResponse(
                orderData?.totalCashOnDeliveryCharges,
                "int"
            ), //  0,
            totalDiscount: validateResponse(orderData?.totalDiscount, "int"), // 0,
            totalGiftCharges: validateResponse(
                orderData?.totalGiftCharges,
                "int"
            ), //  0,
            totalPrepaidAmount: validateResponse(
                orderData?.totalPrepaidAmount,
                "int"
            ), //  0,
            totalShippingCharges: validateResponse(
                orderData?.totalShippingCharges,
                "int"
            ), //  0
        },
        orderItems: orderData.products.items.map((data) => {
            return {

                orderItemId: validateResponse(data?.id, "str"), //  "string",
                status: "CREATED", // Allowable: CANCELLED, CREATED, DISPATCHED, DELIVERED, RETURN_REQUESTED, COURIER_RETURN
                productId: validateResponse(data?.productId, "str"), //  "string",
                variantId: data?.variantId ? validateResponse(data?.variantId, "str") : validateResponse(data?.productId, "str"), //"string",
                sku: validateResponse(data?.sku, "str"), //  "string",
                returnReason: validateResponse(data?.returnReason, "str"), //  "string",
                returnDate: validateResponse(data?.returnDate, "str"), //  "string",
                returnAWB: validateResponse(data?.returnAWB, "str"), //  "string",
                returnShippingProvider: validateResponse(
                    data?.returnShippingProvider,
                    "str"
                ), // "string",
                title: validateResponse(data?.title, "str"), //  "string",
                shippingMethodCode: "STD", //  "STD",
                orderItemPrice: {
                    cashOnDeliveryCharges: validateResponse(
                        data?.cashOnDeliveryCharges,
                        "int"
                    ), //  0,
                    sellingPrice: validateResponse(data?.price, "int"), // 0,
                    shippingCharges: validateResponse(
                        data?.shippingCharges,
                        "int"
                    ), //  0,
                    discount: validateResponse(data?.discount, "int"), //  0,
                    totalPrice: validateResponse(data?.totalPrice, "int"), // 0,
                    transferPrice: validateResponse(data?.transferPrice, "int"), //  0,
                    currency: "INR", //  "string"
                },
                quantity: validateResponse(data?.quantity, "int"), //  0,
                // giftWrap: {
                //     giftWrapMessage: validateResponse(
                //         orderData?.invalid,
                //         "str"
                //     ), // "string",
                //     giftWrapCharges: validateResponse(
                //         orderData?.invalid,
                //         "str"
                //     ), //  0
                // },
                onHold: validateResponse(data?.onHold, "boolean"), //  false,
                packetNumber: 1, //  0

            };
        }),

        // taxExempted: validateResponse(orderData?.taxExempted, "str"), //  false,
        // cFormProvided: validateResponse(orderData?.cFormProvided, "str"), //  false,
        thirdPartyShipping: validateResponse(
            orderData?.thirdPartyShipping,
            "boolean"
        ), // false,
        shippingAddress: {
            addressLine1: validateResponse(orderData?.shippingAddress?.address, "str"), //  "string",
            addressLine2: validateResponse(orderData?.shippingAddress?.invalid, "str"), // "string",
            city: validateResponse(orderData?.shippingAddress?.city, "str"), // "string",
            country: validateResponse(
                orderData?.shippingAddress.country,
                "country"
            ), // "string",
            email: validateResponse(orderData?.shippingAddress?.email, "str"), //  "string",
            name: validateResponse(orderData?.shippingAddress?.name, "str"), // "string",
            phone: validateResponse(orderData?.shippingAddress?.phone, "str"), //  "string",
            pincode: validateResponse(
                orderData?.shippingAddress?.pinCode,
                "str"
            ), // "string",
            state: validateResponse(orderData?.shippingAddress?.state, "state"), //  "string"
        },
        billingAddress: {
            addressLine1: validateResponse(orderData?.billingAddress?.address, "str"), // "string",
            addressLine2: validateResponse(orderData?.billingAddress?.invalid, "str"), //  "string",
            city: validateResponse(orderData?.billingAddress?.city, "str"), //  "string",
            country: validateResponse(
                orderData?.billingAddress?.country,
                "country"
            ), //  "string",
            email: validateResponse(orderData?.billingAddress?.email, "str"), // "string",
            name: validateResponse(orderData?.billingAddress?.name, "str"), // "string",
            phone: validateResponse(orderData?.billingAddress?.phone, "str"), // "string",
            pincode: validateResponse(orderData?.billingAddress?.pinCode, "str"), // "string",
            state: validateResponse(orderData?.billingAddress?.state, "state"), // "string"
        },
        additionalInfo: validateResponse(orderData?.additionalInfo, "str"), //  "string"
    };

    return response;
};

module.exports = {
    getOrdersResponse,
    orderStatusResponse,
};

// orderData {
//   id: '334abe4f-a27d-4cb6-abb6-14302d74034e',
//   code: null,
//   userId: '74b38194-0b0b-403d-acf4-b0c30973e567',
//   user: {
//     id: '74b38194-0b0b-403d-acf4-b0c30973e567',
//     owner: '74b38194-0b0b-403d-acf4-b0c30973e567',
//     firstName: 'Brijesh Agarwal',
//     lastName: 'Brijesh Agarwal',
//     email: 'brijesh.agarwal26@gmail.com',
//     phone: null,
//     gender: null,
//     dob: null,
//     country: null,
//     state: null,
//     city: null,
//     pinCode: null,
//     landmark: null,
//     address: null,
//     location: null,
//     area: null,
//     isActive: true,
//     authProvider: null,
//     totalOrders: null,
//     totalSpent: null,
//     walletBalance: null,
//     walletSpent: null,
//     totalStoreCredit: null,
//     isAdmin: false,
//     profilePhotoUrl: null,
//     wishlists: { nextToken: null },
//     shopingcarts: { nextToken: null },
//     reviews: { nextToken: null },
//     orders: { nextToken: null },
//     payments: { nextToken: null },
//     createdAt: '2023-02-06T07:35:26.368Z',
//     updatedAt: '2023-02-06T07:35:26.368Z'
//   },
//   channelName: null,
//   shippingAddress: {
//     country: 'in',
//     state: 'GJ',
//     city: 'Surat',
//     pinCode: '395007',
//     landmark: '',
//     address: 'A/3A, the Palm Avenue, VIP Road, Near LP Savani School, Vesu.',
//     location: '',
//     area: ''
//   },
//   billingAddress: {
//     country: 'us',
//     state: 'GJ',
//     city: 'Surat',
//     pinCode: '395007',
//     landmark: '',
//     address: 'A/3A, the Palm Avenue, VIP Road, Near LP Savani School, Vesu.',
//     location: '',
//     area: ''
//   },
//   totalStoreCredit: null,
//   CouponCodeId: null,
//   totalCashOnDeliveryCharges: null,
//   totalDiscount: null,
//   totalGiftCharges: null,
//   totalPrepaidAmount: null,
//   totalShippingCharges: null,
//   taxExempted: null,
//   cFormProvided: null,
//   thirdPartyShipping: null,
//   sla: null,
//   priority: null,
//   orderDate: null,
//   status: 'PROCESSING',
//   products: { items: [], nextToken: null },
//   payments: { items: [], nextToken: null },
//   createdAt: '2023-02-06T10:11:52.435Z',
//   updatedAt: '2023-02-06T10:11:52.435Z'
// }
