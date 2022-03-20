const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const postSchema = new mongoose.Schema({
  title: { type: String, trim: true, maxLength:30},

  fileType: {
    type: String,
    required: [true, 'A post must have a file type.'],
    enum: {
      values: ['image', 'video'],
      message: 'post type can only be one of: image, video',
    },
  },

  fileUrl: { type: String, required: [true, 'A post must have a file url.'] }, //Holds original resource url
  derivedUrls:{type:Array}, //Holds tranformed url versions of the original
  // poster:String, //Holds poster for the video 
  createdAt: { type: Date, default: Date.now },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: [true, 'A post must have a creator id.'],
  },
  upvoteCount: { type: Number, default: 0 },

  upvoteRate:{ type:Number, default:0 },

  category: { type: String, required: [true, 'A post must have a category.'] },

  subCategory: {type: String, required: [true, 'A post must have a subcategory.']},

  countryTo: { type: String, required: [true, 'A post must have a To-country']},

  countryFrom: {
    type: String,
    required: [true, 'A post must have a From-country'],
    validate: {
      message:
        'The country of origin must be different from the country of destination.',
      validator: function (val) {
        return val != this.countryTo;
      },
    }
  },

  //This will expire at the end of each season.
  expired: { type: Boolean, default: false },
  season:String
},
{
  // Makes virtual properties appear in outputs
  toJSON:{virtuals:true},
  toObject:{virtuals:true}, //getters: true Will make the virtual attributes such as the upvotes show up in the output
  strict:false
}
);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
postSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

//Only returns non-expired posts except for user profile 
postSchema.pre(/^find/, function (next){
  const reqType =this.schema.statics.reqType;

  if(!(reqType && reqType==="profile")){
    this.find({expired:{$ne:true}});
  }
  next();
});

// Replacing the creatorId path with the creators avatar and username
// postSchema.pre(/^find/, function (next){
//   this.find({}).populate('creatorId', 'username photo');
//   next();
// });

// Runs a populate every time new post object is created and sent back to user
postSchema.methods.POPULATE = function(){
  this.populate([{path:"upvotes", select:"voterId"}, {path:"creatorId", select:"username photo"}])
  .execPopulate();
}
postSchema.queue("POPULATE", []);

// Creating a virtual (upvotes) property on postModel
postSchema.virtual('upvotes',{
  ref:'Upvote', //This is the name of the  child model been referenced....
  foreignField:'postId', //This is where the ref element that connects both models is in the child model
  localField:'_id' //This is where the ref element connecting both models lives in the parent model

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
