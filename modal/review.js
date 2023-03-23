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
        ref:Plase,
        required:[true,"Rebiew moust be a tour"]
    },

})

const Review = mongoose.model("Review",reviewSchema)

module.exports = Review