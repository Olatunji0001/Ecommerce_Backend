import userModel from "../model/userModel.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { newUser } from "./newUser.js";

export async function login (req, res) {
  const { email, password } = req.body;

  if (!email) {
    res.json({
      status: 400,
      message: "Email is required",
    });
  }

  if (!password) {
    res.json({
      status: 400,
      message: "Password is required",
    });
  }

  const findUser = await userModel.findOne({email})
  if (!findUser) {
    res.json({
        status : 500,
        message: "User not found, pls create an account"
    })
  }

  const confirmPassword = await bycrypt.compare(password, findUser.password)
  if (!confirmPassword) {
    res.json({
        status : 500,
        message : "password not match"
    })
  }
}
