import mongoose from "mongoose";


const connectDb  = async()=>{
 await   mongoose.connect(process.env.MONGO_URI)

 console.log("Database connected successfully")
}


export default connectDb;