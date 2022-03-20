
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  creatorId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: [true, 'A test must have a user id.']
  },

  //Reference to the original test from testBank
  testId:{ 
    type:mongoose.Schema.Types.ObjectId,
    required: [true, 'A test must have a parent test id.']
  },

  //A unique identifier for each user taking this test version
  candidateId:{
    type: String,
    required: [true, 'A test must have a candidate id.']
  },

  //Reference to the original test from testBank
  version:{
    type: String,
    required: [true, 'A test must have a version']
  },
  
  season:String,
  testMode:{type:String, required:[true, "A test must either be in a practice or contest mode."]},
  
  reading_ans:{
    task_1: mongoose.Schema.Types.Array, //will be an array of objects e.g: [{Q1:"ans", Score:2},{Q2:"ans", Score:5}]
    task_2: mongoose.Schema.Types.Array,
  },
  writing_ans:{
    task_1: mongoose.Schema.Types.Array, //will be an array of objects e.g: [{Q1:"ans", Score:2},{Q2:"ans", Score:5}]
    task_2: mongoose.Schema.Types.Array,
  },
  listening_ans:{
    task_1: mongoose.Schema.Types.Array, //will be an array of objects e.g: [{Q1:"ans", Score:2},{Q2:"ans", Score:5}]
    task_2: mongoose.Schema.Types.Array,
  },
  speaking_ans:{
    task_1: mongoose.Schema.Types.Array, //will be an array of objects e.g: [{Q1:"ans", Score:2},{Q2:"ans", Score:5}]
    task_2: mongoose.Schema.Types.Array,
  },
  reading_score:{ type:Number, default:0 },
  writing_score:{ type:Number, default:0 },
  listening_score:{ type:Number, default:0 },
  speaking_score:{ type:Number, default:0 },
  total_score:{ type:Number, default:0 },
  
  createdAt:{ type:Date, default:Date.now },
  timeToComplete:{ type:Number, default:0},
  totalAnswered:{ type:Number, default:0 }, //Total questions answered by user
  testRate:{ type:Number, default:0 }, //The rate at which a user completes a test (in Questions/mins)
  expired:{ type:Boolean, default:false },
  countryTo:{
    type: String,
    required: [true, 'A test must have a To-country'],
    default:'canada'
  },
  countryFrom: {
    type: String,
    required: [true, 'A test must have a From-country'],
    validate: {
      message:
      'The country of origin must be different from the country of destination.',
      validator: function (val) {
      return val != this.countryTo;
      },
    },
  },
});

//Only returns non-expired tests except for user profile 
testSchema.pre(/^find/, function (next){
  const reqType = this.schema.statics.reqType;

  if(!(reqType && reqType==="profile")){
  this.find({expired:{$ne:true}});
  }
  next();
})

const testModel = mongoose.model('Test', testSchema);

module.exports = testModel;