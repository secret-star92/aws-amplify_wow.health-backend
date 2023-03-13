

exports.searchProducts = /* GraphQL */ `
query SearchProducts(
  $filter: SearchableProductFilterInput
  $sort: [SearchableProductSortInput]
  $limit: Int
  $nextToken: String
  $from: Int
  $aggregates: [SearchableProductAggregationInput]
) {
  searchProducts(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      title
      brand
      vendor
      categoryId
      storeId
      store {
        id
        name
        description
        isFeatured
        totalProducts
        priority
        imageUrl
        createdAt
        updatedAt
      }
      isFeatured
      category {
        id
        name
        description
        isFeatured
        totalProducts
        priority
        imageUrl
        createdAt
        updatedAt
      }
      productType
      createdAt
      slug
      productDescription
      longDescription
      updatedAt
      publishedAt
      price
      sku
      size
      color
      status
      position
      currency
      costPrice
      listingPrice
      taxable
      barcode
      tags
      weight
      weightUnit
      inventory
      blockedInventory
      rating
      totalOrders
      additionalInfo
      thumbImages
      isTaxEnabled
      isInventoryEnabled
      hasVarient
      variants {
      items {
        barcode
        blockedInventory
        color
        costPrice
        createdAt
        currency
        imageUrl
        id
        inventory
        listingPrice
        position
        price
        productId
        size
        sku
        status
        taxable
        title
        updatedAt
        weight
        weightUnit
      }
      nextToken
    }
      images {
      items {
        alt
        createdAt
        height
        id
        imageKey
        isThumb
        position
        productId
        updatedAt
        width
      }
      nextToken
    }
      reviews {
      items {
        comment
        createdAt
        id
        productId
        rating
        updatedAt
        userId
        user {
          id
          email
          firstName
          lastName
          profilePhotoUrl
        }
      }
    }
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
