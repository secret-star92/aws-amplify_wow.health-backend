exports.getOrder = /* GraphQL */ `
query GetOrder($id: ID!) {
  getOrder(id: $id) {
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

exports.listOrders = /* GraphQL */ `
query ListOrders(
  $filter: ModelOrderFilterInput
  $limit: Int
  $nextToken: String
) {
  listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        nextToken
      }
      payments {
        nextToken
      }
      createdAt
      updatedAt
    }
    nextToken
  }
}
`;


exports.searchOrders =  `
  query SearchOrders(
    $filter: SearchableOrderFilterInput
    $sort: [SearchableOrderSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableOrderAggregationInput]
  ) {
    searchOrders(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
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
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;


exports.searchOrders2 =  `
query MyQuery{
searchOrders {
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