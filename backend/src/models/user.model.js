import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema   = new mongoose.Schema({
    userName :{
        type:String,
        required:[true,"Please provide a username"],
        unique:true
    },
    email :{
        type:String,
        required:[true,"Please provide an email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please provide a password"]
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})



userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10)
  
})



userSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password)
}


const userModel = mongoose.model("user",userSchema);



export default userModel;