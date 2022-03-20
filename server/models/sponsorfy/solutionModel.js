const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
    version:String,
    testId: String, //Points to the test in the testbank that has this solution
    Reading:{
        type: mongoose.Schema.Types.Object,
        default:{
            task_1: mongoose.Schema.Types.Array, //will be an array of objects e.g: [{Q1:"ans",ans:String | {} , mark:2},{Q2:"ans",ans:String | {} , mark:5}]
            task_2: mongoose.Schema.Types.Array,
        }
    },
    Writing:{
        type: mongoose.Schema.Types.Object,
        default:{
            task_1: mongoose.Schema.Types.Array,
            task_2: mongoose.Schema.Types.Array,
        }
    },
    Listening:{
        type: mongoose.Schema.Types.Object,
        default:{
            task_1: mongoose.Schema.Types.Array,
            task_2: mongoose.Schema.Types.Array,
        }
    },
    Speaking:{
        type: mongoose.Schema.Types.Object,
        default:{
            task_1: mongoose.Schema.Types.Array,
            task_2: mongoose.Schema.Types.Array,
        }
    },
    totalPoints:{type:Number,default:500},
    pointsPerQuestion:{type:Number,default:6.33},
    createdAt:{type:Date, default:Date.now()},
    expired:{type:Boolean,default:false}
});


const Solutions = mongoose.model('Solutions', solutionSchema);

module.exports = Solutions;