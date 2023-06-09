const mongoose = require("mongoose")
const  slugify = require('slugify')

const placeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: 
      {
        // GeoJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      }
    ,
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  })

  // tourSchema.index({ price: 1 });
//   placeSchema.index({ price: 1, ratingsAverage: -1 });
//   placeSchema.index({ slug: 1 });
//   placeSchema.index({ startLocation: '2dsphere' });

//   placeSchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

// Virtual populate
placeSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

placeSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

placeSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });
  
    this.start = Date.now();
    next();
  });
  
  placeSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'guides',
      select: '-__v -passwordChangedAt -password'
    });
  
    next();
  });
  
  // placeSchema.post(/^find/, function(docs, next) {
  //   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  //   next();
  // });



const PlaceModel = mongoose.model("Place",placeSchema);

module.exports = PlaceModel