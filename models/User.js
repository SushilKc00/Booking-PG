import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      required:true
  },
  location:{
      type:String,
      required:true,
  },
  email:{
      type:String,
      required:true,
      unique:true
  },
  password:{
      type:String,
      required:true
  },
  },
  { timestamps: true }
);

export default mongoose.model("Userr", UserSchema);
