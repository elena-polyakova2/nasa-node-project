const DEFAULT_PAGE_LIMIT = 0; //mango returns all the documents
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER; //if left value is not defined, use value on the right
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT; //get absolute value of a number even from string
  const skip = (page - 1) * limit; //the amount of documents to skip depending on a page
 
  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
};
