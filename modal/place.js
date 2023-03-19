const mongoose = require("mongoose")

const placeSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"A Plase moust be a owner id"]
    },
    title:{
      type:String,
      required:[true,"A Plase moust be a name"]
    },
    address:{
      type:String,
      required:[true,"A Plase moust be a Address"]
    },
    city:{
      type:String,
      required:[true,"A Plase moust be a city"]
    },
    photos:[String],
    description:{
      type:String,
      required:[true,"A Plase moust be a description"]
    },
    perks:[String],
    extraInfo:String,
    price:{
      type:Number,
      required:[true,"A Plase moust be a price"]
    },
    checkIn:Number,
    checkOut:Number,
    maxGuests:Number,
    ratings: [
        {
          star: Number,
          comment: String,
          postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      totalrating: {
        type: String,
        default: 0,
      },
},{
  timestamps:true
})

const PlaceModel = mongoose.model("Place",placeSchema);

module.exports = PlaceModel