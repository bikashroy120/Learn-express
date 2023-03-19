const mongoose = require("mongoose")

// 
const dbConnect = ()=>{
    try {
        mongoose.set('strictQuery', true)
         mongoose.connect("mongodb+srv://bikashroydt:A6IOZn5nSS5BkL33@cluster0.rlfxfev.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log("Database connect")  
    } catch (error) {
        console.log("Database error")  
    }
}


module.exports = dbConnect