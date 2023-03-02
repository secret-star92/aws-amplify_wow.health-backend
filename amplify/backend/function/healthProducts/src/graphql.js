

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
          nextToken
        }
        images {
          nextToken
        }
        reviews {
          nextToken
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
