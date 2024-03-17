import express from "express";
import z from "zod";
import bcrypt from "bcrypt";
import { HandleError } from "../utils/HandleError";
import crypto from "crypto";
import { db } from "../server";
import { userSession } from "./middlewares/session";

const authRouter = express.Router();

const SignupSchema = z.object({
  name: z.string(),
  password: z.string().min(8),
  email: z.string().email(),
});

authRouter.post("/signup", async (req, res) => {
  const signup = SignupSchema.safeParse(req.body);

  if (!signup.success) {
    console.error(signup.error);
    return res.status(400).json("password must be greater than 8 characters");
  }

  const ids = await db
    .selectFrom("users")
    .select("id")
    .where("email", "=", signup.data.email)
    .execute();

  if (ids.length != 0) {
    return res.status(400).json("user with that email already exists");
  }

  const hashedPass = await bcrypt.hash(signup.data.password, 10);

  const [err] = await HandleError(
    db
      .insertInto("users")
      .values({
        created: new Date(),
        email: signup.data.email,
        name: signup.data.name,
        password: hashedPass,
        session_id: null,
        voted_polls: [],
      })
      .executeTakeFirst()
  );

  if (err) {
    console.error(err);
    return res.status(500).json("internal server error");
  }

  return res.status(200).json("success");
});

const LoginSchema = z.object({
  password: z.string().min(8),
  email: z.string().email(),
});

authRouter.post("/login", async (req, res) => {
  const login = LoginSchema.safeParse(req.body);

  if (!login.success) {
    return res.status(400).json("incorrect email or password");
  }

  //check if they exist
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", login.data.email)
    .executeTakeFirst();

  if (!user) {
    return res.status(400).json("no user with that email exists");
  }

  //check the password
  if (!(await bcrypt.compare(login.data.password, user.password))) {
    return res.status(400).json("incorrect email or password");
  }

  //create a session
  const csrfToken = crypto.randomUUID();
  const sessionCode = crypto.randomUUID();

  const newSession = await db
    .insertInto("sessions")
    .values({
      csrf_token: csrfToken,
      session_code: sessionCode,
      created: new Date(),
    })
    .returning("id")
    .executeTakeFirst();

  if (!newSession) {
    return res.status(400).json("internal server error");
  }

  await db
    .updateTable("users")
    .set({
      session_id: newSession.id,
    })
    .where("email", "=", user.email)
    .executeTakeFirst();

  //delete the old session
  if (user.session_id) {
    await db.deleteFrom("sessions").where("id", "=", user.session_id).executeTakeFirst();
  }

  //resolve
  res
    .cookie("csrfToken", csrfToken, {
      secure: true,
      sameSite: true,
    })
    .cookie("sessionCode", sessionCode, {
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .json("login successful");
});

authRouter.delete("/logout", userSession, async (_, res) => {
  const user = res.locals.user;
  if (user === undefined) return res.status(500).json("internal server error");

  const session = await db
    .selectFrom("sessions")
    .selectAll()
    .where("id", "=", user.session_id)
    .executeTakeFirst();

  if (session === undefined) return res.status(400).json("session doesn't exist");

  await db
    .updateTable("users")
    .where("email", "=", user.email)
    .set({
      session_id: null,
    })
    .executeTakeFirst();

  await db.deleteFrom("sessions").where("id", "=", session.id).executeTakeFirst();

  res
    .status(200)
    .cookie("sessionId", undefined)
    .cookie("csrfToken", undefined)
    .json("successfully logged out");
});

export { authRouter };
