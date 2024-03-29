import express from "express"
import { userSession } from "./middlewares/session"

export const userRouter = express.Router()

userRouter.get("/", userSession, (_, res) => {
  if (!res.locals.user) return res.status(500).json("internal server error")

  res.status(200).json({
    name: res.locals.user.name,
    email: res.locals.user.email,
    created: res.locals.user.created,
  })  
})