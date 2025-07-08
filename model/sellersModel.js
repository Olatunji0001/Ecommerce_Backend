import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
},
 {timestamps: true}
);
const sellersModel = mongoose.model("Sellers", sellerSchema);
export default sellersModel;
