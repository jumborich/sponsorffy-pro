const crypto = require('crypto');
const mongoose = require('mongoose');
const {isEmail} = require('validator').default;
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    required: [true, 'A user must have a fullname.'],
  },
  username: {
    type: String,
    trim: true,
    unique:[true, 'This username is taken.'],
    required: [true, 'A user must have a username.']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'A user must have an email.'],
    unique: [true, 'This email address is already in use.'],
    lowercase: true,
    validate:[isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, 'A user must have a password.'],
    minlength: [6, "password must be at least 6 characters long."],
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken:String,
  passwordResetExpires: Date,
  photo: {
    type: String,
    default:process.env.DEFAULT_AVATAR_URL
    // default:'https://sponsorfy-dev.s3.ca-central-1.amazonaws.com/default_profile.png'---> BEFORE
  },
  phone: {
    type: String,
    trim: true,
    required: [true, 'A user must have a phone number.'],
  },
  coins:{type:Number,default: 5},
  createdAt: {type: Date,default: Date.now},
  deletedAt: {type: Date},
  countryTo: {
    type: String,
    trim: true,
    required: [true, 'A user must have a destination country.'],
    default: 'canada'
  },
  countryFrom:{
    type: String,
    trim: true,
    required: [true, 'A user must have an origin country.'],
    // This only works on creation or SAVE..
    validate: {
      message:
        'The country of origin must be different from the country of destination.',
      validator: function (val) {
        return val !== this.countryTo;
      },
    },
  },
  isContestant:{type:Boolean, default:false},
  active:{type: Boolean,default: true,select:false},
  points:{ 
    entertainment:{type: Number, default:0},
    academia:{type: Number, default:0},
    handwork:{type: Number,default:0},
    sports:{type: Number, default:0},

    total:{ // This will be points from upvotes and test grades only
      tests:{type: Number, default:0},
      upvotes:{type: Number, default:0}
    }, 
    bonus:{
      totalCount:{type: Number, default:0}, //This is the all time total
      dailyCount:{type: Number, default:0}, //This is the daily total
      dailyTimeStamp:{type: Date, default:Date.now}
    }
  },

  //This will be calculated based on the user's category UPVOTE + POINT + BONUS 
  ranks:{
    entertainment:{type: Number, default:0},
    academia:{type: Number, default:0},
    handwork:{type: Number,default:0},
    sports:{type: Number, default:0}
  },

  rates:{
    entertainment:{type: Number, default:0},//average rate
    academia:{type: Number, default:0},//average rate
    handwork:{type: Number,default:0},//average rate
    sports:{type: Number, default:0}//average rate
  },

  // Holds details for user's latest test session
  testSession:{
    testId:String,
    version:String,
    recentScore:{type: Number, default:0},
    duration:Number,
    totalPoints:Number,
    duration_Millis:Date,
    candidateId:String,
  }
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually changed
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password with cost of 12 ---> basically encrypting
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function(next){
  if(!this.isModified('password') || this.isNew) {
    return next();
  };
  // The -1000 is a correction for the JSON web token been issued before data is saved in the database.
  this.passwordChangedAt = Date.now() - 1000;

  next();

});

userSchema.pre(/^find/, function (next){
  // This points to the current query...
  this.find({active:{$ne:false}});
  next();
});

// Creating an instance method which automatically makes it available in every userModel document
userSchema.methods.correctPassword = async function (
  unhashedPassword,
  hashedUserPasswordDB
) {
  return await bcrypt.compare(unhashedPassword, hashedUserPasswordDB);
};

userSchema.methods.changedPasswordAfter = function(JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTtimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex');

  // console.log({resetToken}, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000 //The reset will be valid for 10 minutes

  return resetToken;
}
const User = mongoose.model('User', userSchema);
module.exports = User;
