const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

  version:{type:String, required:[true, "Test version is required!"]},

  createdAt: { type:Date, default:Date.now },

  totalPoints: { type:Number, required:[true, "Test total points is required!"]},
  
  testMode:{type:String, required:[true, "A question set must have a test mode!"]},

  duration:{ type:Number, required:[true, "A question set must have a duration in hours!"]},

  season:String,

  writing:Object,

  reading:Object,

  listening:Object,

  speaking:Object,

  expired:{ type:Boolean, default:false }
});

questionSchema.pre(/^find/, function (next){
  this.find({expired:{$ne:true}});
  next();
})

const Questions = mongoose.model('Questions',questionSchema);

module.exports = Questions