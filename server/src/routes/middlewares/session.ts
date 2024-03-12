import express from "express"
import { Kysely } from "kysely"
import { Database } from "../../db_types"

async function userSession(req: express.Request, res: express.Response, next: express.NextFunction) {
  const csrfToken = req.get("X-CSRF-Token")
  
  if (csrfToken === undefined || !("sessionCode" in req.cookies)) {
    res.status(400).json("authentication failed")
    return 
  } 

  const sessionCode = req.cookies.sessionCode

  console.log(csrfToken, sessionCode)

  const db: Kysely<Database> = res.locals.db

  const session = await db.selectFrom("sessions")
  .selectAll()
  .where("csrf_token", "=", csrfToken)
  .executeTakeFirst()

  if (
    session === undefined || 
    session.session_code !== sessionCode || 
    session.csrf_token !== csrfToken
  ) {
    res.status(400).json("session mismatch")
    return
  }

  const user = await db.selectFrom("users")
  .selectAll()
  .where("session_id", "=", session.id)
  .executeTakeFirst()

  if (!user) {
    res.status(400).json("user not found")
    return
  }

  res.locals.user = user

  next()
}

export {userSession}