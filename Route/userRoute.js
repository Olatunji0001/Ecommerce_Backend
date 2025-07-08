import express from "express"
import {signUp} from "../Controller/signUp.js";
import { login } from "../Controller/login.js";
import { delUser } from "../Controller/delUser.js";
import {forget} from "../Controller/forgetPassword.js"
import { handleSendEmail } from "../Controller/email.js";
import { verifyCode } from "../Controller/verifyCode.js";
import { resendCode } from "../Controller/resendCode.js";
import  {sellersAccount} from "../Controller/sellers.js"




const router = express.Router()


router.post('/sign-up', signUp)
router.post("/login", login)
router.delete("/del-user", delUser)
router.post("/forget_password", forget )
router.post("/send-email", handleSendEmail);
router.post("/verify-code", verifyCode);
router.post("/resend-code", resendCode); 
router.post("/sellers-account", sellersAccount);




export default router
