const Place = require("../modal/place");
const asyncHandler = require("express-async-handler")
const catchAsync = require("../utilis/catchAsync")




const getAllPlece = catchAsync(async(req,res,next)=>{

      // Filtring
      const queryObj = {...req.query}
      const excludedFields = ['page','sort','limit','fields']
      excludedFields.forEach(el=>delete queryObj[el])
      console.log(req.query,queryObj)


      // Advance Filtring

      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,macth=>`$${macth}`)

      let query = Place.find(JSON.parse(queryStr));

      //shorting
      if(req.query.sort){
         const sortBy = req.query.sort.split(",").join(" ")
         query = query.sort(sortBy)
      }
      // else{
      //    query = query.sort('-')
      // }


      // Filed Leamiting

      if(req.query.fields){
         const fieldsBy = req.query.fields.split(",").join(" ")
         query = query.select(fieldsBy)
      }else{
         query = query.select('-__v')
      }

      // Pagenation

      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit)

      if(req.query.page){
         const numPlace = await Place.countDocuments();
         if(skip >= numPlace){
            res.status(300).json("no page")
         }
      }

      const place = await query;
      res.status(200).json({
         status:"Success",
         result:place.length,
         data:place
      })
})


const getWonerPlace = catchAsync(async(req,res,next)=>{

      const {id} = req.user;
      const place = await Place.find({owner:id});
      res.status(200).json({
         status:"Success",
         result:place.length,
         data:place
      })
})

const getSingalPlace = catchAsync(async(req,res,next)=>{

   const {id} = req.params;
      const place = await Place.findById(id).populate("reviews");
      res.json({
         status:"Success",
         data:place
      })
})


const getAvrgase = asyncHandler(async(req,res)=>{
   try {
      
      const states =await Place.aggregate([
         // {
         //    $match:{ maxGuests: { $gte: 5}}
         // },

         { $group: { _id: null, 
            total: { $sum: "$maxGuests" },
            minNumber:{$min:"$maxGuests"}
          } },

      ])

      res.json({
         status:"Success",
         result:states.length,
         data:states
      })

   } catch (error) {
      res.json(error)
   }
})


const getMon = asyncHandler(async(req,res)=>{
   try {
      
      const states =await Place.aggregate([
         { $group: { _id: null, 
            total: { $sum: "$maxGuests" },
            minNumber:{$min:"$maxGuests"}
          } },
      ])

      res.json({
         status:"Success",
         result:states.length,
         data:states
      })

   } catch (error) {
      res.json(error)
   }
})


// exports.aliasTopTours = (req, res, next) => {
//    req.query.limit = '5';
//    req.query.sort = '-ratingsAverage,price';
//    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//    next();
//  };
 

 
 const getTour = catchAsync(async (req, res, next) => {
   const tour = await Place.findById(req.params.id);
   // Tour.findOne({ _id: req.params.id })
 
   if (!tour) {
    return res.status(400).json({mes:"somthing is wrong! please try later"});
   }
 
   res.status(200).json({
     status: 'success',
     data: {
       tour
     }
   });
 });
 
 const createTour = catchAsync(async (req, res, next) => {
   const newTour = await Place.create(req.body);
 
   res.status(201).json({
     status: 'success',
     data: {
       tour: newTour
     }
   });
 });
 
 const updateTour = catchAsync(async (req, res, next) => {
   const tour = await Place.findByIdAndUpdate(req.params.id, req.body, {
     new: true,
     runValidators: true
   });
 
   if (!tour) {
    return res.status(400).json({mes:"somthing is wrong! please try later"});
   }
 
   res.status(200).json({
     status: 'success',
     data:tour
   });
 });
 
 const deleteTour = catchAsync(async (req, res, next) => {
   const tour = await Place.findByIdAndDelete(req.params.id);
 
   if (!tour) {
    return res.status(400).json({mes:"somthing is wrong! please try later"});
   }
 
   res.status(204).json({
     status: 'success',
     data: null
   });
 });
 
 exports.getTourStats = catchAsync(async (req, res, next) => {
   const stats = await Tour.aggregate([
     {
       $match: { ratingsAverage: { $gte: 4.5 } }
     },
     {
       $group: {
         _id: { $toUpper: '$difficulty' },
         numTours: { $sum: 1 },
         numRatings: { $sum: '$ratingsQuantity' },
         avgRating: { $avg: '$ratingsAverage' },
         avgPrice: { $avg: '$price' },
         minPrice: { $min: '$price' },
         maxPrice: { $max: '$price' }
       }
     },
     {
       $sort: { avgPrice: 1 }
     }
     // {
     //   $match: { _id: { $ne: 'EASY' } }
     // }
   ]);
 
   res.status(200).json({
     status: 'success',
     data: {
       stats
     }
   });
 });
 
 exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
   const year = req.params.year * 1; // 2021
 
   const plan = await Tour.aggregate([
     {
       $unwind: '$startDates'
     },
     {
       $match: {
         startDates: {
           $gte: new Date(`${year}-01-01`),
           $lte: new Date(`${year}-12-31`)
         }
       }
     },
     {
       $group: {
         _id: { $month: '$startDates' },
         numTourStarts: { $sum: 1 },
         tours: { $push: '$name' }
       }
     },
     {
       $addFields: { month: '$_id' }
     },
     {
       $project: {
         _id: 0
       }
     },
     {
       $sort: { numTourStarts: -1 }
     },
     {
       $limit: 12
     }
   ]);
 
   res.status(200).json({
     status: 'success',
     data: {
       plan
     }
   });
 });



module.exports={updateTour,deleteTour,createTour,getAllPlece,getWonerPlace,getAvrgase,getSingalPlace,getMon}