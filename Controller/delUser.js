import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken"

export async function delUser (req, res) {
    const {email} = req.body

    if (!email) {
        res.json({
            status: 500,
            message: "Enter your email"
        })
    }

    const confPassword = await userModel.findOne({email})
    if(!confPassword) {
        res.json({
            status: 500,
            message:"email not found"
        })
    }

        await userModel.deleteOne({email})



    res.json({
        status: 200,
        message : "User deleted successfully"
    })
}