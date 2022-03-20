class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1-A) ------ Filtering -------
    const queryObj = { ...this.queryString};

    const excludedFields = ['page', 'sort', 'limit', 'fields']; //The query fields to remove from query object
    excludedFields.forEach((field) => delete queryObj[field]);

    // 1-B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryStr.replace(['gte', 'gt', 'lt', 'lte'], ['$gte', '$gt', '$lt', '$lte']);

    // ----> Initial query to the database ---->
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2)  ------> Sorting ------->
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(this.queryString.sort);
    }

    //Below returns the posts according to the latest post(descending order)
    this.query = this.query.sort('-createdAt');

    return this;
  }

  limitFields() {
    // 3) ------> Field limiting/projecting ------>
    if (this.queryString.fields) {
      const queryProjectionFields = this.queryString.fields
        .split(',')
        .join(' '); //fields to include or exclude in the document

      this.query = this.query.select(queryProjectionFields);
    }
    return this;
  }

  paginate() {
    // 4) ------> Offset-pagination ------>
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 2; //Change the default to 20
    const skip = (page - 1) * limit; //Number of docs to skip before returning the next page
    this.query = this.query.skip(skip).limit(limit);

    // ------> cursor-based pagination: [Look into this] ------>
    // const limit = this.queryString.limit * 1 || 2; //Change the default to 20

    // this.query = this.query.limit(limit).lean();

    return this;
  }
}

module.exports = APIFeatures;
