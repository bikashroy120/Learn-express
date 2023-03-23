const mongoose = require("mongoose");



const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true,"Review cant not be empty"]
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt: {
        type: Date,
        default: Date.now(),
      },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Place',
        required:[true,"Review moust be a tour"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,"Review moust be a user"]
    }

})


reviewSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'tour',
      select: 'name'
    }).populate({
        path:"user",
        select:"username email"
    });
  
    next();
  });

const Review = mongoose.model("Review",reviewSchema)

module.exports = Review