import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema   = new mongoose.Schema({
    username :{
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



userSchema.pre("save", async function (){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10)
  
})



userSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password)
}


const userModel = mongoose.model("user",userSchema);



export default userModel;