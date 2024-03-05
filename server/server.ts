import express from "express"
import { authRouter } from "./routes/auth"
import { session } from "./routes/middlewares/session"

const app = express()

app.use(express.json())
app.use(session)

app.use(authRouter)

app.listen(3000, () => {
  console.log("listening on port 3000")
})