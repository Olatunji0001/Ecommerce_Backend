import userModel from "../model/userModel.js";

export async function forget (req, res) {
    const {email} = req.body

    if (!email) {
        res.json({
            status: 500,
            message: "Email is required"
        })
    }

   const search =  await userModel.findOne({email})

   if (!search) {
    res.json({
        status:500,
        message: "Email not found"
    })
   }

   
}