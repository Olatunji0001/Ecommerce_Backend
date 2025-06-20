import express from "express"
import {newUser} from "../Contoller/newUser.js";
import { login } from "../Contoller/login.js";

const router = express.Router()


router.post('/create', newUser)
router.post("/login", login)



export default router
