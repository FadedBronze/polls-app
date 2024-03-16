import express from "express"
import cookieParser from "cookie-parser"
import { authRouter } from "./routes/auth"
import cors from "cors"
import z from "zod"
import dotenv from "dotenv"
import { Kysely, PostgresDialect } from "kysely"
import { Database } from "./db_types"
import { Pool } from "pg"
import { userSession } from "./routes/middlewares/session"
import { userRouter } from "./routes/user"
import { postRouter } from "./routes/post"
dotenv.config()

const env_variables = z.object({
  db_user: z.string(),
  db_password: z.string(),
  db_host: z.string(),
  db_port: z.string().regex(/^\d+$/).transform(Number),
  db_name: z.string(),
}).parse({
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  db_host: process.env.DB_HOST,
  db_port: process.env.DB_PORT,
  db_name: process.env.DB_NAME,
})

const dialect = new PostgresDialect({
  pool: new Pool({
    database: env_variables.db_name,
    host: env_variables.db_host,
    user: env_variables.db_user,
    port: env_variables.db_port,
    password: env_variables.db_password,
    max: 10,
  })
})

export const db = new Kysely<Database>({
  dialect,
})

const app = express()

app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)

app.get("/api", userSession, (req, res) => {
  console.log(res.locals.user)
  res.status(200).json("success")
})

app.listen(3000, () => {
  console.log("listening on port 3000")
})