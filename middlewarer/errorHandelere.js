const AppError  = require("../utilis/appError")
// Not Found
const notFound = (req,res,next)=>{
    next(new AppError(`Can't Find ${req.originalUrl} on the server`,404))
}

const handelCastErrorDB = (err)=>{
    const message = `Invalid ${err.path} : ${err.value}`
    return new AppError(message,400)
}

const handelvError = (err)=>{
    const error = Object.values(err.error).map(el = el.message)
    const message = `Invalid Input Data : ${error.join(". ")}`
    return new AppError(message,400)
}


const sendErrorDev = (err,res)=>{
    res.status(res.statusCode);
    res.json({
        status:err.status,
        err:err,
        message:err?.message,
        stack:err?.stack
    }) 
}


const sendErrorPro = (err,res)=>{
    if(err.isOperational){
        res.status(res.statusCode);
        res.json({
            status:err.status,
            message:err?.message,
        })
    }else{
        res.status(500);
        res.json({
            status:"error",
            message:err.message,
            err:err
        })
    }
}


const errorHandeler = (err,req,res,next)=>{
    res.statusCode = res.statusCode || 500;
    err.status = err.status || 'error'

    if(process.env.NODE_ENV==="development"){
        sendErrorDev(err,res)
    }else if(process.env.NODE_ENV==="production"){

        let error = { ...err };

        console.log(error.name)

        if(err.name==="CastError"){
            error =  handelCastErrorDB(error)
        }
        

        if(err.name === "ValidatorError") {
            error = handelvError(error)
        }
            sendErrorPro(error,res)
        
       
    }
   
}

module.exports={errorHandeler,notFound}
