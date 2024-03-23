import { model, Schema,models } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "please provide the username"],
    unique: [true, "please provide unique username"],
  },
  password: {
    type: String,
    required: [true, "please provide the password "],
  },
  email: {
    type: String,
    required: [true, "please provide an email"],
    unique: [true, "please provide unique an email"],
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  isAdmin:{
    type:Boolean,
    default:false

  },
  forgetPasswordToken:String,
  forgetPasswordTokenExpiry:Date,
  verifyToken:String,
  verifyTokenExpiry:Date
});

const User = models.users || model("users",userSchema);

export default User;