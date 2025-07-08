import mongoose from "mongoose";

const { Schema, model } = mongoose;
const productSchema = new Schema(
  {
    productName: {type:String, required: true },
    productPrice: {type:String, required: true },
    discoutPrice: {type:String, required: true },
    productImage: {type:String, required: true },
  },
  { timestamps: true }
);
const productModel = model("Products", productSchema);
export default productModel;
