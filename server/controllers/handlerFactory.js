const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
  
    if (!doc) {
      return next(new AppError('No document found with that ID.', 404));
    }
  
    res.status(204).json({
      status: 'success',
      data: null,
    });
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
  
    if (!doc) {
      return next(new AppError('No document found with that ID.', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data:doc
    });
});
  
exports.createOne = Model => catchAsync(async (req, res, next) => {
  
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: doc,
    });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {

  let query = Model.findById(req.params.id)
  if(popOptions) query = query.populate(popOptions);

  const doc =  await query.lean();

  if (!doc) {
    return next(new AppError('No document found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

exports.getAll = (Model,popOptions) => catchAsync(async (req, res, next) => {
  
  // This is to allow for nested GET upvotes on Post requests
  let filter = {};
  if(req.params.postId) filter = {postId: req.params.postId};

  // console.log("req.query: ",req.query)
  const apiFeatures = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    // .paginate();

  //Awaiting the final result of all the query
  // const doc = await apiFeatures.query.explain()

  if(popOptions) apiFeatures.query = apiFeatures.query.populate(popOptions);

  const doc = await apiFeatures.query.lean();

  // console.log("doc: ",doc)
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: doc,
  });
});