const searchReviews = /* GraphQL */ `
  query SearchReviews(
    $filter: SearchableReviewFilterInput
    $sort: [SearchableReviewSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableReviewAggregationInput]
  ) {
    searchReviews(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {

      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
        }
      }
    }
  }
`;

module.exports = { searchReviews };