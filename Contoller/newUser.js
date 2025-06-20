import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export async function newUser (req, res) {
    //console.log(req.body)
    const {firstName, lastName, email, password} = req.body;

    if (!firstName) {
        res.json({
            status: 400,
            message: "First name is required"
        });
    }   

    if (!lastName) {
        res.json({
            status : 400,
            message : "Last name is required"
        })
    }

    if (!email) {
        res.json({
            status: 400,
            message: "Email is required"
        })
    }

    if (!password) {
        res.json({
            status: 400,
            message: "Password is required"
        })
    }

    const checkExistingUser = await userModel.findOne({email})
    if(checkExistingUser) {
        res.json({
            status: 500,
            message : "email already exist"
        })
    }
    const saltRounds = 10;
    const encryptPaasword = await bcrypt.hash(password, saltRounds)

    const saved_data = await userModel.create({...req.body, password : encryptPaasword})

    const token = jwt.sign(
        {user: saved_data},
        "user-token",
        {expiresIn: "1hr"}
    )

    res.json({
        token,
        status : 200,
        data: saved_data
    })
}; 
//export default encryptPaasword