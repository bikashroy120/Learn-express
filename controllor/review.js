const Review = require("../modal/review")
const catchAsync = require("../utilis/catchAsync")



const creactReview  = catchAsync(async(req,res,next)=>{
    const {id} = req.user

    const review = await Review.create({user:id,...req.body})

    res.status(201).json({
        status: 'success',
        data:review
      });

})

const getAllReview = catchAsync(async(req,res,next)=>{

    const review = await Review.find()

    res.status(201).json({
        status: 'success',
        data:review
      });


})





module.exports = {
    creactReview,
    getAllReview
}