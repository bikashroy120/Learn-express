const User = require("../modal/user");
const Otp = require("../modal/otp")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const catchAsync = require("../utilis/catchAsync")
const AppError  = require("../utilis/appError")

const {generateRefreshToken} = require("../config/refreshtoken");
const { generateToken } = require("../config/jwtToken");


// REGESTER USER
 const regester = async(req,res)=>{  
    try {
      console.log(req.body)
        const user = await User.findOne({email:req.body.email})

        if(user){
          return res.status(400).json({mes:" Email already exietd"});
        }

        const salt = await bcrypt.genSalt();
        
        const hassPassword = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hassPassword,
        })

        const sevUser = await newUser.save();
        res.status(201).json(sevUser);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


// LOGGING IN
 const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        if(!user) return res.status(400).json({mes:"Invalid credentials"});

        const isMatch = await bcrypt.compare(password,user.password);
  
        if(!isMatch) return res.status(400).json({mes:"Invalid credentials"});
        const refreshToken = generateRefreshToken(user?._id);
        const updateuser = await User.findByIdAndUpdate(
          user._id,
          {
            refreshToken: refreshToken,
          },
          { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 60 * 1000,
        });

        const token = generateToken(user._id)

        

        res.status(200).json({
          _id:user.id,
          username:user.username,
          email:user.email,
          token:token
        })

    } catch (error) {
        res.status(500).json({error: error.message}) 
    }
}


// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  });
  
  // logout functionality
  
  const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
      refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
  });


  const sentOtp = catchAsync(async(req,res,next)=>{
      const {email} = req.body;

      const user = await User.findOne({email:email});
      if(!user) return res.status(400).json({mes:"Invalid credentials"});

      const otpcode = Math.floor((Math.random()*10000)+1)

      const otpModal = await Otp.findOne({email:email})
      console.log(otpModal)
      if(otpModal){
        otpModal.otp=otpcode;
        otpModal.expierIn=new Date().getTime() + 300*1000;

        await otpModal.save()
      }else{
        const otpData = new Otp({
          email:email,
          otp:otpcode,
          expierIn:new Date().getTime() + 300*1000
      })

      await otpData.save()
      }



      res.status(201).json({
        status:"success",
        message:"send otp in your email!",
        email:email,
        // user:userFind
      }) 

  });


  const varyfyOtp = catchAsync(async(req,res,next)=>{
      const{otp,email} = req.body;
      const findOtpData = await Otp.findOne({email:email});

      if(!findOtpData){
        return res.status(400).json({mes:"somthing is wrong! please try later"});
      }

      if(findOtpData.otp !== Number(otp)){
        return res.status(400).json({mes:"otp not valid"});
      }

      const newData = new Date().getTime();
      const validTime = findOtpData.expierIn - newData;

      if(validTime < 0) {
        return res.status(400).json({mes:"otp varifition time expoer ! plase try again"});
      }

      

      const finduser = await User.findOne({email:email})


      res.status(200).json({
        status:"success",
        message:" otp varyfy!",
        userId:finduser._id
      }) 

  })


  const changePassword = catchAsync(async(req,res,next)=>{
      const {id,password,comfrimPassword} = req.body;

      const user = await User.findById(id)

      if(!user){
        return res.status(400).json({mes:"somthing is wrong! please try later"});
      }

      if(password!==comfrimPassword){
        return res.status(400).json({mes:"password didnot macth"});
      }

      const salt = await bcrypt.genSalt(); 
      const hassPassword = await bcrypt.hash(req.body.password,salt);

      await User.findByIdAndUpdate(id,{
          password:hassPassword,
      },{
        new:true
      })


      await Otp.findOneAndDelete({email:user.email})

      res.status(200).json({
        status:"success",
        message:"password change sussacefylly!",
      }) 


  })

  const getallUser = catchAsync(async(req,res,next)=>{
    const alluser = await User.find()


    res.status(200).json({
      status:"Success",
      result:alluser.length,
      data:alluser
    })
  })


  module.exports={getallUser,regester,login,sentOtp,varyfyOtp,changePassword}