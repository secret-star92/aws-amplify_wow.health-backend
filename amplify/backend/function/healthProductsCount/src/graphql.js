exports.searchProducts = /* GraphQL */ `
query SearchProducts($filter: SearchableProductFilterInput) {
  searchProducts(filter: $filter) {
    total
  }
}
`;